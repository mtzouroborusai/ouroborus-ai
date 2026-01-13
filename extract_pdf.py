import pdfplumber
import re
import json
import os

def extract_pdf_data(pdf_path, output_path):
    # Ensure images directory exists
    images_dir = os.path.join(os.path.dirname(output_path), "images")
    os.makedirs(images_dir, exist_ok=True)

    questions = []
    
    with pdfplumber.open(pdf_path) as pdf:
        # First pass: map pages to questions
        # We need to know which page each question belongs to, to link images.
        # But our current regex logic runs on full_text.
        # Let's change strategy: Parse per page or keep track of page offsets.
        # Simpler: Extract text per page, parse questions per page, keeping a running ID if needed?
        # OR: Just run the text extraction as before, but also store a map of "Page N -> [Question IDs]"
        # Actually, let's process page by page to easily link images.
        
        # But duplicate questions might span pages? The PDF seems to have discrete questions.
        # Let's try processing the whole text first to get structure, then match back to pages?
        # No, that's hard.
        # Better: iterate pages, extract text AND images.
        
        full_text = ""
        questions_by_page = [] # List of list of questions
        
        split_marker_found = False
        
        for i, page in enumerate(pdf.pages):
            page_text = page.extract_text()
            if not page_text:
                continue
                
            # Check for answer key start
            if "RESPUESTAS" in page_text and "EXAMEN TEORICO" in page_text:
                split_marker_found = True
            
            # If we are in answer key section, stop question parsing (or handle separately)
            # But we need to extract answers later.
            # Let's just accumulate text for answers, but process questions per page.
            
            if not split_marker_found:
                # Find questions on this page
                # Normalize
                p_text = page_text.replace('\r', '')
                
                # Find questions on this page
                # We need global question numbering context? No, just regex integers.
                
                # Regex for questions on this page
                # Note: A question might start on previous page and end here?
                # The format seems to be 1 question per block usually, but let's assume they don't split across pages for simplicity first
                # OR capture "Page X text" and parse.
                
                # Parse questions from this page text
                q_pattern = re.compile(r'(?:^|\n)(\d+)\s*(?:\.|-)\s*(?:-)?\s*')
                matches = list(q_pattern.finditer(p_text))
                
                page_questions = []
                for k in range(len(matches)):
                    start = matches[k].end()
                    q_id = int(matches[k].group(1))
                    
                    if k < len(matches) - 1:
                        end = matches[k+1].start()
                    else:
                        end = len(p_text)
                    
                    q_block = p_text[start:end].strip()
                    
                    # Store raw block and ID to parse later, plus bbox info if possible?
                    # pdfplumber extract_words gives text with bbox.
                    # This is getting complicated.
                    
                    # Simplified approach:
                    # 1. Extract images from page.
                    # 2. Get their Y-center.
                    # 3. Text analysis: Find "1.-" Y-position? extract_words() can do this.
                    # 4. Map image to the nearest question above it or same Y.
                    
                    # Let's trust the per-page parsing roughly.
                    img_objs = page.images
                    
                    # Find Y position of the Question ID on the page
                    # We look for words that match the question ID pattern "1.-"
                    words = page.extract_words()
                    q_locs = []
                    for w in words:
                        # Check strictly for "ID.-" or "ID."
                        if re.match(r'^\d+(\.|-)+$', w['text']):
                            # It's a potential candidate
                            q_locs.append({
                                'id': int(re.sub(r'\D', '', w['text'])),
                                'top': w['top'],
                                'bottom': w['bottom']
                            })
                    
                    # Sort questions by TOP position
                    q_locs.sort(key=lambda x: x['top'])
                    
                    # Now match images to these questions
                    # Image belongs to question if Image.top >= Question.top and Image.top < NextQuestion.top
                    for img in img_objs:
                        # Filter out small icons/lines if needed
                        if img['width'] < 50 or img['height'] < 50:
                            continue
                        
                        # Find matching question
                        matched_q = None
                        img_y = img['top']
                        
                        for k, q_loc in enumerate(q_locs):
                            if img_y >= q_loc['top'] - 10: # Tolerance
                                # Check if it's before next question
                                if k < len(q_locs) - 1:
                                    if img_y < q_locs[k+1]['top']:
                                        matched_q = q_loc['id']
                                        break
                                else:
                                    # Last question on page
                                    matched_q = q_loc['id']
                        
                        if matched_q:
                            # Save image
                            img_filename = f"q_{matched_q}.png"
                            img_full_path = os.path.join(images_dir, img_filename)
                            
                            # Extract and save
                            # crop image
                            # (x0, top, x1, bottom)
                            try:
                                cropped = page.crop((img['x0'], img['top'], img['x1'], img['bottom']))
                                img_obj = cropped.to_image(resolution=300)
                                img_obj.save(img_full_path)
                                
                                # We need to store this link.
                                # Let's verify if we can merge this with the text parsing.
                                # We will add a temporary list of (id, image_path) tuples
                                questions_by_page.append((matched_q, f"images/{img_filename}"))
                            except Exception as e:
                                print(f"Error saving image for Q{matched_q}: {e}")

            full_text += page_text + "\n"

    # --- Standard Text Parsing (Re-using logic) ---
    split_marker = "RESPUESTAS"
    split_regex = r"RESPUESTAS\s+EXAMEN TEORICO DE CONDUCCION"
    split_match = re.search(split_regex, full_text)
    
    if split_match:
        questions_part = full_text[:split_match.start()]
        answers_part = full_text[split_match.end():]
    else:
        parts = full_text.split(split_marker)
        questions_part = parts[0]
        answers_part = parts[1] if len(parts) > 1 else ""

    questions = []
    questions_part = questions_part.replace('\r', '')
    q_pattern = re.compile(r'(?:^|\n)(\d+)\s*(?:\.|-)\s*(?:-)?\s*')
    q_matches = list(q_pattern.finditer(questions_part))
    
    # Image map
    img_map = {qid: path for qid, path in questions_by_page}
    
    for i in range(len(q_matches)):
        start_idx = q_matches[i].end()
        q_num = int(q_matches[i].group(1))
        
        if i < len(q_matches) - 1:
            end_idx = q_matches[i+1].start()
        else:
            end_idx = len(questions_part)
            
        q_block = questions_part[start_idx:end_idx].strip()
        q_block_clean = re.sub(r'(?i)Marque\s+(?:una|dos|tres|la|las)\s+respuestas?.*', '', q_block)
        
        options = {}
        opt_matches = list(re.finditer(r'(?:^|\n)\s*([a-e])\)\s', q_block))
        
        question_text_end = len(q_block)
        if opt_matches:
            question_text_end = opt_matches[0].start()
            for j in range(len(opt_matches)):
                o_start = opt_matches[j].end()
                o_char = opt_matches[j].group(1)
                o_end = opt_matches[j+1].start() if j < len(opt_matches) - 1 else len(q_block)
                options[o_char] = q_block[o_start:o_end].strip()
        
        q_text = q_block[:question_text_end].strip()
        q_text = re.sub(r'(?i)Marque.*', '', q_text).strip()
        
        q_obj = {
            "id": q_num,
            "question": q_text,
            "options": options,
            "answer": None,
            "explanation": None,
            "image": img_map.get(q_num) # Add image path here
        }
        questions.append(q_obj)

    # Parse Answers
    q_map = {q['id']: q for q in questions}
    answer_lines = answers_part.split('\n')
    for line in answer_lines:
        line = line.strip()
        if not line: continue
        match = re.match(r'^(\d+)\.\s*(.*)', line)
        if match:
            a_id = int(match.group(1))
            rest = match.group(2)
            if a_id in q_map:
                q_map[a_id]['answer_raw'] = rest
                letters = re.findall(r'([a-e])\)', rest)
                if letters:
                    q_map[a_id]['answer'] = letters if len(letters) > 1 else letters[0]

    questions.sort(key=lambda x: x['id'])
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=4, ensure_ascii=False)
    
    print(f"Extracted {len(questions)} questions (with {len(img_map)} images) to {output_path}")

if __name__ == "__main__":
    extract_pdf_data("cuestionario clase b.pdf", "cuestionario_ordenado.json")

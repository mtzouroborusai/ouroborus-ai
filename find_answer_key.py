import pdfplumber

def find_answer_key(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        start_page = max(0, len(pdf.pages) - 10)
        with open("answer_key_search.txt", "w", encoding="utf-8") as f:
            for i in range(start_page, len(pdf.pages)):
                page = pdf.pages[i]
                text = page.extract_text()
                f.write(f"--- Page {i+1} ---\n")
                f.write(text)
                f.write("\n\n")

if __name__ == "__main__":
    find_answer_key("cuestionario clase b.pdf")

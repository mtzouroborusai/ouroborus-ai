import pdfplumber

def analyze_pdf_deep(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        # Check first 3 pages
        with open("pdf_dump.txt", "w", encoding="utf-8") as f:
            for i in range(min(3, len(pdf.pages))):
                page = pdf.pages[i]
                text = page.extract_text()
                f.write(f"--- Page {i+1} ---\n")
                f.write(text)
                f.write("\n\n")
            
            # Check last page
            if len(pdf.pages) > 3:
                last_page = pdf.pages[-1]
                text = last_page.extract_text()
                f.write(f"--- Last Page ({len(pdf.pages)}) ---\n")
                f.write(text)

if __name__ == "__main__":
    analyze_pdf_deep("cuestionario clase b.pdf")

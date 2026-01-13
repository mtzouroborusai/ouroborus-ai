import pdfplumber

def analyze_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        if len(pdf.pages) > 0:
            first_page = pdf.pages[0]
            text = first_page.extract_text()
            print("--- First Page Text ---")
            print(text)
            print("-----------------------")
        else:
            print("PDF is empty.")

if __name__ == "__main__":
    analyze_pdf("cuestionario clase b.pdf")

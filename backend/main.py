from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from dotenv import load_dotenv
import PyPDF2
import io
import requests
from bs4 import BeautifulSoup
import re

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Try alternate naming you might have setup
    api_key = os.getenv("GOOGLE_GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

app = FastAPI(title="Macro-Resume Pro API")

# Allow Next.js frontend to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

def scrape_job_url(url: str) -> str:
    """Attempt to scrape job description text from a given URL."""
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.extract()
            
        text = soup.get_text(separator=' ', strip=True)
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not scrape that URL. Try pasting the raw text instead. Error: {str(e)}")

@app.get("/")
def read_root():
    return {"status": "Macro-Resume Pro Backend is running!"}

@app.post("/api/optimize-resume")
async def optimize_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not resume.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    # Read PDF
    contents = await resume.read()
    resume_text = extract_text_from_pdf(contents)
    
    if len(resume_text.strip()) < 50:
         raise HTTPException(status_code=400, detail="Could not extract sufficient text from the PDF. Is it an image?")
         
    # Check if Job Description is actually a URL
    url_pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
    is_url = url_pattern.match(job_description.strip())
    
    if is_url:
        print(f"URL detected: {job_description}. Scraping...")
        job_description = scrape_job_url(job_description.strip())
         
    # Setup LLM Prompt
    prompt = f"""
    You are an elite Tech Recruiter and Resume Writer. 
    I am providing you with my current Resume and a Target Job Description.
    
    Your task is to rewrite the experience bullet points in my resume to perfectly align with the Target Job Description.
    Do not invent fake experience. Instead, heavily reframe my existing experience using the exact keywords, tools, and terminology from the job description.
    
    CRITICAL ATS (Applicant Tracking System) INSTRUCTIONS:
    1. Identify the core skills, software, and keywords required in the Target Job Description.
    2. You MUST inject these exact keywords into my bullet points wherever logically possible based on my past experience.
    3. Prioritize matching the exact phrasing of the job description to ensure maximum ATS scoring.
    4. Make the bullet points highly impactful, starting with strong action verbs, and quantifying results where possible.
    
    CRITICAL INSTRUCTIONS FOR OUTPUT FORMATTING:
    - You MUST return the output in pristine Markdown format.
    - Group the updated bullet points by my previous roles.
    - Use H3 headers (`### `) for each Role/Company title.
    - Use standard unordered list bullets (`- `) for the experience points.
    - Bold (**text**) the most critical keywords that match the job description.
    - Do NOT wrap your response in markdown code blocks (```markdown). Just return the raw text.
    
    TARGET JOB DESCRIPTION:
    {job_description}
    
    MY CURRENT RESUME:
    {resume_text}
    """
    
    try:
        # Use Gemini 2.5 Flash for speed, cost, and availability
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        
        return {
            "success": True,
            "original_text_preview": resume_text[:500] + "...",
            "optimized_resume": response.text
        }
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Processing failed. Make sure GEMINI_API_KEY is set in .env")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

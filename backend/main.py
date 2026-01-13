from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from scraper import fetch_website_links, fetch_website_contents

load_dotenv(override=True)

app = FastAPI(title="Brochure Generator API", version="0.1.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

gemini = OpenAI(base_url=GEMINI_BASE_URL, api_key=GEMINI_API_KEY)

# System prompts
link_system_prompt = """
You are provided with a list of links found on a webpage.
You are able to decide which of the links would be most relevant to include in a brochure about the company,
such as links to an About page, or a Company page, or Careers/Jobs pages.
You should respond in JSON as in this example:

{
    "links": [
        {"type": "about page", "url": "https://full.url/goes/here/about"},
        {"type": "careers page", "url": "https://another.full.url/careers"}
    ]
}
"""

brochure_system_prompt = """
You are an assistant that analyzes the contents of several relevant pages from a company website
and creates a short brochure about the company for prospective customers, investors and recruits.
Respond in markdown without code blocks.
Include details of company culture, customers and careers/jobs if you have the information.
Make it engaging and professional.
"""


class BrochureRequest(BaseModel):
    company_name: str
    url: str


class BrochureResponse(BaseModel):
    status: str
    message: str


def get_links_user_prompt(url: str) -> str:
    user_prompt = f"""
Here is the list of links on the website {url} -
Please decide which of these are relevant web links for a brochure about the company, 
respond with the full https URL in JSON format.
Do not include Terms of Service, Privacy, email links.

Links (some might be relative links):

"""
    links = fetch_website_links(url)
    user_prompt += "\n".join(links)
    return user_prompt


def select_relevant_links(url: str) -> dict:
    """Use AI to select relevant links from the website"""
    response = gemini.chat.completions.create(
        model=GEMINI_MODEL,
        messages=[
            {"role": "system", "content": link_system_prompt},
            {"role": "user", "content": get_links_user_prompt(url)},
        ],
        response_format={"type": "json_object"},
    )
    result = response.choices[0].message.content
    links = json.loads(result)
    return links


def fetch_page_and_all_relevant_links(url: str) -> str:
    """Fetch content from landing page and all relevant pages"""
    contents = fetch_website_contents(url)
    relevant_links = select_relevant_links(url)
    result = f"## Landing Page:\n\n{contents}\n## Relevant Links:\n"
    for link in relevant_links["links"]:
        try:
            result += f"\n\n### Link: {link['type']}\n"
            result += fetch_website_contents(link["url"])
        except Exception as e:
            result += f"\n\n(Could not fetch this link)\n"
    return result


def get_brochure_user_prompt(company_name: str, url: str) -> str:
    """Generate the user prompt for brochure creation"""
    user_prompt = f"""
You are looking at a company called: {company_name}
Here are the contents of its landing page and other relevant pages;
use this information to build a short brochure of the company in markdown without code blocks.\n\n
"""
    user_prompt += fetch_page_and_all_relevant_links(url)
    user_prompt = user_prompt[:5_000]  # Truncate if more than 5,000 characters
    return user_prompt


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/generate-brochure")
async def generate_brochure(request: BrochureRequest):
    """
    Generate a brochure for a company (non-streaming).
    Returns the complete brochure as text.
    """
    try:
        user_prompt = get_brochure_user_prompt(request.company_name, request.url)

        response = gemini.chat.completions.create(
            model=GEMINI_MODEL,
            messages=[
                {"role": "system", "content": brochure_system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )

        brochure = response.choices[0].message.content
        return {"status": "success", "brochure": brochure}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-brochure-stream")
async def generate_brochure_stream(request: BrochureRequest):
    """
    Generate a brochure for a company with streaming.
    Returns Server-Sent Events (SSE) stream of text chunks.
    """
    try:
        user_prompt = get_brochure_user_prompt(request.company_name, request.url)

        def event_generator():
            try:
                stream = gemini.chat.completions.create(
                    model=GEMINI_MODEL,
                    messages=[
                        {"role": "system", "content": brochure_system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    stream=True,
                )

                for chunk in stream:
                    if chunk.choices[0].delta.content:
                        content = chunk.choices[0].delta.content
                        yield f"data: {json.dumps({'content': content})}\n\n"

                yield "data: [DONE]\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        return StreamingResponse(event_generator(), media_type="text/event-stream")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=os.getenv("BACKEND_HOST", "0.0.0.0"),
        port=int(os.getenv("BACKEND_PORT", 8000)),
    )

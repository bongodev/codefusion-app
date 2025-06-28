import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import APIKeyHeader

from src.services import summarize_note, assign_tag, analyze_sentiment

app = FastAPI()

API_KEY_NAME = "X-API-KEY"
API_KEY = os.environ.get("API_KEY")
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


async def get_api_key(api_key: str = Depends(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API Key")
    return api_key


@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/ai/analyze")
def analyze_note(note_data: dict, api_key: str = Depends(get_api_key)):
    summary = summarize_note(note_data)
    tag = assign_tag(note_data)
    sentiment = analyze_sentiment(note_data)

    return {
        "summary": summary,
        "tag": tag,
        "sentiment": sentiment,
    }

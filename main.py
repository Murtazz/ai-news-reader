from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from newspaper import Article
from transformers import pipeline
from gtts import gTTS
import uuid
import os

app = FastAPI()

# Load the summarization pipeline
summarizer = pipeline("summarization")

# Folder to store audio files
AUDIO_DIR = "static/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

class URLRequest(BaseModel):
    url: str

@app.post("/summarize")
def summarize_article(request: URLRequest):
    try:
        # Download and parse article
        article = Article(request.url)
        article.download()
        article.parse()
        text = article.text

        if not text:
            raise ValueError("No article text found.")

        # Summarize (adjust max/min length as needed)
        summary_list = summarizer(text, max_length=130, min_length=30, do_sample=False)
        summary = summary_list[0]["summary_text"]

        # Convert to speech
        tts = gTTS(summary)
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)
        tts.save(filepath)

        return {
            "summary": summary,
            "audio_url": f"/static/audio/{filename}"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
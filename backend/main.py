from fastapi import FastAPI, Depends
from pydantic import BaseModel
from transformers import pipeline
from typing import Literal
from sqlmodel import SQLModel, create_engine, Session
from models import Feedback
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI() 

#Create SQLite DB
engine = create_engine("sqlite:///feedback.db")
SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

#Load the sentiment analysis pipeline
sentiment_pipeline = pipeline("sentiment-analysis")

class TextInput(BaseModel):
    text:str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)    

@app.post("/analyze")
def analyze_text(input: TextInput, session: Session = Depends(get_session)):
    result = sentiment_pipeline(input.text)[0]
    label = result['label'].lower()
    score = round(result['score'], 4)
    feedback = Feedback(
        text = input.text,
        sentiment=label,
        confidence=score
    )
    session.add(feedback)
    session.commit()

    return {
        "sentiment" : label,
        "confidence": score
    }

@app.get("/")
def read_root():
    return {"message": "API is running. Visit /docs to test."}

@app.get("/feedback")
def get_feedback(session: Session = Depends(get_session)):
    results = session.query(Feedback).all()
    return results
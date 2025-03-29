from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Feedback(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    sentiment: str
    confidence: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)



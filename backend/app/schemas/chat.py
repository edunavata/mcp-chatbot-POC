from pydantic import BaseModel, Field
from typing import List, Literal


class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str = Field(..., min_length=1)


class ChatRequest(BaseModel):
    messages: List[Message]
    model: str = "gpt-3.5-turbo"

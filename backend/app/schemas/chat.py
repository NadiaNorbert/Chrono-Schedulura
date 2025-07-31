from pydantic import BaseModel
from typing import Any, Dict, Optional


class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    response: str
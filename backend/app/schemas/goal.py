from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    target_value: float
    unit: str
    deadline: Optional[datetime] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    unit: Optional[str] = None
    deadline: Optional[datetime] = None


class GoalResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    target_value: float
    current_value: float
    unit: str
    deadline: Optional[str]
    user_id: str
    created_at: str
    updated_at: str
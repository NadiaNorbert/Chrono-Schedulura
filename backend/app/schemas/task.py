from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class TaskCategory(str, Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.medium
    due_date: Optional[datetime] = None
    category: TaskCategory


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    category: Optional[TaskCategory] = None


class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    completed: bool
    priority: TaskPriority
    due_date: Optional[str]
    category: TaskCategory
    user_id: str
    created_at: str
    updated_at: str
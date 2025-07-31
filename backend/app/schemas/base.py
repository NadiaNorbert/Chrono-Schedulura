from pydantic import BaseModel
from typing import TypeVar, Generic, Optional

T = TypeVar('T')


class ApiResponse(BaseModel, Generic[T]):
    data: T
    message: Optional[str] = None
    success: bool = True
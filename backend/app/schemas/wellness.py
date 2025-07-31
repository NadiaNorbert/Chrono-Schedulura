from pydantic import BaseModel


class WellnessDataCreate(BaseModel):
    sleep_duration: float
    break_duration: float
    usage_duration: float
    mental_health_score: int
    date: str


class WellnessDataResponse(BaseModel):
    id: str
    user_id: str
    sleep_duration: float
    break_duration: float
    usage_duration: float
    mental_health_score: int
    date: str
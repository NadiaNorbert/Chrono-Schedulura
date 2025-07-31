from pydantic import BaseModel


class HealthDataCreate(BaseModel):
    hydration_level: float
    calories_consumed: int
    movement_minutes: int
    workout_completed: bool
    stress_level: int
    date: str


class HealthDataResponse(BaseModel):
    id: str
    user_id: str
    hydration_level: float
    calories_consumed: int
    movement_minutes: int
    workout_completed: bool
    stress_level: int
    date: str
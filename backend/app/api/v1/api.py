from fastapi import APIRouter
from app.api.v1.endpoints import auth, tasks, goals, wellness, health, chat, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])
api_router.include_router(wellness.router, prefix="/wellness", tags=["wellness"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
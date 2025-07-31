from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.health import HealthDataCreate, HealthDataResponse
from app.schemas.base import ApiResponse

router = APIRouter()

# Mock health database - replace with actual database
fake_health_db = {}


@router.get("/", response_model=ApiResponse[List[HealthDataResponse]])
async def get_health_data(
    date: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get health data for the current user"""
    try:
        user_health = [
            data for data in fake_health_db.values() 
            if data["user_id"] == current_user["id"]
        ]
        
        if date:
            user_health = [data for data in user_health if data["date"] == date]
        
        return ApiResponse(
            data=[HealthDataResponse(**data) for data in user_health],
            message="Health data retrieved successfully",
            success=True
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.post("/", response_model=ApiResponse[HealthDataResponse])
async def update_health_data(
    health_data: HealthDataCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create or update health data for a specific date"""
    try:
        import uuid
        
        # Check if data exists for this date
        existing_data = None
        for data in fake_health_db.values():
            if data["user_id"] == current_user["id"] and data["date"] == health_data.date:
                existing_data = data
                break
        
        if existing_data:
            # Update existing data
            update_data = health_data.dict(exclude_unset=True)
            existing_data.update(update_data)
            
            return ApiResponse(
                data=HealthDataResponse(**existing_data),
                message="Health data updated successfully",
                success=True
            )
        else:
            # Create new data
            data_id = str(uuid.uuid4())
            new_data = {
                "id": data_id,
                "user_id": current_user["id"],
                **health_data.dict()
            }
            
            fake_health_db[data_id] = new_data
            
            return ApiResponse(
                data=HealthDataResponse(**new_data),
                message="Health data created successfully",
                success=True
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
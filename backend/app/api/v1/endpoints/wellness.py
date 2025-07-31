from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.wellness import WellnessDataCreate, WellnessDataResponse
from app.schemas.base import ApiResponse

router = APIRouter()

# Mock wellness database - replace with actual database
fake_wellness_db = {}


@router.get("/", response_model=ApiResponse[List[WellnessDataResponse]])
async def get_wellness_data(
    date: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get wellness data for the current user"""
    try:
        user_wellness = [
            data for data in fake_wellness_db.values() 
            if data["user_id"] == current_user["id"]
        ]
        
        if date:
            user_wellness = [data for data in user_wellness if data["date"] == date]
        
        return ApiResponse(
            data=[WellnessDataResponse(**data) for data in user_wellness],
            message="Wellness data retrieved successfully",
            success=True
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.post("/", response_model=ApiResponse[WellnessDataResponse])
async def update_wellness_data(
    wellness_data: WellnessDataCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create or update wellness data for a specific date"""
    try:
        import uuid
        
        # Check if data exists for this date
        existing_data = None
        for data in fake_wellness_db.values():
            if data["user_id"] == current_user["id"] and data["date"] == wellness_data.date:
                existing_data = data
                break
        
        if existing_data:
            # Update existing data
            update_data = wellness_data.dict(exclude_unset=True)
            existing_data.update(update_data)
            
            return ApiResponse(
                data=WellnessDataResponse(**existing_data),
                message="Wellness data updated successfully",
                success=True
            )
        else:
            # Create new data
            data_id = str(uuid.uuid4())
            new_data = {
                "id": data_id,
                "user_id": current_user["id"],
                **wellness_data.dict()
            }
            
            fake_wellness_db[data_id] = new_data
            
            return ApiResponse(
                data=WellnessDataResponse(**new_data),
                message="Wellness data created successfully",
                success=True
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
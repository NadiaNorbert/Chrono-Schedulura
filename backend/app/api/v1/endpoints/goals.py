from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse
from app.schemas.base import ApiResponse

router = APIRouter()

# Mock goals database - replace with actual database
fake_goals_db = {}


@router.get("/", response_model=ApiResponse[List[GoalResponse]])
async def get_goals(current_user: dict = Depends(get_current_user)):
    """Get all goals for the current user"""
    try:
        user_goals = [
            goal for goal in fake_goals_db.values() 
            if goal["user_id"] == current_user["id"]
        ]
        
        return ApiResponse(
            data=[GoalResponse(**goal) for goal in user_goals],
            message="Goals retrieved successfully",
            success=True
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.post("/", response_model=ApiResponse[GoalResponse])
async def create_goal(
    goal_data: GoalCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new goal"""
    try:
        import uuid
        from datetime import datetime
        
        goal_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        new_goal = {
            "id": goal_id,
            "user_id": current_user["id"],
            "title": goal_data.title,
            "description": goal_data.description,
            "target_value": goal_data.target_value,
            "current_value": 0,
            "unit": goal_data.unit,
            "deadline": goal_data.deadline.isoformat() if goal_data.deadline else None,
            "created_at": now,
            "updated_at": now
        }
        
        fake_goals_db[goal_id] = new_goal
        
        return ApiResponse(
            data=GoalResponse(**new_goal),
            message="Goal created successfully",
            success=True
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.put("/{goal_id}", response_model=ApiResponse[GoalResponse])
async def update_goal(
    goal_id: str,
    goal_updates: GoalUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a goal"""
    try:
        if goal_id not in fake_goals_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found"
            )
        
        goal = fake_goals_db[goal_id]
        
        # Check if user owns the goal
        if goal["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this goal"
            )
        
        # Update goal
        from datetime import datetime
        update_data = goal_updates.dict(exclude_unset=True)
        
        if "deadline" in update_data and update_data["deadline"]:
            update_data["deadline"] = update_data["deadline"].isoformat()
        
        goal.update(update_data)
        goal["updated_at"] = datetime.utcnow().isoformat()
        
        return ApiResponse(
            data=GoalResponse(**goal),
            message="Goal updated successfully",
            success=True
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
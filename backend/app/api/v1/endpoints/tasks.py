from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.schemas.base import ApiResponse

router = APIRouter()

# Mock tasks database - replace with actual database
fake_tasks_db = {}


@router.get("/", response_model=ApiResponse[List[TaskResponse]])
async def get_tasks(current_user: dict = Depends(get_current_user)):
    """Get all tasks for the current user"""
    try:
        user_tasks = [
            task for task in fake_tasks_db.values() 
            if task["user_id"] == current_user["id"]
        ]
        
        return ApiResponse(
            data=[TaskResponse(**task) for task in user_tasks],
            message="Tasks retrieved successfully",
            success=True
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.post("/", response_model=ApiResponse[TaskResponse])
async def create_task(
    task_data: TaskCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new task"""
    try:
        import uuid
        from datetime import datetime
        
        task_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        new_task = {
            "id": task_id,
            "user_id": current_user["id"],
            "title": task_data.title,
            "description": task_data.description,
            "completed": False,
            "priority": task_data.priority,
            "due_date": task_data.due_date.isoformat() if task_data.due_date else None,
            "category": task_data.category,
            "created_at": now,
            "updated_at": now
        }
        
        fake_tasks_db[task_id] = new_task
        
        return ApiResponse(
            data=TaskResponse(**new_task),
            message="Task created successfully",
            success=True
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.put("/{task_id}", response_model=ApiResponse[TaskResponse])
async def update_task(
    task_id: str,
    task_updates: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a task"""
    try:
        if task_id not in fake_tasks_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        task = fake_tasks_db[task_id]
        
        # Check if user owns the task
        if task["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this task"
            )
        
        # Update task
        from datetime import datetime
        update_data = task_updates.dict(exclude_unset=True)
        
        if "due_date" in update_data and update_data["due_date"]:
            update_data["due_date"] = update_data["due_date"].isoformat()
        
        task.update(update_data)
        task["updated_at"] = datetime.utcnow().isoformat()
        
        return ApiResponse(
            data=TaskResponse(**task),
            message="Task updated successfully",
            success=True
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.delete("/{task_id}", response_model=ApiResponse[None])
async def delete_task(
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a task"""
    try:
        if task_id not in fake_tasks_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        task = fake_tasks_db[task_id]
        
        # Check if user owns the task
        if task["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this task"
            )
        
        del fake_tasks_db[task_id]
        
        return ApiResponse(
            data=None,
            message="Task deleted successfully",
            success=True
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
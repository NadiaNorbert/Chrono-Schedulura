from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import timedelta
from app.core.config import settings
from app.core.security import create_access_token, verify_password, get_password_hash, verify_token
from app.schemas.auth import LoginRequest, SignupRequest, UserResponse, TokenResponse
from app.schemas.base import ApiResponse

router = APIRouter()
security = HTTPBearer()


# Mock user database - replace with actual database
fake_users_db = {}


@router.post("/login", response_model=ApiResponse[TokenResponse])
async def login(login_data: LoginRequest):
    """Authenticate user and return access token"""
    try:
        # Check if user exists
        if login_data.email not in fake_users_db:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = fake_users_db[login_data.email]
        
        # Verify password
        if not verify_password(login_data.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["email"]}, expires_delta=access_token_expires
        )
        
        return ApiResponse(
            data=TokenResponse(
                user=UserResponse(
                    id=user["id"],
                    email=user["email"],
                    name=user["name"],
                    created_at=user["created_at"]
                ),
                token=access_token
            ),
            message="Login successful",
            success=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.post("/signup", response_model=ApiResponse[TokenResponse])
async def signup(signup_data: SignupRequest):
    """Register new user and return access token"""
    try:
        # Check if user already exists
        if signup_data.email in fake_users_db:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        from datetime import datetime
        import uuid
        
        user_id = str(uuid.uuid4())
        hashed_password = get_password_hash(signup_data.password)
        
        fake_users_db[signup_data.email] = {
            "id": user_id,
            "email": signup_data.email,
            "name": signup_data.name,
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": signup_data.email}, expires_delta=access_token_expires
        )
        
        user = fake_users_db[signup_data.email]
        
        return ApiResponse(
            data=TokenResponse(
                user=UserResponse(
                    id=user["id"],
                    email=user["email"],
                    name=user["name"],
                    created_at=user["created_at"]
                ),
                token=access_token
            ),
            message="Account created successfully",
            success=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.post("/logout", response_model=ApiResponse[None])
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Logout user (invalidate token)"""
    try:
        # In a real implementation, you would blacklist the token
        return ApiResponse(
            data=None,
            message="Logout successful",
            success=True
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)
    email = payload.get("sub")
    
    if email is None or email not in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    return fake_users_db[email]
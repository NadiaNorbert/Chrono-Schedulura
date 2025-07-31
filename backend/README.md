# AI Scheduler Backend

FastAPI backend for the AI Scheduler application.

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run the development server:**
   ```bash
   python main.py
   ```

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py          # Authentication endpoints
│   │       │   ├── tasks.py         # Task management
│   │       │   ├── goals.py         # Goal tracking
│   │       │   ├── wellness.py      # Wellness data
│   │       │   ├── health.py        # Health data
│   │       │   ├── chat.py          # AI chat
│   │       │   └── analytics.py     # Analytics
│   │       └── api.py               # API router
│   ├── core/
│   │   ├── config.py                # App configuration
│   │   └── security.py              # Security utilities
│   └── schemas/
│       ├── auth.py                  # Auth schemas
│       ├── task.py                  # Task schemas
│       ├── goal.py                  # Goal schemas
│       ├── wellness.py              # Wellness schemas
│       ├── health.py                # Health schemas
│       ├── chat.py                  # Chat schemas
│       └── base.py                  # Base schemas
├── main.py                          # FastAPI app entry point
├── requirements.txt                 # Dependencies
└── .env.example                     # Environment template
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/logout` - User logout

### Tasks
- `GET /api/v1/tasks/` - Get user tasks
- `POST /api/v1/tasks/` - Create task
- `PUT /api/v1/tasks/{task_id}` - Update task
- `DELETE /api/v1/tasks/{task_id}` - Delete task

### Goals
- `GET /api/v1/goals/` - Get user goals
- `POST /api/v1/goals/` - Create goal
- `PUT /api/v1/goals/{goal_id}` - Update goal

### Wellness
- `GET /api/v1/wellness/` - Get wellness data
- `POST /api/v1/wellness/` - Update wellness data

### Health
- `GET /api/v1/health/` - Get health data
- `POST /api/v1/health/` - Update health data

### Chat
- `POST /api/v1/chat/` - Send message to AI

### Analytics
- `GET /api/v1/analytics/user` - Get user analytics
- `GET /api/v1/analytics/tasks` - Get task analytics

## Development

The API uses mock data for development. Replace the mock databases with actual database implementations using SQLAlchemy or your preferred ORM.

### Adding New Endpoints

1. Create schema in `app/schemas/`
2. Create endpoint in `app/api/v1/endpoints/`
3. Add router to `app/api/v1/api.py`

### Database Integration

To integrate with a real database:

1. Configure database URL in `.env`
2. Create SQLAlchemy models
3. Replace mock data with database queries
4. Add database migrations with Alembic

## Deployment

1. Set environment variables
2. Install dependencies
3. Run with gunicorn:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```
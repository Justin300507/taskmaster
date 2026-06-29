import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status, Response
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import or_, func
from sqlalchemy.exc import IntegrityError
from fastapi.security import OAuth2PasswordBearer

from app.database import get_db
from app.models.tasks import Task
from app.models.projects import Project
from app.schemas.task import TaskCreate, TaskUpdate
from app.utils.auth import get_current_user

# NOTE: The User model is imported lazily in the type hint to avoid duplicate table registration.

task_router = APIRouter()

logger = logging.getLogger(__name__)


def _task_to_dict(task: Task) -> dict:
    """Convert a Task ORM instance into a plain dict suitable for JSON response."""
    return {
        "id": task.id,
        "title": getattr(task, "title", None),
        "description": getattr(task, "description", None),
        "project_id": getattr(task, "project_id", None),
        "status": getattr(task, "status", None) if hasattr(task, "status") else None,
        "due_date": getattr(task, "due_date", None).isoformat() if getattr(task, "due_date", None) else None,
        "created_at": getattr(task, "created_at", None).isoformat() if getattr(task, "created_at", None) else None,
        "updated_at": getattr(task, "updated_at", None).isoformat() if getattr(task, "updated_at", None) else None,
    }


@task_router.get("/tasks", response_model=dict)
def list_tasks(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    project_id: Optional[int] = Query(None, ge=1),
    status: Optional[str] = Query(None, min_length=1),
    search: Optional[str] = Query(None, min_length=1),
    db: Session = Depends(get_db),
    current_user: "User" = Depends(get_current_user),
):
    """List tasks with optional filters and pagination."""
    query = db.query(Task)

    if project_id is not None:
        query = query.filter(Task.project_id == project_id)
    if status is not None:
        query = query.filter(Task.status == status)
    if search:
        pattern = f"%{search}%"
        query = query.filter(or_(Task.title.ilike(pattern), Task.description.ilike(pattern)))

    total = query.count()
    tasks: List[Task] = query.offset(offset).limit(limit).all()
    return {"items": [_task_to_dict(t) for t in tasks], "total": total}


@task_router.get("/tasks/{task_id}", response_model=dict)
def get_task(
    task_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
    current_user: "User" = Depends(get_current_user),
):
    """Retrieve a single task by its ID."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return _task_to_dict(task)


@task_router.post("/tasks", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: "User" = Depends(get_current_user),
):
    """Create a new task. If a project_id is supplied, it must reference an existing project."""
    if task_in.project_id is not None:
        project = db.query(Project).filter(Project.id == task_in.project_id).first()
        if not project:
            raise HTTPException(status_code=400, detail="Project not found")
    new_task = Task(
        title=task_in.title,
        description=task_in.description,
        project_id=task_in.project_id,
    )
    db.add(new_task)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        logger.exception("Integrity error while creating task")
        raise HTTPException(status_code=400, detail="Could not create task")
    db.refresh(new_task)
    return _task_to_dict(new_task)


@task_router.put("/tasks/{task_id}", response_model=dict)
def update_task(
    task_id: int = Path(..., ge=1),
    task_in: TaskUpdate = ...,
    db: Session = Depends(get_db),
    current_user: "User" = Depends(get_current_user),
):
    """Update fields of an existing task."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    update_data = task_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return _task_to_dict(task)


@task_router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
    current_user: "User" = Depends(get_current_user),
):
    """Delete a task by its ID."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

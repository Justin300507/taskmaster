from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = Field(None, min_length=1)
    project_id: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = Field(None, min_length=1)
    project_id: Optional[int] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: int
    title: Optional[str] = None
    description: Optional[str] = None
    project_id: Optional[int] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    completed: Optional[bool] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

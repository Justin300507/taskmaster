from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

class ProjectmembershipCreate(BaseModel):
    project_id: int = Field(..., ge=1)
    user_id: int = Field(..., ge=1)
    role: str = Field(min_length=1)

    model_config = ConfigDict(from_attributes=True)

class ProjectmembershipUpdate(BaseModel):
    role: Optional[str] = Field(default=None, min_length=1)

    model_config = ConfigDict(from_attributes=True)

class ProjectmembershipResponse(BaseModel):
    id: int
    project_id: Optional[int] = None
    user_id: Optional[int] = None
    role: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

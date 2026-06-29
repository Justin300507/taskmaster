from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class InviteCreate(BaseModel):
    project_id: int = Field(..., ge=1)
    email: str = Field(..., min_length=1)
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)

class InviteUpdate(BaseModel):
    status: Optional[str] = Field(None, min_length=1)

class InviteResponse(BaseModel):
    id: int
    project_id: Optional[int] = None
    email: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class InviteOut(BaseModel):
    id: int
    project_id: int
    email: str
    title: str
    description: str
    status: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

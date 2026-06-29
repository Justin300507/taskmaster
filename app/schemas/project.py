from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class ProjectCreate(BaseModel):
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    owner_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class ProjectResponse(BaseModel):
    id: int
    title: Optional[str] = None
    description: Optional[str] = None
    owner_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

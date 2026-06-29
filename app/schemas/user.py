from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class UserCreate(BaseModel):
    email: str = Field(min_length=1)
    username: str = Field(min_length=1)
    password: str = Field(min_length=1)
    display_name: Optional[str] = None

class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    display_name: Optional[str] = None
    role: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: Optional[str] = None
    username: Optional[str] = None
    display_name: Optional[str] = None
    role: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


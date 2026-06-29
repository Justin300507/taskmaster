from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class RegisterRequest(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=1)
    display_name: Optional[str] = None

class SignupRequest(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=1)
    display_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=1)

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    display_name: Optional[str] = None

class AuthCreate(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=1)
    display_name: Optional[str] = None

class AuthUpdate(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    display_name: Optional[str] = None

class AuthResponse(BaseModel):
    id: int
    email: Optional[str] = None
    display_name: Optional[str] = None
    role: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

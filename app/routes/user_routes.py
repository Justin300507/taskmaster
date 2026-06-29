from fastapi import APIRouter, Depends, HTTPException, Query, Path, Response
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.schemas.user import UserCreate, UserUpdate
from app.utils.auth import get_current_user, get_password_hash

user_router = APIRouter()

# List users with optional email search and pagination
@user_router.get("/users")
def list_users(
    email: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    from app.models.users import User  # lazy import to avoid duplicate table registration
    query = db.query(User)
    if email:
        query = query.filter(User.email.ilike(f"%{email}%"))
    total = query.count()
    users = query.offset(offset).limit(limit).all()
    items = [
        {
            "id": u.id,
            "email": u.email,
            "username": u.username,
            "display_name": u.display_name,
        }
        for u in users
    ]
    return {"items": items, "total": total}

# Retrieve a single user by ID
@user_router.get("/users/{user_id}")
def get_user(
    user_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
):
    from app.models.users import User
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "display_name": user.display_name,
    }

# Create a new user account (sign‑up)
@user_router.post("/users", status_code=201)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
):
    from app.models.users import User
    hashed = get_password_hash(user_in.password)
    user = User(
        email=user_in.email, password=hashed, display_name=user_in.display_name, )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "display_name": user.display_name,
    }

# Update user details (email, username, password, display_name)
@user_router.put("/users/{user_id}")
def update_user(
    user_in: UserUpdate,
    user_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
    current_user: "User" = Depends(get_current_user),
):
    from app.models.users import User
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    if user_in.email is not None:
        user.email = user_in.email
    if user_in.username is not None:
        user.username = user_in.username
    if user_in.password is not None:
        user.password = get_password_hash(user_in.password)
    if user_in.display_name is not None:
        user.display_name = user_in.display_name
    db.commit()
    db.refresh(user)
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "display_name": user.display_name,
    }

# Delete a user account
@user_router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
    current_user: "User" = Depends(get_current_user),
):
    from app.models.users import User
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(user)
    db.commit()
    return Response(status_code=204)

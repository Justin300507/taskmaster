from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project_memberships import ProjectMembership
from app.models.projects import Project
from app.models.users import User
from app.schemas.projectmembership import ProjectmembershipCreate, ProjectmembershipUpdate, ProjectmembershipResponse
from typing import Optional

projectmembership_router = APIRouter()

# ----- Helper -----
def _membership_to_dict(membership: ProjectMembership) -> dict:
    return {
        "id": membership.id,
        "project_id": membership.project_id,
        "user_id": membership.user_id,
        "role": membership.role,
        "created_at": membership.created_at.isoformat() if membership.created_at else None,
        "updated_at": membership.updated_at.isoformat() if membership.updated_at else None,
    }

# ----- Endpoints -----
@projectmembership_router.get("/project_memberships", response_model=dict)
def list_project_memberships(
    project_id: Optional[int] = Query(None, ge=1),
    role: Optional[str] = Query(None, min_length=1),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(ProjectMembership)
    if project_id is not None:
        query = query.filter(ProjectMembership.project_id == project_id)
    if role is not None:
        query = query.filter(ProjectMembership.role.ilike(f"%{role}%"))
    total = query.count()
    memberships = query.offset(offset).limit(limit).all()
    items = [_membership_to_dict(m) for m in memberships]
    return {"items": items, "total": total}

@projectmembership_router.get("/project_memberships/{membership_id}", response_model=dict)
def get_project_membership(
    membership_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
):
    membership = (
        db.query(ProjectMembership)
        .filter(ProjectMembership.id == membership_id)
        .first()
    )
    if not membership:
        raise HTTPException(status_code=404, detail="Not found")
    return _membership_to_dict(membership)

@projectmembership_router.post("/project_memberships", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_project_membership(
    payload: ProjectmembershipCreate,
    db: Session = Depends(get_db),
):
    # Validate referenced Project
    project = db.query(Project).filter(Project.id == payload.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # Validate referenced User
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Create membership
    membership = ProjectMembership(
        project_id=payload.project_id,
        user_id=payload.user_id,
        role=payload.role,
    )
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return _membership_to_dict(membership)

@projectmembership_router.put("/project_memberships/{membership_id}", response_model=dict)
def update_project_membership(
    payload: ProjectmembershipUpdate,
    membership_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
):
    membership = db.query(ProjectMembership).filter(ProjectMembership.id == membership_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Not found")
    if payload.role is not None:
        membership.role = payload.role
    db.commit()
    db.refresh(membership)
    return _membership_to_dict(membership)

@projectmembership_router.delete("/project_memberships/{membership_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_membership(
    membership_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
):
    membership = db.query(ProjectMembership).filter(ProjectMembership.id == membership_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(membership)
    db.commit()
    return None

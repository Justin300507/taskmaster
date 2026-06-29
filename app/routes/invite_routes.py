from fastapi import APIRouter, Depends, HTTPException, Query, Path, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.invites import Invite
from app.models.projects import Project
from app.schemas.invite import InviteCreate, InviteUpdate, InviteOut

invite_router = APIRouter()

@invite_router.get("/invites")
def list_invites(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    project_id: int | None = Query(None, ge=1),
    status: str | None = Query(None, min_length=1),
    email: str | None = Query(None, min_length=1),
    db: Session = Depends(get_db),
):
    query = db.query(Invite)
    if project_id is not None:
        query = query.filter(Invite.project_id == project_id)
    if status is not None:
        query = query.filter(Invite.status == status)
    if email is not None:
        query = query.filter(Invite.email.ilike(f"%{email}%"))
    total = query.count()
    items = query.offset(offset).limit(limit).all()
    return {
        "items": [InviteOut.model_validate(item, from_attributes=True).model_dump() for item in items],
        "total": total,
    }

@invite_router.get("/invites/{invite_id}")
def get_invite(
    invite_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
):
    invite = db.query(Invite).filter(Invite.id == invite_id).first()
    if not invite:
        raise HTTPException(status_code=404, detail="Not found")
    return InviteOut.model_validate(invite, from_attributes=True).model_dump()

@invite_router.post("/invites", status_code=201)
def create_invite(
    invite_in: InviteCreate,
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == invite_in.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    invite = Invite(project_id=invite_in.project_id, email=invite_in.email, status="pending")
    db.add(invite)
    db.commit()
    db.refresh(invite)
    return InviteOut.model_validate(invite, from_attributes=True).model_dump()

@invite_router.put("/invites/{invite_id}")
def update_invite(
    invite_in: InviteUpdate,
    invite_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
):
    invite = db.query(Invite).filter(Invite.id == invite_id).first()
    if not invite:
        raise HTTPException(status_code=404, detail="Not found")
    invite.status = invite_in.status
    db.commit()
    db.refresh(invite)
    return InviteOut.model_validate(invite, from_attributes=True).model_dump()

@invite_router.delete("/invites/{invite_id}")
def delete_invite(
    invite_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
):
    invite = db.query(Invite).filter(Invite.id == invite_id).first()
    if not invite:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(invite)
    db.commit()
    return Response(status_code=204)

from fastapi import APIRouter, Depends, HTTPException, Query, Path, Response
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.project import Project
from app.models.task import Task
from app.models.project_membership import ProjectMembership
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.utils.auth import get_current_user

project_router = APIRouter()


def _project_to_dict(project: Project) -> dict:
    return {
        "id": project.id,
        "title": getattr(project, "title", None),
        "description": getattr(project, "description", None),
        "owner_id": getattr(project, "owner_id", None),
    }


@project_router.get("/projects")
def list_projects(
    name: Optional[str] = Query(None, description="Search by project title"),
    owner_id: Optional[int] = Query(None, description="Filter by owner"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Project)
    if name:
        query = query.filter(Project.title.ilike(f"%{name}%"))
    if owner_id is not None:
        query = query.filter(Project.owner_id == owner_id)
    total = query.count()
    projects = query.offset(offset).limit(limit).all()
    return {"items": [_project_to_dict(p) for p in projects], "total": total}


@project_router.get("/projects/{project_id}")
def get_project(
    project_id: int = Path(..., description="Project ID"),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Not found")
    return _project_to_dict(project)


@project_router.post("/projects")
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: "User" = Depends(get_current_user),
):
    project = Project(
        name=project_in.title, owner_id=current_user.id, )
    db.add(project)
    db.commit()
    db.refresh(project)
    return _project_to_dict(project)


@project_router.put("/projects/{project_id}")
def update_project(
    project_in: ProjectUpdate,
    project_id: int = Path(..., description="Project ID"),
    db: Session = Depends(get_db),
    current_user: "User" = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Not found")
    if getattr(project, "owner_id", None) != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    if project_in.title is not None:
        project.title = project_in.title
    if project_in.description is not None:
        project.description = project_in.description
    db.commit()
    db.refresh(project)
    return _project_to_dict(project)


@project_router.delete("/projects/{project_id}")
def delete_project(
    project_id: int = Path(..., description="Project ID"),
    db: Session = Depends(get_db),
    current_user: "User" = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Not found")
    if getattr(project, "owner_id", None) != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    # Delete related tasks
    db.query(Task).filter(Task.project_id == project_id).delete()
    # Delete related memberships
    db.query(ProjectMembership).filter(ProjectMembership.project_id == project_id).delete()
    db.delete(project)
    db.commit()
    return Response(status_code=204)

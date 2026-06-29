from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models.users import User
from app.models.projects import Project
from app.models.tasks import Task
from app.models.invites import Invite
from app.models.project_memberships import ProjectMembership

stats_router = APIRouter()

_CACHE_TTL = timedelta(seconds=30)
_cache: dict[str, dict] = {}

@stats_router.get("/stats/summary")
def get_stats_summary(db: Session = Depends(get_db)):
    """Return aggregate counts and key metrics for the dashboard.
    The result is cached for {_CACHE_TTL.total_seconds()} seconds to avoid
    repeated heavy aggregation queries.
    """
    now = datetime.utcnow()
    cached = _cache.get("summary")
    if cached and now - cached["time"] < _CACHE_TTL:
        return cached["data"]

    total_users = db.query(func.count(User.id)).scalar() or 0
    total_projects = db.query(func.count(Project.id)).scalar() or 0
    total_tasks = db.query(func.count(Task.id)).scalar() or 0
    total_invites = db.query(func.count(Invite.id)).scalar() or 0
    total_memberships = db.query(func.count(ProjectMembership.id)).scalar() or 0

    data = {
        "total_users": total_users,
        "total_projects": total_projects,
        "total_tasks": total_tasks,
        "total_invites": total_invites,
        "total_project_memberships": total_memberships,
    }
    _cache["summary"] = {"time": now, "data": data}
    return data

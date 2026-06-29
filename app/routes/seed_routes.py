from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.users import User
from app.models.projects import Project
from app.models.tasks import Task
from app.models.project_memberships import ProjectMembership
from app.models.invites import Invite
from app.utils.auth import get_password_hash

seed_router = APIRouter()

@seed_router.post("/seed")
def seed(db: Session = Depends(get_db)):
    # ---------- Users ----------
    users_data = [
        {
            "email": "alex.chen@example.com",
            "username": "alexchen",
            "password": "Password123",
            "display_name": "Alex Chen",
        },
        {
            "email": "maria.garcia@example.com",
            "username": "mariagarcia",
            "password": "SecurePass1",
            "display_name": "Maria Garcia",
        },
        {
            "email": "james.kim@example.com",
            "username": "jameskim",
            "password": "KimPass2023",
            "display_name": "James Kim",
        },
        {
            "email": "sara.lee@example.com",
            "username": "saralee",
            "password": "LeePass456",
            "display_name": "Sara Lee",
        },
        {
            "email": "liam.patel@example.com",
            "username": "liampatel",
            "password": "Patel2023!",
            "display_name": "Liam Patel",
        },
    ]

    for u in users_data:
        if db.query(User).filter(User.email == u["email"]).first():
            continue
        hashed = get_password_hash(u["password"])  # hash the plain password
        new_user = User(
            email=u["email"], password=hashed, display_name=u.get("display_name"),
        )
        db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()

    # ---------- Projects ----------
    projects_data = [
        {"title": "Website Redesign", "description": "Complete overhaul of the corporate website"},
        {"title": "Mobile App Launch", "description": "Release the new cross‑platform mobile app"},
        {"title": "Marketing Campaign Q3", "description": "Launch Q3 digital marketing initiatives"},
        {"title": "Internal Tool Upgrade", "description": "Upgrade internal reporting tools"},
        {"title": "Customer Onboarding", "description": "Improve onboarding flow for new customers"},
    ]

    for p in projects_data:
        if db.query(Project).filter(Project.title == p["title"]).first():
            continue
        new_project = Project(name=p["title"])  # type: ignore[arg-type]
        db.add(new_project)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()

    # Map titles to IDs for later use
    project_map = {proj.title: proj.id for proj in db.query(Project).all()}
    user_map = {user.email: user.id for user in db.query(User).all()}

    # ---------- Tasks ----------
    tasks_data = [
        {
            "title": "Design new homepage",
            "description": "Create mockups for the new homepage layout",
            "project_title": "Website Redesign",
        },
        {
            "title": "Implement authentication",
            "description": "Add OAuth2 login flow to the mobile app",
            "project_title": "Mobile App Launch",
        },
        {
            "title": "Write blog post",
            "description": "Draft blog post for the Q3 campaign",
            "project_title": "Marketing Campaign Q3",
        },
        {
            "title": "Migrate database",
            "description": "Move reporting DB to new server",
            "project_title": "Internal Tool Upgrade",
        },
        {
            "title": "Create welcome email",
            "description": "Design onboarding email series",
            "project_title": "Customer Onboarding",
        },
    ]

    for t in tasks_data:
        proj_id = project_map.get(t["project_title"])  # type: ignore[arg-type]
        if proj_id is None:
            continue
        if db.query(Task).filter(Task.title == t["title"], Task.project_id == proj_id).first():
            continue
        new_task = Task(
            title=t["title"],
            description=t["description"],
            project_id=proj_id,
        )
        db.add(new_task)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()

    # ---------- Project Memberships ----------
    memberships_data = [
        {"project_title": "Website Redesign", "user_email": "alex.chen@example.com", "role": "owner"},
        {"project_title": "Website Redesign", "user_email": "maria.garcia@example.com", "role": "member"},
        {"project_title": "Mobile App Launch", "user_email": "james.kim@example.com", "role": "owner"},
        {"project_title": "Marketing Campaign Q3", "user_email": "sara.lee@example.com", "role": "owner"},
        {"project_title": "Internal Tool Upgrade", "user_email": "liam.patel@example.com", "role": "owner"},
    ]

    for m in memberships_data:
        proj_id = project_map.get(m["project_title"])  # type: ignore[arg-type]
        user_id = user_map.get(m["user_email"])  # type: ignore[arg-type]
        if proj_id is None or user_id is None:
            continue
        if db.query(ProjectMembership).filter(
            ProjectMembership.project_id == proj_id,
            ProjectMembership.user_id == user_id,
        ).first():
            continue
        new_membership = ProjectMembership(
            project_id=proj_id,
            user_id=user_id,
            role=m["role"],
        )
        db.add(new_membership)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()

    # ---------- Invites ----------
    invites_data = [
        {"project_title": "Website Redesign", "email": "new.member@example.com"},
        {"project_title": "Mobile App Launch", "email": "beta.tester@example.com"},
        {"project_title": "Marketing Campaign Q3", "email": "partner@example.com"},
        {"project_title": "Internal Tool Upgrade", "email": "admin@example.com"},
        {"project_title": "Customer Onboarding", "email": "support@example.com"},
    ]

    for inv in invites_data:
        proj_id = project_map.get(inv["project_title"])  # type: ignore[arg-type]
        if proj_id is None:
            continue
        if db.query(Invite).filter(Invite.project_id == proj_id, Invite.email == inv["email"]).first():
            continue
        new_invite = Invite(project_id=proj_id, email=inv["email"])  # type: ignore[arg-type]
        db.add(new_invite)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()

    return {"status": "seeded"}

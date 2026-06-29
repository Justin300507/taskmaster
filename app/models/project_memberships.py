from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from app.database import Base

class ProjectMembership(Base):
    __tablename__ = "project_memberships"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


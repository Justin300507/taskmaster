from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from app.database import Base


class Invite(Base):
    __tablename__ = "invites"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)
    email = Column(String, nullable=False)
    token = Column(String, nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relationships

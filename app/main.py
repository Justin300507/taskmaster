from fastapi import FastAPI

from app.database import engine, Base
# model imports
from app.models.invites import *  # noqa: F401
from app.models.users import *  # noqa: F401
from app.models.project_memberships import *  # noqa: F401
from app.models.projects import *  # noqa: F401
from app.models.tasks import *  # noqa: F401

# router imports
from app.routes.stats_routes import stats_router
from app.routes.auth_routes import auth_router
from app.routes.seed_routes import seed_router
from app.routes.user_routes import user_router
from app.routes.project_routes import project_router
from app.routes.projectmembership_routes import projectmembership_router
from app.routes.task_routes import task_router
from app.routes.invite_routes import invite_router

app = FastAPI()

# CORS (required for frontend access)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create tables
Base.metadata.create_all(bind=engine)

# include routers
app.include_router(stats_router)
app.include_router(auth_router)
app.include_router(seed_router)
app.include_router(user_router)
app.include_router(project_router)
app.include_router(projectmembership_router)
app.include_router(task_router)
app.include_router(invite_router)

# Health endpoint (required for deployment health checks)
@app.get("/health")
def health():
    return {"status": "ok"}

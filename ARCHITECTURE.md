# Architecture — Taskmaster

## ER Diagram

```
┌─────────────────────┐
│ Invite              │
├─────────────────────┤
│ id         Integer ││
│ project_id Integer ││
│ email      String  ││
│ token      String  ││
│ status     String  ││
│ created_at DateTime││
└─────────────────────┘

┌─────────────────────┐
│ ProjectMembership   │
├─────────────────────┤
│ id         Integer ││
│ project_id Integer ││
│ user_id    Integer ││
│ role       String  ││
│ created_at DateTime││
└─────────────────────┘

┌─────────────────────┐
│ Project             │
├─────────────────────┤
│ id         Integer ││
│ name       String  ││
│ owner_id   Integer ││
│ created_at DateTime││
└─────────────────────┘

┌─────────────────────┐
│ Task                │
├─────────────────────┤
│ id         Integer ││
│ project_id Integer ││
│ title      String  ││
│ description Text    ││
│ due_date   DateTime││
│ completed  Boolean ││
│ created_at DateTime││
│ updated_at DateTime││
└─────────────────────┘

┌─────────────────────┐
│ User                │
├─────────────────────┤
│ id         Integer ││
│ email      String  ││
│ hashed_password Strin│
│ created_at DateTime││
└─────────────────────┘

```

## Backend Architecture

```
FastAPI Application
├── Routing Layer (app/routes/)     → HTTP request handling
├── Service Layer (app/services/)   → Business logic
├── Model Layer (app/models/)       → Database ORM (SQLAlchemy)
├── Schema Layer (app/schemas/)     → Validation (Pydantic v2)
└── Database (app/database.py)      → Session management (SQLite)
```

## Design Patterns

- **Repository pattern**: services own DB queries, routes own HTTP logic
- **Dependency injection**: `get_db` session injected via FastAPI `Depends()`
- **Schema separation**: ORM models never exposed directly; Pydantic schemas serialize responses
- **JWT auth**: Bearer tokens validated via `oauth2_scheme` dependency

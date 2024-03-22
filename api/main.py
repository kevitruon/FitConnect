from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routers import (
    accounts,
    friendships,
    workouts,
    exercises,
    sets,
    friend_workouts,
)
from authenticator import authenticator


app = FastAPI()


@app.get("/")
def root():
    return {"message": "You hit the root path!"}


app.include_router(accounts.router)
app.include_router(authenticator.router)
app.include_router(friendships.router)
app.include_router(workouts.router)
app.include_router(exercises.router)
app.include_router(sets.router)
app.include_router(friend_workouts.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.environ.get("CORS_HOST"),
        "https://fitconnect1.gitlab.io",
        "fitconnect1.gitlab.io",
        "https://fitconnect1.gitlab.io/fit-connect",
        "localhost:8000",
        "localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

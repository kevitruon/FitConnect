from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routers import (
    accounts,
    friendships,
    workouts,
    workout_likes,
    workout_comments,
    exercises,
    sets,
)
from authenticator import authenticator


app = FastAPI()
app.include_router(accounts.router)
app.include_router(authenticator.router)
app.include_router(friendships.router)
app.include_router(workouts.router)
app.include_router(workout_likes.router)
app.include_router(workout_comments.router)
app.include_router(exercises.router)
app.include_router(sets.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_HOST")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/launch-details")
def launch_details():
    return {
        "launch_details": {
            "module": 3,
            "week": 17,
            "day": 5,
            "hour": 19,
            "min": "00",
        }
    }

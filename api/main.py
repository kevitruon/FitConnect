from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routers import accounts
from routers import workouts
from authenticator import authenticator
from routers import friendships

app = FastAPI()
app.include_router(accounts.router)
app.include_router(authenticator.router)
<<<<<<< HEAD
app.include_router(friendships.router)

=======
app.include_router(workouts.router)
>>>>>>> 6a3d6d693d77cfc183d7b3abb4e4071d2ccdc065
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

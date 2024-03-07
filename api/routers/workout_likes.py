from fastapi import APIRouter, Depends, Response, Request
from typing import List
from queries.workout_likes import (
    WorkoutLikeIn,
    WorkoutLikeOut,
    WorkoutLikeRepository,
)

router = APIRouter()


@router.post("/workout-likes", response_model=WorkoutLikeOut)
async def create_workout_like(
    like: WorkoutLikeIn,
    repo: WorkoutLikeRepository = Depends(),
):
    return repo.create(like)


@router.get("/workout-likes/{workout_id}", response_model=List[WorkoutLikeOut])
async def get_workout_likes(
    workout_id: int,
    repo: WorkoutLikeRepository = Depends(),
):
    return repo.get_all(workout_id)

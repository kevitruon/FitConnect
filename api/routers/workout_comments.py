from fastapi import APIRouter, Depends, Response, Request
from typing import List
from queries.workout_comments import (
    WorkoutCommentIn,
    WorkoutCommentOut,
    WorkoutCommentRepository,
)

router = APIRouter()


@router.post("/workout-comments", response_model=WorkoutCommentOut)
async def create_workout_comment(
    comment: WorkoutCommentIn,
    repo: WorkoutCommentRepository = Depends(),
):
    return repo.create(comment)


@router.get(
    "/workout-comments/{workout_id}", response_model=List[WorkoutCommentOut]
)
async def get_workout_comments(
    workout_id: int,
    repo: WorkoutCommentRepository = Depends(),
):
    return repo.get_all(workout_id)

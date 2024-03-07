from fastapi import APIRouter, Depends, Response, Request
from typing import List
from queries.exercises import ExerciseIn, ExerciseOut, ExerciseRepository

router = APIRouter()


@router.post("/exercises", response_model=ExerciseOut)
async def create_exercise(
    exercise: ExerciseIn,
    repo: ExerciseRepository = Depends(),
):
    return repo.create(exercise)


@router.get("/exercises", response_model=List[ExerciseOut])
async def get_exercises(
    repo: ExerciseRepository = Depends(),
):
    return repo.get_all()

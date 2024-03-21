from fastapi import APIRouter, Depends
from typing import List, Optional
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


@router.get("/exercises/{exercise_id}", response_model=Optional[ExerciseOut])
async def get_exercise(
    exercise_id: int,
    repo: ExerciseRepository = Depends(),
) -> Optional[ExerciseOut]:
    return repo.get_exercise(exercise_id)

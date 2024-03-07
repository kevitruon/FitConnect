from fastapi import APIRouter, Depends, Response, Request
from typing import List
from queries.sets import SetIn, SetOut, SetRepository

router = APIRouter()


@router.post("/sets", response_model=SetOut)
async def create_set(
    set: SetIn,
    repo: SetRepository = Depends(),
):
    return repo.create(set)


@router.get("/sets/{workout_id}", response_model=List[SetOut])
async def get_sets(
    workout_id: int,
    repo: SetRepository = Depends(),
):
    return repo.get_all(workout_id)

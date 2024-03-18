from fastapi import APIRouter, Depends, Response, Request
from typing import List, Optional
from queries.workouts import (
    WorkoutIn,
    WorkoutOut,
    WorkoutRepository,
    WorkoutErrorMsg,
)
from authenticator import authenticator
from routers.sets import SetIn

router = APIRouter()


@router.get("/workouts", response_model=List[WorkoutOut] | WorkoutErrorMsg)
async def get_all_workouts(
    request: Request,
    account_data: dict = Depends(authenticator.get_current_account_data),
    repo: WorkoutRepository = Depends(),
) -> List[WorkoutOut] | WorkoutErrorMsg:
    user_id = account_data["id"]
    return repo.get_all(user_id)


@router.get(
    "/workouts/{workout_id}",
    response_model=Optional[WorkoutOut] | WorkoutErrorMsg,
)
async def get_workout_detail(
    workout_id: int,
    request: Request,
    response: Response,
    repo: WorkoutRepository = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
) -> Optional[WorkoutOut] | WorkoutErrorMsg:
    user_id = account_data["id"]
    result = repo.get_detail(workout_id, user_id)
    if result is None:
        response.status_code = 404
        return None
        return None
    elif isinstance(result, WorkoutErrorMsg):
        response.status_code = 500
        return None
    else:
        return result


@router.post("/workouts", response_model=WorkoutOut | WorkoutErrorMsg)
async def create_workout(
    workout: WorkoutIn,
    sets: List[SetIn],
    request: Request,
    response: Response,
    repo: WorkoutRepository = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
) -> WorkoutOut | WorkoutErrorMsg:
    sets_data = [set_in.dict() for set_in in sets]
    user_id = int(account_data["id"])
    created_workout = repo.create(
        workout=workout, sets=sets_data, user_id=user_id
    )
    if isinstance(created_workout, WorkoutErrorMsg):
        response.status_code = 400
    return created_workout


@router.put(
    "/workouts/{workout_id}", response_model=WorkoutOut | WorkoutErrorMsg
)
async def update_workout(
    workout_id: int,
    workout: WorkoutIn,
    sets: List[SetIn],
    request: Request,
    response: Response,
    repo: WorkoutRepository = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
) -> WorkoutOut | WorkoutErrorMsg:
    sets_data = [set_in.dict() for set_in in sets]
    user_id = int(account_data["id"])
    updated_workout = repo.update(workout_id, workout, sets_data, user_id)
    if isinstance(updated_workout, WorkoutErrorMsg):
        response.status_code = 400
    return updated_workout


@router.delete("/workouts/{workout_id}", response_model=bool)
async def delete_workout(
    workout_id: int,
    request: Request,
    response: Response,
    repo: WorkoutRepository = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
) -> bool:
    user_id = int(account_data["id"])
    success = repo.delete(workout_id, user_id)
    if not success:
        response.status_code = 404
    return success

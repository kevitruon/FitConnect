from fastapi import APIRouter, Depends, Response, Request, HTTPException
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
    # Get user_id from authenticated account
    user_id = int(account_data["id"])

    # Validate that sets list is not empty
    if not sets or len(sets) == 0:
        response.status_code = 400
        raise HTTPException(
            status_code=400,
            detail="At least one set is required to create a workout",
        )

    # Convert sets to dictionaries
    sets_data = [set_in.dict() for set_in in sets]

    # Override the user_id in workout with authenticated user's id
    workout.user_id = user_id

    # Create the workout
    created_workout = repo.create(
        workout=workout, sets=sets_data, user_id=user_id
    )

    if created_workout is None:
        response.status_code = 500
        raise HTTPException(status_code=500, detail="Failed to create workout")
    elif isinstance(created_workout, WorkoutErrorMsg):
        response.status_code = 400
        return created_workout

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

    # Override the user_id in workout with authenticated user's id
    workout.user_id = user_id

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

from fastapi import APIRouter, Depends
from typing import List
from queries.friend_workouts import (
    FriendWorkoutRepository,
    FriendWorkoutOut,
)
from authenticator import authenticator

router = APIRouter()


@router.get("/friend-workouts", response_model=List[FriendWorkoutOut])
async def get_friend_workouts(
    account_data: dict = Depends(authenticator.get_current_account_data),
    repo: FriendWorkoutRepository = Depends(),
) -> List[FriendWorkoutOut]:
    user_id = account_data["id"]
    return repo.get_friend_workouts(user_id)

from fastapi import (
    APIRouter,
    Depends,
    Response,
    HTTPException,
    status,
    Request,
)
from queries.friendships import (
    FriendshipIn,
    FriendshipOut,
    FriendshipRepo,
    FriendshipErrorMsg,
    DuplicateFriendshipError,
)
from typing import List, Optional, Union
from jwtdown_fastapi.authentication import Token
from authenticator import authenticator
from pydantic import BaseModel

router = APIRouter()


@router.post("/friendships", response_model=FriendshipOut | FriendshipErrorMsg)
async def create_friendship(
    friendship: FriendshipIn,
    request: Request,
    repo: FriendshipRepo = Depends(),
):
    try:
        return repo.create(friendship)
    except DuplicateFriendshipError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/friendships", response_model=List[FriendshipOut] | FriendshipErrorMsg
)
async def get_all_friendships(
    request: Request,
    account_data: dict = Depends(authenticator.get_current_account_data),
    repo: FriendshipRepo = Depends(),
):
    user_id = account_data["user_id"]
    return repo.get_all(user_id)

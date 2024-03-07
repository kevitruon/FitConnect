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
import pydantic


pydantic.error_wrappers.ValidationError.print_errors = True

router = APIRouter()


@router.post("/friendships", response_model=FriendshipOut | FriendshipErrorMsg)
async def create_friendship(
    friendship: FriendshipIn,
    request: Request,
    repo: FriendshipRepo = Depends(),
):
    print(friendship)  # Add this line to print the request data
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
    user_id = account_data["id"]
    return repo.get_all(user_id)


@router.get(
    "/friendships/{friendship_id}",
    response_model=FriendshipOut | FriendshipErrorMsg,
)
async def get_friendship_detail(
    friendship_id: int,
    repo: FriendshipRepo = Depends(),
):
    result = repo.get(friendship_id)
    if isinstance(result, FriendshipErrorMsg):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.message,
        )
    return result


@router.put(
    "/friendships/{friendship_id}/pending",
    response_model=FriendshipOut | FriendshipErrorMsg,
)
async def set_friendship_pending(
    friendship_id: int,
    repo: FriendshipRepo = Depends(),
):
    result = repo.set_pending(friendship_id)
    if isinstance(result, FriendshipErrorMsg):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.message,
        )
    return result


@router.put(
    "/friendships/{friendship_id}/accepted",
    response_model=FriendshipOut | FriendshipErrorMsg,
)
async def set_friendship_accepted(
    friendship_id: int,
    repo: FriendshipRepo = Depends(),
):
    result = repo.set_accepted(friendship_id)
    if isinstance(result, FriendshipErrorMsg):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.message,
        )
    return result


@router.put(
    "/friendships/{friendship_id}/rejected",
    response_model=FriendshipOut | FriendshipErrorMsg,
)
async def set_friendship_rejected(
    friendship_id: int,
    repo: FriendshipRepo = Depends(),
):
    result = repo.set_rejected(friendship_id)
    if isinstance(result, FriendshipErrorMsg):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.message,
        )
    return result


@router.delete(
    "/friendships/{friendship_id}", response_model=bool | FriendshipErrorMsg
)
async def delete_friendship(
    friendship_id: int,
    repo: FriendshipRepo = Depends(),
):
    result = repo.delete(friendship_id)
    if isinstance(result, FriendshipErrorMsg):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.message,
        )
    return result

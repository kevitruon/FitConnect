from fastapi import APIRouter, Depends, Response
from typing import List, Union, Optional
from queries.accounts import (
    UserIn,
    UserOut,
    UserRepository,
    UserErrorMsg
)


router = APIRouter()


@router.post("/users", response_model=Union[UserOut, UserErrorMsg])
def create_user(
    user: UserIn,
    response: Response,
    repo: UserRepository = Depends()
):
    # print("user", user.username)
    # print(repo)
    result = repo.create(user)
    if isinstance(result, UserErrorMsg):
        response.status_code = 418
    return result


@router.get("/users", response_model=List[UserOut])
def get_all(
    repo: UserRepository = Depends(),
):
    return repo.get_all()


@router.get("/users/{user_id}", response_model=Optional[UserOut])
def get_detail(
    user_id: int,
    response: Response,
    repo: UserRepository = Depends(),
) -> Optional[UserOut]:
    result = repo.get_detail(user_id)
    if isinstance(result, UserErrorMsg):
        response.status_code = 418
    return result


@router.put("/users/{user_id}", response_model=Union[UserOut, UserErrorMsg])
def update_user(
    user_id: int,
    user: UserIn,
    repo: UserRepository = Depends(),
) -> Union[UserErrorMsg, UserOut]:
    return repo.update(user_id, user)


@router.delete("/users/{user_id}", response_model=bool)
def delete_user(
    user_id: int,
    repo: UserRepository = Depends(),
) -> bool:
    return repo.delete(user_id)

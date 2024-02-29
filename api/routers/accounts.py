from fastapi import (
    Depends,
    APIRouter,
)
from typing import List
from pydantic import BaseModel
from queries.accounts import UserOut, UserRepository

router = APIRouter()


@router.get("/account", response_model=List[UserOut])
async def get_users(users: UserRepository = Depends()):
    return users.get_all()

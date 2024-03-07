from fastapi import (
    APIRouter,
    Depends,
    Response,
    HTTPException,
    status,
    Request,
)
from queries.accounts import (
    AccountIn,
    AccountOut,
    AccountRepository,
    AccountErrorMsg,
    DuplicateAccountError,
)
from typing import List, Optional, Union
from jwtdown_fastapi.authentication import Token
from authenticator import authenticator
from pydantic import BaseModel

router = APIRouter()

class AccountForm(BaseModel):
    username: str
    password: str


class AccountToken(Token):
    account: AccountOut


class HttpError(BaseModel):
    detail: str







@router.get("/protected", response_model=bool)
async def get_tokens(
    request: Request,
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    return True


@router.get("/token", response_model=AccountToken | None)
async def get_token(
    request: Request,
    account: AccountOut = Depends(authenticator.try_get_current_account_data),
) -> AccountToken | None:
    if account and authenticator.cookie_name in request.cookies:
        return {
            "access_token": request.cookies[authenticator.cookie_name],
            "type": "Bearer",
            "account": account,
        }


@router.post("/users", response_model=AccountToken | HttpError)
async def create_user(
    info: AccountIn,
    request: Request,
    response: Response,
    repo: AccountRepository = Depends(),
):
    hashed_password = authenticator.hash_password(info.password)
    try:
        account = repo.create(info, hashed_password)
        print("AAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    except DuplicateAccountError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create an user with those credentials",
        )
    print("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
    form = AccountForm(username=info.email, password=info.password)
    print()
    print("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC")
    token = await authenticator.login(response, request, form, repo)
    # token = {
    #     account: {"id": "1", "username": "kevit", "password": "<PASSWORD>"}
    # }
    print("This is token", token)
    print("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
    return AccountToken(account=account, **token.dict())


@router.get("/users", response_model=List[AccountOut])
def get_all(
    repo: AccountRepository = Depends(),
):
    return repo.get_all()


@router.get("/users/{user_id}", response_model=Optional[AccountOut])
def get_detail(
    user_id: int,
    response: Response,
    repo: AccountRepository = Depends(),
) -> Optional[AccountOut]:
    result = repo.get_detail(user_id)
    if isinstance(result, AccountErrorMsg):
        response.status_code = 418
    return result


@router.put(
    "/users/{user_id}", response_model=Union[AccountOut, AccountErrorMsg]
)
def update_user(
    user_id: int,
    user: AccountIn,
    repo: AccountRepository = Depends(),
) -> Union[AccountErrorMsg, AccountOut]:
    hashed_password = authenticator.hash_password(user.password)
    user.password = hashed_password
    return repo.update(user_id, user)


@router.delete("/users/{user_id}", response_model=bool)
def delete_user(
    user_id: int,
    repo: AccountRepository = Depends(),
) -> bool:
    return repo.delete(user_id)

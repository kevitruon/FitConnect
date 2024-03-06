from pydantic import BaseModel
from queries.pool import pool
from typing import Union, Optional


class FriendshipErrorMsg(BaseModel):
    message: str


class DuplicateFriendshipError(ValueError):
    message: str


class FriendshipIn(BaseModel):
    user_id: int
    friend_id: int


class FriendshipOut(BaseModel):
    friendship_id: int
    user_id: int
    friend_id: int
    status: str
    date_requested: datetime
    date_accepted: Optional[datetime]


class FriendshipRepo(BaseModel):
    def record_to_friendship_out(self, record):
        return FriendshipOut(
            friendship_id=record[0],
            user_id=record[1],
            friend_id=record[2],
            status=record[3],
            date_requested=record[4],
            date_accepted=record[5],
        )

    def create(self, friendship: FriendshipIn) -> FriendshipOut:
        pass

    def get(self, friendship_id: int) -> FriendshipOut:
        pass

    def get_all(
        self, user_id: int
    ) -> Union[FriendshipOut, FriendshipErrorMsg]:
        pass

    def update(
        self, friendship_id: int, friendship: FriendshipIn
    ) -> Union[FriendshipOut, FriendshipErrorMsg]:
        pass

    def delete(self, friendship_id: int) -> bool:
        pass

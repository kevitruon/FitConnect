from pydantic import BaseModel
from queries.pool import pool
from typing import Union, Optional
import datetime as dt


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
    date_requested: dt.datetime
    date_accepted: Optional[dt.datetime]


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
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    result = cur.execute(
                        """
                        INSERT INTO friendships (user1_id, user2_id)
                        VALUES (%s, %s)
                        RETURNING friendship_id, user1_id, user2_id, status, date_requested, date_accepted;
                        """,
                        [friendship.user_id, friendship.friend_id],
                    )
                    record = result.fetchone()
                    return self.record_to_friendship_out(record)
        except Exception as e:
            if "duplicate key value violates unique constraint" in str(e):
                raise DuplicateFriendshipError("Friendship already exists")
            raise FriendshipErrorMsg(message="Could not create friendship")

    def get(self, friendship_id: int) -> FriendshipOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT friendship_id, user1_id, user2_id, status, date_requested, date_accepted
                        FROM friendships
                        WHERE friendship_id = %s
                        """,
                        [friendship_id],
                    )
                    record = result.fetchone()
                    if record:
                        return self.record_to_friendship_out(record)
                    else:
                        raise FriendshipErrorMsg(
                            message="Friendship not found"
                        )
        except Exception as e:
            raise FriendshipErrorMsg(message="Could not get friendship")

    def get_all(
        self, user_id: int
    ) -> Union[list[FriendshipOut], FriendshipErrorMsg]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT friendship_id, user1_id, user2_id, status, date_requested, date_accepted
                        FROM friendships
                        WHERE user1_id = %s OR user2_id = %s
                        ORDER BY friendship_id;
                        """,
                        [user_id, user_id],
                    )
                    result = [
                        self.record_to_friendship_out(record)
                        for record in db.fetchall()
                    ]
                    print("Result from get_all:", result)  # Print the result
                    return result
        except Exception as e:
            return FriendshipErrorMsg(message="Error retrieving friendships")

    def set_pending(
        self, friendship_id: int
    ) -> Union[FriendshipOut, FriendshipErrorMsg]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE friendships
                        SET status = 'pending', date_accepted = NULL
                        WHERE friendship_id = %s
                        RETURNING friendship_id, user1_id, user2_id, status, date_requested, date_accepted;
                        """,
                        [friendship_id],
                    )
                    record = db.fetchone()
                    if record:
                        return self.record_to_friendship_out(record)
                    else:
                        return FriendshipErrorMsg(
                            message="Friendship not found"
                        )
        except Exception as e:
            return FriendshipErrorMsg(
                message="Error setting friendship as pending"
            )

    def set_accepted(
        self, friendship_id: int
    ) -> Union[FriendshipOut, FriendshipErrorMsg]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE friendships
                        SET status = 'accepted', date_accepted = NOW()
                        WHERE friendship_id = %s
                        RETURNING friendship_id, user1_id, user2_id, status, date_requested, date_accepted;
                        """,
                        [friendship_id],
                    )
                    record = db.fetchone()
                    if record:
                        return self.record_to_friendship_out(record)
                    else:
                        return FriendshipErrorMsg(
                            message="Friendship not found"
                        )
        except Exception as e:
            return FriendshipErrorMsg(
                message="Error setting friendship as accepted"
            )

    def set_rejected(
        self, friendship_id: int
    ) -> Union[FriendshipOut, FriendshipErrorMsg]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE friendships
                        SET status = 'rejected', date_accepted = NULL
                        WHERE friendship_id = %s
                        RETURNING friendship_id, user1_id, user2_id, status, date_requested, date_accepted;
                        """,
                        [friendship_id],
                    )
                    record = db.fetchone()
                    if record:
                        return self.record_to_friendship_out(record)
                    else:
                        return FriendshipErrorMsg(
                            message="Friendship not found"
                        )
        except Exception as e:
            return FriendshipErrorMsg(
                message="Error setting friendship as rejected"
            )

    def delete(self, friendship_id: int) -> Union[bool, FriendshipErrorMsg]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM friendships
                        WHERE friendship_id = %s
                        """,
                        [friendship_id],
                    )
                    rows_affected = db.rowcount
                    if rows_affected > 0:
                        return True
                    else:
                        return FriendshipErrorMsg(
                            message="Friendship not found"
                        )
        except Exception as e:
            return FriendshipErrorMsg(message="Error deleting friendship")

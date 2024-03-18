from pydantic import BaseModel
from queries.pool import pool
from typing import Optional, List
from datetime import datetime


class FriendshipErrorMsg(BaseModel):
    message: str


class DuplicateFriendshipError(ValueError):
    message: str


class FriendshipIn(BaseModel):
    sender_id: int
    recipient_id: int


class FriendshipOut(BaseModel):
    friendship_id: int
    sender_id: int
    recipient_id: int
    status: str
    created_at: datetime


class FriendshipRepository:
    def create_friendship(
        self, sender_id: int, recipient_id: int
    ) -> FriendshipOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    INSERT INTO friendships
                        (sender_id, recipient_id)
                    VALUES (%s, %s)
                    RETURNING
                        friendship_id,
                        sender_id,
                        recipient_id,
                        status,
                        created_at;
                    """,
                    [sender_id, recipient_id],
                )
                record = db.fetchone()
                if record:
                    (
                        friendship_id,
                        sender_id,
                        recipient_id,
                        status,
                        created_at,
                    ) = record
                    return FriendshipOut(
                        friendship_id=friendship_id,
                        sender_id=sender_id,
                        recipient_id=recipient_id,
                        status=status,
                        created_at=created_at,
                    )
                return None

    def get_friendship(
        self, sender_id: int, recipient_id: int
    ) -> Optional[FriendshipOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    SELECT
                        friendship_id,
                        sender_id,
                        recipient_id,
                        status,
                        created_at
                    FROM friendships
                    WHERE
                        (sender_id = %s AND recipient_id = %s)
                    OR
                        (sender_id = %s AND recipient_id = %s);
                    """,
                    [sender_id, recipient_id, recipient_id, sender_id],
                )
                record = db.fetchone()
                if record:
                    (
                        friendship_id,
                        sender_id,
                        recipient_id,
                        status,
                        created_at,
                    ) = record
                    return FriendshipOut(
                        friendship_id=friendship_id,
                        sender_id=sender_id,
                        recipient_id=recipient_id,
                        status=status,
                        created_at=created_at,
                    )
                return None

    def get_friendships(self, user_id: int) -> List[FriendshipOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    SELECT
                        friendship_id,
                        sender_id,
                        recipient_id,
                        status,
                        created_at
                    FROM friendships
                    WHERE sender_id = %s OR recipient_id = %s;
                    """,
                    [user_id, user_id],
                )
                records = db.fetchall()
                friendships = []
                for record in records:
                    (
                        friendship_id,
                        sender_id,
                        recipient_id,
                        status,
                        created_at,
                    ) = record
                    friendships.append(
                        FriendshipOut(
                            friendship_id=friendship_id,
                            sender_id=sender_id,
                            recipient_id=recipient_id,
                            status=status,
                            created_at=created_at,
                        )
                    )
                return friendships

    def accept_friendship(
        self, friendship_id: int, user_id: int
    ) -> Optional[FriendshipOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    UPDATE friendships
                    SET status = 'accepted'
                    WHERE friendship_id = %s
                    AND recipient_id = %s
                    AND status = 'pending'
                    RETURNING
                        friendship_id,
                        sender_id,
                        recipient_id,
                        status,
                        created_at;
                    """,
                    [friendship_id, user_id],
                )
                record = db.fetchone()
                if record:
                    (
                        friendship_id,
                        sender_id,
                        recipient_id,
                        status,
                        created_at,
                    ) = record
                    return FriendshipOut(
                        friendship_id=friendship_id,
                        sender_id=sender_id,
                        recipient_id=recipient_id,
                        status=status,
                        created_at=created_at,
                    )
                return None

    def reject_friendship(
        self, friendship_id: int, user_id: int
    ) -> Optional[FriendshipOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    UPDATE friendships
                    SET status = 'rejected'
                    WHERE friendship_id = %s
                    AND recipient_id = %s
                    AND status = 'pending'
                    RETURNING
                        friendship_id,
                        sender_id,
                        recipient_id,
                        status,
                        created_at;
                    """,
                    [friendship_id, user_id],
                )
                record = db.fetchone()
                if record:
                    (
                        friendship_id,
                        sender_id,
                        recipient_id,
                        status,
                        created_at,
                    ) = record
                    return FriendshipOut(
                        friendship_id=friendship_id,
                        sender_id=sender_id,
                        recipient_id=recipient_id,
                        status=status,
                        created_at=created_at,
                    )
                return None

    def remove_friendship(self, friendship_id: int, user_id: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    DELETE FROM friendships
                    WHERE friendship_id = %s
                    AND (sender_id = %s OR recipient_id = %s)
                    RETURNING friendship_id;
                    """,
                    [friendship_id, user_id, user_id],
                )
                record = db.fetchone()
                return record is not None

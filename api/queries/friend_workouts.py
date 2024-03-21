from pydantic import BaseModel
from queries.pool import pool
from typing import List


class FriendWorkoutOut(BaseModel):
    workout_id: int
    user_id: int
    username: str
    workout_date: str
    notes: str


class FriendWorkoutRepository:
    def get_friend_workouts(self, user_id: int) -> List[FriendWorkoutOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT
                            w.workout_id,
                            w.user_id,
                            u.username,
                            w.workout_date,
                            w.notes
                        FROM workouts w
                        JOIN users u ON w.user_id = u.user_id
                        WHERE w.user_id IN (
                            SELECT recipient_id
                            FROM friendships
                            WHERE sender_id = %s AND status = 'accepted'
                            UNION
                            SELECT sender_id
                            FROM friendships
                            WHERE recipient_id = %s AND status = 'accepted'
                        )
                        ORDER BY w.workout_date DESC;
                        """,
                        (user_id, user_id),
                    )
                    records = cur.fetchall()
                    return [
                        FriendWorkoutOut(
                            workout_id=record[0],
                            user_id=record[1],
                            username=record[2],
                            workout_date=record[3].strftime("%Y-%m-%d"),
                            notes=record[4],
                        )
                        for record in records
                    ]
        except Exception as e:
            print(e)
            return []

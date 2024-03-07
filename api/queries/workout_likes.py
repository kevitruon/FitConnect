from pydantic import BaseModel
from queries.pool import pool
from typing import List, Union


class WorkoutLikeIn(BaseModel):
    user_id: int
    workout_id: int


class WorkoutLikeOut(BaseModel):
    like_id: int
    user_id: int
    workout_id: int
    like_date: str


class WorkoutLikeRepository:
    def create(self, like: WorkoutLikeIn) -> WorkoutLikeOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO workout_likes (user_id, workout_id)
                        VALUES (%s, %s)
                        RETURNING like_id, user_id, workout_id, like_date;
                        """,
                        [like.user_id, like.workout_id],
                    )
                    record = cur.fetchone()
                    return WorkoutLikeOut(
                        like_id=record[0],
                        user_id=record[1],
                        workout_id=record[2],
                        like_date=record[3].strftime("%Y-%m-%d %H:%M:%S"),
                    )
        except Exception as e:
            print(e)
            return {"message": "Could not create workout like"}

    def get_all(self, workout_id: int) -> Union[List[WorkoutLikeOut], dict]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT like_id, user_id, workout_id, like_date
                        FROM workout_likes
                        WHERE workout_id = %s;
                        """,
                        [workout_id],
                    )
                    records = cur.fetchall()
                    return [
                        WorkoutLikeOut(
                            like_id=record[0],
                            user_id=record[1],
                            workout_id=record[2],
                            like_date=record[3].strftime("%Y-%m-%d %H:%M:%S"),
                        )
                        for record in records
                    ]
        except Exception as e:
            print(e)
            return {"message": "Could not get workout likes"}

from pydantic import BaseModel
from queries.pool import pool
from typing import List, Union


class WorkoutCommentIn(BaseModel):
    user_id: int
    workout_id: int
    comment_text: str


class WorkoutCommentOut(BaseModel):
    comment_id: int
    user_id: int
    workout_id: int
    comment_text: str
    comment_date: str


class WorkoutCommentRepository:
    def create(self, comment: WorkoutCommentIn) -> WorkoutCommentOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO workout_comments
                            (user_id, workout_id, comment_text)
                        VALUES (%s, %s, %s)
                        RETURNING
                            comment_id,
                            user_id,
                            workout_id,
                            comment_text,
                            comment_date;
                        """,
                        [
                            comment.user_id,
                            comment.workout_id,
                            comment.comment_text,
                        ],
                    )
                    record = cur.fetchone()
                    return WorkoutCommentOut(
                        comment_id=record[0],
                        user_id=record[1],
                        workout_id=record[2],
                        comment_text=record[3],
                        comment_date=record[4].strftime("%Y-%m-%d %H:%M:%S"),
                    )
        except Exception as e:
            print(e)
            return {"message": "Could not create workout comment"}

    def get_all(self, workout_id: int) -> Union[List[WorkoutCommentOut], dict]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT
                            comment_id,
                            user_id,
                            workout_id,
                            comment_text,
                            comment_date
                        FROM workout_comments
                        WHERE workout_id = %s;
                        """,
                        [workout_id],
                    )
                    records = cur.fetchall()
                    return [
                        WorkoutCommentOut(
                            comment_id=record[0],
                            user_id=record[1],
                            workout_id=record[2],
                            comment_text=record[3],
                            comment_date=record[4].strftime(
                                "%Y-%m-%d %H:%M:%S"
                            ),
                        )
                        for record in records
                    ]
        except Exception as e:
            print(e)
            return {"message": "Could not get workout comments"}

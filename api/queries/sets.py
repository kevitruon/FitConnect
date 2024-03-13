from pydantic import BaseModel
from queries.pool import pool
from typing import List, Union, Optional


class SetIn(BaseModel):
    # workout_id: int
    exercise_id: int
    set_number: int
    weight: float
    reps: int


class SetOut(BaseModel):
    set_id: Optional[int]
    workout_id: int
    exercise_id: int
    set_number: int
    weight: float
    reps: int


class SetRepository:
    def create(self, set: SetIn) -> SetOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO sets
                            (workout_id, exercise_id, set_number, weight, reps)
                        VALUES
                            (%s, %s, %s, %s, %s)
                        RETURNING
                            set_id,
                            workout_id,
                            exercise_id,
                            set_number,
                            weight,
                            reps;
                        """,
                        [
                            set.workout_id,
                            set.exercise_id,
                            set.set_number,
                            set.weight,
                            set.reps,
                        ],
                    )
                    record = cur.fetchone()
                    return SetOut(
                        set_id=record[0],
                        workout_id=record[1],
                        exercise_id=record[2],
                        set_number=record[3],
                        weight=record[4],
                        reps=record[5],
                    )
        except Exception as e:
            print(e)
            return {"message": "Could not create set"}

    def get_all(self, workout_id: int) -> Union[List[SetOut], dict]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT
                            set_id,
                            workout_id,
                            exercise_id,
                            set_number,
                            weight,
                            reps
                        FROM
                            sets
                        WHERE
                            workout_id = %s;
                        """,
                        [workout_id],
                    )
                    records = cur.fetchall()
                    return [
                        SetOut(
                            set_id=record[0],
                            workout_id=record[1],
                            exercise_id=record[2],
                            set_number=record[3],
                            weight=record[4],
                            reps=record[5],
                        )
                        for record in records
                    ]
        except Exception as e:
            print(e)
            return {"message": "Could not get sets"}

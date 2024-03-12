from pydantic import BaseModel
from datetime import date
from queries.pool import pool
from typing import Union, Optional, List
from queries.sets import SetIn, SetOut


class WorkoutErrorMsg(BaseModel):
    message: str


class WorkoutIn(BaseModel):
    user_id: int
    workout_date: date
    notes: Optional[str] = None


class WorkoutOut(BaseModel):
    workout_id: int
    user_id: int
    workout_date: date
    notes: Optional[str] = None


class WorkoutRepository:
    def workout_in_to_out(self, id: int, workout: WorkoutOut):
        old_data = workout.dict()
        return WorkoutOut(workout_id=id, **old_data)

    def record_to_workout_out(self, record):
        return WorkoutOut(
            workout_id=record[0],
            user_id=record[1],
            workout_date=record[2].strftime("%Y-%m-%d"),
            notes=record[3],
        )

    async def create(
        self, workout: WorkoutIn, sets: List[SetIn], user_id: int
    ) -> WorkoutOut:
        try:
            async with pool.connection() as conn:
                async with conn.cursor() as cur:
                    await cur.execute(
                        """
                        INSERT INTO workouts (user_id, workout_date, notes)
                        VALUES (%s, %s, %s)
                        RETURNING workout_id;
                        """,
                        [user_id, workout.workout_date, workout.notes],
                    )
                    workout_id = (await cur.fetchone())[0]

                    set_values = []
                    for set_data in sets:
                        set_values.append(
                            (workout_id,
                             set_data.exercise_id,
                             set_data.set_number,
                             set_data.weight,
                             set_data.reps)
                        )
                    await cur.executemany(
                        """
                        INSERT INTO sets (
                            workout_id,
                            exercise_id,
                            set_number,
                            weight,
                            reps
                            )
                        VALUES (%s, %s, %s, %s, %s);
                        """,
                        set_values,
                    )

                    return WorkoutOut(
                        workout_id=workout_id,
                        user_id=user_id,
                        workout_date=workout.workout_date,
                        notes=workout.notes,
                        sets=[SetOut(
                            **set_data.dict(),
                            workout_id=workout_id) for set_data in sets],
                    )
        except Exception as e:
            print(e)
            return None

    def get_all(
        self, user_id: int
    ) -> Union[List[WorkoutOut], WorkoutErrorMsg]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT workout_id, user_id, workout_date, notes
                        FROM workouts
                        WHERE user_id = %s
                        ORDER BY workout_id;
                        """,
                        [user_id],
                    )
                    result = [
                        self.record_to_workout_out(record)
                        for record in db.fetchall()
                    ]
                    return result
        except Exception as e:
            return WorkoutErrorMsg(message="error!" + str(e))

    def get_detail(
        self, workout_id: int, user_id: int
    ) -> Optional[WorkoutOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT workout_id, user_id, workout_date, notes
                        FROM workouts
                        WHERE workout_id = %s AND user_id = %s
                        """,
                        [workout_id, user_id],
                    )
                    record = result.fetchone()
                    if record:
                        return self.record_to_workout_out(record)
                    else:
                        return None
        except Exception as e:
            return WorkoutErrorMsg(message="error!" + str(e))

    def update(
        self, workout_id: int, workout: WorkoutIn, user_id: int
    ) -> Union[WorkoutOut, WorkoutErrorMsg]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE workouts
                        SET workout_date = %s
                            , notes = %s
                        WHERE workout_id = %s AND user_id = %s
                        """,
                        [
                            workout.workout_date,
                            workout.notes,
                            workout_id,
                            user_id,
                        ],
                    )
                    return self.workout_in_to_out(workout_id, workout)
        except Exception as e:
            return WorkoutErrorMsg(message="error! " + str(e))

    def delete(self, workout_id: int, user_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM workouts
                        WHERE workout_id = %s AND user_id = %s
                        """,
                        [workout_id, user_id],
                    )
                    return True
        except Exception as e:
            print(e)
            return False

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
    sets: list[SetOut]


class WorkoutRepository:
    def workout_in_to_out(self, id: int, workout: WorkoutOut):
        old_data = workout.dict()
        return WorkoutOut(workout_id=id, **old_data)

    def record_to_workout_out(self, record):
        return WorkoutOut(
            workout_id=record[0],
            user_id=record[1],
            workout_date=record[2],
            notes=record[3],
        )

    def create(
        self, workout: WorkoutIn, sets: SetIn, user_id: int
    ) -> Optional[WorkoutOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO workouts (user_id, workout_date, notes)
                        VALUES (%s, %s, %s)
                        RETURNING workout_id;
                        """,
                        [workout.user_id, workout.workout_date, workout.notes],
                    )
                    workout_id = (cur.fetchone())[0]
                    set_values = []
                    for set_data in sets:
                        set_values.append(
                            (
                                workout_id,
                                set_data["exercise_id"],
                                set_data["set_number"],
                                set_data["weight"],
                                set_data["reps"],
                            )
                        )
                    set_dict_values = []
                    for set_data in sets:
                        set_dict_values.append(
                            {
                                "workout_id": workout_id,
                                "exercise_id": set_data["exercise_id"],
                                "set_number": set_data["set_number"],
                                "weight": set_data["weight"],
                                "reps": set_data["reps"],
                            }
                        )
                    cur.executemany(
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
                    sets_list = [
                        SetOut(**set_data) for set_data in set_dict_values
                    ]
                    return WorkoutOut(
                        workout_id=workout_id,
                        user_id=user_id,
                        workout_date=workout.workout_date,
                        notes=workout.notes,
                        sets=sets_list,
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
                        SELECT
                            w.workout_id,
                            w.user_id,
                            w.workout_date,
                            w.notes,
                            s.set_id,
                            s.exercise_id,
                            s.set_number,
                            s.weight,
                            s.reps
                        FROM workouts w
                        LEFT JOIN sets s ON w.workout_id = s.workout_id
                        WHERE w.user_id = %s
                        ORDER BY w.workout_id, s.set_id;
                        """,
                        [user_id],
                    )
                    rows = db.fetchall()
                    workouts = []
                    current_workout = None

                    for row in rows:
                        (
                            workout_id,
                            user_id,
                            workout_date,
                            notes,
                            set_id,
                            exercise_id,
                            set_number,
                            weight,
                            reps,
                        ) = row

                        if (
                            current_workout is None
                            or current_workout.workout_id != workout_id
                        ):
                            if current_workout is not None:
                                workouts.append(current_workout)
                            current_workout = WorkoutOut(
                                workout_id=workout_id,
                                user_id=user_id,
                                workout_date=workout_date,
                                notes=notes,
                                sets=[],
                            )

                        if set_id is not None:
                            set_out = SetOut(
                                set_id=set_id,
                                workout_id=workout_id,
                                exercise_id=exercise_id,
                                set_number=set_number,
                                weight=weight,
                                reps=reps,
                            )
                            current_workout.sets.append(set_out)

                    if current_workout is not None:
                        workouts.append(current_workout)

                    return workouts
        except Exception as e:
            return WorkoutErrorMsg(message="error!" + str(e))

    def update(
        self,
        workout_id: int,
        workout: WorkoutIn,
        sets: List[dict],
        user_id: int,
    ) -> Union[WorkoutOut, WorkoutErrorMsg]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE workouts
                        SET workout_date = %s, notes = %s
                        WHERE workout_id = %s AND user_id = %s;
                        """,
                        [
                            workout.workout_date,
                            workout.notes,
                            workout_id,
                            user_id,
                        ],
                    )

                    db.execute(
                        """
                        DELETE FROM sets
                        WHERE workout_id = %s;
                        """,
                        [workout_id],
                    )

                    set_values = [
                        (
                            workout_id,
                            set_data["exercise_id"],
                            set_data["set_number"],
                            set_data["weight"],
                            set_data["reps"],
                        )
                        for set_data in sets
                    ]
                    db.executemany(
                        """
                        INSERT INTO sets
                        (workout_id, exercise_id, set_number, weight, reps)
                        VALUES (%s, %s, %s, %s, %s);
                        """,
                        set_values,
                    )

                    db.execute(
                        """
                        SELECT
                            w.workout_id,
                            w.user_id,
                            w.workout_date,
                            w.notes,
                            s.set_id,
                            s.exercise_id,
                            s.set_number,
                            s.weight,
                            s.reps
                        FROM workouts w
                        LEFT JOIN sets s ON w.workout_id = s.workout_id
                        WHERE w.workout_id = %s;
                        """,
                        [workout_id],
                    )
                    rows = db.fetchall()

                    updated_workout = WorkoutOut(
                        workout_id=rows[0][0],
                        user_id=rows[0][1],
                        workout_date=rows[0][2],
                        notes=rows[0][3],
                        sets=[
                            SetOut(
                                set_id=row[4],
                                workout_id=row[0],
                                exercise_id=row[5],
                                set_number=row[6],
                                weight=row[7],
                                reps=row[8],
                            )
                            for row in rows
                            if row[4] is not None
                        ],
                    )

                    return updated_workout
        except Exception as e:
            print(e)
            return WorkoutErrorMsg(message="error! " + str(e))

    def get_detail(
        self, workout_id: int, user_id: int
    ) -> Optional[WorkoutOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            w.workout_id,
                            w.user_id,
                            w.workout_date,
                            w.notes,
                            s.set_id,
                            s.exercise_id,
                            s.set_number,
                            s.weight,
                            s.reps
                        FROM workouts w
                        LEFT JOIN sets s ON w.workout_id = s.workout_id
                        WHERE w.workout_id = %s
                        ORDER BY s.set_id;
                        """,
                        [workout_id],
                    )
                    rows = db.fetchall()

                    if not rows:
                        return None

                    workout_data = rows[0]
                    workout = WorkoutOut(
                        workout_id=workout_data[0],
                        user_id=workout_data[1],
                        workout_date=workout_data[2],
                        notes=workout_data[3],
                        sets=[],
                    )

                    for row in rows:
                        set_id, exercise_id, set_number, weight, reps = row[4:]
                        if set_id is not None:
                            set_out = SetOut(
                                set_id=set_id,
                                workout_id=workout_id,
                                exercise_id=exercise_id,
                                set_number=set_number,
                                weight=weight,
                                reps=reps,
                            )
                            workout.sets.append(set_out)

                    return workout
        except Exception as e:
            print(e)
            return None

    def delete(self, workout_id: int, user_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM sets
                        WHERE workout_id = %s;
                        """,
                        [workout_id],
                    )
                    db.execute(
                        """
                        DELETE FROM workouts
                        WHERE workout_id = %s AND user_id = %s;
                        """,
                        [workout_id, user_id],
                    )
                    return True
        except Exception as e:
            print(e)
            return False

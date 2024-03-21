from pydantic import BaseModel
from queries.pool import pool
from typing import List, Union


class ExerciseIn(BaseModel):
    exercise_name: str
    description: str
    category: str


class ExerciseOut(BaseModel):
    exercise_id: int
    exercise_name: str
    description: str
    category: str


class ExerciseRepository:
    def create(self, exercise: ExerciseIn) -> ExerciseOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO exercises
                            (exercise_name, description, category)
                        VALUES
                            (%s, %s, %s)
                        RETURNING
                            exercise_id, exercise_name, description, category;
                        """,
                        [
                            exercise.exercise_name,
                            exercise.description,
                            exercise.category,
                        ],
                    )
                    record = cur.fetchone()
                    return ExerciseOut(
                        exercise_id=record[0],
                        exercise_name=record[1],
                        description=record[2],
                        category=record[3],
                    )
        except Exception as e:
            print(e)
            return {"message": "Could not create exercise"}

    def get_all(self) -> Union[List[ExerciseOut], dict]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT
                            exercise_id, exercise_name, description, category
                        FROM
                            exercises;
                        """
                    )
                    records = cur.fetchall()
                    return [
                        ExerciseOut(
                            exercise_id=record[0],
                            exercise_name=record[1],
                            description=record[2],
                            category=record[3],
                        )
                        for record in records
                    ]
        except Exception as e:
            print(e)
            return {"message": "Could not get exercises"}

    def get_exercise(self, exercise_id: int) -> Union[ExerciseOut, None]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT
                            exercise_id, exercise_name, description, category
                        FROM
                            exercises
                        WHERE
                            exercise_id = %s;
                        """,
                        [exercise_id],
                    )
                    record = cur.fetchone()
                    if record:
                        return ExerciseOut(
                            exercise_id=record[0],
                            exercise_name=record[1],
                            description=record[2],
                            category=record[3],
                        )
                    return None
        except Exception as e:
            print(e)
            return None

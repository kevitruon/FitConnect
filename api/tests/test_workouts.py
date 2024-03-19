from fastapi.testclient import TestClient
from main import app
from queries.workouts import WorkoutRepository

client = TestClient(app)


class EmptyWorkoutQueries:
    def get_all(self, user_id):
        return []


class CreateWorkoutQueries:
    def create(self, workout, sets, user_id):
        result = {
            "workout_id": 1,
            "user_id": 1,
            "workout_date": "2024-03-18",
            "notes": "string",
            "sets": [
                {
                    "set_id": None,
                    "workout_id": 1,
                    "exercise_id": 1,
                    "set_number": 1,
                    "weight": 1,
                    "reps": 1,
                }
            ],
        }
        result.update(workout)
        return result


def test_create_workout():
    # Arrange
    app.dependency_overrides[WorkoutRepository] = CreateWorkoutQueries
    workout = {
        "workout": {
            "user_id": 1,
            "workout_date": "2024-03-18",
            "notes": "string",
        },
        "sets": [{"exercise_id": 1, "set_number": 1, "weight": 1, "reps": 1}],
    }
    expected = {
        "workout_id": 1,
        "user_id": 1,
        "workout_date": "2024-03-18",
        "notes": "string",
        "sets": [
            {
                "set_id": None,
                "workout_id": 1,
                "exercise_id": 1,
                "set_number": 1,
                "weight": 1,
                "reps": 1,
            }
        ],
    }
    token = (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
        "eyJqdGkiOiJkOGUxYzY5Yy0zMzUwLTRjM2UtYTdhMy0yMTM2NzUzNTA3MTAi"
        "LCJleHAiOjE3MTA4NzAwODAsInN1YiI6ImJvYiIsImFjY291bnQiOnsiaWQiO"
        "iIxIiwidXNlcm5hbWUiOiJib2IiLCJlbWFpbCI6ImJvYkBib2IuY29tIn19."
        "y0DI5gDlN_LzHmrvUeAgn1rN7E9wbds8luzhmt3osus"
    )

    headers = {"Authorization": f"Bearer {token}"}

    # Act
    response = client.post("/workouts", headers=headers, json=workout)

    # Clean up
    app.dependency_overrides = {}

    # Assert
    assert response.status_code == 200
    assert response.json() == expected


def test_get_all_workouts():
    # Arrange
    app.dependency_overrides[WorkoutRepository] = EmptyWorkoutQueries
    token = (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
        "eyJqdGkiOiJkOGUxYzY5Yy0zMzUwLTRjM2UtYTdhMy0yMTM2NzUzNTA3MTAi"
        "LCJleHAiOjE3MTA4NzAwODAsInN1YiI6ImJvYiIsImFjY291bnQiOnsiaWQiO"
        "iIxIiwidXNlcm5hbWUiOiJib2IiLCJlbWFpbCI6ImJvYkBib2IuY29tIn19."
        "y0DI5gDlN_LzHmrvUeAgn1rN7E9wbds8luzhmt3osus"
    )

    headers = {"Authorization": f"Bearer {token}"}

    # Act
    response = client.get("/workouts", headers=headers)

    # Clean up
    app.dependency_overrides = {}

    # Assert
    assert response.status_code == 200
    assert response.json() == []


def test_init():
    assert 1 == 1

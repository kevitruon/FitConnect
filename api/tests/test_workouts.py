from fastapi.testclient import TestClient
from main import app
from queries.workouts import WorkoutRepository

client = TestClient(app)


class EmptyWorkoutQueries:
    def get_all(self, user_id):
        return []


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

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Act
    response = client.get("/workouts", headers=headers)

    # Clean up
    app.dependency_overrides = {}

    # Assert
    assert response.status_code == 200
    assert response.json() == []


def test_init():
    assert 1 == 1

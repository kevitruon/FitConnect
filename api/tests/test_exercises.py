from fastapi.testclient import TestClient
from main import app
from queries.exercises import ExerciseRepository

client = TestClient(app)


class EmptyExerciseQueries:
    def get_all(self):
        return []


# check get exercise
def test_exercise_getall():
    # ARRANGE
    app.dependency_overrides[ExerciseRepository] = EmptyExerciseQueries
    # ACT
    response = client.get("/exercises/")
    app.dependency_overrides = {}
    # ASSERT
    assert response.status_code == 200
    assert response.json() == []

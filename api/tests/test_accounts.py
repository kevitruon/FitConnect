from queries.accounts import AccountRepository
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class EmptyUserQueries:
    def get_all(self):
        return []


# check get user
def test_user_getall():
    # ARRANGE
    app.dependency_overrides[AccountRepository] = EmptyUserQueries
    # ACT
    response = client.get("/users/")
    app.dependency_overrides = {}
    # ASSERT
    assert response.status_code == 200
    assert response.json() == []

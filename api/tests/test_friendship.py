from fastapi.testclient import TestClient
from main import app
from queries.friendships import FriendshipRepository

client = TestClient(app)


class CreateFriendshipQueries:
    def create_friendship(self, sender_id, recipient_id):
        result = {
            "friendship_id": 1,
            "sender_id": sender_id,
            "recipient_id": recipient_id,
            "status": "pending",
            "created_at": "2023-06-08T10:00:00",
        }
        return result


class GetFriendshipsQueries:
    def get_friendships(self, user_id):
        result = [
            {
                "friendship_id": 1,
                "sender_id": 1,
                "recipient_id": 2,
                "status": "accepted",
                "created_at": "2023-06-08T10:00:00",
            },
            {
                "friendship_id": 2,
                "sender_id": 3,
                "recipient_id": 1,
                "status": "pending",
                "created_at": "2023-06-09T12:00:00",
            },
        ]
        return result


def test_create_friendship():
    # Arrange
    app.dependency_overrides[FriendshipRepository] = CreateFriendshipQueries
    friendship = {
        "recipient_id": 2,
    }
    expected = {
        "friendship_id": 1,
        "sender_id": 1,
        "recipient_id": 2,
        "status": "pending",
        "created_at": "2023-06-08T10:00:00",
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
    response = client.post("/friendships", headers=headers, json=friendship)

    # Clean up
    app.dependency_overrides = {}

    # Assert
    assert response.status_code == 200
    assert response.json() == expected


def test_get_friendships():
    # Arrange
    app.dependency_overrides[FriendshipRepository] = GetFriendshipsQueries
    expected = [
        {
            "friendship_id": 1,
            "sender_id": 1,
            "recipient_id": 2,
            "status": "accepted",
            "created_at": "2023-06-08T10:00:00",
        },
        {
            "friendship_id": 2,
            "sender_id": 3,
            "recipient_id": 1,
            "status": "pending",
            "created_at": "2023-06-09T12:00:00",
        },
    ]
    token = (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
        "eyJqdGkiOiJkOGUxYzY5Yy0zMzUwLTRjM2UtYTdhMy0yMTM2NzUzNTA3MTAi"
        "LCJleHAiOjE3MTA4NzAwODAsInN1YiI6ImJvYiIsImFjY291bnQiOnsiaWQiO"
        "iIxIiwidXNlcm5hbWUiOiJib2IiLCJlbWFpbCI6ImJvYkBib2IuY29tIn19."
        "y0DI5gDlN_LzHmrvUeAgn1rN7E9wbds8luzhmt3osus"
    )

    headers = {"Authorization": f"Bearer {token}"}

    # Act
    response = client.get("/friendships", headers=headers)

    # Clean up
    app.dependency_overrides = {}

    # Assert
    assert response.status_code == 200
    assert response.json() == expected

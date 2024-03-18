from fastapi import APIRouter, HTTPException, Depends
from queries.friendships import FriendshipRepository
from queries.accounts import AccountRepository
from queries.friendships import FriendshipIn, FriendshipOut
from authenticator import authenticator

router = APIRouter()


@router.post("/friendships", response_model=FriendshipOut)
async def send_friend_request(
    request: FriendshipIn,
    account_data: dict = Depends(authenticator.get_current_account_data),
    friend_repo: FriendshipRepository = Depends(),
    account_repo: AccountRepository = Depends(),
):
    sender_id = account_data["id"]
    recipient_id = request.recipient_id

    # Check if the recipient exists
    recipient = account_repo.get_detail(recipient_id)
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    # Check if a friendship already exists
    existing_friendship = friend_repo.get_friendship(sender_id, recipient_id)
    if existing_friendship:
        raise HTTPException(
            status_code=400, detail="Friendship already exists"
        )

    # Create a new friendship request
    friendship = friend_repo.create_friendship(sender_id, recipient_id)
    return friendship


@router.get("/friendships", response_model=list[FriendshipOut])
async def get_friendships(
    account_data: dict = Depends(authenticator.get_current_account_data),
    friend_repo: FriendshipRepository = Depends(),
):
    user_id = account_data["id"]
    friendships = friend_repo.get_friendships(user_id)
    return friendships


@router.put(
    "/friendships/{friendship_id}/accept", response_model=FriendshipOut
)
async def accept_friend_request(
    friendship_id: int,
    account_data: dict = Depends(authenticator.get_current_account_data),
    friend_repo: FriendshipRepository = Depends(),
):
    user_id = account_data["id"]
    friendship = friend_repo.accept_friendship(friendship_id, user_id)
    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found")
    return friendship


@router.put(
    "/friendships/{friendship_id}/reject", response_model=FriendshipOut
)
async def reject_friend_request(
    friendship_id: int,
    account_data: dict = Depends(authenticator.get_current_account_data),
    friend_repo: FriendshipRepository = Depends(),
):
    user_id = account_data["id"]
    friendship = friend_repo.reject_friendship(friendship_id, user_id)
    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found")
    return friendship


@router.delete("/friendships/{friendship_id}", response_model=bool)
async def remove_friendship(
    friendship_id: int,
    account_data: dict = Depends(authenticator.get_current_account_data),
    friend_repo: FriendshipRepository = Depends(),
):
    user_id = account_data["id"]
    success = friend_repo.remove_friendship(friendship_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Friendship not found")
    return success

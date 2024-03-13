import React from 'react'

const FriendRequestList = ({
    friendRequests,
    onAcceptFriend,
    onRejectFriend,
}) => {
    const handleAcceptFriend = (requestId) => {
        onAcceptFriend(requestId)
    }

    const handleRejectFriend = (requestId) => {
        onRejectFriend(requestId)
    }

    return (
        <div>
            <h3>Friend Requests</h3>
            {friendRequests.length === 0 ? (
                <p>No friend requests.</p>
            ) : (
                <ul>
                    {friendRequests.map((request) => (
                        <li key={request.id}>
                            <div>
                                <span>{request.username}</span>
                                <button
                                    onClick={() =>
                                        handleAcceptFriend(request.id)
                                    }
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() =>
                                        handleRejectFriend(request.id)
                                    }
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default FriendRequestList

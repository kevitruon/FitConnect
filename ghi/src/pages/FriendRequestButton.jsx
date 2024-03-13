import React from 'react'

const FriendRequestButton = ({ userId, onAddFriend }) => {
    const handleAddFriend = () => {
        onAddFriend(userId)
    }

    return <button onClick={handleAddFriend}>Add Friend</button>
}

export default FriendRequestButton

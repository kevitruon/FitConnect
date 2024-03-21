import { useState, useEffect, useCallback } from 'react'
import useToken from '@galvanize-inc/jwtdown-for-react'

const FriendsPage = () => {
    const [currentUser, setCurrentUser] = useState(null)
    const [friends, setFriends] = useState([])
    const [friendRequests, setFriendRequests] = useState([])
    const [users, setUsers] = useState([])
    const { fetchWithCookie, token } = useToken()

    const fetchFriendRequests = useCallback(async () => {
        try {
            if (token) {
                const userData = await fetchWithCookie(
                    'http://localhost:8000/token'
                )
                if (userData && userData.account) {
                    setCurrentUser(userData.account)
                }

                const friendshipsData = await fetchWithCookie(
                    'http://localhost:8000/friendships'
                )
                const acceptedFriendships = friendshipsData.filter(
                    (friendship) => friendship.status === 'accepted'
                )
                const pendingRequests = friendshipsData.filter(
                    (friendship) =>
                        friendship.recipient_id === userData.account.id &&
                        friendship.status === 'pending'
                )
                setFriends(acceptedFriendships)
                setFriendRequests(pendingRequests)

                const allUsers = await fetchWithCookie(
                    'http://localhost:8000/users'
                )
                setUsers(allUsers)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }, [token, fetchWithCookie])

    useEffect(() => {
        fetchFriendRequests()
    }, [fetchFriendRequests])

    const getUsernameById = (userId) => {
        const user = users.find((user) => user.id == userId)
        return user ? user.username : ''
    }

    const handleAcceptRequest = async (friendshipId) => {
        try {
            await fetch(
                `http://localhost:8000/friendships/${friendshipId}/accept`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            console.log('Friend request accepted')

            await fetchFriendRequests()
        } catch (error) {
            console.error('Error accepting friend request:', error)
        }
    }

    const handleRejectRequest = async (friendshipId) => {
        try {
            await fetch(`http://localhost:8000/friendships/${friendshipId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log('Friend request rejected')

            await fetchFriendRequests()
        } catch (error) {
            console.error('Error rejecting friend request:', error)
        }
    }

    return (
        <div>
            <h2>Friends List</h2>
            {friends.length === 0 ? (
                <p>No friends found.</p>
            ) : (
                <ul>
                    {friends.map((friendship) => (
                        <li key={friendship.friendship_id}>
                            {getUsernameById(
                                friendship.sender_id === currentUser?.id
                                    ? friendship.recipient_id
                                    : friendship.sender_id
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <h2>Friend Requests</h2>
            {friendRequests.length === 0 ? (
                <p>No pending friend requests.</p>
            ) : (
                <ul>
                    {friendRequests.map((request) => (
                        <li key={request.friendship_id}>
                            <span>{getUsernameById(request.sender_id)}</span>
                            <button
                                onClick={() =>
                                    handleAcceptRequest(request.friendship_id)
                                }
                            >
                                Accept
                            </button>
                            <button
                                onClick={() =>
                                    handleRejectRequest(request.friendship_id)
                                }
                            >
                                Reject
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default FriendsPage
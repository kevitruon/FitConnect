import { useState, useEffect, useCallback } from 'react'
import useToken from '@galvanize-inc/jwtdown-for-react'

const FriendRequests = ({ currentUser }) => {
    const [friendRequests, setFriendRequests] = useState([])
    const { fetchWithCookie, token } = useToken()

    const fetchFriendRequests = useCallback(async () => {
        try {
            const requests = await fetchWithCookie('/friendships')
            const filteredRequests = requests.filter(
                (request) =>
                    request.recipient_id === currentUser?.id && request.status === 'pending'
            )
            setFriendRequests(filteredRequests)
        } catch (error) {
            console.error('Error fetching friend requests:', error)
        }
    }, [fetchWithCookie, currentUser])

    useEffect(() => {
        const fetchRequests = debounce(() => {
            if (currentUser) {
                fetchFriendRequests()
            }
        }, 500)

        fetchRequests()

        return () => {
            fetchRequests.cancel()
        }
    }, [currentUser, fetchFriendRequests])

    const debounce = (func, delay) => {
        let timeoutId
        const debouncedFunc = (...args) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                func(...args)
            }, delay)
        }
        debouncedFunc.cancel = () => {
            clearTimeout(timeoutId)
        }
        return debouncedFunc
    }

    const handleAcceptRequest = async (friendshipId) => {
        try {
            await fetch(`/friendships/${friendshipId}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log('Friend request accepted')
            fetchFriendRequests()
        } catch (error) {
            console.error('Error accepting friend request:', error)
        }
    }

    const handleRejectRequest = async (friendshipId) => {
        try {
            await fetch(`/friendships/${friendshipId}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log('Friend request rejected')
            fetchFriendRequests()
        } catch (error) {
            console.error('Error rejecting friend request:', error)
        }
    }

    return (
        <div>
            <h2>Friend Requests</h2>
            {friendRequests.length === 0 ? (
                <p>No pending friend requests.</p>
            ) : (
                <ul>
                    {friendRequests.map((request) => (
                        <li key={request.friendship_id}>
                            <span>{request.sender_username}</span>
                            <button
                                onClick={() => handleAcceptRequest(request.friendship_id)}
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleRejectRequest(request.friendship_id)}
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

export default FriendRequests

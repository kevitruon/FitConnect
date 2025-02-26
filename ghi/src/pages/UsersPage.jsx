import { useState, useEffect, useCallback } from 'react'
import useToken from '@galvanize-inc/jwtdown-for-react'

const UserPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    // const [friendships, setFriendships] = useState([])
    const { fetchWithCookie, token } = useToken()
    const API_HOST = import.meta.env.VITE_API_HOST

    const fetchData = useCallback(async () => {
        try {
            if (token) {
                const userData = await fetchWithCookie(`${API_HOST}/token`)
                if (userData && userData.account) {
                    setCurrentUser(userData.account)
                }
                const friendshipsData = await fetchWithCookie(
                    `${API_HOST}/friendships`
                )
                // setFriendships(friendshipsData)
                const allUsers = await fetchWithCookie(`${API_HOST}/users`)
                const availableUsers = allUsers.filter(
                    (user) =>
                        user.id !== userData.account.id &&
                        !friendshipsData.some(
                            (friendship) =>
                                friendship.recipient_id == user.id ||
                                friendship.sender_id == user.id
                        )
                )
                setUsers(availableUsers)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }, [token, API_HOST, fetchWithCookie])

    useEffect(() => {
        const fetchUsers = debounce(() => {
            fetchData()
        }, 500)

        fetchUsers()

        return () => {
            fetchUsers.cancel()
        }
    }, [fetchData])

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

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddFriend = async (recipientId) => {
        try {
            await fetch(`${API_HOST}/friendships`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    sender_id: currentUser.id,
                    recipient_id: recipientId,
                }),
            })
            console.log('Friend request sent')
            fetchData() // Refresh data after sending a friend request
        } catch (error) {
            console.error('Error sending friend request:', error)
        }
    }

    return (
        <div>
            <h2>Find Friends</h2>
            <input
                type="text"
                placeholder="Search by username"
                value={searchQuery}
                onChange={handleSearchInputChange}
            />
            <ul>
                {filteredUsers.map((user) => (
                    <li key={user.id}>
                        <div>
                            <span>{user.username}</span>
                            <button onClick={() => handleAddFriend(user.id)}>
                                Add Friend
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UserPage

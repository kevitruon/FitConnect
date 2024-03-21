import { useState, useEffect } from 'react'
import useToken from '@galvanize-inc/jwtdown-for-react'

const UserPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [friendships, setFriendships] = useState([])
    const { fetchWithCookie, token } = useToken()

    useEffect(() => {
        fetchData()
    }, [token])

    const fetchData = async () => {
        try {
            if (token) {
                const userData = await fetchWithCookie(
                    'http://localhost:8000/token'
                )
                if (userData && userData.account) {
                    setCurrentUser(userData.account)
                }

                const friendshipsData = await fetchWithCookie(
                    `http://localhost:8000/friendships`
                )
                setFriendships(friendshipsData)

                const allUsers = await fetchWithCookie(
                    'http://localhost:8000/users'
                )

                const availableUsers = allUsers.filter(
                    (user) =>
                        user.id !== userData.account.id &&
                        !friendshipsData.some(
                            (friendship) =>
                                friendship.recipient_id == user.id ||
                                friendship.sender_id == user.id
                        )
                )
                console.log('UserData:', userData)
                console.log('FriendshipData:', friendshipsData)
                console.log('Available users:', availableUsers)
                setUsers(availableUsers)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddFriend = async (recipientId) => {
        try {
            await fetch('http://localhost:8000/friendships', {
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

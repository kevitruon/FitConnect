import React, { useState, useEffect } from 'react'
import useToken from '@galvanize-inc/jwtdown-for-react'

const UsersPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [users, setUsers] = useState([])
    const { accessToken, account } = useToken()
    const {account}

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/users', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
            } else {
                console.error('Failed to fetch users')
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
            user.id !== account?.id
    )

    const handleAddFriend = async (friendId) => {
        try {
            const response = await fetch('http://localhost:8000/friendships', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    user_id: account?.id,
                    friend_id: friendId,
                }),
            })
            if (response.ok) {
                console.log('Friend request sent')
            } else {
                console.error('Failed to send friend request')
            }
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

export default UsersPage

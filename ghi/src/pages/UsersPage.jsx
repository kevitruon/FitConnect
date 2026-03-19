import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'
import { Search, UserPlus, Users, CheckCircle } from 'lucide-react'

const UserPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [sentRequests, setSentRequests] = useState(new Set())
    const { fetchWithCookie, token } = useToken()
    const navigate = useNavigate()
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

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getInitials = (username) => {
        if (!username) return 'U'
        return username
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const getAvatarColor = (username) => {
        const colors = [
            'from-blue-500 to-purple-500',
            'from-green-500 to-teal-500',
            'from-orange-500 to-red-500',
            'from-pink-500 to-rose-500',
            'from-indigo-500 to-blue-500',
            'from-purple-500 to-pink-500',
        ]
        const index = username
            ? username.charCodeAt(0) % colors.length
            : 0
        return colors[index]
    }

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
            setSentRequests((prev) => new Set([...prev, recipientId]))
            fetchData()
        } catch (error) {
            console.error('Error sending friend request:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Friends</h1>
                    <p className="text-slate-600">Discover and connect with other fitness enthusiasts</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-slate-400" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                        />
                    </div>
                </div>

                {/* Results Count */}
                {searchQuery && (
                    <p className="text-sm text-slate-500 mb-4">
                        {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                    </p>
                )}

                {/* Users List */}
                {filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {searchQuery ? 'No users found' : 'No new users to connect with'}
                        </h3>
                        <p className="text-slate-500 mb-6">
                            {searchQuery
                                ? `No users match "${searchQuery}". Try a different search.`
                                : "You're already connected with everyone! Check your friends list."}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => navigate('/friends')}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
                            >
                                View My Friends
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className={`w-14 h-14 bg-gradient-to-br ${getAvatarColor(user.username)} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                                        >
                                            {getInitials(user.username)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-lg">
                                                {user.username}
                                            </p>
                                            <p className="text-sm text-slate-500">FitConnect Member</p>
                                        </div>
                                    </div>
                                    {sentRequests.has(user.id) ? (
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                                            <CheckCircle size={16} />
                                            <span className="text-sm font-semibold">Sent!</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAddFriend(user.id)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md font-semibold"
                                        >
                                            <UserPlus size={16} />
                                            <span>Add</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserPage

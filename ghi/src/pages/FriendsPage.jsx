import { useState, useEffect, useCallback } from 'react'
import useToken from '@galvanize-inc/jwtdown-for-react'
import { Users, UserPlus, Check, X, Clock, Search } from 'lucide-react'

const FriendsPage = () => {
    const [currentUser, setCurrentUser] = useState(null)
    const [friends, setFriends] = useState([])
    const [friendRequests, setFriendRequests] = useState([])
    const [users, setUsers] = useState([])
    const { fetchWithCookie, token } = useToken()
    const API_HOST = import.meta.env.VITE_API_HOST

    const fetchFriendRequests = useCallback(async () => {
        try {
            if (token) {
                const userData = await fetchWithCookie(
                    `${API_HOST}/token`
                )
                if (userData && userData.account) {
                    setCurrentUser(userData.account)
                }

                const friendshipsData = await fetchWithCookie(
                    `${API_HOST}/friendships`
                )
                const acceptedFriendships = friendshipsData.filter(
                    (friendship) => friendship.status === 'accepted'
                )
                const pendingRequests = friendshipsData.filter(
                    (friendship) =>
                        friendship.recipient_id == userData.account.id &&
                        friendship.status === 'pending'
                )
                setFriends(acceptedFriendships)
                setFriendRequests(pendingRequests)

                const allUsers = await fetchWithCookie(
                    `${API_HOST}/users`
                )
                setUsers(allUsers)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }, [token, API_HOST, fetchWithCookie])

    useEffect(() => {
        const fetchData = debounce(() => {
            fetchFriendRequests()
        }, 500)

        fetchData()

        return () => {
            fetchData.cancel()
        }
    }, [fetchFriendRequests])

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

    const getUsernameById = (userId) => {
        const user = users.find((user) => user.id == userId)
        return user ? user.username : ''
    }

    const getInitials = (username) => {
        if (!username) return 'U'
        return username
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const handleAcceptRequest = async (friendshipId) => {
        try {
            await fetch(
                `${API_HOST}/friendships/${friendshipId}/accept`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            await fetchFriendRequests()
        } catch (error) {
            console.error('Error accepting friend request:', error)
        }
    }

    const handleRejectRequest = async (friendshipId) => {
        try {
            await fetch(`${API_HOST}/friendships/${friendshipId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            await fetchFriendRequests()
        } catch (error) {
            console.error('Error rejecting friend request:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Friends</h1>
                    <p className="text-slate-600">Manage your fitness connections</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Friend Requests */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <Clock className="text-orange-500" size={24} />
                                <h2 className="text-xl font-bold text-slate-900">
                                    Pending Requests
                                </h2>
                            </div>

                            {friendRequests.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <UserPlus className="text-slate-400" size={24} />
                                    </div>
                                    <p className="text-sm text-slate-500">No pending requests</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {friendRequests.map((request) => (
                                        <div
                                            key={request.friendship_id}
                                            className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                                        >
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {getInitials(getUsernameById(request.sender_id))}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-900">
                                                        {getUsernameById(request.sender_id)}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Sent you a friend request
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleAcceptRequest(request.friendship_id)
                                                    }
                                                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                                                >
                                                    <Check size={16} />
                                                    <span>Accept</span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRejectRequest(request.friendship_id)
                                                    }
                                                    className="flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Friends List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-2">
                                    <Users className="text-blue-500" size={24} />
                                    <h2 className="text-xl font-bold text-slate-900">
                                        My Friends ({friends.length})
                                    </h2>
                                </div>
                            </div>

                            {friends.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="text-slate-400" size={32} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        No friends yet
                                    </h3>
                                    <p className="text-slate-600 mb-6">
                                        Start building your fitness community!
                                    </p>
                                    <button
                                        onClick={() => window.location.href = '/find-friends'}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
                                    >
                                        Find Friends
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {friends.map((friendship) => {
                                        const friendId = friendship.sender_id === currentUser?.id
                                            ? friendship.recipient_id
                                            : friendship.sender_id
                                        const friendUsername = getUsernameById(friendId)

                                        return (
                                            <div
                                                key={friendship.friendship_id}
                                                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-all"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {getInitials(friendUsername)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-slate-900">
                                                            {friendUsername}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Connected since {new Date(friendship.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FriendsPage

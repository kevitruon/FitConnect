import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'
import { Users, UserPlus, Check, X, Clock, UserMinus } from 'lucide-react'

const FriendsPage = () => {
    const [currentUser, setCurrentUser] = useState(null)
    const [friends, setFriends] = useState([])
    const [friendRequests, setFriendRequests] = useState([])
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [processingId, setProcessingId] = useState(null)
    const { fetchWithCookie, token } = useToken()
    const navigate = useNavigate()
    const API_HOST = import.meta.env.VITE_API_HOST

    const fetchFriendRequests = useCallback(async () => {
        try {
            if (token) {
                const [userData, friendshipsData, allUsers] = await Promise.all([
                    fetchWithCookie(`${API_HOST}/token`),
                    fetchWithCookie(`${API_HOST}/friendships`),
                    fetchWithCookie(`${API_HOST}/users`),
                ])

                if (userData?.account) setCurrentUser(userData.account)

                setFriends(
                    friendshipsData.filter((f) => f.status === 'accepted')
                )
                setFriendRequests(
                    friendshipsData.filter(
                        (f) =>
                            f.recipient_id === userData?.account?.id &&
                            f.status === 'pending'
                    )
                )
                setUsers(allUsers)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }, [token, API_HOST, fetchWithCookie])

    useEffect(() => {
        const fetchData = debounce(() => fetchFriendRequests(), 300)
        fetchData()
        return () => fetchData.cancel()
    }, [fetchFriendRequests])

    const debounce = (func, delay) => {
        let timeoutId
        const debouncedFunc = (...args) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => func(...args), delay)
        }
        debouncedFunc.cancel = () => clearTimeout(timeoutId)
        return debouncedFunc
    }

    const getUsernameById = (userId) =>
        users.find((u) => u.id == userId)?.username || ''

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
        return username
            ? colors[username.charCodeAt(0) % colors.length]
            : colors[0]
    }

    const handleAcceptRequest = async (friendshipId) => {
        setProcessingId(friendshipId)
        try {
            await fetch(`${API_HOST}/friendships/${friendshipId}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            await fetchFriendRequests()
        } catch (error) {
            console.error('Error accepting friend request:', error)
        } finally {
            setProcessingId(null)
        }
    }

    const handleRejectRequest = async (friendshipId) => {
        setProcessingId(friendshipId)
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
        } finally {
            setProcessingId(null)
        }
    }

    const handleUnfriend = async (friendshipId) => {
        setProcessingId(friendshipId)
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
            console.error('Error removing friend:', error)
        } finally {
            setProcessingId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Loading friends...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
                        Friends
                    </h1>
                    <p className="text-slate-500">Manage your fitness connections</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pending Requests */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center space-x-2 mb-5">
                                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Clock className="text-orange-500" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Pending
                                    </h2>
                                    {friendRequests.length > 0 && (
                                        <span className="text-xs text-orange-600 font-semibold">
                                            {friendRequests.length} request
                                            {friendRequests.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {friendRequests.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <UserPlus className="text-slate-400" size={22} />
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        No pending requests
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {friendRequests.map((request) => {
                                        const senderName = getUsernameById(request.sender_id)
                                        const busy = processingId === request.friendship_id
                                        return (
                                            <div
                                                key={request.friendship_id}
                                                className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                                            >
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div
                                                        className={`w-11 h-11 bg-gradient-to-br ${getAvatarColor(senderName)} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                                                    >
                                                        {getInitials(senderName)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-slate-900 truncate">
                                                            {senderName}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Wants to connect
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleAcceptRequest(
                                                                request.friendship_id
                                                            )
                                                        }
                                                        disabled={busy}
                                                        className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-sm disabled:opacity-50"
                                                    >
                                                        <Check size={14} />
                                                        <span>Accept</span>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleRejectRequest(
                                                                request.friendship_id
                                                            )
                                                        }
                                                        disabled={busy}
                                                        className="flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                                        title="Decline"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Friends List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center space-x-2">
                                    <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Users className="text-blue-500" size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        My Friends{' '}
                                        <span className="text-slate-400 font-normal">
                                            ({friends.length})
                                        </span>
                                    </h2>
                                </div>
                                <button
                                    onClick={() => navigate('/find-friends')}
                                    className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
                                >
                                    <UserPlus size={15} />
                                    <span>Find Friends</span>
                                </button>
                            </div>

                            {friends.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="text-slate-400" size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                        No friends yet
                                    </h3>
                                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                        Start building your fitness community and stay accountable together!
                                    </p>
                                    <button
                                        onClick={() => navigate('/find-friends')}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md font-bold"
                                    >
                                        Find Training Partners
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {friends.map((friendship) => {
                                        const friendId =
                                            friendship.sender_id === currentUser?.id
                                                ? friendship.recipient_id
                                                : friendship.sender_id
                                        const friendUsername = getUsernameById(friendId)
                                        const busy =
                                            processingId === friendship.friendship_id

                                        return (
                                            <div
                                                key={friendship.friendship_id}
                                                className="group flex items-center space-x-3 p-4 border border-slate-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                                            >
                                                <div
                                                    className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(friendUsername)} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
                                                >
                                                    {getInitials(friendUsername)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-900 truncate">
                                                        {friendUsername}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        Since{' '}
                                                        {new Date(
                                                            friendship.created_at
                                                        ).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleUnfriend(friendship.friendship_id)
                                                    }
                                                    disabled={busy}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                                    title="Remove friend"
                                                >
                                                    <UserMinus size={16} />
                                                </button>
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

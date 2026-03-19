import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'
import {
    Heart,
    MessageCircle,
    ChevronRight,
    Activity,
    Users,
    TrendingUp,
    Dumbbell,
    Flame,
    Plus,
} from 'lucide-react'

const Dashboard = () => {
    const [friendWorkouts, setFriendWorkouts] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [likedWorkouts, setLikedWorkouts] = useState(new Set())
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        friendsActive: 0,
        weeklyStreak: 0,
        exercisesLogged: 0,
    })
    const { fetchWithCookie, token } = useToken()
    const navigate = useNavigate()
    const API_HOST = import.meta.env.VITE_API_HOST

    useEffect(() => {
        const fetchData = debounce(async () => {
            try {
                if (token) {
                    const [tokenData, friendWorkoutsData, userWorkouts] =
                        await Promise.all([
                            fetchWithCookie(`${API_HOST}/token`),
                            fetchWithCookie(`${API_HOST}/friend-workouts`),
                            fetchWithCookie(`${API_HOST}/workouts`),
                        ])

                    if (tokenData?.account) setCurrentUser(tokenData.account)
                    setFriendWorkouts(friendWorkoutsData)

                    // Calculate weekly streak (distinct workout days in last 7 days)
                    const last7Days = Array.from({ length: 7 }, (_, i) => {
                        const d = new Date()
                        d.setDate(d.getDate() - i)
                        return d.toISOString().split('T')[0]
                    })
                    const workoutDays = new Set(
                        userWorkouts.map((w) => w.workout_date)
                    )
                    const streakDays = last7Days.filter((d) =>
                        workoutDays.has(d)
                    ).length

                    setStats({
                        totalWorkouts: userWorkouts.length,
                        friendsActive: new Set(
                            friendWorkoutsData.map((w) => w.user_id)
                        ).size,
                        weeklyStreak: streakDays,
                        exercisesLogged: userWorkouts.reduce(
                            (acc, w) => acc + (w.sets?.length || 0),
                            0
                        ),
                    })
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }, 300)

        fetchData()
        return () => fetchData.cancel()
    }, [token, API_HOST, fetchWithCookie])

    const debounce = (func, delay) => {
        let timeoutId
        const debouncedFunc = (...args) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => func(...args), delay)
        }
        debouncedFunc.cancel = () => clearTimeout(timeoutId)
        return debouncedFunc
    }

    const getTimeAgo = (date) => {
        const now = new Date()
        const workoutDate = new Date(date)
        const diffInHours = Math.floor((now - workoutDate) / (1000 * 60 * 60))
        if (diffInHours < 1) return 'Just now'
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInHours < 48) return 'Yesterday'
        return `${Math.floor(diffInHours / 24)} days ago`
    }

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

    const toggleLike = (workoutId) => {
        setLikedWorkouts((prev) => {
            const next = new Set(prev)
            next.has(workoutId) ? next.delete(workoutId) : next.add(workoutId)
            return next
        })
    }

    const statsConfig = [
        {
            label: 'Total Workouts',
            value: stats.totalWorkouts,
            icon: Activity,
            color: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
        },
        {
            label: 'Friends Active',
            value: stats.friendsActive,
            icon: Users,
            color: 'from-green-500 to-emerald-600',
            bg: 'bg-green-50',
            text: 'text-green-600',
        },
        {
            label: '7-Day Streak',
            value: stats.weeklyStreak,
            icon: Flame,
            color: 'from-orange-500 to-orange-600',
            bg: 'bg-orange-50',
            text: 'text-orange-600',
        },
        {
            label: 'Sets Logged',
            value: stats.exercisesLogged,
            icon: Dumbbell,
            color: 'from-purple-500 to-purple-600',
            bg: 'bg-purple-50',
            text: 'text-purple-600',
        },
    ]

    const firstName = currentUser?.username
        ? currentUser.username.charAt(0).toUpperCase() +
          currentUser.username.slice(1)
        : null

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome + Quick Action */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">
                            {firstName ? `Welcome back, ${firstName}! 👋` : 'Welcome Back!'}
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Here is what is happening with your fitness journey
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/log-workout')}
                        className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus size={18} />
                        <span>Log Workout</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statsConfig.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className={`w-11 h-11 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow`}
                                >
                                    <stat.icon className="text-white" size={22} />
                                </div>
                            </div>
                            <p className="text-3xl font-extrabold text-slate-900">
                                {stat.value}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Activity Feed */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Friend Activity
                        </h2>
                        <button
                            onClick={() => navigate('/friends')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            View All Friends
                        </button>
                    </div>

                    {friendWorkouts.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                <Users className="text-slate-400" size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                No friend activity yet
                            </h3>
                            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                Connect with training partners to see their workouts here and stay motivated together!
                            </p>
                            <button
                                onClick={() => navigate('/find-friends')}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md font-bold"
                            >
                                Find Training Partners
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {friendWorkouts.map((workout) => {
                                const isLiked = likedWorkouts.has(workout.workout_id)
                                return (
                                    <div
                                        key={workout.workout_id}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(workout.username)} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
                                                >
                                                    {getInitials(workout.username)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">
                                                        {workout.username}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {getTimeAgo(workout.workout_date)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                                {new Date(workout.workout_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="mb-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Dumbbell className="text-white" size={14} />
                                                </div>
                                                <h4 className="font-bold text-slate-900">
                                                    {workout.notes || 'Workout Session'}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-slate-500 ml-10">
                                                Completed a training session
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2 pt-4 border-t border-slate-100">
                                            <button
                                                onClick={() => toggleLike(workout.workout_id)}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-semibold text-sm ${
                                                    isLiked
                                                        ? 'bg-red-50 text-red-500'
                                                        : 'text-slate-500 hover:bg-slate-50 hover:text-red-400'
                                                }`}
                                            >
                                                <Heart
                                                    size={16}
                                                    className={isLiked ? 'fill-red-500' : ''}
                                                />
                                                <span>{isLiked ? 'Liked' : 'Like'}</span>
                                            </button>
                                            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-blue-500 transition-all font-semibold text-sm">
                                                <MessageCircle size={16} />
                                                <span>Comment</span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    navigate(`/workouts/${workout.workout_id}`)
                                                }
                                                className="flex items-center space-x-1 px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-blue-500 transition-all font-semibold text-sm ml-auto"
                                            >
                                                <span>View</span>
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'
import { Heart, MessageCircle, ChevronRight, Activity, Users, TrendingUp, Dumbbell } from 'lucide-react'

const Dashboard = () => {
    const [friendWorkouts, setFriendWorkouts] = useState([])
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        friendsActive: 0,
        weeklyStreak: 0,
        exercisesLogged: 0
    })
    const { fetchWithCookie, token } = useToken()
    const navigate = useNavigate()
    const API_HOST = import.meta.env.VITE_API_HOST

    useEffect(() => {
        const fetchData = debounce(async () => {
            try {
                if (token) {
                    const friendWorkoutsData = await fetchWithCookie(
                        `${API_HOST}/friend-workouts`
                    )
                    setFriendWorkouts(friendWorkoutsData)

                    // Fetch user workouts for stats
                    const userWorkouts = await fetchWithCookie(
                        `${API_HOST}/workouts`
                    )

                    // Calculate stats
                    setStats({
                        totalWorkouts: userWorkouts.length || 0,
                        friendsActive: friendWorkoutsData.length || 0,
                        weeklyStreak: 7, // You can calculate this based on workout dates
                        exercisesLogged: userWorkouts.reduce((acc, w) => acc + (w.sets?.length || 0), 0)
                    })
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }, 500)

        fetchData()

        return () => {
            fetchData.cancel()
        }
    }, [token, API_HOST, fetchWithCookie])

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

    const getTimeAgo = (date) => {
        const now = new Date()
        const workoutDate = new Date(date)
        const diffInHours = Math.floor((now - workoutDate) / (1000 * 60 * 60))

        if (diffInHours < 1) return 'Just now'
        if (diffInHours < 24) return `${diffInHours} hours ago`
        if (diffInHours < 48) return 'Yesterday'
        return `${Math.floor(diffInHours / 24)} days ago`
    }

    const getInitials = (username) => {
        return username
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const statsConfig = [
        { label: "Total Workouts", value: stats.totalWorkouts, change: "+12%", icon: Activity, color: "bg-blue-500" },
        { label: "Friends Active", value: stats.friendsActive, change: "+3", icon: Users, color: "bg-green-500" },
        { label: "Weekly Streak", value: stats.weeklyStreak, change: "🔥", icon: TrendingUp, color: "bg-orange-500" },
        { label: "Exercises Logged", value: stats.exercisesLogged, change: "+24", icon: Dumbbell, color: "bg-purple-500" }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back!</h1>
                    <p className="text-slate-600">Here's what's happening with your fitness journey</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statsConfig.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center shadow-md`}>
                                    <stat.icon className="text-white" size={24} />
                                </div>
                                <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Activity Feed */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Friend Activity</h2>
                        <button
                            onClick={() => navigate('/friends')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            View All Friends
                        </button>
                    </div>

                    {friendWorkouts.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="text-slate-400" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No friend workouts yet</h3>
                            <p className="text-slate-600 mb-6">Connect with friends to see their fitness activities here!</p>
                            <button
                                onClick={() => navigate('/find-friends')}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
                            >
                                Find Friends
                            </button>
                        </div>
                    ) : (
                        friendWorkouts.map((workout) => (
                            <div key={workout.workout_id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {getInitials(workout.username)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{workout.username}</p>
                                            <p className="text-xs text-slate-500">{getTimeAgo(workout.workout_date)}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500">{workout.workout_date}</span>
                                </div>

                                {/* Content */}
                                <div className="mb-4">
                                    <h4 className="font-bold text-slate-900 mb-3">{workout.notes || 'Workout Session'}</h4>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <p className="text-sm text-slate-600">
                                            Completed a workout session
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-6 pt-4 border-t border-slate-100">
                                    <button className="flex items-center space-x-2 text-slate-600 hover:text-red-500 transition-colors">
                                        <Heart size={18} />
                                        <span className="text-sm font-semibold">Like</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-slate-600 hover:text-blue-500 transition-colors">
                                        <MessageCircle size={18} />
                                        <span className="text-sm font-semibold">Comment</span>
                                    </button>
                                    <button
                                        onClick={() => navigate(`/workouts/${workout.workout_id}`)}
                                        className="flex items-center space-x-2 text-slate-600 hover:text-blue-500 transition-colors ml-auto"
                                    >
                                        <span className="text-sm font-semibold">View Details</span>
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard

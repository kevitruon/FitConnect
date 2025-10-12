import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'
import { Dumbbell, Search, Bell, Settings, Home, Activity, Users, Calendar, Plus } from 'lucide-react'

const Navbar = () => {
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { token, logout, fetchWithCookie } = useToken()
    const navigate = useNavigate()
    const location = useLocation()
    const API_HOST = import.meta.env.VITE_API_HOST
    const hasFetchedRef = useRef(false)

    useEffect(() => {
        // Only fetch once when token changes and we haven't fetched yet
        if (token && !hasFetchedRef.current) {
            const fetchUserData = async () => {
                try {
                    setIsLoading(true)
                    const data = await fetchWithCookie(`${API_HOST}/token`)
                    if (data?.account) {
                        setUserData(data)
                        hasFetchedRef.current = true
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error)
                } finally {
                    setIsLoading(false)
                }
            }

            fetchUserData()
        } else if (!token) {
            // Reset when logged out
            setUserData(null)
            hasFetchedRef.current = false
            setIsLoading(false)
        }
    }, [token]) // Only depend on token changes

    const handleLogout = async () => {
        try {
            const success = await logout()
            if (success) {
                localStorage.removeItem('token')
                setUserData(null)
                hasFetchedRef.current = false
                navigate('/login')
            }
        } catch (error) {
            console.error('Logout error:', error)
        }
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

    const isActive = (path) => {
        return location.pathname === path
    }

    // Show loading state briefly
    if (isLoading && token) {
        return (
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Dumbbell className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                FitConnect
                            </span>
                        </div>
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </nav>
        )
    }

    if (!token || !userData) {
        return (
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Dumbbell className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                FitConnect
                            </span>
                        </Link>

                        {/* Auth Links */}
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Dumbbell className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            FitConnect
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link
                            to="/"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive('/')
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Home size={18} />
                            <span>Home</span>
                        </Link>
                        <Link
                            to="/log-workout"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive('/log-workout')
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Plus size={18} />
                            <span>Log Workout</span>
                        </Link>
                        <Link
                            to="/workout-history"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive('/workout-history')
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Activity size={18} />
                            <span>History</span>
                        </Link>
                        <Link
                            to="/friends"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive('/friends')
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Users size={18} />
                            <span>Friends</span>
                        </Link>
                        <Link
                            to="/find-friends"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive('/find-friends')
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Search size={18} />
                            <span>Find</span>
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        {/* User Menu */}
                        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {getInitials(userData?.account?.username)}
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-sm font-semibold text-slate-900">
                                    {userData?.account?.username}
                                </p>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                            {/* Mobile logout button */}
                            <button
                                onClick={handleLogout}
                                className="lg:hidden px-3 py-2 text-sm text-slate-600 hover:text-slate-900 font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

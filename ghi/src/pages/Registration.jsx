import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'
import { Dumbbell, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'

const Registration = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useToken()
    const navigate = useNavigate()
    const API_HOST = import.meta.env.VITE_API_HOST

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMessage('')

        // Basic validation
        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long')
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch(`${API_HOST}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            })

            if (response.ok) {
                const success = await login(username, password)
                if (success) {
                    navigate('/')
                }
            } else {
                const data = await response.json()
                setErrorMessage(data.detail || 'Registration failed. Please try again.')
            }
        } catch (error) {
            console.error('Registration error:', error)
            setErrorMessage('An error occurred during registration. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4">
                        <Dumbbell className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
                        Join FitConnect
                    </h1>
                    <p className="text-slate-600">Start your fitness journey today</p>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-sm text-red-800">{errorMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="text-slate-400" size={20} />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="text-slate-400" size={20} />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="text-slate-400" size={20} />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Create a password (min. 6 characters)"
                                    required
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-500">Password must be at least 6 characters long</p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-500">Already have an account?</span>
                        </div>
                    </div>

                    {/* Sign In Link */}
                    <Link
                        to="/login"
                        className="block text-center py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all"
                    >
                        Sign In Instead
                    </Link>
                </div>

                {/* Footer Text */}
                <p className="text-center text-sm text-slate-600 mt-8">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    )
}

export default Registration

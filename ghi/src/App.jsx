import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider } from '@galvanize-inc/jwtdown-for-react'
import useToken from '@galvanize-inc/jwtdown-for-react'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Dashboard from './pages/Dashboard'
import WorkoutLogging from './pages/WorkoutLogging'
import WorkoutHistory from './pages/WorkoutHistory'
import WorkoutDetail from './pages/WorkoutDetail'
import UsersPage from './pages/UsersPage'
import FriendsPage from './pages/FriendsPage'
import Navbar from './pages/Navbar'
import LandingPage from './pages/LandingPage'

// Smart home route: landing page for guests, dashboard for logged-in users
function HomeRoute() {
    const { token } = useToken()
    return token ? <Dashboard /> : <LandingPage />
}

// Simple 404 page
function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
            <div className="text-center">
                <p className="text-8xl font-extrabold text-slate-200 mb-4">404</p>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
                <p className="text-slate-500 mb-8">The page you are looking for does not exist.</p>
                <a
                    href="/"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                >
                    Go Home
                </a>
            </div>
        </div>
    )
}

function App() {
    const API_HOST = import.meta.env.VITE_API_HOST

    if (!API_HOST) {
        throw new Error('VITE_API_HOST is not defined')
    }

    return (
        <AuthProvider baseUrl={API_HOST}>
            <Router>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                    <Navbar />

                    <Routes>
                        <Route path="/" element={<HomeRoute />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Registration />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/log-workout" element={<WorkoutLogging />} />
                        <Route path="/workout-history" element={<WorkoutHistory />} />
                        <Route path="/workouts/:id" element={<WorkoutDetail />} />
                        <Route path="/find-friends" element={<UsersPage />} />
                        <Route path="/friends" element={<FriendsPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App

import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@galvanize-inc/jwtdown-for-react'

import Login from './pages/Login'
import Registration from './pages/Registration'
import Dashboard from './pages/Dashboard'
import WorkoutLogging from './pages/WorkoutLogging'
import WorkoutHistory from './pages/WorkoutHistory'
import ExerciseLibrary from './pages/ExerciseLibrary'
import Friends from './pages/Friends'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    {/* Add navigation component */}
                    <nav className="bg-gray-800">
                        {/* Add navigation menu items */}
                    </nav>

                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Registration />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                            path="/log-workout"
                            element={<WorkoutLogging />}
                        />
                        <Route
                            path="/workout-history"
                            element={<WorkoutHistory />}
                        />
                        <Route
                            path="/exercises"
                            element={<ExerciseLibrary />}
                        />
                        <Route path="/friends" element={<Friends />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>

                    {/* Add footer component */}
                    <footer className="bg-gray-800 text-white py-4">
                        {/* Add footer content */}
                    </footer>
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App

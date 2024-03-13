import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'

const Navbar = () => {
    const [userData, setUserData] = useState()
    const { token, logout, fetchWithCookie } = useToken()
    const navigate = useNavigate()
    const API_HOST = import.meta.env.VITE_API_HOST
    let location = useLocation()
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await fetchWithCookie(`${API_HOST}/token`)
                setUserData(data)
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }

        if (token) {
            fetchUserData()
        }
    }, [location])

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Dashboard</Link>
                </li>
                <li>
                    <Link to="/profile">Profile</Link>
                </li>
                <li>
                    <Link to="/log-workout">Workout Logging</Link>
                </li>
                <li>
                    <Link to="/find-friends">Find Friends</Link>
                </li>
            </ul>
            {token && userData ? (
                <div>
                    <span>Welcome, {userData.account.username} </span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar

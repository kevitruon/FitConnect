import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'

const Navbar = () => {
    const [userData, setUserData] = useState()
    const { token, logout, fetchWithCookie } = useToken()
    const navigate = useNavigate()
    const API_HOST = import.meta.env.VITE_API_HOST

    useEffect(() => {
        const fetchUserData = debounce(async () => {
            try {
                const data = await fetchWithCookie(`${API_HOST}/token`)
                setUserData(data)
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }, 500)

        if (token) {
            fetchUserData()
        }

        return () => {
            fetchUserData.cancel()
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
    const handleLogout = async () => {
        try {
            const success = await logout()
            if (success) {
                localStorage.removeItem('token')
                navigate('/login')
            }
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <nav>
            {token && userData ? (
                <div>
                    <ul>
                        <li>
                            <Link to="/">Home Feed</Link>
                        </li>
                        <li>
                            <Link to="/log-workout">Workout Logging</Link>
                        </li>
                        <li>
                            <Link to="/friends">Friends List</Link>
                        </li>
                        <li>
                            <Link to="/find-friends">Find Friends</Link>
                        </li>
                        <li>
                            <Link to="/workout-history">Workout History</Link>
                        </li>
                    </ul>
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

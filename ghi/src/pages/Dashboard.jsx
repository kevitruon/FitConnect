import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'

const Dashboard = () => {
    const [friendWorkouts, setFriendWorkouts] = useState([])
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
    return (
        <div>
            <h2>Friend Workouts</h2>
            {friendWorkouts.length === 0 ? (
                <p>No friend workouts found.</p>
            ) : (
                <ul>
                    {friendWorkouts.map((workout) => (
                        <li key={workout.workout_id}>
                            <p>User: {workout.username}</p>
                            <p>Workout: {workout.notes}</p>
                            <p>Date: {workout.workout_date}</p>
                            <button
                                onClick={() =>
                                    navigate(`/workouts/${workout.workout_id}`)
                                }
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                View Workout
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Dashboard

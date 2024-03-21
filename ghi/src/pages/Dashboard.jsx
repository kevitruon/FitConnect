import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'

const Dashboard = () => {
    // const [currentUser, setCurrentUser] = useState(null)
    const [friendWorkouts, setFriendWorkouts] = useState([])
    const { fetchWithCookie, token } = useToken()
    const navigate = useNavigate()

    useEffect(() => {
    const fetchData = async () => {
        try {
            if (token) {
                const friendWorkoutsData = await fetchWithCookie(
                    'http://localhost:8000/friend-workouts'
                )
                setFriendWorkouts(friendWorkoutsData)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    };

    fetchData();
}, [token, fetchWithCookie]);


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

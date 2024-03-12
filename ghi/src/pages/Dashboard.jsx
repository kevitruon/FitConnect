import { useState, useEffect } from 'react'
import useToken from '@galvanize-inc/jwtdown-for-react'

const Dashboard = () => {
    const [friendWorkouts, setFriendWorkouts] = useState([])
    const { accessToken } = useToken()

    useEffect(() => {
        const fetchFriendWorkouts = async () => {
            try {
                const response = await fetch('http://localhost:8000/workouts', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                if (response.ok) {
                    const data = await response.json()
                    setFriendWorkouts(data)
                } else {
                    console.error('Failed to fetch friend workouts')
                }
            } catch (error) {
                console.error('Error fetching friend workouts:', error)
            }
        }

        if (accessToken) {
            fetchFriendWorkouts()
        }
    }, [accessToken])

    return (
        <div>
            <h2>Friend Workouts</h2>
            {friendWorkouts.length === 0 ? (
                <p>No friend workouts found.</p>
            ) : (
                <ul>
                    {friendWorkouts.map((workout) => (
                        <li key={workout.workout_id}>
                            <p>Workout: {workout.notes}</p>
                            <p>Date: {workout.workout_date}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Dashboard

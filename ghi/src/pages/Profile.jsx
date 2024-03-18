import { useState, useEffect } from 'react'
import useToken from '@galvanize-inc/jwtdown-for-react'

const Profile = () => {
    const [userWorkouts, setUserWorkouts] = useState([])
    const { token } = useToken()

    useEffect(() => {
        const fetchUserWorkouts = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8000/api/workouts',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.ok) {
                    const data = await response.json()
                    setUserWorkouts(data)
                } else {
                    console.error('Failed to fetch user workouts')
                }
            } catch (error) {
                console.error('Error fetching user workouts:', error)
            }
        }

        if (token) {
            fetchUserWorkouts()
        }
    }, [token])

    return (
        <div>
            <h2>User Workouts</h2>
            {userWorkouts.length === 0 ? (
                <p>No user workouts found.</p>
            ) : (
                <ul>
                    {userWorkouts.map((workout) => (
                        <li key={workout.id}>
                            <p>Workout: {workout.description}</p>
                            <p>Date: {workout.date}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Profile

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'

function ListWorkouts() {
    const { token } = useToken()
    const navigate = useNavigate()
    const [workouts, setWorkouts] = useState([])
    const API_HOST = import.meta.env.VITE_API_HOST

    useEffect(() => {
        const fetchWorkouts = debounce(async () => {
            try {
                const response = await fetch(`${API_HOST}/workouts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (response.ok) {
                    const data = await response.json()
                    setWorkouts(data)
                } else {
                    console.error('Failed to fetch workouts')
                }
            } catch (error) {
                console.error('Failed to fetch workouts:', error)
            }
        }, 500)

        fetchWorkouts()

        return () => {
            fetchWorkouts.cancel()
        }
    }, [API_HOST, token])

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

    const handleDeleteWorkout = async (workoutId) => {
        try {
            console.log(workoutId)
            const response = await fetch(
                `${API_HOST}/workouts/${workoutId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            if (response.ok) {
                // Remove the deleted workout from the list
                const deletedWorkout = workouts.find(
                    (workout) => workout.workout_id !== workoutId
                )
                console.log('deleted workout:', deletedWorkout)
                setWorkouts(
                    workouts.filter(
                        (workout) => workout.workout_id !== workoutId
                    )
                )
            } else {
                console.error('Failed to delete workout')
            }
        } catch (error) {
            console.error('Failed to delete workout:', error)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">My Workouts</h2>
            <div className="space-y-4">
                {workouts.map((workout) => (
                    <div
                        key={workout.workout_id}
                        className="border rounded px-4 py-2"
                    >
                        <p className="font-bold">
                            Workout Date: {workout.workout_date}
                        </p>
                        <p className="text-sm">Notes: {workout.notes}</p>
                        <div className="flex justify-between items-center mt-2">
                            <button
                                onClick={() =>
                                    navigate(`/workouts/${workout.workout_id}`)
                                }
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                View Workout
                            </button>

                            <button
                                onClick={() =>
                                    handleDeleteWorkout(workout.workout_id)
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Delete Workout
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListWorkouts

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'

function WorkoutDetail() {
    const { token } = useToken()
    const { id } = useParams()
    const [workout, setWorkout] = useState(null)
    const [exercises, setExercises] = useState([])

    useEffect(() => {
        const fetchWorkoutDetail = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/workouts/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.ok) {
                    const data = await response.json()
                    setWorkout(data)

                    const exerciseIds = [
                        ...new Set(data.sets.map((set) => set.exercise_id)),
                    ]
                    const exercisesData = await Promise.all(
                        exerciseIds.map(async (exerciseId) => {
                            const exerciseResponse = await fetch(
                                `http://localhost:8000/exercises/${exerciseId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            )
                            if (exerciseResponse.ok) {
                                return exerciseResponse.json()
                            }
                            throw new Error('Failed to fetch exercise')
                        })
                    )
                    setExercises(exercisesData)
                } else {
                    console.error('Failed to fetch workout detail')
                }
            } catch (error) {
                console.error('Failed to fetch workout detail:', error)
            }
        }

        fetchWorkoutDetail()
    }, [id, token])

    if (!workout) {
        return <div>Loading...</div>
    }

    const getExerciseName = (exerciseId) => {
        const exercise = exercises.find((ex) => ex.exercise_id === exerciseId)
        return exercise ? exercise.exercise_name : ''
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Workout Detail</h2>
            <div className="border rounded px-4 py-2">
                <p className="font-bold">
                    Workout Date: {workout.workout_date}
                </p>
                <p className="text-sm">Notes: {workout.notes}</p>
                <h3 className="text-lg font-semibold mt-4">Exercises</h3>
                <div className="space-y-4">
                    {workout.sets
                        .reduce((acc, set) => {
                            const existingExercise = acc.find(
                                (ex) => ex.exercise_id === set.exercise_id
                            )
                            if (existingExercise) {
                                existingExercise.sets.push(set)
                            } else {
                                acc.push({
                                    exercise_id: set.exercise_id,
                                    exercise_name: getExerciseName(
                                        set.exercise_id
                                    ),
                                    sets: [set],
                                })
                            }
                            return acc
                        }, [])
                        .map((exercise) => (
                            <div key={exercise.exercise_id}>
                                <p className="font-bold">
                                    {exercise.exercise_name}
                                </p>
                                <table className="table-auto w-full mt-2">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2">Set</th>
                                            <th className="px-4 py-2">
                                                Weight
                                            </th>
                                            <th className="px-4 py-2">Reps</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exercise.sets.map((set, index) => (
                                            <tr key={index}>
                                                <td className="border px-4 py-2">
                                                    {set.set_number}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {set.weight}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {set.reps}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default WorkoutDetail

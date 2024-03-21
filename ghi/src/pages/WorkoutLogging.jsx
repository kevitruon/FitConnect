import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'

function CreateWorkout() {
    const [workoutDate, setWorkoutDate] = useState('')
    const [notes, setNotes] = useState('')
    const [exercises, setExercises] = useState([])
    const [selectedExercises, setSelectedExercises] = useState([])
    const [userId, setUserId] = useState(null)
    const { token, fetchWithCookie } = useToken()
    const navigate = useNavigate()
    const API_HOST = import.meta.env.VITE_API_HOST

    useEffect(() => {
        const fetchUserData = debounce(async () => {
            try {
                const userData = await fetchWithCookie(`${API_HOST}/token`)
                if (userData && userData.account && userData.account.id) {
                    setUserId(userData.account.id)
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }, 500)

        const fetchExercises = debounce(async () => {
            try {
                const response = await fetch(
                    'http://localhost:8000/exercises',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (response.ok) {
                    const data = await response.json()
                    setExercises(data)
                } else {
                    console.error('Failed to fetch exercises')
                }
            } catch (error) {
                console.error('Error fetching exercises:', error)
            }
        }, 500)

        if (token) {
            fetchUserData()
            fetchExercises()
        }

        return () => {
            fetchUserData.cancel()
            fetchExercises.cancel()
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        const sets = selectedExercises.flatMap((exercise) =>
            exercise.sets.map((set, index) => ({
                exercise_id: exercise.exercise_id,
                set_number: index + 1,
                weight: set.weight,
                reps: set.reps,
            }))
        )
        const response = await fetch('http://localhost:8000/workouts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                workout: {
                    user_id: userId,
                    workout_date: workoutDate,
                    notes: notes,
                },
                sets: sets,
            }),
        })
        if (response.ok) {
            navigate('/dashboard')
        } else {
            console.error('Create workout failed')
        }
    }

    const addExercise = (e) => {
        const exerciseId = parseInt(e.target.value)
        if (exerciseId) {
            const exercise = exercises.find(
                (ex) => ex.exercise_id === exerciseId
            )
            setSelectedExercises([
                ...selectedExercises,
                { ...exercise, sets: [{ weight: '', reps: '' }] },
            ])
        }
    }

    const removeExercise = (exerciseIndex) => {
        const newSelectedExercises = [...selectedExercises]
        newSelectedExercises.splice(exerciseIndex, 1)
        setSelectedExercises(newSelectedExercises)
    }

    const handleSetChange = (exerciseIndex, setIndex, field, value) => {
        const newSelectedExercises = [...selectedExercises]
        newSelectedExercises[exerciseIndex].sets[setIndex][field] = value
        setSelectedExercises(newSelectedExercises)
    }

    const addSet = (exerciseIndex) => {
        const newSelectedExercises = [...selectedExercises]
        newSelectedExercises[exerciseIndex].sets.push({ weight: '', reps: '' })
        setSelectedExercises(newSelectedExercises)
    }

    const removeSet = (exerciseIndex, setIndex) => {
        const newSelectedExercises = [...selectedExercises]
        newSelectedExercises[exerciseIndex].sets.splice(setIndex, 1)
        setSelectedExercises(newSelectedExercises)
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Create Workout</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="workoutDate" className="block">
                        Workout Date:
                    </label>
                    <input
                        type="date"
                        id="workoutDate"
                        value={workoutDate}
                        onChange={(e) => setWorkoutDate(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="notes" className="block">
                        Notes:
                    </label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="exercise" className="block">
                        Add Exercise:
                    </label>
                    <select
                        id="exercise"
                        onChange={addExercise}
                        className="border rounded px-2 py-1 w-full"
                    >
                        <option value="">Select an exercise</option>
                        {exercises.map((exercise) => (
                            <option
                                key={exercise.exercise_id}
                                value={exercise.exercise_id}
                            >
                                {exercise.exercise_name}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedExercises.map((exercise, exerciseIndex) => (
                    <div
                        key={exercise.exercise_id}
                        className="border rounded px-4 py-2 mb-4"
                    >
                        <div className="flex justify-between items-center">
                            <p className="font-bold">
                                {exercise.exercise_name}
                            </p>
                            <button
                                type="button"
                                onClick={() => removeExercise(exerciseIndex)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Remove Exercise
                            </button>
                        </div>
                        {exercise.sets.map((set, setIndex) => (
                            <div key={setIndex} className="space-y-2">
                                <div>
                                    <label
                                        htmlFor={`weight-${exerciseIndex}-${setIndex}`}
                                        className="block"
                                    >
                                        Weight:
                                    </label>
                                    <input
                                        type="number"
                                        id={`weight-${exerciseIndex}-${setIndex}`}
                                        value={set.weight}
                                        onChange={(e) =>
                                            handleSetChange(
                                                exerciseIndex,
                                                setIndex,
                                                'weight',
                                                e.target.value
                                            )
                                        }
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor={`reps-${exerciseIndex}-${setIndex}`}
                                        className="block"
                                    >
                                        Reps:
                                    </label>
                                    <input
                                        type="number"
                                        id={`reps-${exerciseIndex}-${setIndex}`}
                                        value={set.reps}
                                        onChange={(e) =>
                                            handleSetChange(
                                                exerciseIndex,
                                                setIndex,
                                                'reps',
                                                e.target.value
                                            )
                                        }
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                </div>
                                {setIndex > 0 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeSet(exerciseIndex, setIndex)
                                        }
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Remove Set
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addSet(exerciseIndex)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Add Set
                        </button>
                    </div>
                ))}
                <button
                    type="submit"
                    className="bg-green-500 text-white px-3 py-1 rounded"
                >
                    Create Workout
                </button>
            </form>
        </div>
    )
}

export default CreateWorkout

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'
import { Plus, Minus, Calendar, FileText, Dumbbell, Save, X } from 'lucide-react'

function CreateWorkout() {
    const [workoutDate, setWorkoutDate] = useState('')
    const [notes, setNotes] = useState('')
    const [exercises, setExercises] = useState([])
    const [selectedExercises, setSelectedExercises] = useState([])
    const [userId, setUserId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
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
                const response = await fetch(`${API_HOST}/exercises`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
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
            // Set today's date as default
            const today = new Date().toISOString().split('T')[0]
            setWorkoutDate(today)
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
        setIsLoading(true)

        const sets = selectedExercises.flatMap((exercise) =>
            exercise.sets.map((set, index) => ({
                exercise_id: exercise.exercise_id,
                set_number: index + 1,
                weight: parseFloat(set.weight) || 0,
                reps: parseInt(set.reps) || 0,
            }))
        )

        // Validation
        if (sets.length === 0) {
            alert('Please add at least one exercise with sets')
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch(`${API_HOST}/workouts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    workout: {
                        user_id: userId,
                        workout_date: workoutDate,
                        notes: notes || null,
                    },
                    sets: sets,
                }),
            })

            if (response.ok) {
                navigate('/workout-history')
            } else {
                const errorData = await response.json()
                console.error('Create workout failed:', errorData)
                alert('Failed to create workout. Please try again.')
            }
        } catch (error) {
            console.error('Error creating workout:', error)
            alert('An error occurred while creating the workout.')
        } finally {
            setIsLoading(false)
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
            e.target.value = ''
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Log Workout</h1>
                    <p className="text-slate-600">Record your training session</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Workout Details Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <Calendar className="mr-2 text-blue-500" size={24} />
                            Workout Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="workoutDate" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="workoutDate"
                                    value={workoutDate}
                                    onChange={(e) => setWorkoutDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Workout Notes
                                </label>
                                <input
                                    type="text"
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Leg Day, Upper Body..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Add Exercise Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <label htmlFor="exercise" className="block text-sm font-semibold text-slate-700 mb-3">
                            Add Exercise
                        </label>
                        <select
                            id="exercise"
                            onChange={addExercise}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value="">Select an exercise to add...</option>
                            {exercises.map((exercise) => (
                                <option
                                    key={exercise.exercise_id}
                                    value={exercise.exercise_id}
                                >
                                    {exercise.exercise_name} - {exercise.category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Selected Exercises */}
                    {selectedExercises.map((exercise, exerciseIndex) => (
                        <div
                            key={exerciseIndex}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                                        <Dumbbell className="mr-2 text-blue-500" size={20} />
                                        {exercise.exercise_name}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">{exercise.category}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeExercise(exerciseIndex)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Sets Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Set</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Weight (lbs)</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Reps</th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exercise.sets.map((set, setIndex) => (
                                            <tr key={setIndex} className="border-b border-slate-100">
                                                <td className="py-3 px-4 font-semibold text-slate-700">
                                                    {setIndex + 1}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="number"
                                                        value={set.weight}
                                                        onChange={(e) =>
                                                            handleSetChange(
                                                                exerciseIndex,
                                                                setIndex,
                                                                'weight',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="0"
                                                        step="0.5"
                                                        required
                                                    />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="number"
                                                        value={set.reps}
                                                        onChange={(e) =>
                                                            handleSetChange(
                                                                exerciseIndex,
                                                                setIndex,
                                                                'reps',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="0"
                                                        required
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    {setIndex > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeSet(exerciseIndex, setIndex)
                                                            }
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Minus size={18} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button
                                type="button"
                                onClick={() => addSet(exerciseIndex)}
                                className="mt-4 flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold"
                            >
                                <Plus size={18} />
                                <span>Add Set</span>
                            </button>
                        </div>
                    ))}

                    {/* Submit Buttons */}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={isLoading || selectedExercises.length === 0}
                            className="flex-1 flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            <span>{isLoading ? 'Saving...' : 'Save Workout'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/workout-history')}
                            className="px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateWorkout

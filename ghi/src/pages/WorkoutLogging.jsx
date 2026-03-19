import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'
import {
    Plus,
    Minus,
    Calendar,
    Dumbbell,
    Save,
    X,
    AlertCircle,
    BarChart3,
} from 'lucide-react'

function CreateWorkout() {
    const [workoutDate, setWorkoutDate] = useState('')
    const [notes, setNotes] = useState('')
    const [exercises, setExercises] = useState([])
    const [selectedExercises, setSelectedExercises] = useState([])
    const [userId, setUserId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { token, fetchWithCookie } = useToken()
    const navigate = useNavigate()
    const API_HOST = import.meta.env.VITE_API_HOST

    useEffect(() => {
        const fetchUserData = debounce(async () => {
            try {
                const userData = await fetchWithCookie(`${API_HOST}/token`)
                if (userData?.account?.id) setUserId(userData.account.id)
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }, 300)

        const fetchExercises = debounce(async () => {
            try {
                const response = await fetch(`${API_HOST}/exercises`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (response.ok) {
                    const data = await response.json()
                    setExercises(data)
                }
            } catch (error) {
                console.error('Error fetching exercises:', error)
            }
        }, 300)

        if (token) {
            fetchUserData()
            fetchExercises()
            setWorkoutDate(new Date().toISOString().split('T')[0])
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
            timeoutId = setTimeout(() => func(...args), delay)
        }
        debouncedFunc.cancel = () => clearTimeout(timeoutId)
        return debouncedFunc
    }

    // Group exercises by category for the dropdown
    const exercisesByCategory = useMemo(() => {
        const groups = {}
        exercises.forEach((ex) => {
            const cat = ex.category || 'Other'
            if (!groups[cat]) groups[cat] = []
            groups[cat].push(ex)
        })
        return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
    }, [exercises])

    // Already-added exercise IDs (to avoid duplicates)
    const addedIds = new Set(selectedExercises.map((e) => e.exercise_id))

    // Live volume calculations
    const getExerciseVolume = (sets) =>
        sets.reduce(
            (sum, s) =>
                sum + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0),
            0
        )

    const totalVolume = selectedExercises.reduce(
        (sum, ex) => sum + getExerciseVolume(ex.sets),
        0
    )

    const totalSets = selectedExercises.reduce(
        (sum, ex) => sum + ex.sets.length,
        0
    )

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('')
        setIsLoading(true)

        const sets = selectedExercises.flatMap((exercise) =>
            exercise.sets.map((set, index) => ({
                exercise_id: exercise.exercise_id,
                set_number: index + 1,
                weight: parseFloat(set.weight) || 0,
                reps: parseInt(set.reps) || 0,
            }))
        )

        if (sets.length === 0) {
            setErrorMessage('Please add at least one exercise with sets.')
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
                    sets,
                }),
            })

            if (response.ok) {
                navigate('/workout-history')
            } else {
                const errorData = await response.json()
                setErrorMessage(
                    errorData.detail || 'Failed to save workout. Please try again.'
                )
            }
        } catch (error) {
            console.error('Error creating workout:', error)
            setErrorMessage('An error occurred. Please check your connection and try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const addExercise = (e) => {
        const exerciseId = parseInt(e.target.value)
        if (exerciseId && !addedIds.has(exerciseId)) {
            const exercise = exercises.find((ex) => ex.exercise_id === exerciseId)
            setSelectedExercises([
                ...selectedExercises,
                { ...exercise, sets: [{ weight: '', reps: '' }] },
            ])
        }
        e.target.value = ''
    }

    const removeExercise = (exerciseIndex) => {
        setSelectedExercises(selectedExercises.filter((_, i) => i !== exerciseIndex))
    }

    const handleSetChange = (exerciseIndex, setIndex, field, value) => {
        const updated = selectedExercises.map((ex, ei) =>
            ei === exerciseIndex
                ? {
                      ...ex,
                      sets: ex.sets.map((s, si) =>
                          si === setIndex ? { ...s, [field]: value } : s
                      ),
                  }
                : ex
        )
        setSelectedExercises(updated)
    }

    const addSet = (exerciseIndex) => {
        setSelectedExercises(
            selectedExercises.map((ex, i) =>
                i === exerciseIndex
                    ? { ...ex, sets: [...ex.sets, { weight: '', reps: '' }] }
                    : ex
            )
        )
    }

    const removeSet = (exerciseIndex, setIndex) => {
        setSelectedExercises(
            selectedExercises.map((ex, i) =>
                i === exerciseIndex
                    ? { ...ex, sets: ex.sets.filter((_, si) => si !== setIndex) }
                    : ex
            )
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
                        Log Workout
                    </h1>
                    <p className="text-slate-500">Record your training session</p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-red-800 font-medium">{errorMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Workout Details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center space-x-2">
                            <Calendar className="text-blue-500" size={22} />
                            <span>Workout Details</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label
                                    htmlFor="workoutDate"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="workoutDate"
                                    value={workoutDate}
                                    onChange={(e) => setWorkoutDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="notes"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Session Name{' '}
                                    <span className="text-slate-400 font-normal">
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Chest Day, Push A, Leg Day..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Add Exercise */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <label
                            htmlFor="exercise"
                            className="block text-sm font-bold text-slate-700 mb-3"
                        >
                            Add Exercise
                        </label>
                        <select
                            id="exercise"
                            onChange={addExercise}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-700"
                        >
                            <option value="">— Select an exercise —</option>
                            {exercisesByCategory.map(([category, exList]) => (
                                <optgroup key={category} label={category}>
                                    {exList.map((exercise) => (
                                        <option
                                            key={exercise.exercise_id}
                                            value={exercise.exercise_id}
                                            disabled={addedIds.has(exercise.exercise_id)}
                                        >
                                            {exercise.exercise_name}
                                            {addedIds.has(exercise.exercise_id)
                                                ? ' ✓'
                                                : ''}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Live Session Summary */}
                    {selectedExercises.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-md">
                            <div className="flex items-center space-x-2 mb-3">
                                <BarChart3 size={20} />
                                <span className="font-bold text-lg">Session Summary</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/15 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-extrabold">
                                        {selectedExercises.length}
                                    </p>
                                    <p className="text-xs text-blue-100">Exercises</p>
                                </div>
                                <div className="bg-white/15 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-extrabold">{totalSets}</p>
                                    <p className="text-xs text-blue-100">Total Sets</p>
                                </div>
                                <div className="bg-white/15 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-extrabold">
                                        {totalVolume.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-blue-100">Volume (lbs)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Selected Exercises */}
                    {selectedExercises.map((exercise, exerciseIndex) => {
                        const exVolume = getExerciseVolume(exercise.sets)
                        return (
                            <div
                                key={exerciseIndex}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                {/* Exercise Header */}
                                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow">
                                            <Dumbbell className="text-white" size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                {exercise.exercise_name}
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                {exercise.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {exVolume > 0 && (
                                            <div className="hidden sm:block text-right">
                                                <p className="text-xs text-slate-500">Volume</p>
                                                <p className="text-sm font-bold text-blue-600">
                                                    {exVolume.toLocaleString()} lbs
                                                </p>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeExercise(exerciseIndex)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove exercise"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Sets Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                                <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-12">
                                                    Set
                                                </th>
                                                <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Weight (lbs)
                                                </th>
                                                <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Reps
                                                </th>
                                                <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Volume
                                                </th>
                                                <th className="w-12" />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {exercise.sets.map((set, setIndex) => {
                                                const setVol =
                                                    (parseFloat(set.weight) || 0) *
                                                    (parseInt(set.reps) || 0)
                                                return (
                                                    <tr
                                                        key={setIndex}
                                                        className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                                                    >
                                                        <td className="py-3 px-5">
                                                            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                                                                {setIndex + 1}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-5">
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
                                                                className="w-28 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                                placeholder="0"
                                                                step="0.5"
                                                                min="0"
                                                                required
                                                            />
                                                        </td>
                                                        <td className="py-3 px-5">
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
                                                                className="w-24 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                                placeholder="0"
                                                                min="0"
                                                                required
                                                            />
                                                        </td>
                                                        <td className="py-3 px-5">
                                                            <span
                                                                className={`text-sm font-semibold ${
                                                                    setVol > 0
                                                                        ? 'text-blue-600'
                                                                        : 'text-slate-300'
                                                                }`}
                                                            >
                                                                {setVol > 0
                                                                    ? `${setVol.toLocaleString()} lbs`
                                                                    : '—'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            {exercise.sets.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeSet(
                                                                            exerciseIndex,
                                                                            setIndex
                                                                        )
                                                                    }
                                                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <Minus size={14} />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Add Set */}
                                <div className="px-5 py-4">
                                    <button
                                        type="button"
                                        onClick={() => addSet(exerciseIndex)}
                                        className="flex items-center space-x-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors font-semibold"
                                    >
                                        <Plus size={16} />
                                        <span>Add Set</span>
                                    </button>
                                </div>
                            </div>
                        )
                    })}

                    {/* Submit */}
                    <div className="flex space-x-4 pb-8">
                        <button
                            type="submit"
                            disabled={isLoading || selectedExercises.length === 0}
                            className="flex-1 flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            <span>{isLoading ? 'Saving...' : 'Save Workout'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/workout-history')}
                            className="px-6 py-4 border-2 border-slate-200 text-slate-600 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors font-semibold"
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

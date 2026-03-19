import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'
import { Calendar, Dumbbell, ArrowLeft, BarChart3, AlertCircle } from 'lucide-react'

function WorkoutDetail() {
    const { token } = useToken()
    const { id } = useParams()
    const navigate = useNavigate()
    const [workout, setWorkout] = useState(null)
    const [exercises, setExercises] = useState([])
    const [error, setError] = useState(false)
    const API_HOST = import.meta.env.VITE_API_HOST

    useEffect(() => {
        const fetchWorkoutDetail = debounce(async () => {
            try {
                const response = await fetch(`${API_HOST}/workouts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (response.ok) {
                    const data = await response.json()
                    setWorkout(data)

                    const exerciseIds = [
                        ...new Set(data.sets.map((set) => set.exercise_id)),
                    ]
                    const exercisesData = await Promise.all(
                        exerciseIds.map(async (exerciseId) => {
                            const res = await fetch(
                                `${API_HOST}/exercises/${exerciseId}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                            )
                            if (res.ok) return res.json()
                            throw new Error('Failed to fetch exercise')
                        })
                    )
                    setExercises(exercisesData)
                } else {
                    setError(true)
                }
            } catch (err) {
                console.error('Failed to fetch workout detail:', err)
                setError(true)
            }
        }, 300)

        fetchWorkoutDetail()
        return () => fetchWorkoutDetail.cancel()
    }, [id, API_HOST, token])

    const debounce = (func, delay) => {
        let timeoutId
        const debouncedFunc = (...args) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => func(...args), delay)
        }
        debouncedFunc.cancel = () => clearTimeout(timeoutId)
        return debouncedFunc
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="text-red-500" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        Workout not found
                    </h2>
                    <p className="text-slate-500 mb-6">
                        This workout could not be loaded.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    if (!workout) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Loading workout...</p>
                </div>
            </div>
        )
    }

    const getExerciseName = (exerciseId) =>
        exercises.find((ex) => ex.exercise_id === exerciseId)?.exercise_name ||
        'Unknown Exercise'

    const getExerciseCategory = (exerciseId) =>
        exercises.find((ex) => ex.exercise_id === exerciseId)?.category || ''

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })

    const getTotalVolume = (sets) =>
        sets.reduce((total, set) => total + set.weight * set.reps, 0)

    const groupedExercises = workout.sets.reduce((acc, set) => {
        const existing = acc.find((ex) => ex.exercise_id === set.exercise_id)
        if (existing) {
            existing.sets.push(set)
        } else {
            acc.push({
                exercise_id: set.exercise_id,
                exercise_name: getExerciseName(set.exercise_id),
                category: getExerciseCategory(set.exercise_id),
                sets: [set],
            })
        }
        return acc
    }, [])

    const totalVolume = getTotalVolume(workout.sets)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors font-semibold"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                        <Calendar size={18} className="opacity-80" />
                        <span className="text-blue-100 font-medium">
                            {formatDate(workout.workout_date)}
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold mb-6">
                        {workout.notes || 'Workout Session'}
                    </h1>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/15 rounded-xl p-4 text-center">
                            <p className="text-3xl font-extrabold">
                                {groupedExercises.length}
                            </p>
                            <p className="text-sm text-blue-100 mt-1">Exercises</p>
                        </div>
                        <div className="bg-white/15 rounded-xl p-4 text-center">
                            <p className="text-3xl font-extrabold">
                                {workout.sets.length}
                            </p>
                            <p className="text-sm text-blue-100 mt-1">Sets</p>
                        </div>
                        <div className="bg-white/15 rounded-xl p-4 text-center">
                            <p className="text-3xl font-extrabold">
                                {totalVolume.toLocaleString()}
                            </p>
                            <p className="text-sm text-blue-100 mt-1">Volume (lbs)</p>
                        </div>
                    </div>
                </div>

                {/* Exercises */}
                <div className="space-y-5">
                    {groupedExercises.map((exercise, index) => {
                        const exVolume = getTotalVolume(exercise.sets)
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                {/* Exercise Header */}
                                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
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
                                    <div className="flex items-center space-x-2 text-right">
                                        <BarChart3 size={16} className="text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Volume</p>
                                            <p className="font-bold text-slate-900">
                                                {exVolume.toLocaleString()} lbs
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sets Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50/60 border-b border-slate-100">
                                            <tr>
                                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Set
                                                </th>
                                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Weight (lbs)
                                                </th>
                                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Reps
                                                </th>
                                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Volume
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {exercise.sets.map((set, setIndex) => (
                                                <tr
                                                    key={setIndex}
                                                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                                                >
                                                    <td className="py-4 px-6">
                                                        <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                                                            {set.set_number}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 font-semibold text-slate-800">
                                                        {set.weight}
                                                    </td>
                                                    <td className="py-4 px-6 font-semibold text-slate-800">
                                                        {set.reps}
                                                    </td>
                                                    <td className="py-4 px-6 font-semibold text-blue-600">
                                                        {(
                                                            set.weight * set.reps
                                                        ).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default WorkoutDetail

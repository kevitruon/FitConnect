import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'
import { Calendar, FileText, Dumbbell, ArrowLeft } from 'lucide-react'

function WorkoutDetail() {
    const { token } = useToken()
    const { id } = useParams()
    const navigate = useNavigate()
    const [workout, setWorkout] = useState(null)
    const [exercises, setExercises] = useState([])
    const API_HOST = import.meta.env.VITE_API_HOST

    useEffect(() => {
        const fetchWorkoutDetail = debounce(async () => {
            try {
                const response = await fetch(
                    `${API_HOST}/workouts/${id}`,
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
                                `${API_HOST}/exercises/${exerciseId}`,
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
        }, 500)

        fetchWorkoutDetail()

        return () => {
            fetchWorkoutDetail.cancel()
        }
    }, [id, API_HOST, token])

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

    if (!workout) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading workout details...</p>
                </div>
            </div>
        )
    }

    const getExerciseName = (exerciseId) => {
        const exercise = exercises.find((ex) => ex.exercise_id === exerciseId)
        return exercise ? exercise.exercise_name : 'Unknown Exercise'
    }

    const getExerciseCategory = (exerciseId) => {
        const exercise = exercises.find((ex) => ex.exercise_id === exerciseId)
        return exercise ? exercise.category : ''
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const getTotalVolume = (sets) => {
        return sets.reduce((total, set) => total + (set.weight * set.reps), 0)
    }

    const groupedExercises = workout.sets.reduce((acc, set) => {
        const existingExercise = acc.find(
            (ex) => ex.exercise_id === set.exercise_id
        )
        if (existingExercise) {
            existingExercise.sets.push(set)
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/workout-history')}
                    className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-semibold">Back to History</span>
                </button>

                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <Calendar size={24} />
                        <span className="text-lg font-medium">
                            {formatDate(workout.workout_date)}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        {workout.notes || 'Workout Session'}
                    </h1>
                    <div className="flex items-center space-x-6 mt-6">
                        <div className="bg-white/20 rounded-lg px-4 py-2">
                            <p className="text-sm opacity-90">Exercises</p>
                            <p className="text-2xl font-bold">{groupedExercises.length}</p>
                        </div>
                        <div className="bg-white/20 rounded-lg px-4 py-2">
                            <p className="text-sm opacity-90">Total Sets</p>
                            <p className="text-2xl font-bold">{workout.sets.length}</p>
                        </div>
                        <div className="bg-white/20 rounded-lg px-4 py-2">
                            <p className="text-sm opacity-90">Volume</p>
                            <p className="text-2xl font-bold">{getTotalVolume(workout.sets).toLocaleString()} lbs</p>
                        </div>
                    </div>
                </div>

                {/* Exercises */}
                <div className="space-y-6">
                    {groupedExercises.map((exercise, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                        >
                            {/* Exercise Header */}
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                            <Dumbbell className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">
                                                {exercise.exercise_name}
                                            </h3>
                                            <p className="text-sm text-slate-500">{exercise.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500">Total Volume</p>
                                        <p className="text-lg font-bold text-slate-900">
                                            {getTotalVolume(exercise.sets).toLocaleString()} lbs
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sets Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                                                Set
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                                                Weight
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                                                Reps
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                                                Volume
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exercise.sets.map((set, setIndex) => (
                                            <tr
                                                key={setIndex}
                                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="py-4 px-6 font-semibold text-slate-900">
                                                    {set.set_number}
                                                </td>
                                                <td className="py-4 px-6 text-slate-700">
                                                    {set.weight} lbs
                                                </td>
                                                <td className="py-4 px-6 text-slate-700">
                                                    {set.reps} reps
                                                </td>
                                                <td className="py-4 px-6 font-semibold text-blue-600">
                                                    {(set.weight * set.reps).toLocaleString()} lbs
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WorkoutDetail

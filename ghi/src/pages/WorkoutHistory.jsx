import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '@galvanize-inc/jwtdown-for-react'
import { Activity, Calendar, ChevronRight, Dumbbell, Plus, Trash2 } from 'lucide-react'

function ListWorkouts() {
    const { token } = useToken()
    const navigate = useNavigate()
    const [workouts, setWorkouts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)
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
            } finally {
                setIsLoading(false)
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
        setDeletingId(workoutId)
        try {
            const response = await fetch(`${API_HOST}/workouts/${workoutId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.ok) {
                setWorkouts(workouts.filter((w) => w.workout_id !== workoutId))
            } else {
                console.error('Failed to delete workout')
            }
        } catch (error) {
            console.error('Failed to delete workout:', error)
        } finally {
            setDeletingId(null)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your workouts...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">Workout History</h1>
                        <p className="text-slate-600">
                            {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'} logged
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/log-workout')}
                        className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Log Workout</span>
                    </button>
                </div>

                {/* Empty State */}
                {workouts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-5">
                            <Dumbbell className="text-blue-500" size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No workouts yet</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                            Start logging your workouts to track your progress and share with friends!
                        </p>
                        <button
                            onClick={() => navigate('/log-workout')}
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
                        >
                            Log Your First Workout
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {workouts.map((workout) => {
                            const exerciseCount = workout.sets
                                ? new Set(workout.sets.map((s) => s.exercise_id)).size
                                : 0
                            const setCount = workout.sets ? workout.sets.length : 0

                            return (
                                <div
                                    key={workout.workout_id}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        {/* Left: workout info */}
                                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                                <Activity className="text-white" size={22} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-slate-900 truncate">
                                                    {workout.notes || 'Workout Session'}
                                                </h3>
                                                <div className="flex items-center space-x-2 mt-1 text-sm text-slate-500">
                                                    <Calendar size={14} />
                                                    <span>{formatDate(workout.workout_date)}</span>
                                                </div>
                                                {/* Stats badges */}
                                                <div className="flex items-center space-x-3 mt-3">
                                                    {exerciseCount > 0 && (
                                                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                                            <Dumbbell size={12} />
                                                            <span>{exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}</span>
                                                        </span>
                                                    )}
                                                    {setCount > 0 && (
                                                        <span className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">
                                                            {setCount} {setCount === 1 ? 'set' : 'sets'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: actions */}
                                        <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                                            <button
                                                onClick={() => navigate(`/workouts/${workout.workout_id}`)}
                                                className="flex items-center space-x-1 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold text-sm"
                                            >
                                                <span>View</span>
                                                <ChevronRight size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteWorkout(workout.workout_id)}
                                                disabled={deletingId === workout.workout_id}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete workout"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListWorkouts

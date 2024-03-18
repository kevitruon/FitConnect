import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useToken from '@galvanize-inc/jwtdown-for-react';

function WorkoutDetail() {
  const { token } = useToken();
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);


  console.log('Type of id:', typeof id); // Log the type of id
  useEffect(() => {
    console.log('ID:', id)
    const fetchWorkoutDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8000/workouts/${id}`, { // Use id directly in the URL
        
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setWorkout(data);
        } else {
          console.error('Failed to fetch workout detail');
        }
      } catch (error) {
        console.error('Failed to fetch workout detail:', error);
      }
    };

    fetchWorkoutDetail();
  }, [id, token]);

  const handleDeleteWorkout = async () => {
    try {
      const response = await fetch(`http://localhost:8000/workouts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        // Redirect to workout history page after deletion
        // You can replace '/workout-history' with the appropriate route
        window.location.href = '/workout-history';
      } else {
        console.error('Failed to delete workout');
      }
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  };

  if (!workout) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Workout Detail</h2>
      <div className="border rounded px-4 py-2">
        <h3 className="text-lg font-semibold">Workout Details</h3>
        <p className="font-bold">Workout ID: {workout.workout_id}</p>
        <p className="font-bold">User ID: {workout.user_id}</p>
        <p className="font-bold">Workout Date: {workout.workout_date}</p>
        <p className="text-sm">Notes: {workout.notes}</p>
        <h3 className="text-lg font-semibold mt-4">Sets</h3>
        <div className="space-y-2">
          {workout.sets.map((set) => (
            <div key={set.set_id} className="border rounded px-4 py-2">
              <p>Exercise ID: {set.exercise_id}</p>
              <p>Set Number: {set.set_number}</p>
              <p>Weight: {set.weight}</p>
              <p>Reps: {set.reps}</p>
            </div>
          ))}
        </div>
        <button
          onClick={handleDeleteWorkout}
          className="bg-red-500 text-white px-3 py-1 rounded mt-4"
        >
          Delete Workout
        </button>
      </div>
    </div>
  );
}

export default WorkoutDetail;

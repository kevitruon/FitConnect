import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useToken from '@galvanize-inc/jwtdown-for-react';

function UpdateWorkout() {
  const [workoutData, setWorkoutData] = useState({
    userId: '',
    workoutDate: '',
    notes: '',
    sets: [{ exerciseId: '', setNumber: '', weight: '', reps: '' }],
  });
  const { token, userId } = useToken();
  const navigate = useNavigate();
  const { workoutId } = useParams();
  console.log('workoutID:', workoutId)
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`http://localhost:8000/workouts/${workoutId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          console.log(response)
          const workout = await response.json();
          setWorkoutData({
            userId: workout.user_id,
            workoutDate: workout.workout_date,
            notes: workout.notes,
            sets: workout.sets.map(({ exercise_id, set_number, weight, reps }) => ({
              exerciseId: exercise_id,
              setNumber: set_number,
              weight,
              reps,
            })),
          });
        } else {
          console.error('Failed to fetch workout');
        }
      } catch (error) {
        console.error('Error fetching workout:', error);
      }
    };


    if (token) {
      fetchWorkout();
    }
  }, [token, workoutId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/workouts/${workoutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workout: {
            user_id: workoutData.userId,
            workout_date: workoutData.workoutDate,
            notes: workoutData.notes,
          },
          sets: workoutData.sets.map(({ exerciseId, setNumber, weight, reps }) => ({
            exercise_id: exerciseId,
            set_number: setNumber,
            weight,
            reps,
          })),
        }),
      });
      if (response.ok) {
        console.log('Updated workout:', workoutData);
        navigate('/dashboard');
      } else {
        console.error('Update workout failed');
      }
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const handleSetChange = (index, field, value) => {
    const newSets = [...workoutData.sets];
    newSets[index][field] = value;
    newSets[index]['workoutId'] = workoutId;
    setWorkoutData({ ...workoutData, sets: newSets });
  };

  const addSet = () => {
    setWorkoutData({
      ...workoutData,
      sets: [...workoutData.sets, { exerciseId: '', setNumber: '', weight: '', reps: '' }],
    });
  };

  const removeSet = (index) => {
    const newSets = [...workoutData.sets];
    newSets.splice(index, 1);
    setWorkoutData({ ...workoutData, sets: newSets });
  };

  return (
    <div>
      <h2>Update Workout</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userId" className="block">User ID:</label>
          <input
            type="text"
            id="userId"
            value={workoutData.userId}
            onChange={(e) => setWorkoutData({ ...workoutData, userId: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label htmlFor="workoutDate" className="block">Workout Date:</label>
          <input
            type="date"
            id="workoutDate"
            value={workoutData.workoutDate}
            onChange={(e) => setWorkoutData({ ...workoutData, workoutDate: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block">Notes:</label>
          <textarea
            id="notes"
            value={workoutData.notes}
            onChange={(e) => setWorkoutData({ ...workoutData, notes: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          ></textarea>
        </div>
        <h3 className="text-lg font-semibold">Sets</h3>
        {workoutData.sets.map((set, index) => (
          <div key={index} className="space-y-2">
            <div>
              <label htmlFor={`exerciseId-${index}`} className="block">Exercise ID:</label>
              <input
                type="text"
                id={`exerciseId-${index}`}
                value={set.exerciseId || ''}
                onChange={(e) => handleSetChange(index, 'exerciseId', e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label htmlFor={`setNumber-${index}`} className="block">Set Number:</label>
              <input
                type="number"
                id={`setNumber-${index}`}
                value={set.setNumber || ''}
                onChange={(e) => handleSetChange(index, 'setNumber', e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label htmlFor={`weight-${index}`} className="block">Weight:</label>
              <input
                type="number"
                id={`weight-${index}`}
                value={set.weight}
                onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label htmlFor={`reps-${index}`} className="block">Reps:</label>
              <input
                type="number"
                id={`reps-${index}`}
                value={set.reps}
                onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <button
              type="button"
              onClick={() => removeSet(index)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >Remove Set</button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSet}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >Add Set</button>
        <button type="submit">Update Workout</button>
      </form>
    </div>
  );
}

export default UpdateWorkout;

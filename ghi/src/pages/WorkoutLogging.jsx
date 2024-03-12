import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useToken from '@galvanize-inc/jwtdown-for-react';

function CreateWorkout() {
  const [workoutDate, setWorkoutDate] = useState('');
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState([{ exerciseId: '', setNumber: '', weight: '', reps: '' }]);
  const { token } = useToken();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workout_date: workoutDate,
        notes,
        sets: sets.map(({ exerciseId, setNumber, weight, reps }) => ({
          exercise_id: exerciseId,
          set_number: setNumber,
          weight,
          reps,
        })),
      }),
    });

    if (response.ok) {
      navigate('/dashboard');
    } else {
      console.error('Create workout failed');
    }
  };

  const handleSetChange = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const addSet = () => {
    setSets([...sets, { exerciseId: '', setNumber: '', weight: '', reps: '' }]);
  };

  const removeSet = (index) => {
    const newSets = [...sets];
    newSets.splice(index, 1);
    setSets(newSets);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Create Workout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="workoutDate" className="block">Workout Date:</label>
          <input
            type="date"
            id="workoutDate"
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          ></textarea>
        </div>
        <h3 className="text-lg font-semibold">Sets</h3>
        {sets.map((set, index) => (
          <div key={index} className="space-y-2">
            <div>
              <label htmlFor={`exerciseId-${index}`} className="block">Exercise ID:</label>
              <input
                type="text"
                id={`exerciseId-${index}`}
                value={set.exerciseId}
                onChange={(e) => handleSetChange(index, 'exerciseId', e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label htmlFor={`setNumber-${index}`} className="block">Set Number:</label>
              <input
                type="number"
                id={`setNumber-${index}`}
                value={set.setNumber}
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
            <button type="button" onClick={() => removeSet(index)} className="bg-red-500 text-white px-3 py-1 rounded">Remove Set</button>
          </div>
        ))}
        <button type="button" onClick={addSet} className="bg-blue-500 text-white px-3 py-1 rounded">Add Set</button>
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">Create Workout</button>
      </form>
    </div>
  );
}

export default CreateWorkout;

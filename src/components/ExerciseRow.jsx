import SetInput from "./SetInput";
import { useState } from "react";

export default function ExerciseRow({ exercise, onChange, onDelete }) {
  const [sets, setSets] = useState(exercise.sets);

  const updateSets = (newSets) => {
    setSets(newSets);
    onChange({ ...exercise, sets: newSets });
  };

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet = lastSet ? { weight: lastSet.weight, reps: lastSet.reps } : { weight: "", reps: "" };
    updateSets([...sets, newSet]);
  };

  const deleteSet = (setIndex) => {
    updateSets(sets.filter((_, i) => i !== setIndex));
  };

  return (
    <div className="card p-3 my-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <input
          className="form-control custom-select me-2"
          style={{ maxWidth: "300px" }}
          value={exercise.name}
          readOnly
        />

        <button className="btn btn-outline-danger ms-2 btn-sm" onClick={onDelete}>
          🗑️ Delete Exercise
        </button>
      </div>

      {sets.map((set, index) => (
        <SetInput
          key={index}
          index={index}
          setData={set}
          onChange={(updatedSet) => {
            const newSets = [...sets];
            newSets[index] = updatedSet;
            updateSets(newSets);
          }}
          onDelete={() => deleteSet(index)}
        />
      ))}

      <div className="d-flex justify-content-center mt-2">
        <button className="btn btn-outline-secondary btn-sm" onClick={addSet}>
          ➕ Add Set
        </button>
      </div>
    </div>
  );
}

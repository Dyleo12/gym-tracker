export default function SetInput({ index, setData, onChange, onDelete }) {
  return (
    <div className="input-group my-2">
      <span className="input-group-text">Set {index + 1}</span>

      <input
        type="number"
        className="form-control custom-select"
        placeholder="Weight"
        value={setData.weight}
        onChange={(e) => onChange({ ...setData, weight: e.target.value })}
      />

      <input
        type="number"
        className="form-control custom-select"
        placeholder="Reps"
        value={setData.reps}
        onChange={(e) => onChange({ ...setData, reps: e.target.value })}
      />

      <button className="btn btn-danger ms-2 btn-sm " onClick={onDelete}>
        ✕
      </button>
    </div>
  );
}

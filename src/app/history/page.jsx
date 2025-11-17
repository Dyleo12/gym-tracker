"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import "../globals.css"

export default function WorkoutHistory() {
  const [history, setHistory] = useState([]);
  const router = useRouter();
  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .order("date", { ascending: false });

    if (error) console.error(error);
    else setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteWorkout = async (id) => {
    if (!confirm("Are you sure you want to delete this workout?")) return;

    const { error } = await supabase.from("workouts").delete().eq("id", id);
    if (error) console.error(error);
    else fetchHistory();
  };

  return (
    <div className="container my-4">
      <h2 className="underline-animate header-glow mb-3">Workout History</h2>
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <a href="/" className="btn btn-primary me-2">
          Home
        </a>
      </div>
      {history.length === 0 && <p>No workouts saved yet.</p>}

      {history
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((workout) => (
          <div key={workout.id} className="card mb-3 p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">{workout.date}</h5>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => deleteWorkout(workout.id)}
              >
                🗑️ Delete Workout
              </button>
            </div>

            {workout.exercises.map((ex, idx) => (
              <div key={`${ex.name}-${idx}`} className="mb-2">
                <strong>{ex.name}</strong>
                <ul className="list-group list-group-flush">
                  {ex.sets.map((set, i) => (
                    <li key={i} className="list-group-item">
                      Set {i + 1}: {set.weight} kg × {set.reps} reps
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

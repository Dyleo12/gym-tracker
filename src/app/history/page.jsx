"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import "../globals.css"
import { useAuth } from "@/lib/useAuth";

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
  const authUser = useAuth(15000);

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteWorkout = async (id) => {
    if (!confirm("Are you sure you want to delete this workout?")) return;

    const { error } = await supabase.from("workouts").delete().eq("id", id);
    if (error) console.error(error);
    else fetchHistory();
  };

  const downloadHistory = () => {
    if (!history.length) return;

    const dataStr = JSON.stringify(history, null, 2); // pretty print
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "workout_history.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="container my-4">
      <h2 className="underline-animate header-glow mb-3">Workout History</h2>
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <a href="/" className="btn btn-primary me-2">
          Home
        </a>
        <button onClick={downloadHistory} className="btn btn-success">
          📥 Download History
        </button>
      </div>
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
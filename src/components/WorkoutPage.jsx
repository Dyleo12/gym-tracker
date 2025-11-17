"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ExerciseRow from "./ExerciseRow";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import "../app/globals.css"

const PRESET_EXERCISES = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Pull-Up",
  "Dip",
  "Bicep Curl",
  "Tricep Extension",
];

export default function WorkoutPage() {
  const [exercises, setExercises] = useState([]);
  const [customExercises, setCustomExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [newCustomExercise, setNewCustomExercise] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/auth"; 
      } else {
        setUser(session.user);
        fetchCustomExercises(session.user.id);
      }
    };
    getSession();
  }, []);

  const fetchCustomExercises = async (userId) => {
    const { data, error } = await supabase
      .from("custom_exercises")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) console.error(error);
    else setCustomExercises(data.map((ex) => ex.name));
  };

  const addCustomExercise = async () => {
    if (!user) return; 
    const trimmed = newCustomExercise.trim();
    if (!trimmed || customExercises.includes(trimmed)) return;

    const { data, error } = await supabase
      .from("custom_exercises")
      .insert([{ name: trimmed, user_id: user.id }])
      .select();

    if (error) console.error(error);
    else {
      setCustomExercises([...customExercises, data[0].name]);
      setSelectedExercise(data[0].name);
      setNewCustomExercise("");
    }
  };

  const removeCustomExercise = async (name) => {
    if (!user) return;
    const { error } = await supabase
      .from("custom_exercises")
      .delete()
      .eq("name", name)
      .eq("user_id", user.id);

    if (error) console.error(error);
    else setCustomExercises(customExercises.filter((ex) => ex !== name));
  };

  const addExercise = () => {
    if (!selectedExercise.trim()) return;
    setExercises([...exercises, { id: uuidv4(), name: selectedExercise, sets: [] }]);
    setSelectedExercise("");
  };

  const updateExercise = (index, updatedExercise) => {
    const newExercises = [...exercises];
    newExercises[index] = updatedExercise;
    setExercises(newExercises);
  };

  const deleteExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const saveWorkout = async () => {
    if (exercises.length === 0) {
      alert("Add at least one exercise before saving!");
      return;
    }

    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      alert("You must be logged in to save a workout");
      return;
    }

    const userId = session.user.id;

    const workoutData = {
      date: new Date().toISOString().split("T")[0],
      exercises,
      user_id: userId
    };

    const { data, error } = await supabase.from("workouts").insert([workoutData]);

    if (error) {
      console.error(error);
      alert("Failed to save workout");
    } else {
      alert("Workout saved!");
      setExercises([]); 
    }
  };

  const exerciseOptions = [...PRESET_EXERCISES, ...customExercises];

  return (
    <div className="container my-4">
      <h2 className="underline-animate header-glow mb-3">Today's Workout</h2>

      {/* Navigation */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <a href="/" className="btn btn-primary me-2">
          Home
        </a>
        <a href="/history" className="btn btn-secondary me-2">
          History
        </a>

      </div>

      {/* Add Exercise */}
      <div className="input-group mb-3">
        <select
          className="form-select form-select-sm exercise-select"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
        >
          <option value="">Select Exercise</option>
          {exerciseOptions.map((ex, i) => (
            <option key={i} value={ex}>{ex}</option>
          ))}
        </select>
        <button className="btn btn-primary btn-sm" onClick={addExercise}>
          Add
        </button>
      </div>

      {/* Add Custom Exercise Inline */}
      <div className="d-flex gap-2 mb-2 align-items-center">
        <input
          type="text"
          className="form-control form-control-sm custom-select2"
          placeholder="Add custom exercise"
          value={newCustomExercise}
          onChange={(e) => setNewCustomExercise(e.target.value)}
          style={{ maxWidth: "200px" }}
        />
        <button className="btn btn-outline-secondary btn-sm" onClick={addCustomExercise}>
          Save
        </button>
      </div>

      {/* Custom Exercises as badges */}
      {customExercises.length > 0 && (
        <div className="mb-3">
          <h6 className="mb-1">Custom Exercises:</h6>
          <div className="d-flex flex-wrap gap-1">
            {customExercises.map((ex, i) => (
              <span key={i} className="badge bg-secondary d-flex align-items-center">
                {ex}
                <button
                  className="btn btn-sm btn-transparent text-light ms-2 p-0"
                  style={{ fontSize: "0.8rem" }}
                  onClick={() => removeCustomExercise(ex)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Workout Exercises */}
      {exercises.map((exercise, index) => (
        <div key={exercise.id} className="card mb-2 shadow-sm">
          <div className="card-body p-2">
            <ExerciseRow
              exercise={exercise}
              onChange={(updated) => updateExercise(index, updated)}
              onDelete={() => deleteExercise(index)}
            />
          </div>
        </div>
      ))}

      {/* Save Workout */}
      <button
        className="btn btn-success btn-m mb-3"
        style={{
          position: "fixed",
          bottom: "30px",  
          zIndex: 1000     
        }}
        onClick={saveWorkout}
      >
        💾 Save Workout
      </button>
    </div>

  );
}

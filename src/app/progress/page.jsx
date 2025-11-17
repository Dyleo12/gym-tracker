"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Container, Button, Card, Collapse, Form } from "react-bootstrap";
import ExerciseChart from "@/components/ExerciseChart";
import { useRouter } from "next/navigation";
import "../globals.css"

export default function ProgressPage() {
  const [exerciseCharts, setExerciseCharts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const presets = ["Bench Press", "Squat", "Deadlift", "Overhead Press", "Barbell Row", "Pull-Up", "Dip", "Bicep Curl", "Tricep Extension"];
    const fetchCustomExercises = async () => {
      const { data } = await supabase.from("custom_exercises").select("*");
      const customNames = data?.map((ex) => ex.name) || [];
      setExerciseOptions([...presets, ...customNames]);
    };
    fetchCustomExercises();
  }, []);

  const addExerciseChart = async () => {
    if (!selectedExercise) return;

    const { data: workouts } = await supabase
      .from("workouts")
      .select("*")
      .order("date", { ascending: true });

    const exerciseData = workouts.map((w) => {
      const ex = w.exercises.find((e) => e.name === selectedExercise);
      if (!ex) return null;
      return {
        date: w.date,
        sets: ex.sets
      };
    }).filter(Boolean);

    setExerciseCharts([...exerciseCharts, { name: selectedExercise, data: exerciseData }]);
    setSelectedExercise("");
  };

  return (
    <Container className="my-4">
      <h2 className="underline-animate header-glow mb-3">Exercise Progress</h2>
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <a href="/" className="btn btn-primary me-2">
          Home
        </a>
        </div>

      <div className="input-group mb-3">
        <select className="form-select custom-select" value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
          <option value="">Select Exercise</option>
          {exerciseOptions.map((ex, i) => (
            <option key={i} value={ex}>{ex}</option>
          ))}
        </select>
        <Button onClick={addExerciseChart}>Add Exercise Chart</Button>
      </div>


      {exerciseCharts.map((chart, i) => (
        <ExerciseChart key={i} exercise={chart.name} data={chart.data} />
      ))}
    </Container>
  );
}


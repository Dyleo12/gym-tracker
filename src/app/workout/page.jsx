"use client";

import { supabase } from "@/lib/supabaseClient";
import WorkoutPage from "@/components/WorkoutPage";
const { data: { session } } = await supabase.auth.getSession();

export default function Workout() {
  return <WorkoutPage />;
}

"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Done :)");
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else if (data?.session) {
      router.push("/");
    }
  };

  return (
    <div className="container  mt-5">
      <h1 className="header-glow">Login / Signup</h1>
      <input
        type="email"
        placeholder="Email"
        className="form-control mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="form-control mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-primary me-2" onClick={handleSignIn}>
        Sign In
      </button>
      <button className="btn btn-secondary" onClick={handleSignUp}>
        Sign Up
      </button>
    </div>
  );
}

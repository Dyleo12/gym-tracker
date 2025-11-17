"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import "./globals.css"

const backgroundImages = [
  "/images/bg1.jpg",
  "/images/bg2.webp",
  "/images/bg3.webp",
  "/images/bg4.jpg"
];

export default function HomePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  const currentImage = backgroundImages[currentIndex];

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    else router.push("/auth"); 
  };

  return (
    <div
      style={{
        backgroundImage: `url(${currentImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        transition: "background-image 1s ease-in-out",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }} className="container text-white">
        <h1 className="header-glow2"> Gym App</h1>
        <div className="mt-3">
          <button className="btn btn-danger me-2" onClick={handleSignOut}>
            Sign Out
          </button>

          <a href="/workout" className="btn btn-primary me-2">
            Track Workout
          </a>

          <a href="/progress" className="btn btn-success me-2">
            Progress
          </a>

          <a href="/history" className="btn btn-secondary">
            Workout History
          </a>
        </div>
      </div>
    </div>
  );
}

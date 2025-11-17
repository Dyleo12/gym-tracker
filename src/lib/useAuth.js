"use client";

import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export function useAuth(pollInterval = 30000) { 
  const [user, setUser] = useState(null);

  useEffect(() => {
    let intervalId;

    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        setUser(null);
        window.location.href = "/auth";
        return;
      }

      if (!session) {
        setUser(null);
        window.location.href = "/auth"; 
      } else {
        setUser(session.user);
      }
    };

    checkSession(); 

    if (pollInterval > 0) {
      intervalId = setInterval(checkSession, pollInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pollInterval]);

  return user;
}

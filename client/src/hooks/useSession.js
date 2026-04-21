"use client";

import { useEffect, useState } from "react";

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/auth/session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setSession(data))
      .finally(() => setLoading(false));
  }, []);

  return { session, loading };
}

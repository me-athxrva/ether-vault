"use client";

import { useEffect, useRef } from "react";
import { useSessionStore } from "@/store/useSessionStore";

export function useSession() {
  const { session, loading, setSession, clearSession } = useSessionStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("/api/auth/session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.auth) {
          clearSession();
        } else {
          setSession(data);
        }
      })
      .catch(() => {
        clearSession();
      });
  }, []);

  return { session, loading };
}

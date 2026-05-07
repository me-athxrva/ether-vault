"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Generic hook for fetching dashboard data from the API.
 * Handles loading, error, and refetch states.
 */
export function useDashboardData(endpoint, options = {}) {
  const { autoFetch = true, params = {} } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const buildUrl = useCallback(() => {
    const url = new URL(endpoint, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
    return url.toString();
  }, [endpoint, JSON.stringify(params)]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildUrl(), {
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.status === "success") {
        setData(json.data);
      } else {
        setError(json.message || "Failed to fetch data");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return { data, loading, error, refetch: fetchData };
}

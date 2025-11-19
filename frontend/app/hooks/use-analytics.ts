import { useState, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function useAnalytics() {
  const [loading, setLoading] = useState(false);

  const getTaskInsights = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/analytics/tasks`);
      return await response.json();
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeamInsights = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/analytics/team`);
      return await response.json();
    } finally {
      setLoading(false);
    }
  }, []);

  return { getTaskInsights, getTeamInsights, loading };
}

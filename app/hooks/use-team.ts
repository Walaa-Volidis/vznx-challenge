import { useState, useCallback } from 'react';

type Task = {
  id: string;
  name: string;
  isComplete: boolean;
};

type TeamMember = {
  id: string;
  name: string;
  tasks: Task[];
};

export function useTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/team');
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      const data = await response.json();
      setTeamMembers(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTeamMember = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create team member');
      }

      const newMember = await response.json();
      setTeamMembers((prev) => [...prev, newMember]);
      return newMember;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    teamMembers,
    loading,
    error,
    fetchTeamMembers,
    createTeamMember,
  };
}

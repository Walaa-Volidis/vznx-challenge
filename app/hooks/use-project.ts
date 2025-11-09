import { useState, useCallback } from 'react';

type TeamMember = {
  id: string;
  name: string;
};

type Task = {
  id: string;
  name: string;
  isComplete: boolean;
  teamMember: TeamMember | null;
};

type Project = {
  id: string;
  name: string;
  status: string;
  progress: number;
  tasks: Task[];
};

export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      const data = await response.json();
      setProject(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return {
    project,
    loading,
    error,
    fetchProject,
    setProject,
  };
}

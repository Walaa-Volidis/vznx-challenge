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

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const createTask = useCallback(
    async (name: string, teamMemberId?: string) => {
      if (!projectId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/projects/${projectId}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, teamMemberId: teamMemberId || null }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create task');
        }

        const newTask = await response.json();
        setTasks((prev) => [...prev, newTask]);
        return newTask;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  const updateTask = useCallback(
    async (
      taskId: string,
      updates: {
        isComplete?: boolean;
        name?: string;
        teamMemberId?: string | null;
      }
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update task');
        }

        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );
        return updatedTask;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const toggleTask = useCallback(
    async (taskId: string, currentStatus: boolean) => {
      return updateTask(taskId, { isComplete: !currentStatus });
    },
    [updateTask]
  );

  const deleteTask = useCallback(async (taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    setTasks,
  };
}

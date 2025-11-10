'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { ArrowLeft, Plus, Check, Trash2 } from 'lucide-react';
import { useProject } from '../../hooks/use-project';
import { useTasks } from '../../hooks/use-tasks';
import { useTeam } from '../../hooks/use-team';

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

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [projectId, setProjectId] = useState<string>('');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [selectedMember, setSelectedMember] = useState<string>('');

  const { project, fetchProject } = useProject(projectId);
  const {
    createTask,
    toggleTask,
    deleteTask: removeTask,
  } = useTasks(projectId);
  const { teamMembers, fetchTeamMembers } = useTeam();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setProjectId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchTeamMembers();
    }
  }, [projectId, fetchProject, fetchTeamMembers]);

  const handleAddTask = async () => {
    if (!newTaskName.trim()) return;

    try {
      await createTask(newTaskName, selectedMember || undefined);
      setNewTaskName('');
      setSelectedMember('');
      setIsAddTaskOpen(false);
      // Refresh project to get updated progress
      await fetchProject();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      await toggleTask(taskId, currentStatus);
      // Refresh project to get updated progress
      await fetchProject();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await removeTask(taskId);
      // Refresh project to get updated progress
      await fetchProject();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (!project) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
            <p
              className={`text-lg ${
                project.status === 'Completed'
                  ? 'text-green-600'
                  : 'text-blue-600'
              }`}
            >
              {project.status}
            </p>
          </div>

          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to {project.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="taskName">Task Name</Label>
                  <Input
                    id="taskName"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="Enter task name"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assign To (Optional)</Label>
                  <select
                    id="assignee"
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddTaskOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3" />
            <div className="flex justify-between mt-4 text-sm text-muted-foreground">
              <span>{project.tasks.length} total tasks</span>
              <span>
                {project.tasks.filter((t) => t.isComplete).length} completed
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
        {project.tasks.length === 0 ? (
          <Card className="text-center p-12">
            <CardTitle className="mb-2">No tasks yet</CardTitle>
            <CardDescription>
              Get started by adding your first task
            </CardDescription>
          </Card>
        ) : (
          <div className="space-y-3">
            {project.tasks.map((task) => (
              <Card
                key={task.id}
                className={`transition-all ${
                  task.isComplete ? 'bg-muted/50' : 'hover:shadow-md'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() =>
                          handleToggleTask(task.id, task.isComplete)
                        }
                        className={`flex items-center justify-center w-6 h-6 rounded border-2 transition-colors ${
                          task.isComplete
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {task.isComplete && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </button>

                      <div className="flex-1">
                        <p
                          className={`text-base ${
                            task.isComplete
                              ? 'line-through text-muted-foreground'
                              : 'font-medium'
                          }`}
                        >
                          {task.name}
                        </p>
                        {task.teamMember && (
                          <p className="text-sm text-muted-foreground">
                            Assigned to: {task.teamMember.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

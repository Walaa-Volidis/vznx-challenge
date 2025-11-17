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
import {
  ArrowLeft,
  Plus,
  Check,
  Trash2,
  Circle,
  CheckCircle2,
  User2,
} from 'lucide-react';
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
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Loading project...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
      {/* Header with Back Button */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-6">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-4 hover:bg-slate-100 dark:hover:bg-slate-800 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          {/* Project Hero Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1 space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                {project.name}
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border ${
                    project.status === 'Completed'
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
                  }`}
                >
                  {project.status === 'Completed' && (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {project.status === 'Completed' ? 'Completed' : 'In Progress'}
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {project.tasks.length}{' '}
                  {project.tasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            </div>

            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Create New Task
                  </DialogTitle>
                  <DialogDescription>
                    Add a new task to track progress on this project
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="taskName" className="text-sm font-semibold">
                      Task Name
                    </Label>
                    <Input
                      id="taskName"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      placeholder="e.g., Design homepage mockup"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                      className="h-11"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assignee" className="text-sm font-semibold">
                      Assign To (Optional)
                    </Label>
                    <select
                      id="assignee"
                      value={selectedMember}
                      onChange={(e) => setSelectedMember(e.target.value)}
                      className="flex h-11 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
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
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddTaskOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddTask}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Progress Card */}
          <Card className="mt-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/20 dark:to-slate-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Overall Progress
                </span>
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {project.progress}%
                </span>
              </div>
              <div className="relative h-4 bg-white dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-500 rounded-full shadow-md"
                  style={{ width: `${project.progress}%` }}
                >
                  {project.progress > 0 && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Circle className="h-3 w-3 fill-slate-400" />
                  {project.tasks.length} total tasks
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {project.tasks.filter((t) => t.isComplete).length} completed
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
          Tasks
        </h2>
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
          Tasks
        </h2>

        {project.tasks.length === 0 ? (
          <Card className="p-16 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 dark:from-blue-500/10 dark:to-blue-600/10 flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                No tasks yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Get started by adding your first task to track progress on this
                project
              </p>
              <Button
                onClick={() => setIsAddTaskOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Task
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {project.tasks.map((task, index) => (
              <Card
                key={task.id}
                className={`group border-slate-200 dark:border-slate-800 transition-all duration-300 animate-fade-in ${
                  task.isComplete
                    ? 'bg-slate-50/50 dark:bg-slate-900/50'
                    : 'bg-white dark:bg-slate-900 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-0.5'
                }`}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Custom Checkbox */}
                      <button
                        onClick={() =>
                          handleToggleTask(task.id, task.isComplete)
                        }
                        className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                          task.isComplete
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 shadow-lg shadow-emerald-500/30'
                            : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md hover:scale-110'
                        }`}
                      >
                        {task.isComplete && (
                          <Check
                            className="h-5 w-5 text-white font-bold"
                            strokeWidth={3}
                          />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-base font-medium transition-all duration-200 truncate ${
                            task.isComplete
                              ? 'line-through text-slate-400 dark:text-slate-600'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {task.name}
                        </p>
                        {task.teamMember && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                              {task.teamMember.name.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                              <User2 className="h-3 w-3" />
                              {task.teamMember.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      className="flex-shrink-0 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
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

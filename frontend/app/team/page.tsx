'use client';

import { useState, useEffect } from 'react';
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
  Plus,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useTeam } from '../hooks/use-team';

export default function TeamPage() {
  const { teamMembers, loading, error, fetchTeamMembers, createTeamMember } =
    useTeam();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const handleAddMember = async () => {
    if (!newMemberName.trim()) return;

    try {
      await createTeamMember(newMemberName);
      setNewMemberName('');
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to create team member:', error);
    }
  };

  const getCapacityLevel = (taskCount: number) => {
    const maxCapacity = 5; // 5 tasks = 100% capacity
    const percentage = (taskCount / maxCapacity) * 100;
    return Math.min(percentage, 100);
  };

  const getCapacityColor = (taskCount: number) => {
    if (taskCount <= 2) return 'from-emerald-500 to-emerald-600';
    if (taskCount <= 4) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  const getCapacityBgColor = (taskCount: number) => {
    if (taskCount <= 2)
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    if (taskCount <= 4)
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
  };

  const getCapacityLabel = (taskCount: number) => {
    if (taskCount === 0) return 'Available';
    if (taskCount <= 2) return 'Light Load';
    if (taskCount <= 4) return 'Moderate Load';
    return 'At Capacity';
  };

  const getCapacityIcon = (taskCount: number) => {
    if (taskCount <= 2) return <CheckCircle2 className="h-4 w-4" />;
    if (taskCount <= 4) return <TrendingUp className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                Team Overview
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Manage your team members and monitor their workload
              </p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Add Team Member
                  </DialogTitle>
                  <DialogDescription>
                    Add a new member to your team
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="memberName"
                      className="text-sm font-semibold"
                    >
                      Name
                    </Label>
                    <Input
                      id="memberName"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="e.g., John Doe"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                      className="h-11"
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddMember}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add Member
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Team Stats */}
          {teamMembers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Team Members
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        {teamMembers.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Available
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        {teamMembers.filter((m) => m.tasks.length <= 2).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        At Capacity
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        {teamMembers.filter((m) => m.tasks.length > 4).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Team Members Section */}
      <div className="container mx-auto px-6 py-8">
        {teamMembers.length === 0 ? (
          <Card className="text-center p-16 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 dark:from-blue-500/10 dark:to-blue-600/10 flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="mb-3 text-2xl text-slate-900 dark:text-white">
                No team members yet
              </CardTitle>
              <CardDescription className="text-base mb-6">
                Get started by adding your first team member
              </CardDescription>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Member
              </Button>
            </div>
          </Card>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Team Members
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {teamMembers.length}{' '}
                {teamMembers.length === 1 ? 'member' : 'members'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => {
                const taskCount = member.tasks.length;
                const completedTasks = member.tasks.filter(
                  (t) => t.isComplete
                ).length;
                const capacityPercentage = getCapacityLevel(taskCount);
                const capacityColor = getCapacityColor(taskCount);
                const capacityLabel = getCapacityLabel(taskCount);
                const capacityBg = getCapacityBgColor(taskCount);
                const capacityIcon = getCapacityIcon(taskCount);

                return (
                  <Card
                    key={member.id}
                    className="group border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">
                              {member.name}
                            </CardTitle>
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border mt-1.5 ${capacityBg}`}
                            >
                              {capacityIcon}
                              <span>{capacityLabel}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Workload Capacity */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            Workload
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {taskCount}/5 tasks
                          </span>
                        </div>
                        <div className="relative h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${capacityColor} transition-all duration-500 rounded-full`}
                            style={{ width: `${capacityPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Task Completion */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">
                            Completed
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {completedTasks} / {taskCount}
                          </span>
                        </div>
                        {taskCount > 0 && (
                          <Progress
                            value={(completedTasks / taskCount) * 100}
                            className="h-2"
                          />
                        )}
                      </div>

                      {/* Active Tasks */}
                      {member.tasks.length > 0 && (
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                            Active Tasks:
                          </p>
                          <ul className="space-y-1.5 max-h-24 overflow-y-auto">
                            {member.tasks.slice(0, 3).map((task) => (
                              <li
                                key={task.id}
                                className={`text-sm flex items-start gap-2 ${
                                  task.isComplete
                                    ? 'line-through text-slate-400 dark:text-slate-600'
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <span className="text-slate-400 mt-0.5">•</span>
                                <span className="flex-1">{task.name}</span>
                              </li>
                            ))}
                            {member.tasks.length > 3 && (
                              <li className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                +{member.tasks.length - 3} more tasks...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

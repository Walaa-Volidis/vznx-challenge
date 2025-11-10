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
import { Plus, Users } from 'lucide-react';
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
    if (taskCount <= 2) return 'bg-green-500'; // Green: Low load
    if (taskCount <= 4) return 'bg-orange-500'; // Orange: Medium load
    return 'bg-red-500'; // Red: High load
  };

  const getCapacityLabel = (taskCount: number) => {
    if (taskCount === 0) return 'Available';
    if (taskCount <= 2) return 'Light Load';
    if (taskCount <= 4) return 'Moderate Load';
    return 'At Capacity';
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Team Overview</h1>
          <p className="text-muted-foreground">
            Manage your team and their workload
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Add a new member to your team
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="memberName">Name</Label>
                <Input
                  id="memberName"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Enter team member name"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddMember}>Add Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {teamMembers.length === 0 ? (
        <Card className="text-center p-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="mb-2">No team members yet</CardTitle>
          <CardDescription>
            Get started by adding your first team member
          </CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => {
            const taskCount = member.tasks.length;
            const completedTasks = member.tasks.filter(
              (t) => t.isComplete
            ).length;
            const capacityPercentage = getCapacityLevel(taskCount);
            const capacityColor = getCapacityColor(taskCount);
            const capacityLabel = getCapacityLabel(taskCount);

            return (
              <Card
                key={member.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription className="mt-2">
                    <span
                      className={
                        taskCount <= 2
                          ? 'text-green-600'
                          : taskCount <= 4
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }
                    >
                      {capacityLabel}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-muted-foreground">
                          Tasks Assigned
                        </span>
                        <span className="font-medium">{taskCount}</span>
                      </div>
                      <div className="relative">
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${capacityColor} transition-all`}
                            style={{ width: `${capacityPercentage}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Capacity: {taskCount}/5 tasks
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Completed</span>
                        <span className="font-medium">
                          {completedTasks} / {taskCount}
                        </span>
                      </div>
                      {taskCount > 0 && (
                        <Progress
                          value={(completedTasks / taskCount) * 100}
                          className="h-2 mt-2"
                        />
                      )}
                    </div>

                    {member.tasks.length > 0 && (
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium mb-2">
                          Active Tasks:
                        </p>
                        <ul className="space-y-1 max-h-24 overflow-y-auto">
                          {member.tasks.slice(0, 3).map((task) => (
                            <li
                              key={task.id}
                              className={`text-sm ${
                                task.isComplete
                                  ? 'line-through text-muted-foreground'
                                  : 'text-foreground'
                              }`}
                            >
                              • {task.name}
                            </li>
                          ))}
                          {member.tasks.length > 3 && (
                            <li className="text-sm text-muted-foreground">
                              +{member.tasks.length - 3} more...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

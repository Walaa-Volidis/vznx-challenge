'use client';

import { useEffect, useState } from 'react';
import { useAnalytics } from '../hooks/use-analytics';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const { getTaskInsights, getTeamInsights, loading } = useAnalytics();
  const [taskData, setTaskData] = useState<any>(null);
  const [teamData, setTeamData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const [tasks, team] = await Promise.all([
        getTaskInsights(),
        getTeamInsights(),
      ]);
      setTaskData(tasks);
      setTeamData(team);
    }
    loadData();
  }, [getTaskInsights, getTeamInsights]);

  if (loading || !taskData || !teamData) {
    return <div className="p-8">Loading analytics...</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{taskData.overall.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
              {taskData.overall.completed}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {taskData.overall.completionRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks by Project Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tasks by Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskData.byProject}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="projectName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completedTasks" fill="#00C49F" name="Completed" />
              <Bar dataKey="totalTasks" fill="#0088FE" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Team Workload Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Team Workload Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamData.byMember}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="completedTasks"
                fill="#00C49F"
                name="Completed"
                stackId="a"
              />
              <Bar
                dataKey="pendingTasks"
                fill="#FF8042"
                name="Pending"
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

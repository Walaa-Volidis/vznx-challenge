import teamRepository from '../repositories/team.repository.js';
import projectRepository from '../repositories/project.repository.js';

class AnalyticsService {
  async getTaskInsights() {
    const projects = await projectRepository.findAll();

    const taskStats = projects.map((project) => ({
      projectName: project.name,
      totalTasks: project.tasks.length,
      completedTasks: project.tasks.filter((t) => t.isComplete).length,
      progress: project.progress,
    }));

    const totalTasks = taskStats.reduce((sum, p) => sum + p.totalTasks, 0);
    const completedTasks = taskStats.reduce(
      (sum, p) => sum + p.completedTasks,
      0
    );

    return {
      byProject: taskStats,
      overall: {
        total: totalTasks,
        completed: completedTasks,
        pending: totalTasks - completedTasks,
        completionRate:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
    };
  }

  async getTeamInsights() {
    const teamMembers = await teamRepository.findAll();

    const teamStats = teamMembers.map((member) => ({
      name: member.name,
      totalTasks: member.tasks.length,
      completedTasks: member.tasks.filter((t) => t.isComplete).length,
      pendingTasks: member.tasks.filter((t) => !t.isComplete).length,
      workloadLevel: this.getWorkloadLevel(member.tasks.length),
    }));

    return {
      byMember: teamStats,
      overall: {
        totalMembers: teamMembers.length,
        averageTasksPerMember:
          teamMembers.length > 0
            ? Math.round(
                teamStats.reduce((sum, m) => sum + m.totalTasks, 0) /
                  teamMembers.length
              )
            : 0,
      },
    };
  }

  getWorkloadLevel(taskCount) {
    if (taskCount <= 2) return 'Light';
    if (taskCount <= 4) return 'Moderate';
    return 'Heavy';
  }
}

export default new AnalyticsService();

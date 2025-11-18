import taskRepository from '../repositories/task.repository.js';
import projectRepository from '../repositories/project.repository.js';
import { ZCreateTaskSchema, ZUpdateTaskSchema } from '../utils/validations.js';

class TaskService {
  async getTasksByProjectId(projectId) {
    return await taskRepository.findByProjectId(projectId);
  }

  async createTask(projectId, data) {
    const validatedData = ZCreateTaskSchema.parse(data);

    const taskData = {
      name: validatedData.name,
      projectId: projectId,
      teamMemberId: validatedData.teamMemberId || null,
    };

    return await taskRepository.create(taskData);
  }

  async updateTask(taskId, data) {
    const validatedData = ZUpdateTaskSchema.parse(data);

    const existingTask = await taskRepository.findById(taskId);
    if (!existingTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    const updateData = {};
    if (validatedData.isComplete !== undefined)
      updateData.isComplete = validatedData.isComplete;
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.teamMemberId !== undefined)
      updateData.teamMemberId = validatedData.teamMemberId;

    const updatedTask = await taskRepository.update(taskId, updateData);

    if (validatedData.isComplete !== undefined) {
      await this.updateProjectProgress(updatedTask.projectId);
    }

    return updatedTask;
  }

  async deleteTask(taskId) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    const projectId = task.projectId;
    await taskRepository.remove(taskId);
    await this.updateProjectProgress(projectId);
    return { message: 'Task deleted successfully' };
  }

  async updateProjectProgress(projectId) {
    const { total, completed } = await taskRepository.countByProjectId(
      projectId
    );

    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const status = progress === 100 ? 'Completed' : 'In Progress';

    await projectRepository.update(projectId, {
      progress,
      status,
    });
  }
}

export default new TaskService();

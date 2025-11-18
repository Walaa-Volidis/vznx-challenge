import taskService from '../services/task.service.js';

class TaskController {
  async getTasksByProjectId(req, res, next) {
    try {
      const { id } = req.params;
      const tasks = await taskService.getTasksByProjectId(id);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async createTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.createTask(id, req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const task = await taskService.updateTask(taskId, req.body);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const result = await taskService.deleteTask(taskId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new TaskController();

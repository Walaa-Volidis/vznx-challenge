class TaskController {
  constructor(taskService) {
    this.taskService = taskService;
  }

  async getTasksByProjectId(req, res, next) {
    try {
      const { id } = req.params;
      const tasks = await this.taskService.getTasksByProjectId(id);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async createTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await this.taskService.createTask(id, req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const task = await this.taskService.updateTask(taskId, req.body);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const result = await this.taskService.deleteTask(taskId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default TaskController;

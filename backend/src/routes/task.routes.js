const express = require('express');
const taskController = require('../controllers/task.controller');

const router = express.Router();

router.get(
  '/:id/tasks',
  taskController.getTasksByProjectId.bind(taskController)
);

router.post('/:id/tasks', taskController.createTask.bind(taskController));

router.patch('/tasks/:taskId', taskController.updateTask.bind(taskController));

router.delete('/tasks/:taskId', taskController.deleteTask.bind(taskController));

module.exports = router;

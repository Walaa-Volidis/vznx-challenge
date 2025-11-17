const express = require('express');
const projectController = require('../controllers/project.controller');

const router = express.Router();

router.get('/', projectController.getAllProjects.bind(projectController));

router.get('/:id', projectController.getProjectById.bind(projectController));

router.post('/', projectController.createProject.bind(projectController));

router.patch('/:id', projectController.updateProject.bind(projectController));

router.delete('/:id', projectController.deleteProject.bind(projectController));

module.exports = router;

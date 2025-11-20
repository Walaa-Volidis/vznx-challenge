import { createContainer, asClass, asValue, InjectionMode } from 'awilix';
import prisma from './db.js';

// Repositories
import ProjectRepository from '../repositories/project.repository.js';
import TaskRepository from '../repositories/task.repository.js';
import TeamRepository from '../repositories/team.repository.js';

// Services
import ProjectService from '../services/project.service.js';
import TaskService from '../services/task.service.js';
import TeamService from '../services/team.service.js';
import AnalyticsService from '../services/analytics.service.js';

// Controllers
import ProjectController from '../controllers/project.controller.js';
import TaskController from '../controllers/task.controller.js';
import TeamController from '../controllers/team.controller.js';
import AnalyticsController from '../controllers/analytics.controller.js';


function configureContainer() {
  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC, 
  });

  container.register({
    prisma: asValue(prisma),
  });

  container.register({
    projectRepository: asClass(ProjectRepository).singleton(),
    taskRepository: asClass(TaskRepository).singleton(),
    teamRepository: asClass(TeamRepository).singleton(),
  });

  container.register({
    projectService: asClass(ProjectService).singleton(),
    taskService: asClass(TaskService).singleton(),
    teamService: asClass(TeamService).singleton(),
    analyticsService: asClass(AnalyticsService).singleton(),
  });

  container.register({
    projectController: asClass(ProjectController).singleton(),
    taskController: asClass(TaskController).singleton(),
    teamController: asClass(TeamController).singleton(),
    analyticsController: asClass(AnalyticsController).singleton(),
  });

  return container;
}

export default configureContainer;

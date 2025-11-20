import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import errorMiddleware from './middlewares/error.middleware.js';
import createProjectRoutes from './routes/project.routes.js';
import createTaskRoutes from './routes/task.routes.js';
import createTeamRoutes from './routes/team.routes.js';
import createAnalyticsRoutes from './routes/analytics.routes.js';
import { SERVER_SETTINGS } from './config/settings.js';
import configureContainer from './config/container.js';

const container = configureContainer();

const projectController = container.resolve('projectController');
const taskController = container.resolve('taskController');
const teamController = container.resolve('teamController');
const analyticsController = container.resolve('analyticsController');

const app = express();

app.use(
  cors({
    origin: SERVER_SETTINGS.corsOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

app.use('/api/projects', createProjectRoutes(projectController));
app.use('/api/projects', createTaskRoutes(taskController));
app.use('/api/team', createTeamRoutes(teamController));
app.use('/api/analytics', createAnalyticsRoutes(analyticsController));
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

app.use(errorMiddleware);

export default app;

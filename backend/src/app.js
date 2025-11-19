import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import errorMiddleware from './middlewares/error.middleware.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import teamRoutes from './routes/team.routes.js';
import { SERVER_SETTINGS } from './config/settings.js';

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

app.use('/api/projects', projectRoutes);
app.use('/api/projects', taskRoutes);
app.use('/api/team', teamRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

app.use(errorMiddleware);

export default app;

import express from 'express';

export default function createAnalyticsRoutes(analyticsController) {
  const router = express.Router();

  router.get(
    '/tasks',
    analyticsController.getTaskInsights.bind(analyticsController)
  );
  router.get(
    '/team',
    analyticsController.getTeamInsights.bind(analyticsController)
  );

  return router;
}

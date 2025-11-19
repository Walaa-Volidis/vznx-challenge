import express from 'express';
import analyticsController from '../controllers/analytics.controller.js';

const router = express.Router();

router.get(
  '/tasks',
  analyticsController.getTaskInsights.bind(analyticsController)
);
router.get(
  '/team',
  analyticsController.getTeamInsights.bind(analyticsController)
);

export default router;

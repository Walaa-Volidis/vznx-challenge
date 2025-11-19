import analyticsService from '../services/analytics.service.js';

class AnalyticsController {
  async getTaskInsights(req, res, next) {
    try {
      const insights = await analyticsService.getTaskInsights();
      res.json(insights);
    } catch (error) {
      next(error);
    }
  }

  async getTeamInsights(req, res, next) {
    try {
      const insights = await analyticsService.getTeamInsights();
      res.json(insights);
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyticsController();

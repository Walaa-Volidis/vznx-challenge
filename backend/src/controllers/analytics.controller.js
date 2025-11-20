class AnalyticsController {
  constructor(analyticsService) {
    this.analyticsService = analyticsService;
  }

  async getTaskInsights(req, res, next) {
    try {
      const insights = await this.analyticsService.getTaskInsights();
      res.json(insights);
    } catch (error) {
      next(error);
    }
  }

  async getTeamInsights(req, res, next) {
    try {
      const insights = await this.analyticsService.getTeamInsights();
      res.json(insights);
    } catch (error) {
      next(error);
    }
  }
}

export default AnalyticsController;

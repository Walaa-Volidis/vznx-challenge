const teamService = require('../services/team.service');

class TeamController {
  async getAllTeamMembers(req, res, next) {
    try {
      const teamMembers = await teamService.getAllTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      next(error);
    }
  }

  async createTeamMember(req, res, next) {
    try {
      const teamMember = await teamService.createTeamMember(req.body);
      res.status(201).json(teamMember);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TeamController();

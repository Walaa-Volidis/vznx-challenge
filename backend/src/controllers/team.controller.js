class TeamController {
  constructor(teamService) {
    this.teamService = teamService;
  }

  async getAllTeamMembers(req, res, next) {
    try {
      const teamMembers = await this.teamService.getAllTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      next(error);
    }
  }

  async createTeamMember(req, res, next) {
    try {
      const teamMember = await this.teamService.createTeamMember(req.body);
      res.status(201).json(teamMember);
    } catch (error) {
      next(error);
    }
  }
}

export default TeamController;

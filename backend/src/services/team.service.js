const teamRepository = require('../repositories/team.repository');
const { ZCreateTeamMemberSchema } = require('../utils/validations');

class TeamService {
  async getAllTeamMembers() {
    return await teamRepository.findAll();
  }

  async createTeamMember(data) {
    const validatedData = ZCreateTeamMemberSchema.parse(data);
    const teamMemberData = {
      name: validatedData.name,
    };

    return await teamRepository.create(teamMemberData);
  }
}

module.exports = new TeamService();

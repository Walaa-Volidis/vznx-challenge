import teamRepository from '../repositories/team.repository.js';
import { ZCreateTeamMemberSchema } from '../utils/validations.js';

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

export default new TeamService();

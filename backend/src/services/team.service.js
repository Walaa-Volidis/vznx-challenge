import { ZCreateTeamMemberSchema } from '../utils/validations.js';

class TeamService {
  constructor(teamRepository) {
    this.teamRepository = teamRepository;
  }

  async getAllTeamMembers() {
    return await this.teamRepository.findAll();
  }

  async createTeamMember(data) {
    const validatedData = ZCreateTeamMemberSchema.parse(data);
    const teamMemberData = {
      name: validatedData.name,
    };

    return await this.teamRepository.create(teamMemberData);
  }
}

export default TeamService;

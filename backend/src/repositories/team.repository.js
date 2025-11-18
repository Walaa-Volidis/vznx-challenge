import { prisma } from '../config/db.js';

class TeamRepository {
  async findAll() {
    return await prisma.teamMember.findMany({
      include: {
        tasks: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id) {
    return await prisma.teamMember.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });
  }

  async create(data) {
    return await prisma.teamMember.create({
      data,
      include: {
        tasks: true,
      },
    });
  }
}

export default new TeamRepository();

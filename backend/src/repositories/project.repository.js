import { prisma } from '../config/db.js';

class ProjectRepository {
  async findAll() {
    return await prisma.project.findMany({
      include: {
        tasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id) {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            teamMember: true,
          },
        },
      },
    });
  }

  async create(data) {
    return await prisma.project.create({
      data,
    });
  }

  async update(id, data) {
    return await prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id) {
    return await prisma.project.delete({
      where: { id },
    });
  }
}

export default new ProjectRepository();

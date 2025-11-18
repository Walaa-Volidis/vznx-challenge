import { prisma } from '../config/db.js';

class TaskRepository {
  async findByProjectId(projectId) {
    return await prisma.task.findMany({
      where: { projectId },
      include: {
        teamMember: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findById(id) {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        teamMember: true,
        project: true,
      },
    });
  }

  async create(data) {
    return await prisma.task.create({
      data,
      include: {
        teamMember: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.task.update({
      where: { id },
      data,
      include: {
        teamMember: true,
        project: true,
      },
    });
  }

  async remove(id) {
    return await prisma.task.delete({
      where: { id },
    });
  }

  async countByProjectId(projectId) {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: {
        isComplete: true,
      },
    });
    const total = tasks.length;
    const completed = tasks.filter((task) => task.isComplete).length;
    return { total, completed };
  }
}

export default new TaskRepository();

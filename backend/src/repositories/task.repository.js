class TaskRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findByProjectId(projectId) {
    return await this.prisma.task.findMany({
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
    return await this.prisma.task.findUnique({
      where: { id },
      include: {
        teamMember: true,
        project: true,
      },
    });
  }

  async create(data) {
    return await this.prisma.task.create({
      data,
      include: {
        teamMember: true,
      },
    });
  }

  async update(id, data) {
    return await this.prisma.task.update({
      where: { id },
      data,
      include: {
        teamMember: true,
        project: true,
      },
    });
  }

  async remove(id) {
    return await this.prisma.task.delete({
      where: { id },
    });
  }

  async countByProjectId(projectId) {
    const tasks = await this.prisma.task.findMany({
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

export default TaskRepository;

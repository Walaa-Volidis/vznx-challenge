class ProjectRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return await this.prisma.project.findMany({
      include: {
        tasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id) {
    return await this.prisma.project.findUnique({
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
    return await this.prisma.project.create({
      data,
    });
  }

  async update(id, data) {
    return await this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id) {
    return await this.prisma.project.delete({
      where: { id },
    });
  }
}

export default ProjectRepository;

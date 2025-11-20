class TeamRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return await this.prisma.teamMember.findMany({
      include: {
        tasks: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id) {
    return await this.prisma.teamMember.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });
  }

  async create(data) {
    return await this.prisma.teamMember.create({
      data,
      include: {
        tasks: true,
      },
    });
  }
}

export default TeamRepository;

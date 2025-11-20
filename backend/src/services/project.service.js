import {
  ZCreateProjectSchema,
  ZUpdateProjectSchema,
} from '../utils/validations.js';

class ProjectService {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async getAllProjects() {
    return await this.projectRepository.findAll();
  }

  async getProjectById(id) {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    return project;
  }

  async createProject(data) {
    const validatedData = ZCreateProjectSchema.parse(data);

    const projectData = {
      name: validatedData.name,
      status: validatedData.status || 'In Progress',
      progress: 0,
    };

    return await this.projectRepository.create(projectData);
  }

  async updateProject(id, data) {
    const validatedData = ZUpdateProjectSchema.parse(data);

    await this.getProjectById(id);

    const updateData = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.status !== undefined)
      updateData.status = validatedData.status;
    if (validatedData.progress !== undefined)
      updateData.progress = validatedData.progress;

    return await this.projectRepository.update(id, updateData);
  }

  async deleteProject(id) {
    await this.getProjectById(id);

    return await this.projectRepository.remove(id);
  }
}

export default ProjectService;

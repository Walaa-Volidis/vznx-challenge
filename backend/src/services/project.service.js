import projectRepository from '../repositories/project.repository.js';
import {
  ZCreateProjectSchema,
  ZUpdateProjectSchema,
} from '../utils/validations.js';

class ProjectService {
  async getAllProjects() {
    return await projectRepository.findAll();
  }

  async getProjectById(id) {
    const project = await projectRepository.findById(id);

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

    return await projectRepository.create(projectData);
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

    return await projectRepository.update(id, updateData);
  }

  async deleteProject(id) {
    await this.getProjectById(id);

    return await projectRepository.remove(id);
  }
}

export default new ProjectService();

class ProjectController {
  constructor(projectService) {
    this.projectService = projectService;
  }

  async getAllProjects(req, res, next) {
    try {
      const projects = await this.projectService.getAllProjects();
      res.json(projects);
    } catch (error) {
      next(error);
    }
  }

  async getProjectById(req, res, next) {
    try {
      const { id } = req.params;
      const project = await this.projectService.getProjectById(id);
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async createProject(req, res, next) {
    try {
      const project = await this.projectService.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      const project = await this.projectService.updateProject(id, req.body);
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      await this.projectService.deleteProject(id);
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default ProjectController;

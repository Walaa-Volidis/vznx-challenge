import express from 'express';

export default function createTeamRoutes(teamController) {
  const router = express.Router();

  router.get('/', teamController.getAllTeamMembers.bind(teamController));

  router.post('/', teamController.createTeamMember.bind(teamController));

  return router;
}

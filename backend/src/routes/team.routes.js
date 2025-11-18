import express from 'express';
import teamController from '../controllers/team.controller.js';

const router = express.Router();

router.get('/', teamController.getAllTeamMembers.bind(teamController));

router.post('/', teamController.createTeamMember.bind(teamController));

export default router;

const express = require('express');
const teamController = require('../controllers/team.controller');

const router = express.Router();

router.get('/', teamController.getAllTeamMembers.bind(teamController));

router.post('/', teamController.createTeamMember.bind(teamController));

module.exports = router;

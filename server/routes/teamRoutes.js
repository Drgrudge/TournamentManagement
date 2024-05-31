import express from 'express';
import { createTeam, getTeams, addMemberToTeam, deleteMemberFromTeam, replaceMemberInTeam } from '../controllers/teamController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createTeam);
router.get('/', authMiddleware, getTeams);
router.post('/:teamId/members', authMiddleware, addMemberToTeam);
router.delete('/:teamId/members/:userId', authMiddleware, deleteMemberFromTeam);
router.put('/:teamId/members/:oldUserId/:newUserId', authMiddleware, replaceMemberInTeam);

export default router;

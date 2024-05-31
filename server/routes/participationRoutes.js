import express from 'express';
import { participateSolo, createTeam, addUserToTeam } from '../controllers/participationController.js';
import { authMiddleware, adminOrOrganizerMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/solo', authMiddleware, participateSolo);
router.post('/team', authMiddleware, createTeam);
router.post('/team/:teamId/add', authMiddleware, addUserToTeam);

export default router;

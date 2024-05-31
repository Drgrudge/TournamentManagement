import express from 'express';
import { createEvent, getEvents, editEvent, deleteEvent, participateSolo, createTeam } from '../controllers/eventController.js';
import { authMiddleware, adminOrOrganizerMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, adminOrOrganizerMiddleware, createEvent);
router.get('/', getEvents);
router.put('/:id', authMiddleware, adminOrOrganizerMiddleware, editEvent);
router.delete('/:id', authMiddleware, adminOrOrganizerMiddleware, deleteEvent);

// Participation routes
router.post('/participation/solo', authMiddleware, participateSolo);
router.post('/teams', authMiddleware, createTeam);

export default router;

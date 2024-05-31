import express from 'express';
import { addScore, getScores } from '../controllers/scoreController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, addScore);
router.get('/', getScores);

export default router;

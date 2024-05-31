import express from 'express';
import { createHostel, getHostels } from '../controllers/hostelController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createHostel);
router.get('/', getHostels);

export default router;

import express from 'express';
import { register, login, changePassword, getUsers, deleteUser, assignHostelRepresentative, getUsersByHostel } from '../controllers/userController.js'; // Add getUsersByHostel
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', authMiddleware, changePassword);
router.get('/', authMiddleware, getUsers);
router.delete('/:userId', authMiddleware, deleteUser);
router.post('/assign-representative', authMiddleware, assignHostelRepresentative);
router.get('/hostel/:hostelId', authMiddleware, getUsersByHostel); // Ensure getUsersByHostel is used here


export default router;

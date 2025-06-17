import express from 'express';
import { login, register, logout,updateProfile, checkAuth, getAllUserProfile, getUsersForSidebar } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { uploadUserImage } from "../middleware/auth.multer.js";
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.put('/update-profile',updateProfile);
router.get('/check-auth', authMiddleware,checkAuth);
router.get('/getAllUser',getAllUserProfile)
router.get('/sidebar-users',getUsersForSidebar)
export default router;
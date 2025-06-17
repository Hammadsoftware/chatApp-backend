import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import messageController from "../controllers/messege.controller.js";

const router = express.Router();

// Destructure the controller functions (no `io` injection)
const {
  getUsersForSidebar,
  getMessage,
  sendMessage
} = messageController; // 👈 directly use the controller object

// Routes
router.get("/users", protectRoute, getUsersForSidebar);
router.post("/getMessege", getMessage);
router.post("/send", sendMessage);

export default router;

import { Router } from "express";
import { getMe, updateProfile } from "../controller/userController.js";
import { verifyToken } from "../middleware/middleware.js";

const router = Router();

router.get("/me", verifyToken, getMe);
router.put("/profile", verifyToken, updateProfile);

export default router;

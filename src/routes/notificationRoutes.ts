import { Router } from "express";
import { getUserNotifications } from "../controllers/notificationController";

const router = Router();

router.get("/users/:id/notifications", getUserNotifications);

export default router;

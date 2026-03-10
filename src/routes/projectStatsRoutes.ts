import { Router } from "express";
import { getProjectStats } from "../controllers/projectStatsController";

const router = Router();

router.get("/projects/:id/stats", getProjectStats);

export default router;

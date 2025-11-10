import { Router } from "express";
import { authenticate } from "../middleware/checkAuth";
import { createProject, getProjects, addMember, removeMember } from "../controllers/projectController";

const router = Router();

router.post("/", authenticate, createProject);
router.get("/", authenticate, getProjects);
router.post("/:id/members", authenticate, addMember);
router.delete("/:id/members/:userId", authenticate, removeMember);

export default router;
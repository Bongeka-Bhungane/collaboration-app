import { Router } from "express";
import { authenticate } from "../middleware/checkAuth";
import {
  createSubmission,
  getSubmissionsByProject,
  getSubmission,
  updateSubmissionStatus,
  deleteSubmission,
} from "../controllers/submissionController";

const router = Router();

// Create submission
router.post("/", authenticate, createSubmission);

// List submissions by project
router.get("/projects/:id", authenticate, getSubmissionsByProject);

// View single submission
router.get("/:id", authenticate, getSubmission);

// Update submission status
router.patch("/:id/status", authenticate, updateSubmissionStatus);

// Delete submission
router.delete("/:id", authenticate, deleteSubmission);

export default router;

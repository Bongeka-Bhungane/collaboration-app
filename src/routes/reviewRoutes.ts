import { Router } from "express";
import { authenticate } from "../middleware/checkAuth";
import {
  approveSubmission,
  requestChanges,
  getReviewHistory,
} from "../controllers/reviewController";

const router = Router();

router.post("/submissions/:id/approve", authenticate, approveSubmission);

router.post("/submissions/:id/request-changes", authenticate, requestChanges);

router.get("/submissions/:id/reviews", authenticate, getReviewHistory);

export default router;

import { Router } from "express";
import { authenticate } from "../middleware/checkAuth";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController";

const router = Router();

// Add comment
router.post("/submissions/:id/comments", authenticate, addComment);

// List comments
router.get("/submissions/:id/comments", authenticate, getComments);

// Update comment
router.patch("/comments/:id", authenticate, updateComment);

// Delete comment
router.delete("/comments/:id", authenticate, deleteComment);

export default router;

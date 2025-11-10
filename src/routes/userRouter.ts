import { Router } from "express";
import { getUser, UpdateUser, deleteUSer } from "../controllers/userController";
import { authenticate } from "../middleware/checkAuth";

const router = Router();

router.get("/:id", authenticate, getUser);
router.put("/:id", authenticate, UpdateUser);
router.delete("/:id", authenticate, deleteUSer);

export default router;
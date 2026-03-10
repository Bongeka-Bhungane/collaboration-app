import { Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateMiddleware";
import { register, login } from "../controllers/authController";

const router = Router();

router.post(
  "/register",
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  validateRequest,
  register,
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
  validateRequest,
  login,
);

export default router;

import { Router } from "express";
import {
    createQuestion,
    getQuestions,
    getQuestionById,
    deleteQuestion,
} from "../controllers/question.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
// router.route("/").get(getQuestions);

// Protected routes
router.route("/").get(verifyJWT, getQuestions);
router.route("/").post(verifyJWT, createQuestion);
router.route("/:id").get(verifyJWT, getQuestionById);
router.route("/:id").delete(verifyJWT, deleteQuestion);

export default router;

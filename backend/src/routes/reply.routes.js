import { Router } from "express";
import {
    createReply,
    getRepliesForQuestion,
    deleteReply,
} from "../controllers/reply.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected routess
router.route("/:questionId").get(verifyJWT, getRepliesForQuestion);
router.route("/").post(verifyJWT, createReply);
router.route("/:id").delete(verifyJWT, deleteReply);

export default router;

import express from "express";
import { deleteComment, getPostComments, postComment } from "../controllers/comment.controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post('/:postId', authMiddleware, postComment);
router.get('/:postId', getPostComments);
router.delete('/:postId/:commentId', authMiddleware, deleteComment);

export default router;
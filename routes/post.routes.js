import express from 'express';
import { createPost, deletePost, getPostBySlug, getPosts, uploadImage } from '../controllers/post.controller.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();


//defining routes 
router.get('/upload-auth', uploadImage);
router.post('/', authMiddleware, createPost); //protected routes
router.delete('/:id', authMiddleware, deletePost);//proteted routes
router.get('/', getPosts);
router.get('/:slug', getPostBySlug);


export default router;
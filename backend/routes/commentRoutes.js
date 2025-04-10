import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { addComment, getComments } from '../controllers/commentController.js';

const router = express.Router();

router.post('/:postId/comment', isAuth, addComment);
router.get('/:postId/comments', isAuth, getComments);

export default router;

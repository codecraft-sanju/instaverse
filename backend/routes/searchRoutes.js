// searchRoutes.js
import express from 'express';
import { searchUser } from '../controllers/searchController.js'; 
import { isAuth } from '../middlewares/isAuth.js'; 

const router = express.Router();


router.get('/', isAuth, searchUser);

export default router;

import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateProfilePicture,
  getAllUser,
 updateBio
} from '../controllers/userController.js';



import { isAuth } from '../middlewares/isAuth.js';
import { upload } from '../config/multerConfig.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', isAuth, getUserProfile);
router.get('/getall',isAuth,getAllUser)
router.put(
  '/profile-picture',
  isAuth,
  upload.single('file'),
  updateProfilePicture,
);
router.put('/update-bio', isAuth, updateBio);




export default router;

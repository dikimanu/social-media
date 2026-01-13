
import express from 'express';
import {
  acceptConnectionRequest,
  discoverUsers,
  followUser,
  getUserConnections,
  getUserData,
  getUserProfiles,
  sendConnectionRequest,
  unfollowUser,
  updateUserData,
} from '../controllers/userController.js';
import { getUserRecentMessages } from '../controllers/messageController.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const userRouter = express.Router();

// -------------------------
// Routes
// -------------------------

// Get logged-in user data
userRouter.get('/data', protect, getUserData);

// Update user profile (with profile & cover image uploads)
userRouter.post(
  '/update',
  protect,
  upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  updateUserData
);

// Discover users by name, username, bio, or location
userRouter.post('/discover', protect, discoverUsers);

// Follow / Unfollow users
userRouter.post('/follow', protect, followUser);
userRouter.post('/unfollow', protect, unfollowUser);

// Send / Accept connection requests
userRouter.post('/connect', protect, sendConnectionRequest);
userRouter.post('/accept', protect, acceptConnectionRequest);

// Get user connections, followers, following, and pending connections
userRouter.get('/connections', protect, getUserConnections);

// Get user profiles with posts
userRouter.post('/profiles', protect, getUserProfiles);

// Get recent messages for logged-in user
userRouter.get('/recent-messages', protect, getUserRecentMessages);

export default userRouter;

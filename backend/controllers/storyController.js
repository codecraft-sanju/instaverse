import { Story } from '../models/storyModel.js';
import { User } from '../models/userModel.js'; 

// Upload Story
export const uploadStory = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'File upload failed' });
    }

    const story = await Story.create({
      user: req.user._id,
      fileUrl: req.file.path,
      type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    //  Push story ID to the user's document
    await User.findByIdAndUpdate(req.user._id, {
      $push: { stories: story._id },
    });

    res.status(201).json({ message: 'Story uploaded successfully', story });
  } catch (error) {
    console.error('Story Upload Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get Stories of Following Users
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find({
      user: { $in: req.user.following },
      expiresAt: { $gt: new Date() }, // Only active stories
    }).populate('user', 'username name profilePicture');

    res.status(200).json({ message: 'Stories fetched successfully', stories });
  } catch (error) {
    console.error('Get Stories Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

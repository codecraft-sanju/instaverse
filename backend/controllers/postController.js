import { Post } from '../models/postModel.js';
import { User } from '../models/userModel.js';
import cloudinary from 'cloudinary';


// Create a new post
export const createPost = async (req, res) => {
  try {
    const { caption, comments } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'instagram-clone-posts',
      resource_type: 'auto',
    });

    // Format comments if provided
    let formattedComments = [];
    if (comments && Array.isArray(comments)) {
      formattedComments = comments.map((comment) => ({
        user: req.user._id,
        text: comment.text,
        createdAt: new Date(),
      }));
    }

    // Create new post
    const post = await Post.create({
      caption,
      image: uploadedImage.secure_url,
      user: req.user._id,
      comments: formattedComments,
    });

    // Push post ID into user's posts array
    await User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//  Fetch all posts (for feed)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Get Posts Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//  Fetch posts of a specific user
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId })
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error('Get User Posts Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

  
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    
    const publicId = post.image.split('/').pop().split('.')[0]; 
    await cloudinary.v2.uploader.destroy(`instagram-clone-posts/${publicId}`, {
      resource_type: 'image',
    });

    
    await Post.findByIdAndDelete(postId);

    
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { posts: post._id },
    });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete Post Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get feed posts from following users
export const getFeedPosts = async (req, res) => {
  try {
    
    const loggedInUser = await User.findById(req.user._id).populate('following');

    
    if (!loggedInUser.following || loggedInUser.following.length === 0) {
      return res.status(200).json([]);
    }

  
    const posts = await Post.find({
      user: { $in: loggedInUser.following.map((user) => user._id) },
    })
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Feed Post Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


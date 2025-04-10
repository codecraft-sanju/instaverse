import bcrypt from 'bcryptjs';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

//User Registration Controller
export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    // Remove password from response
    const { password: _, ...userData } = user._doc;

    // Set token in cookies
    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: req.secure || process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res
      .status(201)
      .json({ message: 'User registered successfully', user: userData });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//User Login Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    // Remove password from response
    const { password: _, ...userData } = user._doc;

    // Set token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: req.secure || process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Login successful', user: userData });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//User Logout Controller
export const logoutUser = (req, res) => {
  try {
    res.cookie('token', '', { expires: new Date(0) });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//Get User Profile (Protected Route)
export const getUserProfile = async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: 'User profile fetched successfully', user: req.user });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.log(error.message);
    res.json(500).json({ message: 'Error while fetching all users' });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.profilePicture?.id) {
      await cloudinary.v2.uploader.destroy(user.profilePicture.id);
    }

    await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          profilePicture: {
            id: req.file.filename,
            url: req.file.path,
          },
        },
      },
    );

    res.status(200).json({
      message: 'Profile picture updated successfully!',
      profilePicture: {
        id: req.file.filename,
        url: req.file.path,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const updateBio = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio } = req.body;

    if (!bio || typeof bio !== 'string') {
      return res.status(400).json({ message: 'Invalid bio' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.bio = bio;
    await user.save();

    res
      .status(200)
      .json({ message: 'Bio updated successfully', bio: user.bio });
  } catch (error) {
    console.error('Error updating bio:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


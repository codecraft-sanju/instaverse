import { User } from '../models/userModel.js';

//  Search User Controller
export const searchUser = async (req, res) => {
  try {
    const { query } = req.query; // Search query

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Find users matching the query (username or name)
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ],
    }).limit(10); // Limit results for pagination

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

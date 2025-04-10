import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToRecentSearches,
  removeFromRecentSearches,
  clearRecentSearches,
} from '../redux/features/searchSlice';

const Search = () => {
  const { users } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const recentSearches = useSelector((state) => state.search.recentSearches);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle user click (Add to recent searches)
  const handleUserClick = (user) => {
    dispatch(addToRecentSearches(user));
    navigate(`/search/${user._id}`);
  };

  // Function to remove user from recent searches
  const removeUser = (username) => {
    dispatch(removeFromRecentSearches(username));
  };

  // Function to clear all recent searches
  const clearAllSearches = () => {
    dispatch(clearRecentSearches());
  };

  // Show filtered users when searching, otherwise show recent searches
  const filteredUsers =
    searchTerm.trim() === ''
      ? recentSearches
      : users.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()),
        );

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-950 p-6 text-white">
      <div className="w-full max-w-lg">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />

        {/* Recent Searches */}
        <div className="mt-6 bg-gray-900 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-400">
              {searchTerm ? 'Search Results' : 'Recent Searches'}
            </h2>
            {recentSearches.length > 0 && !searchTerm && (
              <button
                onClick={clearAllSearches}
                className="text-gray-400 hover:text-white text-sm"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        user.profilePicture?.url || './defaultProfilePic.jpg'
                      }
                      alt={user.username}
                      className="w-10 h-10 rounded-full bg-gray-600"
                    />
                    <span className="text-white text-lg">{user.username}</span>
                  </div>
                  <X
                    size={20}
                    className="text-gray-400 hover:text-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation on X click
                      removeUser(user.username);
                    }}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center">
                No users found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

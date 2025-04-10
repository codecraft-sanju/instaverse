import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Bookmark, User } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useFollow } from '../context/followContext';
import { usePost } from '../context/PostContext';
import PostCard from '../components/PostCard';
import FollowersModal from '../components/FollowersModal';

const SearchUser = () => {
  const { id } = useParams();
  const { users, user: currentUser } = useUser();
  const {
    followUser,
    unfollowUser,
    isFollowing,
    followLoading,
    getfollowers,
    followerUser,
  } = useFollow();
  const { userPosts, fetchUserPosts, loadingUserPosts } = usePost();

  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);

  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [modalType, setModalType] = useState('followers');

  useEffect(() => {
    setUserLoading(true);
    setError(false);

    const foundUser = users.find((u) => u._id === id);
    if (!foundUser) {
      setError(true);
    } else {
      setSelectedUser(foundUser);
    }

    setUserLoading(false);
  }, [id, users]);

  useEffect(() => {
    if (id) {
      fetchUserPosts(id);
    }
  }, [id]);

  const handleFollowToggle = async () => {
    if (!selectedUser?._id) return;

    if (isFollowing(selectedUser._id)) {
      await unfollowUser(selectedUser._id);
      setSelectedUser((prev) => ({
        ...prev,
        followers: prev.followers.filter((fid) => fid !== currentUser.user._id),
      }));
    } else {
      await followUser(selectedUser._id);
      setSelectedUser((prev) => ({
        ...prev,
        followers: [...prev.followers, currentUser.user._id],
      }));
    }
  };

  const handleFollowersClick = async (type) => {
    await getfollowers(selectedUser._id);
    setModalType(type);
    setIsFollowersModalOpen(true);
  };

  if (error) {
    return (
      <div className="text-white bg-black min-h-screen flex items-center justify-center text-xl">
        User Not Found
      </div>
    );
  }

  return (
    <div className="text-white bg-black min-h-screen flex flex-col items-center px-4">
      <div className="max-w-4xl w-full p-6 rounded-lg shadow-lg mt-6">
        {/* Profile Section */}
        {userLoading ? (
          <div className="text-center text-gray-400">Loading Profile...</div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Profile Image */}
            <div className="w-28 h-28 rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-full"
                src={selectedUser?.profilePicture?.url || 'default-profile.png'}
                alt="profile"
              />
            </div>

            {/* User Details */}
            <div>
              <h2 className="text-2xl font-bold">{selectedUser?.username}</h2>
              <p className="text-gray-400 text-sm">{selectedUser?.name}</p>
              <p className="mt-2 text-gray-300">
                {selectedUser?.bio || 'No bio available'}
              </p>

              <div className="flex justify-center md:justify-start gap-6 mt-3 text-gray-300">
                <span>{userPosts?.length || 0} Posts</span>
                <span
                  onClick={() => handleFollowersClick('followers')}
                  className="cursor-pointer hover:text-blue-500"
                >
                  {selectedUser?.followers?.length || 0} Followers
                </span>
                <span
                  onClick={() => handleFollowersClick('following')}
                  className="cursor-pointer hover:text-blue-500"
                >
                  {selectedUser?.following?.length || 0} Following
                </span>
              </div>

              {/* Follow/Unfollow Button */}
              {selectedUser._id !== currentUser?.user?._id && (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`mt-4 px-4 py-1 rounded-md text-sm font-semibold transition-all ${
                    isFollowing(selectedUser._id)
                      ? 'bg-gray-800 text-white border border-gray-600'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {followLoading
                    ? 'Loading...'
                    : isFollowing(selectedUser._id)
                    ? 'Unfollow'
                    : 'Follow'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-around mt-6 border-t border-gray-700 pt-3">
          <button
            className={`p-2 ${
              activeTab === 'posts' ? 'text-blue-500' : 'text-white'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            <Grid size={24} />
          </button>
          <button
            className={`p-2 ${
              activeTab === 'saved' ? 'text-blue-500' : 'text-white'
            }`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={24} />
          </button>
          <button
            className={`p-2 ${
              activeTab === 'tagged' ? 'text-blue-500' : 'text-white'
            }`}
            onClick={() => setActiveTab('tagged')}
          >
            <User size={24} />
          </button>
        </div>

        {/* User Posts */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 mt-4">
            {loadingUserPosts ? (
              <p className="text-center text-gray-400 col-span-full mt-4">
                Loading Posts...
              </p>
            ) : userPosts?.length > 0 ? (
              userPosts.map((post) => (
                <img
                  key={post._id}
                  src={post.image}
                  alt="Post"
                  className="h-60 w-full object-cover cursor-pointer rounded-md hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedPost(post)}
                />
              ))
            ) : (
              <p className="text-center text-gray-400 col-span-full mt-4">
                No posts yet
              </p>
            )}
          </div>
        )}
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <PostCard post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      {/* Followers / Following Modal */}
      <FollowersModal
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
        title={modalType === 'followers' ? 'Followers' : 'Following'}
        users={
          modalType === 'followers'
            ? followerUser?.followers || []
            : followerUser?.following || []
        }
      />
    </div>
  );
};

export default SearchUser;

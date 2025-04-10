import React, { useState, useEffect } from 'react';
import {
  Grid,
  Bookmark,
  Camera,
  User,
  CameraIcon,
  LoaderCircle,
  Pencil,
  X,
  Check,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { usePost } from '../context/PostContext';
import PostModal from '../components/PostModal';
import FollowersFollowingModal from '../components/FollowersFollowingModal';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('followers');

  const { user, updateProfilePic, btnLoading, updateBio } = useUser();
  const { userPosts, fetchUserPosts, deletePost } = usePost();

  useEffect(() => {
    if (user?.user?._id) fetchUserPosts(user.user._id);
  }, [user?.user?._id]);

  useEffect(() => {
    setBio(user?.user?.bio || '');
  }, [user?.user?.bio]);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) await updateProfilePic(file);
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
    setSelectedPost(null);
  };

  const openFollowersFollowingModal = (tab) => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center px-4">
      <div className="max-w-4xl w-full p-6 mt-6 shadow-lg rounded-lg bg-black">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="relative group w-28 aspect-square rounded-full overflow-hidden bg-gray-500">
            <img
              src={user?.user?.profilePicture?.url || 'defaultProfilePic.jpg'}
              alt="profile"
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 flex items-center justify-center 
              ${btnLoading ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity'}
              rounded-full`}
            >
              <label className="cursor-pointer flex items-center justify-center">
                {btnLoading ? (
                  <LoaderCircle className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <CameraIcon size={24} className="text-white" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  disabled={btnLoading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <h2 className="text-2xl font-bold">{user?.user?.username}</h2>
              <div className="text-sm text-gray-400 mt-1 sm:mt-0">{user?.user?.name}</div>
            </div>

            <div className="mt-2">
              {!editingBio ? (
                <div className="flex justify-between gap-2 items-start">
                  <p className="text-gray-300 whitespace-pre-wrap break-words max-w-xl">
                    {bio || 'No bio added yet.'}
                  </p>
                  <button
                    onClick={() => setEditingBio(true)}
                    className="text-blue-500 text-sm hover:underline flex items-center gap-1"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-gray-800 text-white px-3 py-2 rounded-md w-full resize-none max-h-32 overflow-y-auto"
                    rows={3}
                    maxLength={150}
                  />
                  <div className="flex gap-2 sm:flex-col">
                    <button
                      onClick={async () => {
                        await updateBio(bio);
                        setEditingBio(false);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md"
                      title="Save"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setBio(user?.user?.bio || '');
                        setEditingBio(false);
                      }}
                      className="bg-gray-600 hover:bg-gray-700 p-2 rounded-md"
                      title="Cancel"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-6 mt-4 text-sm text-gray-300">
              <span
                className="cursor-pointer hover:underline"
                
              >
                <strong>{userPosts?.length || 0}</strong> posts
              </span>
              <span
                className="cursor-pointer"
                onClick={() => openFollowersFollowingModal('followers')}
              >
                <strong>{user?.user?.followers?.length || 0}</strong> followers
              </span>
              <span className="cursor-pointer" onClick={() => openFollowersFollowingModal('following')}>
                <strong>{user?.user?.following?.length || 0}</strong> following
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-around mt-6 border-t border-gray-700 pt-3">
          <button onClick={() => setActiveTab('posts')} className="p-2">
            <Grid size={24} />
          </button>
          <button onClick={() => setActiveTab('reels')} className="p-2">
            <Camera size={24} />
          </button>
          <button onClick={() => setActiveTab('saved')} className="p-2">
            <Bookmark size={24} />
          </button>
          <button onClick={() => setActiveTab('tagged')} className="p-2">
            <User size={24} />
          </button>
        </div>

        {activeTab === 'posts' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 mt-4">
            {userPosts?.length > 0 ? (
              userPosts.map((post) => (
                <div
                  key={post._id}
                  className="aspect-square overflow-hidden rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedPost(post)}
                >
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 col-span-full mt-4">
                No posts yet
              </p>
            )}
          </div>
        )}
      </div>

      <PostModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onDelete={handleDeletePost}
      />

      {isModalOpen && (
        <FollowersFollowingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          followers={user?.user?.followers || []}
          following={user?.user?.following || []}
          tab={modalTab}
        />
      )}
    </div>
  );
};

export default Profile;
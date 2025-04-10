import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useFollow } from '../context/followContext';
import { Link } from 'react-router-dom'; 

const FollowersFollowingModal = ({
  isOpen = false,
  onClose,
  tab = 'followers',
}) => {
  const [activeTab, setActiveTab] = useState(tab);
  const { user } = useUser();
  const { getfollowers, followerUser, followLoading } = useFollow();

  useEffect(() => {
    if (user?.user?._id) {
      getfollowers(user.user._id);
    }
  }, [user?.user?._id]);

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  const listToRender =
    activeTab === 'followers' ? followerUser.followers : followerUser.following;

  const tabClass = (checkTab) =>
    `w-1/2 py-2 text-center font-medium cursor-pointer ${
      activeTab === checkTab
        ? 'border-b-2 border-white text-white'
        : 'text-gray-400'
    }`;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-70 p-4">
        <Dialog.Panel className="w-full max-w-sm bg-zinc-900 text-white rounded-xl shadow-2xl border border-zinc-700">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-700">
            <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-300 hover:text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-zinc-700">
            <div className={tabClass('followers')} onClick={() => setActiveTab('followers')}>
              Followers
            </div>
            <div className={tabClass('following')} onClick={() => setActiveTab('following')}>
              Following
            </div>
          </div>

          {/* User List */}
          <div className="max-h-80 overflow-y-auto">
            {followLoading ? (
              <p className="text-center text-gray-400 py-8">Loading...</p>
            ) : listToRender?.length > 0 ? (
              listToRender.map((user) => (
                <Link
                  key={user._id}
                  to={`/search/${user._id}`} 
                  onClick={onClose} 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition"
                >
                  <img
                    src={user?.profilePicture?.url || 'defaultProfilePic.jpg'}
                    alt="user"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-400">{user.name}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No {activeTab} found.</p>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FollowersFollowingModal;

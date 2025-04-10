import React, { useEffect, useState } from 'react';
import { useFollow } from '../context/followContext';
import { useUser } from '../context/UserContext';

const FollowButton = ({ userId }) => {
  const { followUser, unfollowUser, isFollowing, followLoading } = useFollow();
  const { user } = useUser(); 


  const [followingState, setFollowingState] = useState(false);

  useEffect(() => {
    if (user?.user?._id && userId) {
      setFollowingState(isFollowing(userId));
    }
  }, [user, userId, isFollowing]);

  const handleFollowToggle = async () => {
    if (followingState) {
      await unfollowUser(userId);
    } else {
      await followUser(userId);
    }
    setFollowingState((prev) => !prev);
  };

  // Don't show button if user is trying to follow himself
  if (user?.user?._id === userId) return null;

  return (
    <button
      onClick={handleFollowToggle}
      disabled={followLoading}
      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
        followingState ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
      }`}
    >
      {followLoading ? 'Loading...' : followingState ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;

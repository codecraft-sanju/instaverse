import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useFollow } from '../context/followContext';

const SuggestedUsers = () => {
  const { user, users: allUsers } = useUser();  
  const { followUser, isFollowing, followLoading } = useFollow();

  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    if (user?.user && allUsers?.length > 0) {
      const currentUserId = user.user._id;
      const followingIds = user.user.following || [];

      console.log("Current Logged-in User ID:", currentUserId);
      console.log("User is already following:", followingIds);
      console.log("All Users from DB:", allUsers);

      // Filter out: 1. self, 2. already followed users
      const notFollowingUsers = allUsers.filter((u) => {
        return (
          u._id !== currentUserId &&
          !followingIds.includes(u._id)
        );
      });

      console.log("Filtered (Not Followed Yet) Users:", notFollowingUsers);

      // Random shuffle
      const shuffled = [...notFollowingUsers].sort(() => 0.5 - Math.random());

      // Take first 5
      const randomSuggestions = shuffled.slice(0, 5);

      setSuggested(randomSuggestions);
    }
  }, [user, allUsers]);

  return (
    <div className="w-72 text-white p-4 fixed right-4 top-16">
      <h2 className="font-semibold mb-2">Suggested for you</h2>

      {suggested.length === 0 ? (
        <p className="text-sm text-gray-400">No suggestions available</p>
      ) : (
        suggested.map((u) => (
          <div key={u._id} className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-3">
              <img
                src={u.profilePicture?.url || '/defaultProfilePic.jpg'}
                alt={u.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-sm">{u.username}</span>
            </div>
            <button
              className="text-blue-400 text-sm"
              onClick={() => followUser(u._id)}
              disabled={followLoading || isFollowing(u._id)}
            >
              {isFollowing(u._id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default SuggestedUsers;

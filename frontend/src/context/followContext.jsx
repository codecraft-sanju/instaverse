import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const FollowContext = createContext();



export const FollowProvider = ({ children }) => {
  const { user, fetchUser, fetchAllUsers } = useUser();

  const [followLoading, setFollowLoading] = useState(false);
  const [followerUser, setFollowerUser] = useState({ followers: [], following: [] });

  // Check if current user is following another user
  const isFollowing = (id) => {
    return user?.user?.following?.includes(id);
  };

  // Follow a user
  const followUser = async (userId) => {
    try {
      setFollowLoading(true);
      await axios.post(`/follow/follow/${userId}`, {}, { withCredentials: true });
      await fetchUser();
      await fetchAllUsers();
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  // Unfollow a user
  const unfollowUser = async (userId) => {
    try {
      setFollowLoading(true);
      await axios.delete(`/follow/unfollow/${userId}`, { withCredentials: true });
      await fetchUser();
      await fetchAllUsers();
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  // Get followers and following for a user
  const getfollowers = async (userId) => {
    setFollowLoading(true);
    try {
      const { data } = await axios.get(`/follow/all/${userId}`, {
        withCredentials: true,
      });

      console.log("Followers & Following data:", data);

      setFollowerUser({
        followers: data.followers || [],
        following: data.following || [],
      });
    } catch (error) {
      console.log("Error: " + error.message);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <FollowContext.Provider
      value={{ followUser, unfollowUser, isFollowing, followLoading, getfollowers, followerUser }}
    >
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => useContext(FollowContext);

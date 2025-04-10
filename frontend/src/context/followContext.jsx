import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const FollowContext = createContext();

const API = import.meta.env.VITE_API_URL + '/api';

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
      await axios.post(`${API}/follow/follow/${userId}`, {}, { withCredentials: true });
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
      await axios.delete(`${API}/follow/unfollow/${userId}`, { withCredentials: true });
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
      const { data } = await axios.get(`${API}/follow/all/${userId}`, {
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

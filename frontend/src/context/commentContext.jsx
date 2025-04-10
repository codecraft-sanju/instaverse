import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CommentContext = createContext();

export const useComment = () => useContext(CommentContext);

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all comments for a specific post
  const getComments = async (postId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/comments/${postId}/comments`, {
        withCredentials: true,
      });
      setComments(res.data.comments);
    } catch (err) {
      console.error('Fetch Comments Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new comment to a post
  const addComment = async (postId, text) => {
    try {
      const res = await axios.post(
        `/api/comments/${postId}/comment`,
        { text },
        { withCredentials: true },
      );

      // Optionally update local comments state
      setComments((prev) => [res.data.comment, ...prev]);
    } catch (err) {
      console.error('Add Comment Error:', err);
    }
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        loading,
        getComments,
        addComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

import React, { useEffect, useState } from 'react';
import { usePost } from '../context/PostContext';
import { useUser } from '../context/UserContext';
import { useComment } from '../context/commentContext';
import moment from 'moment';

const PostCard = ({ post, onClose }) => {
  const { likePost, unlikePost } = usePost();
  const { user } = useUser();
  const { comments, getComments, addComment } = useComment();

  const [newComment, setNewComment] = useState('');
  const isLikedByCurrentUser = post.likes.includes(user?._id);

  useEffect(() => {
    getComments(post._id);
  }, [post._id, getComments]);

  const handleLike = () => {
    isLikedByCurrentUser ? unlikePost(post._id) : likePost(post._id);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment(post._id, newComment);
    await getComments(post._id);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a1a1a] rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 text-xl hover:text-red-500 transition"
        >
          ✖
        </button>

        {/* Post Image */}
        <div className="rounded-lg overflow-hidden mb-3">
          <img
            src={post.image}
            alt="post"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Likes */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">
            {post.likes.length} likes
          </span>
          <button
            onClick={handleLike}
            className={`text-sm px-3 py-1 rounded-full transition ${
              isLikedByCurrentUser
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-800 text-blue-400 hover:bg-gray-700'
            }`}
          >
            {isLikedByCurrentUser ? 'Unlike' : 'Like'}
          </button>
        </div>

        {/* Add Comment */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            placeholder="Add a comment..."
            className="flex-1 p-2 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="text-sm font-medium text-blue-500 hover:text-blue-400 transition"
          >
            Post
          </button>
        </div>

        {/* Comments */}
        <div className="overflow-y-auto pr-1 max-h-52 custom-scrollbar">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          ) : (
            comments.map((cmt) => (
              <div key={cmt._id} className="flex items-start gap-3 mt-3">
                <img
                  src={
                    cmt.user?.profilePicture?.url || '/defaultProfilePic.png'
                  }
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-600"
                />
                <div>
                  <p className="text-sm text-gray-300 leading-snug">
                    <span className="font-semibold text-white">
                      {cmt.user?.username || 'Unknown'}
                    </span>{' '}
                    <span>{cmt.text}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {moment(cmt.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;

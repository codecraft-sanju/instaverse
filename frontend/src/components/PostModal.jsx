import React, { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { useComment } from '../context/commentContext';

const PostModal = ({ post, onClose, onDelete }) => {
  const { comments, getComments, addComment, loading } = useComment();
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (post?._id) {
      getComments(post._id);
    }
  }, [post?._id]);

  if (!post) return null;

  const { image, caption, user, likes } = post;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addComment(post._id, commentText);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-[#111] rounded-xl w-[95%] max-w-5xl h-[85%] flex flex-col md:flex-row overflow-hidden relative shadow-xl">
        {/* Image Section */}
        <div className="md:w-[60%] w-full h-1/2 md:h-full bg-[#1a1a1a] flex items-center justify-center">
          <img
            src={image}
            alt="Post"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Details Section */}
        <div className="md:w-[40%] w-full h-1/2 md:h-full flex flex-col justify-between bg-[#1a1a1a] p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
            <img
              src={user?.profilePicture?.url || '/defaultProfilePic.jpg'}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-semibold text-sm">
                {user?.username}
              </p>
              <p className="text-gray-500 text-xs">@{user?.username}</p>
            </div>
          </div>

          {/* Caption */}
          <div className="text-gray-300 text-sm mb-4 max-h-[80px] overflow-y-auto pr-1">
            <span className="font-semibold text-white">{user?.username}:</span>{' '}
            {caption || 'No caption'}
          </div>

          {/* Likes */}
          <div className="text-sm text-gray-400 mb-2 border-b border-gray-700 pb-2">
            ❤️ {likes?.length || 0} likes
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto mb-4 pr-1">
            {loading ? (
              <p className="text-gray-500">Loading comments...</p>
            ) : comments && comments.length > 0 ? (
              comments.map((cmt, idx) => (
                <div key={idx} className="mb-3 flex items-start gap-3">
                  <img
                    src={
                      cmt.user?.profilePicture?.url || '/defaultProfileP.png'
                    }
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover mt-1"
                  />
                  <div>
                    <p className="text-sm text-white font-medium">
                      {cmt.user?.username}
                      <span className="text-gray-300 font-normal ml-2">
                        {cmt.text}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet</p>
            )}
          </div>

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="mb-3">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 text-sm outline-none"
            />
          </form>

          {/* Actions */}
          <div className="flex justify-between items-center border-t border-gray-700 pt-3">
            <button
              onClick={() => onDelete(post._id)}
              className="text-red-500 hover:text-red-400 transition"
              title="Delete Post"
            >
              <Trash2 size={22} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
              title="Close"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;

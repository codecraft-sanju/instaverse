import { Heart, MessageCircle, Plus } from 'lucide-react';

const Post = ({ post }) => {
  const { caption, image, user } = post;

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg w-full max-w-xl mb-6 border-b border-gray-700 pb-6 mt-5">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src={post.user?.profilePicture?.url || '/defaultProfilePic.jpg'}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-semibold">{user?.username}</span>
      </div>

      {/* Post Image */}
      <div className="mt-3">
        <img
          src={image}
          alt="Post"
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-3 mt-3">
        <Heart size={24} className="cursor-pointer" />
        <MessageCircle size={24} className="cursor-pointer" />
        <Plus size={24} className="cursor-pointer" />
      </div>

      {/* Caption */}
      <p className="text-sm mt-2">
        <b>{user?.username}</b> {caption}
      </p>
    </div>
  );
};

export default Post;

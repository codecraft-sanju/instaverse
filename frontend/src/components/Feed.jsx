import React, { useEffect } from 'react';
import { usePost } from '../context/PostContext';
import Post from '../components/Post';
import Stories from './Stories';
import StoryViewer from '../components/StoryViewer';

const Feed = () => {
  const { feedPosts, fetchFeedPosts, loadingFeedPosts } = usePost();

  useEffect(() => {
    fetchFeedPosts();
  }, []);

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl mx-auto">
        <Stories />
        <StoryViewer/>
        {loadingFeedPosts ? (
          <p className="text-white text-center mt-5">Loading feed...</p>
        ) : feedPosts.length === 0 ? (
          <p className="text-white text-center mt-5">No posts to show</p>
        ) : (
          feedPosts.map((post) => <Post key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Feed;

import { useRef } from "react";
import { useStory } from "../context/StoryContext";
import { useUser } from "../context/UserContext";
import { BsPlusCircleFill } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";

const Stories = () => {
  const fileRef = useRef();
  const { user } = useUser();
  const { stories, addStory, btnLoading, setSelectedStoryGroup } = useStory();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) addStory(file);
  };

  // Grouping stories by userId
  const groupedStories = Object.values(
    stories.reduce((acc, story) => {
      const userId = story.user._id;
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: [],
        };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {})
  );

  const openStoryGroup = (group) => {
    setSelectedStoryGroup({
      user: group.user,
      stories: group.stories,
      currentIndex: 0,
    });
  };

  return (
    <div className="flex gap-4 overflow-x-auto max-w-3xl px-4 py-3 border-b border-gray-700">
      {/* Your Story Upload */}
      <div className="flex flex-col items-center space-y-1">
        <div
          onClick={() => fileRef.current.click()}
          className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center border-2 border-blue-500 cursor-pointer relative"
        >
          <BsPlusCircleFill className="absolute bottom-0 right-0 text-blue-600 bg-white rounded-full text-xl" />
          {btnLoading ? (
            <ImSpinner2 className="text-2xl text-blue-500 animate-spin" />
          ) : user?.user?.profilePicture?.url ? (
            <img
              src={user.user.profilePicture.url}
              alt="your story"
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <IoImageOutline className="text-3xl text-gray-700" />
          )}
        </div>
        <p className="text-xs text-white">Your Story</p>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={btnLoading}
        />
      </div>

      {/* Other Users' Stories */}
      {groupedStories.map((group) => (
        <div
          key={group.user._id}
          className="flex flex-col items-center space-y-1 cursor-pointer"
          onClick={() => openStoryGroup(group)}
        >
          <div className="h-16 w-16 border-2 border-red-500 rounded-full overflow-hidden">
            <img
              src={group.user.profilePicture?.url || "/defaultProfilePic.jpg"}
              alt="story"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-xs text-white truncate max-w-[4rem]">
            {group.user.username}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stories;

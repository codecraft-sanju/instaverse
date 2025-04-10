import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StoryContext = createContext();

export const StoryProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [storyLoading, setStoryLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState(null);

  // Upload Story
  async function addStory(file) {
    setBtnLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post("/api/stories/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message);
      fetchStories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload story");
    } finally {
      setBtnLoading(false);
    }
  }

  // Fetch Stories
  async function fetchStories() {
    setStoryLoading(true);
    try {
      const { data } = await axios.get("/api/stories");
      setStories(data.stories);
    } catch (error) {
     // toast.error("Failed to fetch stories");
    } finally {
      setStoryLoading(false);
    }
  }

  // Story Controls
  const closeStory = () => {
    setSelectedStoryGroup(null);
  };

  const nextStory = () => {
    if (
      selectedStoryGroup &&
      selectedStoryGroup.currentIndex < selectedStoryGroup.stories.length - 1
    ) {
      setSelectedStoryGroup({
        ...selectedStoryGroup,
        currentIndex: selectedStoryGroup.currentIndex + 1,
      });
    } else {
      closeStory();
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <StoryContext.Provider
      value={{
        stories,
        storyLoading,
        btnLoading,
        addStory,
        fetchStories,
        selectedStoryGroup,
        setSelectedStoryGroup,
        closeStory,
        nextStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => useContext(StoryContext);

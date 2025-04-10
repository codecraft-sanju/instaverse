import { useEffect, useRef } from "react";
import { useStory } from "../context/StoryContext";

const StoryViewer = () => {
  const { selectedStoryGroup, closeStory, nextStory } = useStory();

  // Timer reference for auto-progress
  const timerRef = useRef(null);

  // Progress bar reference
  const progressRef = useRef(null);

  // Get the current story being shown
  const currentStory =
    selectedStoryGroup?.stories[selectedStoryGroup.currentIndex];

  // Run effect whenever the current story changes
  useEffect(() => {
    if (!currentStory) return;

    // If story is an image, auto-play with progress animation
    if (currentStory.type === "image") {
      // Reset progress bar
      progressRef.current.style.width = "0%";

      // Start progress animation after slight delay
      setTimeout(() => {
        progressRef.current.style.transition = "width 5s linear";
        progressRef.current.style.width = "100%";
      }, 50);

      // Move to next story after 5 seconds
      timerRef.current = setTimeout(() => {
        nextStory();
      }, 5000);
    }

    // Cleanup timer and reset progress bar when story changes or unmounts
    return () => {
      clearTimeout(timerRef.current);
      if (progressRef.current) {
        progressRef.current.style.transition = "none";
        progressRef.current.style.width = "0%";
      }
    };
  }, [currentStory, nextStory]);

  // If no story is selected, return nothing
  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Top progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
        <div
          ref={progressRef}
          className="h-full bg-white transition-all duration-5000 ease-linear"
          style={{ width: "0%" }}
        />
      </div>

      {/* Close button */}
      <button
        onClick={closeStory}
        className="absolute top-4 right-4 text-white text-3xl z-50"
      >
        ×
      </button>

      {/* Story content */}
      <div className="w-full h-full max-w-md relative flex items-center justify-center">
        {currentStory.type === "image" ? (
          // Display image story
          <img
            src={currentStory.fileUrl}
            alt="story"
            className="object-contain max-h-full max-w-full"
          />
        ) : (
          // Display video story
          <video
            src={currentStory.fileUrl}
            autoPlay
            muted
            controls
            className="object-contain max-h-full max-w-full"
          />
        )}

        {/* Username display */}
        <p className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-40 px-3 py-1 rounded-full">
          @{currentStory.user.username}
        </p>
      </div>
    </div>
  );
};

export default StoryViewer;

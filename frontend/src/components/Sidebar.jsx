import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Search,
  Compass,
  Video,
  MessageCircle,
  Heart,
  Plus,
  BarChart,
  User,
  Menu,
  LogOut,
  Settings,
  Camera,
  Image as Gallery,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { usePost } from '../context/PostContext';

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const { logoutUser } = useUser();
  const { createPost } = usePost();

  const handleModalChange = () => setIsModalOpen((prev) => !prev);
  const handleCreateModalChange = () => setIsCreateModalOpen((prev) => !prev);

  const resetCreateModal = () => {
    setCaption('');
    setLoading(false);
    setIsCreateModalOpen(false);
    setIsCameraOpen(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      await createPost(file, caption);
      resetCreateModal();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      setLoading(true);
      try {
        await createPost(blob, caption);
        resetCreateModal();
      } catch (error) {
        console.error('Error creating post:', error);
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg');
  };

  const menuItems = [
    { icon: Home, label: 'Home', link: '/' },
    { icon: Search, label: 'Search', link: '/search' },
    { icon: Compass, label: 'Explore', link: '/explore' },
    { icon: Video, label: 'Reels', link: '/reels' },
    { icon: MessageCircle, label: 'Messages', link: '/messages' },
    { icon: Heart, label: 'Notifications', link: '/notifications' },
    {
      icon: Plus,
      label: 'Create',
      link: '#',
      onClick: handleCreateModalChange,
    },
    { icon: BarChart, label: 'Dashboard', link: '/dashboard' },
    { icon: User, label: 'Profile', link: '/profile' },
  ];

  return (
    <div
      className={`flex flex-col z-10 h-screen bg-black text-white p-4 fixed top-0 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-72' : 'w-20 items-center'}
      `}
    >
      <div className="flex items-center justify-between mb-6 w-full">
        {isSidebarOpen ? (
          <h1 className="font-mono text-2xl">Instagram</h1>
        ) : (
          <Camera size={26} />
        )}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? (
            <ChevronLeft size={24} />
          ) : (
            <ChevronRight size={24} />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col flex-grow justify-between w-full">
        <div className="flex flex-col gap-2">
          {menuItems.map(({ icon: Icon, label, link, onClick }) => (
            <Link
              to={link}
              key={label}
              onClick={onClick}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-300/20 transition-all"
            >
              <Icon size={24} />
              {isSidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </div>

        {/* More */}
        <div
          className="relative hover:bg-gray-300/20 p-2 rounded-lg cursor-pointer flex items-center gap-3 mt-4"
          onClick={handleModalChange}
        >
          <Menu size={24} />
          {isSidebarOpen && <span>More</span>}
          {isModalOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-52 bg-gray-900 text-white rounded-lg shadow-lg py-2 z-50">
              <button className="flex items-center gap-3 p-3 w-full hover:bg-gray-700">
                <Settings size={20} />
                <span>Settings</span>
              </button>
              <button
                onClick={logoutUser}
                className="flex items-center gap-3 p-3 w-full hover:bg-gray-700"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="absolute left-2 bottom-60 w-64 bg-gray-900 text-white rounded-lg shadow-lg py-3 px-4 z-50">
          {loading ? (
            <div className="flex justify-center items-center p-3">
              <Loader2 className="animate-spin" size={24} />
              <span className="ml-2">Uploading...</span>
            </div>
          ) : (
            <>
              <textarea
                placeholder="Write a caption..."
                className="w-full p-2 mb-2 rounded bg-gray-800 text-white resize-none outline-none"
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <button className="flex items-center gap-3 p-2 w-full hover:bg-gray-700 rounded">
                <label className="cursor-pointer flex items-center gap-3 w-full">
                  <Gallery size={20} />
                  <span>Gallery</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </button>
              <button
                onClick={openCamera}
                className="flex items-center gap-3 p-2 w-full hover:bg-gray-700 rounded"
              >
                <Camera size={20} />
                <span>Camera</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white p-4 rounded-lg shadow-lg flex flex-col items-center z-50">
          <video ref={videoRef} autoPlay className="w-64 h-48 rounded-lg" />
          <canvas ref={canvasRef} className="hidden" />
          <textarea
            placeholder="Write a caption..."
            className="w-full mt-3 p-2 rounded bg-gray-800 text-white resize-none outline-none"
            rows={2}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button
            onClick={capturePhoto}
            className="mt-3 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
          >
            Capture & Post
          </button>
          <button
            onClick={() => setIsCameraOpen(false)}
            className="mt-2 text-red-500"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

import React from "react";
import { ArrowLeft } from "lucide-react";

const Messages = ({ onClose }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white ml-72">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-700">
        <ArrowLeft size={24} className="cursor-pointer mr-4" onClick={onClose} />
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto">
        
        <p className="text-gray-400">No new messages</p>
      </div>
    </div>
  );
};

export default Messages;

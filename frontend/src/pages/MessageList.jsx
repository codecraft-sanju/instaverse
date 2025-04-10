import React, { useState } from "react";
import { X, Phone, Info } from "lucide-react";

const messagesList = [
  { username: "Chirag__", lastMessage: "Reacted 😍 to your message" },
  { username: "Rahul_parihar", lastMessage: "Liked a message" },
  { username: "Sneh Patel", lastMessage: "Send your resume..." },
];

const MessageUI = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-700 overflow-y-auto">
        <h2 className="p-4 text-xl font-semibold">Messages</h2>
        {messagesList.map((chat, index) => (
          <div
            key={index}
            onClick={() => setSelectedChat(chat)}
            className="flex items-center p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-700"
          >
            <div className="w-10 h-10 bg-gray-700 rounded-full" />
            <div className="ml-3">
              <p className="font-semibold">{chat.username}</p>
              <p className="text-sm text-gray-400">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full" />
                <p className="text-lg font-semibold">{selectedChat.username}</p>
              </div>
              <div className="flex gap-3">
                <Phone className="cursor-pointer" />
                <Info className="cursor-pointer" />
                <X
                  className="cursor-pointer"
                  onClick={() => setSelectedChat(null)}
                />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">{/* Messages will go here */}</div>

            {/* Input Field */}
            <div className="p-4 border-t border-gray-700 flex items-center">
              <input
                type="text"
                placeholder="Message..."
                className="flex-1 p-2 bg-gray-800 rounded-full focus:outline-none"
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-400">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageUI;

import React from 'react';
import { Dialog } from '@headlessui/react';

const FollowersModal = ({ isOpen, onClose, title, users }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-black text-white p-6 shadow-lg">
          <Dialog.Title className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
            {title}
          </Dialog.Title>

          <div className="max-h-96 overflow-y-auto space-y-4">
            {users?.length === 0 ? (
              <p className="text-gray-400 text-sm">No users found</p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 border-b border-gray-800 pb-3"
                >
                  <img
                    src={user.profilePicture?.url || 'default-profile.png'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-gray-400">{user.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-800 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FollowersModal;

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useChatBlock } from "@/hooks/useChatBlock";

export const BlockChatModal = ({ 
  isOpen, 
  onClose, 
  userToBlock, 
  chatId,
  onSuccess 
}) => {
  const [reason, setReason] = useState("");
  const { blockChat, loading, error } = useChatBlock();

  const handleBlockChat = async () => {
    if (!userToBlock?.user?.id || !chatId) {
      return;
    }

    try {
      await blockChat(userToBlock.user.id, chatId, reason || null);
      onSuccess?.();
      onClose();
      // Reset form
      setReason("");
    } catch (err) {
      // Error is handled by the hook
      console.error("Failed to block chat:", err);
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Icon 
              icon="mdi:message-off" 
              className="text-orange-600" 
              width={24} 
              height={24} 
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Block Chat
            </h2>
            <p className="text-gray-600">
              This will prevent this user from sending you messages
            </p>
          </div>
        </div>

        {userToBlock && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {userToBlock.clientProfile?.profileImage ? (
                <Image
                  src={userToBlock.clientProfile.profileImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <Icon icon="mdi:account" className="text-gray-600" width={20} height={20} />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {userToBlock.clientProfile?.firstName} {userToBlock.clientProfile?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {userToBlock.user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for blocking chat (optional)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter a reason for blocking chat..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {reason.length}/500 characters
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:information" className="text-blue-600 mt-0.5" width={20} height={20} />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  What happens when you block chat?
                </h3>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li>• They cannot send you messages</li>
                  <li>• They can still see your profile and request coaching</li>
                  <li>• You can unblock chat at any time</li>
                  <li>• This only affects messaging, not other interactions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={handleBlockChat}
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Blocking..." : "Block Chat"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}; 
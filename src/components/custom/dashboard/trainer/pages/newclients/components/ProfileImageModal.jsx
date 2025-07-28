import { Icon } from "@iconify/react";
import Image from "next/image";

import { Modal } from "@/components/common/Modal";

export const ProfileImageModal = ({ isOpen, onClose, profileImage }) => {
  if (!profileImage) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      footerButtons={false}
      title={
        <div className="flex items-center gap-2">
          <Icon
            icon="mdi:account"
            className="text-[#FF7800]"
            width={24}
            height={24}
          />
          <span>Profile Photo</span>
        </div>
      }
      hideButtons={true}
    >
      <div className="flex justify-center items-center w-full h-[70vh]">
        {profileImage.url ? (
          <div
            className="relative rounded-2xl overflow-hidden border-4 border-[#FF7800]/30 shadow-2xl bg-zinc-900/70"
            style={{
              width: "min(600px, 90vw)",
              height: "min(600px, 70vh)",
            }}
          >
            <Image
              src={profileImage.url}
              alt={profileImage.name}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 90vw, 600px"
              priority
            />
          </div>
        ) : (
          <div className="flex h-[300px] w-[300px] items-center justify-center bg-gradient-to-br from-[#FF7800] to-[#FF9A00] rounded-2xl border-4 border-[#FF7800]/30 shadow-2xl">
            <Icon icon="mdi:account" width={128} height={128} color="white" />
          </div>
        )}
      </div>
      <p className="text-center text-zinc-400 mt-4 font-medium">
        {profileImage.name}
      </p>
    </Modal>
  );
};

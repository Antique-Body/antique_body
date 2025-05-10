import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";

/**
 * EmptyState component for when there are no client requests
 */
export const EmptyState = ({ onInviteClick }) => (
    <div className="bg-[rgba(20,20,20,0.5)] border border-[#222]/70 rounded-xl p-8 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="bg-[rgba(30,30,30,0.6)] rounded-full p-4 mb-2">
                <Icon icon="mdi:account-multiple-outline" className="text-gray-400" width={32} height={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-300">No client requests found</h3>
            <p className="text-sm text-gray-400 mb-4">Invite clients to start growing your business</p>
            <Button variant="orangeFilled" size="small" onClick={onInviteClick}>
                <div className="flex items-center gap-1.5">
                    <Icon icon="mdi:account-plus" width={16} height={16} />
                    <span>Invite Clients</span>
                </div>
            </Button>
        </div>
    </div>
);

export default EmptyState;

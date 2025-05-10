import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";

/**
 * Header component for the new clients page
 * Contains the page title and invite button
 */
export const Header = ({ onInviteClick }) => (
    <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Client Requests</h1>

        <Button
            variant="orangeFilled"
            size="default"
            className="flex items-center justify-center gap-1.5 px-4 py-2 shadow-lg"
            onClick={onInviteClick}
        >
            <Icon icon="mdi:account-plus" width={18} height={18} />
            <span className="font-medium">Invite Client</span>
        </Button>
    </div>
);

export default Header;

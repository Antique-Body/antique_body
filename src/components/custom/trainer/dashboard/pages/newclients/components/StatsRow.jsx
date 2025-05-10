import { Icon } from "@iconify/react";

/**
 * StatsRow component that displays statistics about client requests
 */
export const StatsRow = ({ pendingCount, acceptedCount, weeklyCount }) => (
    <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-[rgba(30,30,30,0.5)] to-[rgba(20,20,20,0.5)] border border-[#333]/50 rounded-xl px-4 py-3 flex items-center gap-3 shadow-md">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center bg-[#FF6B00]/10">
                <Icon icon="mdi:account-clock" className="text-[#FF6B00]" width={22} height={22} />
            </div>
            <div>
                <p className="text-xs text-gray-400">Pending</p>
                <p className="text-xl font-semibold">{pendingCount}</p>
            </div>
        </div>

        <div className="bg-gradient-to-br from-[rgba(30,30,30,0.5)] to-[rgba(20,20,20,0.5)] border border-[#333]/50 rounded-xl px-4 py-3 flex items-center gap-3 shadow-md">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center bg-green-500/10">
                <Icon icon="mdi:account-check" className="text-green-500" width={22} height={22} />
            </div>
            <div>
                <p className="text-xs text-gray-400">Accepted</p>
                <p className="text-xl font-semibold">{acceptedCount}</p>
            </div>
        </div>

        <div className="bg-gradient-to-br from-[rgba(30,30,30,0.5)] to-[rgba(20,20,20,0.5)] border border-[#333]/50 rounded-xl px-4 py-3 flex items-center gap-3 shadow-md">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center bg-blue-500/10">
                <Icon icon="mdi:calendar-week" className="text-blue-500" width={22} height={22} />
            </div>
            <div>
                <p className="text-xs text-gray-400">This Week</p>
                <p className="text-xl font-semibold">{weeklyCount}</p>
            </div>
        </div>
    </div>
);

export default StatsRow;

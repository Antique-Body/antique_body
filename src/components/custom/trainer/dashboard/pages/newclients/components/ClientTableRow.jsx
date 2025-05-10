import { Icon } from "@iconify/react";
import Image from "next/image";

import { Button } from "@/components/common/Button";

/**
 * ClientTableRow component displays a single client row
 * This will be used as a render function for the Table component
 */
export const ClientTableRow = ({ client, isAccepted, onAcceptClick, onDeclineClick, onMessageClick, _onRowClick }) => (
    <>
        {/* Mobile status indicator - visible only on small screens */}
        <div className="md:hidden absolute top-3 right-3">
            {isAccepted ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                    <Icon icon="mdi:check" className="text-green-400" width={12} height={12} />
                </div>
            ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20">
                    <Icon icon="mdi:clock-outline" className="text-[#FF6B00]" width={12} height={12} />
                </div>
            )}
        </div>

        {/* Client column */}
        <div className="md:col-span-3 flex items-center space-x-3 pt-2 md:pt-0" onClick={(e) => e.stopPropagation()}>
            {/* Status indicator - hidden on mobile, visible on md and up */}
            <div className="hidden md:flex">
                {isAccepted ? (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                        <Icon icon="mdi:check" className="text-green-400" width={14} height={14} />
                    </div>
                ) : (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20">
                        <Icon icon="mdi:clock-outline" className="text-[#FF6B00]" width={14} height={14} />
                    </div>
                )}
            </div>

            {/* Profile image */}
            <div className="relative h-12 w-12 md:h-10 md:w-10 flex-shrink-0">
                <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-[#333] group-hover:border-[#FF6B00] transition-colors duration-200">
                    <Image
                        src={client.imageUrl}
                        alt={client.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 48px, 40px"
                    />
                </div>
            </div>

            {/* Name and date */}
            <div className="min-w-0">
                <div className="truncate font-medium text-sm md:group-hover:text-[#FF6B00]">{client.name}</div>
                <div className="flex items-center text-xs text-gray-400">
                    <Icon icon="mdi:calendar" width={12} height={12} className="mr-1" />
                    <span>{client.requestDate}</span>
                </div>
            </div>
        </div>

        {/* Plan & Location column */}
        <div className="md:col-span-2 flex flex-col md:block">
            <div className="flex items-center mb-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FF6B00]/10 mr-1.5">
                    <Icon icon="mdi:clipboard-text-outline" className="text-[#FF6B00]" width={12} height={12} />
                </div>
                <span className="text-xs font-medium truncate">{client.plan}</span>
            </div>
            <div className="flex items-center">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 mr-1.5">
                    <Icon icon="mdi:map-marker" className="text-blue-400" width={12} height={12} />
                </div>
                <span className="text-xs text-gray-400 truncate">{client.location}</span>
            </div>
        </div>

        {/* Goals column - improved design */}
        <div className="md:col-span-4 relative group/goals">
            <div className="flex items-center mb-1.5 md:mb-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FF6B00]/10 mr-1.5">
                    <Icon icon="mdi:target" className="text-[#FF6B00]" width={12} height={12} />
                </div>
                <span className="text-xs font-medium text-gray-300">Goals</span>
            </div>

            <div className="text-xs bg-gradient-to-br from-[rgba(30,30,30,0.7)] to-[rgba(20,20,20,0.7)] rounded-md py-2.5 px-3.5 h-14 overflow-hidden border border-[#333]/40 relative transition-all duration-200 group-hover/goals:border-[#FF6B00]/30 group-hover/goals:from-[rgba(35,35,35,0.8)] group-hover/goals:to-[rgba(25,25,25,0.8)] group-hover/goals:shadow-md group-hover/goals:shadow-[#FF6B00]/5">
                <div className="line-clamp-2 group-hover/goals:line-clamp-none text-gray-200 group-hover/goals:text-white relative z-10">
                    {client.goals}
                </div>

                {/* Subtle accent decoration */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#FF6B00]/50 to-[#FF6B00]/10 rounded-l"></div>

                {/* Show gradient overlay and expand button on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(25,25,25,0.9)] to-transparent opacity-0 group-hover/goals:opacity-100 flex items-end justify-center pb-1 transition-all duration-300 pointer-events-none">
                    <div className="bg-[#333] rounded-full px-2.5 py-0.5 text-[10px] text-gray-300 shadow-sm border border-[#444]/30 flex items-center gap-1">
                        <Icon icon="mdi:eye-outline" width={10} height={10} className="text-[#FF6B00]" />
                        <span>View complete</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Stats column - Condensed for better space usage */}
        <div className="md:col-span-1 hidden md:block">
            <div className="flex flex-col gap-1">
                <div className="flex items-center">
                    <Icon icon="mdi:human-male-height" className="text-green-400 mr-1" width={11} height={11} />
                    <span className="text-xs text-gray-400 truncate">{client.height}</span>
                </div>
                <div className="flex items-center">
                    <Icon icon="mdi:weight" className="text-purple-400 mr-1" width={11} height={11} />
                    <span className="text-xs text-gray-400 truncate">{client.weight}</span>
                </div>
            </div>
        </div>

        {/* Actions column - Accept/Decline buttons */}
        <div className="md:col-span-2 flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            {!isAccepted ? (
                <>
                    <Button
                        variant="subtle"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeclineClick && onDeclineClick(client);
                        }}
                        className="bg-[rgba(30,30,30,0.5)] hover:bg-red-500/10 hover:text-red-400 transition-colors px-2.5"
                    >
                        <div className="flex items-center justify-center gap-1">
                            <Icon icon="mdi:close" width={14} height={14} />
                            <span className="text-xs">Decline</span>
                        </div>
                    </Button>

                    <Button
                        variant="orangeFilled"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAcceptClick && onAcceptClick(client);
                        }}
                        className="px-2.5"
                    >
                        <div className="flex items-center justify-center gap-1">
                            <Icon icon="mdi:check" width={14} height={14} />
                            <span className="text-xs">Accept</span>
                        </div>
                    </Button>
                </>
            ) : (
                <Button
                    variant="subtle"
                    size="xs"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMessageClick && onMessageClick(client);
                    }}
                    className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-3"
                >
                    <div className="flex items-center justify-center gap-1">
                        <Icon icon="mdi:message-text-outline" width={14} height={14} />
                        <span className="text-xs">Message</span>
                    </div>
                </Button>
            )}
        </div>

        {/* Mobile-only preference info - Shown only on small screens */}
        <div className="flex md:hidden items-center text-xs text-gray-400 mt-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/10 mr-1.5">
                <Icon icon="mdi:laptop-account" className="text-purple-400" width={12} height={12} />
            </div>
            <span className="truncate">{client.preference}</span>
            <span className="mx-2">•</span>
            <span>
                {client.height} / {client.weight}
            </span>
        </div>
    </>
);

export default ClientTableRow;

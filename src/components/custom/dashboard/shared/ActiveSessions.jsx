import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export const ActiveSessions = ({
  sessions = [],
  onTerminateSession,
  onTerminateAll,
  loading = false,
}) => {
  const getDeviceIcon = (device) => {
    if (device.includes("iPhone") || device.includes("iPad"))
      return "mdi:cellphone";
    if (device.includes("MacBook")) return "mdi:laptop";
    return "mdi:desktop-tower";
  };

  return (
    <Card variant="darkStrong" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:devices" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Active Sessions</h3>
        </div>
        <Button
          onClick={onTerminateAll}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
        >
          Terminate All Others
        </Button>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon
                  icon={getDeviceIcon(session.device)}
                  className="text-[#FF6B00] w-6 h-6"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      {session.device}
                    </span>
                    {session.current && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {session.browser} • {session.location} • {session.ip}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Last active: {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button
                  onClick={() => onTerminateSession(session.id)}
                  disabled={loading}
                  className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  Terminate
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

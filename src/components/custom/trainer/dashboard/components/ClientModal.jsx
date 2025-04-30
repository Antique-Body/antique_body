import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";

export const ClientModal = ({ client, setShowClientModal }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[#333] bg-[#111] p-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-lg font-bold text-white">
            {client?.name
              ?.split(" ")
              .map(n => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="text-xl font-bold">{client?.name}</h3>
            <p className="text-sm text-gray-400">{client?.email}</p>
          </div>
        </div>

        <Button variant="ghost" onClick={() => setShowClientModal(false)} className="text-gray-400 hover:text-white">
          <CloseXIcon size={24} />
        </Button>
      </div>

      {/* Content will be filled based on the selected client */}
      <div className="space-y-6">
        <div className="rounded-lg bg-[rgba(20,20,20,0.5)] p-4">
          <h4 className="mb-3 text-lg font-medium">Personal Details</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-400">Age</p>
              <p>{client?.age || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Height</p>
              <p>{client?.height || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Weight</p>
              <p>{client?.weight || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Experience</p>
              <p>{client?.experience || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Member Since</p>
              <p>{client?.joinDate || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <p className={client?.status === "active" ? "text-green-500" : "text-yellow-500"}>
                {client?.status || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-[rgba(20,20,20,0.5)] p-4">
          <h4 className="mb-3 text-lg font-medium">Training Plan</h4>
          <p className="font-medium text-[#FF6B00]">{client?.plan || "No plan assigned"}</p>
          <p className="mt-2 text-sm">{client?.planDescription || ""}</p>

          <div className="mt-4 flex justify-end">
            <Button variant="orangeFilled">Change Plan</Button>
          </div>
        </div>

        <div className="rounded-lg bg-[rgba(20,20,20,0.5)] p-4">
          <h4 className="mb-3 text-lg font-medium">Session History</h4>
          {client?.sessions?.length > 0 ? (
            <div className="space-y-3">
              {client.sessions.map((session, index) => (
                <div key={index} className="rounded-lg bg-[rgba(40,40,40,0.7)] p-3">
                  <div className="flex justify-between">
                    <p className="font-medium">{session.date}</p>
                    <p className="text-sm text-gray-400">{session.duration}</p>
                  </div>
                  <p className="mt-1 text-sm">{session.focus}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No sessions recorded</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline">Send Message</Button>
          <Button variant="orangeFilled">Schedule Session</Button>
        </div>
      </div>
    </div>
  </div>
);

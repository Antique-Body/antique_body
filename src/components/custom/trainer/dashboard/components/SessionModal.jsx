import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";

export const SessionModal = ({ session, closeSessionModal }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#333] bg-[#111] p-6">
      <div className="mb-6 flex items-start justify-between">
        <h3 className="text-xl font-bold">Session Details</h3>

        <Button
          variant="ghost"
          onClick={closeSessionModal}
          className="p-0 text-gray-400 transition-colors duration-300 hover:text-white"
        >
          <CloseXIcon size={24} />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg bg-[rgba(20,20,20,0.5)] p-4">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-lg font-bold text-white">
              {session?.clientName
                ?.split(" ")
                .map(n => n[0])
                .join("")}
            </div>
            <div>
              <h4 className="text-lg font-medium">{session?.clientName}</h4>
              <div className="flex items-center text-sm">
                <span
                  className={`mr-2 inline-block h-2 w-2 rounded-full ${
                    session?.status === "confirmed"
                      ? "bg-green-500"
                      : session?.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                ></span>
                <span className="capitalize text-gray-300">{session?.status}</span>
              </div>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p className="font-medium">{session?.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Time</p>
              <p className="font-medium">{session?.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Type</p>
              <p className="font-medium">{session?.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Location</p>
              <p className="font-medium">{session?.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Payment</p>
              <p className={`font-medium ${session?.paid ? "text-green-500" : "text-red-500"}`}>
                {session?.paid ? "Paid" : "Unpaid"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-[rgba(20,20,20,0.5)] p-4">
          <h4 className="mb-3 text-lg font-medium">Session Focus</h4>
          <p className="mb-2 font-medium text-[#FF6B00]">{session?.focus}</p>

          <h4 className="mb-2 mt-4 text-lg font-medium">Notes</h4>
          <p className="text-sm">{session?.notes}</p>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-gray-400">Add Session Notes</label>
            <textarea
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] p-3 text-white"
              rows="4"
              placeholder="Enter session notes, observations, or follow-up tasks..."
            ></textarea>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            className="px-4 py-2 text-[#FF6B00] transition-all duration-300 hover:bg-[rgba(255,107,0,0.1)]"
          >
            Reschedule
          </Button>
          <Button variant="orangeFilled" className="px-4 py-2 transition-all duration-300">
            Complete Session
          </Button>
        </div>
      </div>
    </div>
  </div>
);

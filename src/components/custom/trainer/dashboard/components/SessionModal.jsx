import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";

export const SessionModal = ({ session, closeSessionModal }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#111] border border-[#333] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold">Session Details</h3>

                    <Button
                        variant="ghost"
                        onClick={closeSessionModal}
                        className="text-gray-400 hover:text-white transition-colors duration-300 p-0"
                    >
                        <CloseXIcon size={24} />
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="p-4 bg-[rgba(20,20,20,0.5)] rounded-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex justify-center items-center text-white font-bold text-lg">
                                {session?.clientName
                                    ?.split(" ")
                                    .map(n => n[0])
                                    .join("")}
                            </div>
                            <div>
                                <h4 className="text-lg font-medium">{session?.clientName}</h4>
                                <div className="flex items-center text-sm">
                                    <span
                                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                            session?.status === "confirmed"
                                                ? "bg-green-500"
                                                : session?.status === "pending"
                                                  ? "bg-yellow-500"
                                                  : "bg-red-500"
                                        }`}
                                    ></span>
                                    <span className="text-gray-300 capitalize">{session?.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-gray-400 text-sm">Date</p>
                                <p className="font-medium">{session?.date}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Time</p>
                                <p className="font-medium">{session?.time}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Type</p>
                                <p className="font-medium">{session?.type}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Location</p>
                                <p className="font-medium">{session?.location}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Payment</p>
                                <p className={`font-medium ${session?.paid ? "text-green-500" : "text-red-500"}`}>
                                    {session?.paid ? "Paid" : "Unpaid"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-[rgba(20,20,20,0.5)] rounded-lg">
                        <h4 className="text-lg font-medium mb-3">Session Focus</h4>
                        <p className="text-[#FF6B00] font-medium mb-2">{session?.focus}</p>

                        <h4 className="text-lg font-medium mb-2 mt-4">Notes</h4>
                        <p className="text-sm">{session?.notes}</p>

                        <div className="mt-4">
                            <label className="text-gray-400 text-sm block mb-2">Add Session Notes</label>
                            <textarea
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white"
                                rows="4"
                                placeholder="Enter session notes, observations, or follow-up tasks..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            className="py-2 px-4 text-[#FF6B00] transition-all duration-300 hover:bg-[rgba(255,107,0,0.1)]"
                        >
                            Reschedule
                        </Button>
                        <Button variant="orangeFilled" className="py-2 px-4 transition-all duration-300">
                            Complete Session
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

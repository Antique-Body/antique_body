import { Card } from "@/components/custom/Card";

export const ProgramHeader = ({ program }) => (
    <Card variant="darkStrong" width="100%" maxWidth="none">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Your Training Program</h2>
        <span className="rounded-lg border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-3 py-1 text-sm font-medium text-[#FF6B00]">
          {program.name}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap text-sm">
        <div className="mb-2 mr-6">
          <span className="text-gray-400">Coach:</span>
          <span className="ml-1 text-white">{program.coach}</span>
        </div>
        <div className="mb-2 mr-6">
          <span className="text-gray-400">Start Date:</span>
          <span className="ml-1 text-white">{program.startDate}</span>
        </div>
        <div className="mb-2">
          <span className="text-gray-400">End Date:</span>
          <span className="ml-1 text-white">{program.endDate}</span>
        </div>
      </div>

      <div className="mb-2">
        <div className="mb-1 flex justify-between text-sm">
          <span>Program Progress</span>
          <span>{Math.round((program.progress.completedSessions / program.progress.totalSessions) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#333]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
            style={{
              width: `${(program.progress.completedSessions / program.progress.totalSessions) * 100}%`,
            }}
          ></div>
        </div>
        <p className="mt-1 text-xs text-gray-400">Next milestone: {program.progress.nextMilestone}</p>
      </div>
    </Card>
  ); 
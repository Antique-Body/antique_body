import { PerformanceMetrics } from "./PerformanceMetrics";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { ProgressChartIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const ProgressTrackingCard = ({
    weight,
    bodyFat,
    activeMetric,
    progress,
    newMeasurements,
    performanceFields,
    onWeightChange,
    onBodyFatChange,
    onActiveMetricChange,
    onMeasurementChange,
    onProgressUpdate,
    onMetricAdd,
    clientType,
    clientGoal,
}) => (
        <Card variant="darkStrong" width="100%" maxWidth="none">
            <h3 className="mb-4 flex items-center text-xl font-semibold">
                <ProgressChartIcon size={20} stroke="#FF6B00" className="mr-2" />
                Progress Tracking
            </h3>

            <form className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3" onSubmit={onProgressUpdate}>
                <FormField
                    type="number"
                    placeholder="Weight (kg)"
                    value={weight}
                    onChange={(e) => onWeightChange(e.target.value)}
                    className="mb-0"
                    min="0"
                    step="0.1"
                />
                <FormField
                    type="number"
                    placeholder="Body Fat (%)"
                    value={bodyFat}
                    onChange={(e) => onBodyFatChange(e.target.value)}
                    className="mb-0"
                    min="0"
                    step="0.1"
                />

                {/* Dynamic performance metrics based on client type */}
                {activeMetric ? (
                    <FormField
                        type="number"
                        placeholder={performanceFields.find((f) => f.id === activeMetric)?.label || activeMetric}
                        value={newMeasurements[activeMetric] || ""}
                        onChange={(e) => onMeasurementChange(activeMetric, e.target.value)}
                        className="mb-0"
                        step="0.1"
                    />
                ) : (
                    <FormField
                        type="select"
                        value={activeMetric}
                        onChange={(e) => onActiveMetricChange(e.target.value)}
                        options={[
                            { value: "", label: "Select Metric" },
                            ...performanceFields.map((field) => ({
                                value: field.id,
                                label: field.label,
                            })),
                        ]}
                        className="mb-0"
                    />
                )}

                <Button type="submit" variant="orangeFilled" className="md:col-span-2 lg:col-span-3">
                    Add Progress Entry
                </Button>
            </form>

            {/* Client performance metrics visualization */}
            <PerformanceMetrics clientType={clientType} clientGoal={clientGoal} progress={progress} onMetricAdd={onMetricAdd} />

            {/* Progress history table */}
            <div className="mt-6">
                <h4 className="mb-3 font-medium">Progress History</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#333] text-gray-400">
                                <th className="px-2 py-2 text-left">Date</th>
                                <th className="px-2 py-2 text-left">Weight (kg)</th>
                                <th className="px-2 py-2 text-left">Body Fat (%)</th>

                                {/* Dynamic headers based on client type */}
                                {performanceFields
                                    .filter((field) => progress.some((entry) => entry[field.id] !== undefined))
                                    .map((field) => (
                                        <th key={field.id} className="px-2 py-2 text-left">
                                            {field.label}
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...progress].reverse().map((entry, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? "bg-[rgba(30,30,30,0.3)]" : ""}>
                                    <td className="px-2 py-2">{entry.date}</td>
                                    <td className="px-2 py-2">{entry.weight ?? "-"}</td>
                                    <td className="px-2 py-2">{entry.bodyFat ?? "-"}</td>

                                    {/* Dynamic cells based on client type */}
                                    {performanceFields
                                        .filter((field) => progress.some((entry) => entry[field.id] !== undefined))
                                        .map((field) => (
                                            <td key={field.id} className="px-2 py-2">
                                                {entry[field.id] !== undefined ? entry[field.id] : "-"}
                                            </td>
                                        ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );

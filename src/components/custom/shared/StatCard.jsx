import React from "react";

import { Card } from "@/components";

export const StatCard = ({ label, value, subtext }) => (
  <Card variant="dark" className="!rounded-xl" hover={true} width="100%" maxWidth="none">
    <p className="mb-1 text-xs text-gray-400">{label}</p>
    <p className="text-lg font-bold">{value}</p>
    {subtext && <p className="text-xs text-gray-300">{subtext}</p>}
  </Card>
);

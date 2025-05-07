"use client";

import { Card } from "@/components/custom/Card";
import { useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

export const WeeklyProgressChart = ({ data, measurement = "weight", unit = "kg", title = "Progress Chart" }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation effect when measurement changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [measurement]);

  // Extract relevant data for the selected measurement
  const chartData = data.map(entry => ({
    date: entry.date,
    value: parseFloat(entry[measurement]) || 0
  })).reverse(); // Reverse to show oldest to newest

  // Calculate change from first to last
  const totalChange = chartData.length > 1 
    ? (chartData[chartData.length - 1].value - chartData[0].value).toFixed(1) 
    : 0;
  
  // Calculate if positive trend (decreasing for weight/fat, increasing for muscle)
  const isPositiveTrend = (measurement === 'weight' || measurement === 'bodyFat' || measurement === 'waist') 
    ? totalChange < 0 
    : totalChange > 0;

  // Determine gradient and labels based on measurement
  const getGradient = () => {
    switch(measurement) {
      case 'weight': return ['#FF6B00', '#FF9A00'];
      case 'bodyFat': return ['#3B82F6', '#60A5FA'];
      case 'chest': return ['#8B5CF6', '#A78BFA'];
      case 'waist': return ['#EF4444', '#F87171'];
      case 'hips': return ['#EC4899', '#F472B6'];
      case 'thighs': return ['#10B981', '#34D399'];
      case 'arms': return ['#6366F1', '#818CF8'];
      default: return ['#FF6B00', '#FF9A00'];
    }
  };

  const getMeasurementLabel = () => {
    switch(measurement) {
      case 'weight': return 'Weight';
      case 'bodyFat': return 'Body Fat';
      case 'chest': return 'Chest';
      case 'waist': return 'Waist';
      case 'hips': return 'Hips';
      case 'thighs': return 'Thighs';
      case 'arms': return 'Arms';
      default: return measurement;
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#222] p-3 rounded-lg border border-[#333] shadow-lg">
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-sm font-medium">
            {payload[0].value} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  const [gradientStart, gradientEnd] = getGradient();

  return (
    <Card 
      variant="dark" 
      width="100%" 
      maxWidth="none" 
      className={`transition-all duration-300 ${isAnimating ? 'scale-[1.02] shadow-lg shadow-[rgba(255,107,0,0.1)]' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{title || `${getMeasurementLabel()} Progression`}</h3>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`}>
            {totalChange > 0 ? '+' : ''}{totalChange} {unit}
          </span>
          <span className="text-xs text-gray-400">total change</span>
        </div>
      </div>
      
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientStart} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={gradientEnd} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#666', fontSize: 12 }}
              tickLine={{ stroke: '#333' }}
              axisLine={{ stroke: '#333' }}
            />
            <YAxis 
              tick={{ fill: '#666', fontSize: 12 }}
              tickLine={{ stroke: '#333' }}
              axisLine={{ stroke: '#333' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={gradientStart}
              strokeWidth={2}
              fill="url(#areaGradient)"
              activeDot={{ r: 4, fill: gradientStart }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {chartData.length <= 1 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-400 text-sm">Need more data points for trend analysis</p>
        </div>
      )}
    </Card>
  );
}; 
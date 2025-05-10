"use client";

import Image from "next/image";
import { useEffect, useState } from 'react';

import { Card } from "@/components/custom/Card";

export const BodyMeasurementsVisual = ({ measurements, previousMeasurements = null, highlightedMeasurement = null }) => {
  const [animatingPart, setAnimatingPart] = useState(null);

  // Effect to handle animation when highlighted measurement changes
  useEffect(() => {
    if (highlightedMeasurement) {
      setAnimatingPart(highlightedMeasurement);
      const timer = setTimeout(() => setAnimatingPart(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [highlightedMeasurement]);

  // Function to calculate change and determine if it's positive
  const calculateChange = (current, previous, metric) => {
    if (!previous || previous[metric] === undefined || previous[metric] === "") return null;
    
    const change = (parseFloat(current) - parseFloat(previous[metric])).toFixed(1);
    
    // For waist, smaller is better; for others like chest/arms, bigger is better
    const isPositive = metric === "waist" || metric === "hips" 
      ? change < 0 
      : change > 0;
      
    return {
      value: change,
      isPositive
    };
  };

  // Get highlighted status
  const isHighlighted = (part) => part === highlightedMeasurement;

  // Create an array of all measurements for easy display
  const measurementDetails = [
    {
      id: 'chest',
      label: 'Chest',
      value: measurements.chest,
      colorClass: 'bg-blue-500',
      activeClass: 'bg-blue-400 shadow-blue-500/50',
      textActiveClass: 'text-blue-400',
      position: 'top-[32%] left-1/2 -translate-x-1/2',
      lineWidth: 'w-40',
      change: calculateChange(measurements.chest, previousMeasurements, "chest")
    },
    {
      id: 'waist',
      label: 'Waist',
      value: measurements.waist,
      colorClass: 'bg-red-500',
      activeClass: 'bg-red-400 shadow-red-500/50',
      textActiveClass: 'text-red-400',
      position: 'top-[45%] left-1/2 -translate-x-1/2',
      lineWidth: 'w-28',
      change: calculateChange(measurements.waist, previousMeasurements, "waist")
    },
    {
      id: 'hips',
      label: 'Hips',
      value: measurements.hips,
      colorClass: 'bg-purple-500',
      activeClass: 'bg-purple-400 shadow-purple-500/50',
      textActiveClass: 'text-purple-400',
      position: 'top-[52%] left-1/2 -translate-x-1/2',
      lineWidth: 'w-36',
      change: calculateChange(measurements.hips, previousMeasurements, "hips")
    },
    {
      id: 'thighs',
      label: 'Thighs',
      value: measurements.thighs,
      colorClass: 'bg-green-500',
      activeClass: 'bg-green-400 shadow-green-500/50',
      textActiveClass: 'text-green-400',
      position: 'top-[62%] left-[41%]',
      lineWidth: 'w-10',
      change: calculateChange(measurements.thighs, previousMeasurements, "thighs")
    },
    {
      id: 'arms',
      label: 'Arms',
      value: measurements.arms,
      colorClass: 'bg-indigo-500',
      activeClass: 'bg-indigo-400 shadow-indigo-500/50',
      textActiveClass: 'text-indigo-400',
      position: 'top-[30%] left-[65%]',
      lineWidth: 'w-8',
      change: calculateChange(measurements.arms, previousMeasurements, "arms")
    }
  ];

  // Calculate total change (all measurements combined)
  const calculateTotalChange = () => {
    if (!previousMeasurements) return { improved: 0, total: 0 };
    
    const total = measurementDetails.filter(m => m.change).length;
    const improved = measurementDetails.filter(m => m.change && m.change.isPositive).length;
    
    return { improved, total };
  };
  
  const { improved, total } = calculateTotalChange();
  const improvementPercentage = total > 0 ? Math.round((improved / total) * 100) : 0;

  return (
    <Card variant="dark" width="100%" maxWidth="none">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">Body Visualization</h3>
          
          {/* Comparison summary */}
          <div className="text-xs text-gray-400 bg-[#1a1a1a] px-3 py-1 rounded-full">
            Latest vs Initial Measurements
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left column - Current measurements table */}
          <div className="w-full md:w-2/5 bg-[#121212] rounded-lg p-4 border border-[#333]">
            <h4 className="text-sm font-medium mb-3 text-gray-300">Measurement Changes</h4>
            <div className="space-y-3">
              {measurementDetails.map(item => (
                <div 
                  key={item.id}
                  className={`flex items-center justify-between p-2 rounded transition-all duration-300 ${
                    isHighlighted(item.id) 
                      ? 'bg-[rgba(255,107,0,0.05)] border-l-2 border-[#FF6B00] pl-3' 
                      : 'border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${isHighlighted(item.id) ? item.activeClass : item.colorClass}`}></div>
                    <span className={`${isHighlighted(item.id) ? 'font-medium' : ''}`}>{item.label}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">{item.value} cm</span>
                    {item.change && (
                      <span className={`ml-2 text-xs ${item.change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {item.change.value > 0 ? '+' : ''}{item.change.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress summary */}
            {total > 0 && (
              <div className="mt-4 pt-4 border-t border-[#333]">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Overall improvement</span>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium">{improved}/{total}</span>
                      <span className={`text-sm ${improved > total/2 ? 'text-green-500' : 'text-gray-400'}`}>
                        ({improvementPercentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[#333] rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${improved > total/2 ? 'bg-green-500' : 'bg-[#FF6B00]'}`}
                      style={{ width: `${improvementPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right column - Body visualization */}
          <div className="w-full md:w-3/5 bg-[#121212] rounded-lg p-4 border border-[#333]">
            <h4 className="text-sm font-medium mb-3 text-gray-300 text-center">Body Measurement Points</h4>
            
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
              {/* Body silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="https://images.vexels.com/media/users/3/144844/isolated/preview/dd3cbfcf459573de87c52c42ff1022fb-bodybuilder-crucifix-pose-silhouette.png"
                    alt="Body silhouette"
                    fill
                    className="object-contain opacity-30 invert brightness-200 contrast-200"
                  />
                </div>
              </div>
              
              {/* Measurement indicators */}
              <div className="absolute w-full h-full">
                {measurementDetails.map(item => (
                  <div 
                    key={item.id}
                    className={`absolute ${item.position} transition-all duration-300 ${
                      isHighlighted(item.id) ? 'scale-110 z-10' : ''
                    }`}
                  >
                    <div className={`h-0.5 ${item.lineWidth} ${isHighlighted(item.id) ? item.activeClass : item.colorClass} rounded-full ${isHighlighted(item.id) ? 'h-1' : ''}`}></div>
                    <div className="flex justify-center mt-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${isHighlighted(item.id) ? `bg-${item.colorClass.replace('bg-', '')}/30` : `bg-${item.colorClass.replace('bg-', '')}/20`}`}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Measurement values */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {measurementDetails.map(item => (
                <div 
                  key={item.id}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${
                    isHighlighted(item.id) ? `bg-${item.colorClass.replace('bg-', '')}/10` : 'bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1 ${item.colorClass}`}></div>
                    <span className="text-xs">{item.label}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium">{item.value}cm</span>
                    {item.change && (
                      <span className={`ml-1 text-xs ${item.change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {item.change.value > 0 ? '+' : ''}{item.change.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-[rgba(255,107,0,0.1)] rounded-lg p-3 border border-[#FF6B00]/20 text-xs text-gray-300">
          <p className="flex items-center">
            <span className="px-1.5 py-0.5 bg-green-500 text-white rounded-md mr-2 font-medium">Tip</span>
            <span>
              <span className="text-green-500 font-medium">Green</span> indicates positive changes:
              <span className="ml-1 text-[#FF6B00]">↓</span> smaller waist/hips,
              <span className="ml-1 text-[#FF6B00]">↑</span> larger muscle measurements
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}; 
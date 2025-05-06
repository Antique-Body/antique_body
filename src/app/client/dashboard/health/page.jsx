"use client";

import { Button } from "@/components/common/Button";
import {
    ActivityIcon,
    CalendarIcon,
    ChartBarIcon,
    ConnectIcon,
    DisconnectIcon,
    ErrorIcon,
    RefreshIcon,
    TargetIcon,
    TimerIcon
} from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Mock data generator


// Custom Chart Component
const CustomChart = ({ data, selectedDate, onPointClick }) => {
    // Format data for Recharts
    const chartData = data.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        steps: day.steps,
        calories: day.calories,
        distance: parseFloat(day.distance),
        activeMinutes: day.activeMinutes
    }));

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900/90 backdrop-blur-sm p-3 rounded-lg border border-gray-800 shadow-lg">
                    <p className="text-white font-medium mb-2">{label}</p>
                    <div className="space-y-1">
                        <p className="text-[#FF6B00] font-semibold">
                            {payload[0].value.toLocaleString()} steps
                        </p>
                        <p className="text-gray-300">
                            {payload[1].value.toLocaleString()} calories
                        </p>
                        <p className="text-gray-300">
                            {typeof payload[2].value === 'number' ? payload[2].value.toFixed(2) : payload[2].value} km
                        </p>
                        <p className="text-gray-300">
                            {payload[3].value} min active
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    onClick={(data) => {
                        if (data && data.activePayload) {
                            const date = data.activePayload[0].payload.date;
                            onPointClick(date);
                        }
                    }}
                >
                    <defs>
                        <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        vertical={false}
                        stroke="#1F1F1F"
                    />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#9CA3AF' }}
                        tickLine={{ stroke: '#1F1F1F' }}
                        axisLine={{ stroke: '#1F1F1F' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis 
                        tick={{ fill: '#9CA3AF' }}
                        tickLine={{ stroke: '#1F1F1F' }}
                        axisLine={{ stroke: '#1F1F1F' }}
                        tickFormatter={(value) => value.toLocaleString()}
                        domain={[0, 13000]}
                        ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="steps"
                        stroke="#FF6B00"
                        strokeWidth={3}
                        dot={{
                            fill: '#FF6B00',
                            stroke: '#FF6B00',
                            strokeWidth: 2,
                            r: 4,
                            style: { filter: 'drop-shadow(0 0 2px rgba(255, 107, 0, 0.5))' }
                        }}
                        activeDot={{
                            fill: '#FF6B00',
                            stroke: '#FF6B00',
                            strokeWidth: 3,
                            r: 6,
                            style: { filter: 'drop-shadow(0 0 4px rgba(255, 107, 0, 0.7))' }
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="calories"
                        stroke="#4CAF50"
                        strokeWidth={2}
                        dot={false}
                        opacity={0.5}
                    />
                    <Line
                        type="monotone"
                        dataKey="distance"
                        stroke="#2196F3"
                        strokeWidth={2}
                        dot={false}
                        opacity={0.5}
                    />
                    <Line
                        type="monotone"
                        dataKey="activeMinutes"
                        stroke="#9C27B0"
                        strokeWidth={2}
                        dot={false}
                        opacity={0.5}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

// Add this function near the top of the file, after the imports
const generateRandomHealthMetrics = () => {
    return {
        heartRate: {
            average: Math.floor(Math.random() * 20) + 70, // 70-90 bpm
            min: Math.floor(Math.random() * 10) + 60, // 60-70 bpm
            max: Math.floor(Math.random() * 30) + 100, // 100-130 bpm
            resting: Math.floor(Math.random() * 10) + 60 // 60-70 bpm
        },
        speed: {
            average: (Math.random() * 2 + 3).toFixed(1), // 3-5 km/h
            max: (Math.random() * 3 + 5).toFixed(1) // 5-8 km/h
        }
    };
};

export default function HealthPage() {
    const { data: session } = useSession();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [healthData, setHealthData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const initializedRef = useRef(false);

    // Function to disconnect Google Fit
    const handleDisconnect = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/health/google-fit/disconnect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: session?.user?.id }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to disconnect Google Fit');
            }
            
            setIsConnected(false);
            setHealthData(null);
            setError(null);
        } catch (error) {
            console.error('Error disconnecting from Google Fit:', error);
            setError('Failed to disconnect from Google Fit');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch health data
    const fetchHealthData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/health/google-fit/data');
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to fetch health data');
            }
            
            if (!data || !data.dailyData) {
                throw new Error('No health data available');
            }
            
            setHealthData(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching health data:', error);
            setError(error.message || 'Failed to fetch health data');
            setHealthData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Check connection status and fetch data
    useEffect(() => {
        if (initializedRef.current) return;
        
        const checkConnection = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/health/google-fit/status');
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.details || data.error || 'Failed to check connection status');
                }
                
                setIsConnected(data.connected);
                
                if (data.connected) {
                    await fetchHealthData();
                }
            } catch (error) {
                console.error('Error checking connection:', error);
                setError(error.message || 'Failed to check connection status');
                setIsConnected(false);
            } finally {
                setIsLoading(false);
                initializedRef.current = true;
            }
        };

        checkConnection();
    }, []);

    // Function to connect with Google Fit
    const handleConnect = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/health/google-fit/connect', {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Failed to connect to Google Fit');
            }
            const data = await response.json();
            if (data.authUrl) {
                window.location.href = data.authUrl;
            }
        } catch (error) {
            console.error('Error connecting to Google Fit:', error);
            setError('Failed to connect to Google Fit');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('hr-HR', { 
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getSelectedData = () => {
        if (!healthData?.dailyData) return {
            date: selectedDate,
            steps: 0,
            calories: 0,
            distance: 0,
            activeMinutes: 0,
            floors: 0,
            elevation: 0,
            ...generateRandomHealthMetrics()
        };
        
        const dayData = healthData.dailyData.find(day => day.date === selectedDate);
        if (!dayData) return {
            date: selectedDate,
            steps: 0,
            calories: 0,
            distance: 0,
            activeMinutes: 0,
            floors: 0,
            elevation: 0,
            ...generateRandomHealthMetrics()
        };

        return {
            ...dayData,
            ...generateRandomHealthMetrics()
        };
    };

    const getPaginatedData = () => {
        if (!healthData?.dailyData) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        return healthData.dailyData.slice(startIndex, startIndex + itemsPerPage);
    };

    const totalPages = Math.ceil((healthData?.dailyData?.length || 0) / itemsPerPage);

    // Function to render pagination numbers
    const renderPaginationNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            // Calculate start and end of visible pages
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            
            // Adjust if at the start
            if (currentPage <= 2) {
                end = 4;
            }
            // Adjust if at the end
            if (currentPage >= totalPages - 1) {
                start = totalPages - 3;
            }
            
            // Add ellipsis if needed
            if (start > 2) {
                pages.push('...');
            }
            
            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            // Add ellipsis if needed
            if (end < totalPages - 1) {
                pages.push('...');
            }
            
            // Always show last page
            pages.push(totalPages);
        }
        
        return pages;
    };

    // Function to render chart
    const renderChart = () => {
        if (!healthData?.dailyData) return null;
        
        // Get last 7 days of data
        const last7Days = healthData.dailyData
            .slice(-7)
            .map(day => ({
                ...day,
                date: new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                })
            }))
            .reverse(); // Reverse to show oldest to newest
        
        return (
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[rgba(255,107,0,0.1)] rounded-xl flex items-center justify-center">
                            <ChartBarIcon size={24} className="text-[#FF6B00]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">Daily Steps Overview</h3>
                            <p className="text-gray-400 mt-1">Last 7 days of activity</p>
                        </div>
                    </div>
                    <Button
                        variant="outlineLight"
                        size="sm"
                        leftIcon={<CalendarIcon size={16} />}
                    >
                        Last 7 Days
                    </Button>
                </div>
                <CustomChart 
                    data={last7Days}
                    selectedDate={selectedDate}
                    onPointClick={(date) => {
                        // Convert the formatted date back to ISO string
                        const [weekday, month, day] = date.split(' ');
                        const year = new Date().getFullYear();
                        const dateObj = new Date(`${month} ${day}, ${year}`);
                        setSelectedDate(dateObj.toISOString().split('T')[0]);
                    }}
                />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <Card variant="darkStrong" width="100%" maxWidth="none" className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Health Dashboard</h1>
                            <p className="text-gray-400 mt-1">Track your daily activity and health metrics</p>
                        </div>
                        <div className="flex gap-3">
                            {isConnected ? (
                                <Button
                                    onClick={handleDisconnect}
                                    variant="outlineRed"
                                    leftIcon={<DisconnectIcon size={16} />}
                                >
                                    Disconnect Google Fit
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleConnect}
                                    variant="orangeFilled"
                                    leftIcon={<ConnectIcon size={16} />}
                                >
                                    Connect Google Fit
                                </Button>
                            )}
                            {isConnected && (
                                <Button
                                    onClick={fetchHealthData}
                                    variant="outlineLight"
                                    leftIcon={<RefreshIcon size={16} />}
                                >
                                    Refresh Data
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {!isConnected && (
                    <Card variant="darkStrong" width="100%" maxWidth="none" hover>
                        <div className="text-center p-8">
                            <div className="w-16 h-16 bg-[rgba(255,107,0,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                                <ActivityIcon size={32} className="text-[#FF6B00]" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Health Data</h3>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                Connect your Google Fit account to start tracking your daily activity, steps, and other health metrics.
                            </p>
                            <Button
                                onClick={handleConnect}
                                variant="orangeFilled"
                                leftIcon={<ConnectIcon size={16} />}
                                className="px-8"
                            >
                                Connect Google Fit
                            </Button>
                        </div>
                    </Card>
                )}

                {isLoading && (
                    <Card variant="darkStrong" width="100%" maxWidth="none">
                        <div className="text-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00] mx-auto"></div>
                            <p className="mt-4 text-gray-400">Loading your health data...</p>
                        </div>
                    </Card>
                )}

                {error && (
                    <Card variant="darkStrong" width="100%" maxWidth="none">
                        <div className="text-center p-8">
                            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ErrorIcon size={32} className="text-red-500" />
                            </div>
                            <p className="text-red-500 mb-4">{error}</p>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="orangeFilled"
                                className="mt-4"
                            >
                                Retry
                            </Button>
                        </div>
                    </Card>
                )}

                {isConnected && !isLoading && !error && healthData && (
                    <>
                        {/* Daily Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card variant="darkStrong" width="100%" hover>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-[rgba(255,107,0,0.1)] rounded-full flex items-center justify-center">
                                        <ChartBarIcon size={20} className="text-[#FF6B00]" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {formatDate(getSelectedData().date)}
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Steps</p>
                                        <p className="text-2xl font-bold text-[#FF6B00]">
                                            {getSelectedData().steps.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Calories</p>
                                        <p className="text-2xl font-bold text-[#FF6B00]">
                                            {Math.round(getSelectedData().calories)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Distance</p>
                                        <p className="text-2xl font-bold text-[#FF6B00]">
                                            {getSelectedData().distance} km
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card variant="darkStrong" width="100%" hover>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-[rgba(255,107,0,0.1)] rounded-full flex items-center justify-center">
                                        <TimerIcon size={20} className="text-[#FF6B00]" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Activity</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Active Minutes</p>
                                        <p className="text-2xl font-bold text-[#FF6B00]">
                                            {getSelectedData().activeMinutes}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Floors</p>
                                        <p className="text-2xl font-bold text-[#FF6B00]">
                                            {getSelectedData().floors}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Elevation</p>
                                        <p className="text-2xl font-bold text-[#FF6B00]">
                                            {getSelectedData().elevation} m
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card variant="darkStrong" width="100%" hover>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-[rgba(255,107,0,0.1)] rounded-full flex items-center justify-center">
                                        <TargetIcon size={20} className="text-[#FF6B00]" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Health Metrics</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Heart Rate</p>
                                        <p className="text-2xl font-bold text-[#FF6B00]">
                                            {getSelectedData().heartRate?.average || 0} bpm
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-xs text-gray-400">Min: {getSelectedData().heartRate?.min || 0}</span>
                                            <span className="text-xs text-gray-400">Max: {getSelectedData().heartRate?.max || 0}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Speed</p>
                                        <p className="text-2xl font-bold text-[#FF6B00]">
                                            {getSelectedData().speed?.average || 0} km/h
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-xs text-gray-400">Max: {getSelectedData().speed?.max || 0} km/h</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Steps Chart */}
                        <Card variant="darkStrong" width="100%" maxWidth="none" hover>
                            {renderChart()}
                        </Card>

                        {/* Progress Section */}
                        <Card variant="darkStrong" width="100%" maxWidth="none" hover>
                            <h3 className="text-lg font-semibold text-white mb-6">Daily Progress</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-300">Daily Step Goal</span>
                                        <span className="text-sm font-medium text-gray-300">
                                            {getSelectedData().steps.toLocaleString()} / 10,000
                                        </span>
                                    </div>
                                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-800">
                                        <div 
                                            className="h-full rounded-full bg-[#FF6B00] transition-all duration-500" 
                                            style={{ width: `${Math.min((getSelectedData().steps / 10000) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-300">Active Minutes Goal</span>
                                        <span className="text-sm font-medium text-gray-300">
                                            {getSelectedData().activeMinutes} / 30
                                        </span>
                                    </div>
                                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-800">
                                        <div 
                                            className="h-full rounded-full bg-[#FF6B00] transition-all duration-500" 
                                            style={{ width: `${Math.min((getSelectedData().activeMinutes / 30) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Data Table Section */}
                        <Card variant="darkStrong" width="100%" maxWidth="none" hover>
                            <div className="p-6 border-b border-gray-800">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Activity History</h3>
                                    <Button
                                        variant="outlineLight"
                                        size="sm"
                                        leftIcon={<CalendarIcon size={16} />}
                                    >
                                        View Calendar
                                    </Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-800">
                                    <thead className="bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Steps</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Calories</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Distance</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Active Minutes</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Floors</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Elevation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {getPaginatedData().map((day) => (
                                            <tr 
                                                key={day.date}
                                                className={`hover:bg-gray-800/50 cursor-pointer transition-colors ${
                                                    day.date === selectedDate ? 'bg-[rgba(255,107,0,0.05)]' : ''
                                                }`}
                                                onClick={() => setSelectedDate(day.date)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {formatDate(day.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {day.steps.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {Math.round(day.calories)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {day.distance} km
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {day.activeMinutes}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {day.floors}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {day.elevation} m
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Updated Pagination */}
                            <div className="bg-gray-900/50 px-4 py-3 flex items-center justify-between border-t border-gray-800 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <Button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        variant="outlineLight"
                                        size="sm"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        variant="outlineLight"
                                        size="sm"
                                    >
                                        Next
                                    </Button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">
                                            Showing <span className="font-medium text-gray-300">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                                            <span className="font-medium text-gray-300">
                                                {Math.min(currentPage * itemsPerPage, healthData?.dailyData?.length || 0)}
                                            </span>{' '}
                                            of <span className="font-medium text-gray-300">{healthData?.dailyData?.length || 0}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <Button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                variant="outlineLight"
                                                size="sm"
                                                className="rounded-l-md"
                                            >
                                                &laquo;
                                            </Button>
                                            
                                            {renderPaginationNumbers().map((page, index) => (
                                                page === '...' ? (
                                                    <span 
                                                        key={`ellipsis-${index}`}
                                                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400"
                                                    >
                                                        ...
                                                    </span>
                                                ) : (
                                                    <Button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        variant={currentPage === page ? "orangeFilled" : "outlineLight"}
                                                        size="sm"
                                                        className='mx-1'
                                                    >
                                                        {page}
                                                    </Button>
                                                )
                                            ))}
                                            
                                            <Button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                variant="outlineLight"
                                                size="sm"
                                                className="rounded-r-md"
                                            >
                                                &raquo;
                                            </Button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
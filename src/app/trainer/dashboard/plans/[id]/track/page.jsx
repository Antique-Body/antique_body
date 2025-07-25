"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common";

export default function PlanTrackingOverviewPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unwrappedParams = React.use ? React.use(params) : params;
  const { id: planId } = unwrappedParams;
  
  const [assignments, setAssignments] = useState([]);
  const [planDetails, setPlanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const planType = searchParams.get('type');

  useEffect(() => {
    // Parse assignments from URL params
    const assignmentsParam = searchParams.get('assignments');
    if (assignmentsParam) {
      try {
        const parsedAssignments = JSON.parse(decodeURIComponent(assignmentsParam));
        setAssignments(parsedAssignments);
      } catch (error) {
        console.error('Error parsing assignments:', error);
      }
    }

    // Fetch plan details
    const fetchPlanDetails = async () => {
      try {
        const response = await fetch(`/api/users/trainer/plans/${planId}`);
        if (response.ok) {
          const data = await response.json();
          setPlanDetails(data);
        }
      } catch (error) {
        console.error('Error fetching plan details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [planId, searchParams]);

  const handleClientSelect = (assignment) => {
    router.push(`/trainer/dashboard/clients/${assignment.clientId}/plans/${assignment.assignedPlanId}?type=${planType}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-900/30 text-green-400', icon: 'mdi:play-circle', label: 'Active' },
      completed: { color: 'bg-blue-900/30 text-blue-400', icon: 'mdi:check-circle', label: 'Completed' },
      paused: { color: 'bg-yellow-900/30 text-yellow-400', icon: 'mdi:pause-circle', label: 'Paused' },
      pending: { color: 'bg-gray-900/30 text-gray-400', icon: 'mdi:clock-outline', label: 'Pending' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        <Icon icon={config.icon} width={14} height={14} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Icon icon="mdi:loading" className="w-8 h-8 text-[#FF6B00] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading plan tracking overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a]">
      <main className="py-6 sm:py-8 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              leftIcon={<Icon icon="mdi:arrow-left" width={20} height={20} />}
              className="text-gray-400 hover:text-white"
            >
              Back to Plans
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] shadow-lg shadow-[#FF6B00]/25">
              <Icon icon="mdi:chart-multiple" className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Plan Tracking Overview
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {planDetails?.title} - Multiple clients assigned
              </p>
            </div>
          </div>
        </div>

        {/* Plan Info Banner */}
        {planDetails && (
          <Card variant="dark" className="mb-8 p-6 border border-[#333]">
            <div className="flex items-start gap-4">
              {planDetails.coverImage && (
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={planDetails.coverImage}
                    alt={planDetails.title}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-white">{planDetails.title}</h2>
                  <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                    planType === 'nutrition' 
                      ? "bg-green-900/80 text-green-100"
                      : "bg-blue-900/80 text-blue-100"
                  }`}>
                    {planType === 'nutrition' ? 'Nutrition' : 'Training'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{planDetails.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Duration: {planDetails.duration || 'Not specified'}</span>
                  <span>•</span>
                  <span>Assigned to {assignments.length} client{assignments.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Clients Overview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Clients with this plan ({assignments.length})
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Select a client to view their individual progress and tracking details
          </p>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((assignment, index) => (
            <Card
              key={`${assignment.clientId}-${assignment.assignedPlanId}`}
              variant="dark"
              className="p-4 border border-[#333] hover:border-[#FF6B00] transition-all duration-300 cursor-pointer group"
              onClick={() => handleClientSelect(assignment)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white group-hover:text-[#FF6B00] transition-colors">
                    {assignment.clientName}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Assigned {formatDate(assignment.assignedAt)}
                  </p>
                </div>
                <Icon 
                  icon="mdi:arrow-right" 
                  className="text-gray-500 group-hover:text-[#FF6B00] transition-colors" 
                  width={20} 
                  height={20} 
                />
              </div>

              <div className="flex items-center justify-between">
                {getStatusBadge(assignment.status)}
                <Button
                  variant="ghost"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClientSelect(assignment);
                  }}
                  leftIcon={<Icon icon="mdi:chart-line" width={16} height={16} />}
                  className="text-xs text-[#FF6B00] hover:bg-[#FF6B00]/10"
                >
                  Track Progress
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* No assignments fallback */}
        {assignments.length === 0 && (
          <div className="text-center py-12">
            <Icon
              icon="mdi:account-group-outline"
              className="text-gray-600 mx-auto mb-4"
              width={64}
              height={64}
            />
            <p className="text-xl font-medium text-gray-400 mb-2">
              No Active Assignments
            </p>
            <p className="text-gray-500 mb-4">
              This plan hasn't been assigned to any clients yet.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/trainer/dashboard/clients')}
              leftIcon={<Icon icon="mdi:account-plus" width={20} height={20} />}
            >
              Assign to Client
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
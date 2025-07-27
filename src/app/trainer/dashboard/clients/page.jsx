"use client";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { Button } from "@/components/common/Button";
import { InfoBanner } from "@/components/common/InfoBanner";
import { ClientsGrid } from "@/components/custom/dashboard/trainer/pages/clients/components";
import { SortControls } from "@/components/custom/shared/SortControls";

export default function ClientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allClients, setAllClients] = useState([]); // Store all clients for local filtering
  const [filteredClients, setFilteredClients] = useState([]); // Store filtered results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  const [sortOption, setSortOption] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const searchInputRef = useRef(null);

  // Pagination settings
  const CLIENTS_PER_PAGE = 12;

  // Get tracking parameters
  const planId = searchParams.get("planId");
  const planType = searchParams.get("type");

  // Fetch all accepted clients (without pagination for local filtering)
  const fetchAllClients = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        role: "trainer",
        status: "accepted",
        limit: 1000, // Get all clients for local filtering
        sort: sortOption,
        order: sortOrder,
      });

      const response = await fetch(
        `/api/coaching-requests?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      if (data.success) {
        setAllClients(data.data);
        setFilteredClients(data.data);
        setTotalClients(data.data.length);
      } else {
        throw new Error(data.error || "Failed to fetch clients");
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to sort clients
  const sortClients = (clientsToSort, option, order) =>
    [...clientsToSort].sort((a, b) => {
      let comparison = 0;

      switch (option) {
        case "name":
          const aName = `${a.client?.clientProfile?.firstName || ""} ${
            a.client?.clientProfile?.lastName || ""
          }`;
          const bName = `${b.client?.clientProfile?.firstName || ""} ${
            b.client?.clientProfile?.lastName || ""
          }`;
          comparison = aName.localeCompare(bName);
          break;
        case "createdAt":
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case "lastActive":
          const aLastActive =
            a.client?.clientProfile?.lastActive || a.createdAt;
          const bLastActive =
            b.client?.clientProfile?.lastActive || b.createdAt;
          comparison = new Date(aLastActive) - new Date(bLastActive);
          break;
        default:
          comparison = 0;
      }

      return order === "asc" ? comparison : -comparison;
    });

  // Handle local filtering and sorting
  useEffect(() => {
    if (!allClients.length) return;

    let results = [...allClients];

    // Apply search filter
    if (searchQuery) {
      const searchTermLower = searchQuery.toLowerCase();
      results = results.filter((clientRequest) => {
        const client = clientRequest.client?.clientProfile;
        if (!client) return false;

        const fullName = `${client.firstName || ""} ${
          client.lastName || ""
        }`.toLowerCase();
        const email = clientRequest.client?.email?.toLowerCase() || "";

        return (
          fullName.includes(searchTermLower) || email.includes(searchTermLower)
        );
      });
    }

    // Sort results
    results = sortClients(results, sortOption, sortOrder);

    setFilteredClients(results);
    setTotalClients(results.length);

    // Calculate pagination
    const totalPages = Math.ceil(results.length / CLIENTS_PER_PAGE);
    setTotalPages(totalPages);

    // Reset to first page if current page is beyond total pages
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [searchQuery, sortOption, sortOrder, allClients, currentPage]);

  // Get clients for current page
  const getCurrentPageClients = () => {
    const startIndex = (currentPage - 1) * CLIENTS_PER_PAGE;
    const endIndex = startIndex + CLIENTS_PER_PAGE;
    return filteredClients.slice(startIndex, endIndex);
  };

  // Handle sort changes - refetch all data
  useEffect(() => {
    fetchAllClients();
  }, [sortOption, sortOrder]);

  // Initial fetch
  useEffect(() => {
    fetchAllClients();
  }, []);

  const handleViewClient = (clientRequest) => {
    if (planId) {
      // If tracking a specific plan, navigate to the assigned plan page
      router.push(
        `/trainer/dashboard/clients/${clientRequest.id}/plans/${planId}?type=${planType}`
      );
    } else {
      // Normal client dashboard navigation
      router.push(`/trainer/dashboard/clients/${clientRequest.id}`);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCurrentPage(1);
    // Focus will be maintained since we're not refetching
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  };

  if (loading && allClients.length === 0) {
    return (
      <div className="px-4 py-5">
        <div className="flex h-64 w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent" />
            <p className="mt-4 text-zinc-400">Loading clients...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-5">
        <div className="flex h-64 w-full items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <Icon
              icon="mdi:alert-circle"
              className="text-red-500"
              width={48}
              height={48}
            />
            <p className="mt-4 text-lg font-medium text-white">
              Failed to load clients
            </p>
            <p className="mt-2 text-zinc-400">{error}</p>
            <Button
              variant="primary"
              onClick={() => fetchAllClients()}
              leftIcon={<Icon icon="mdi:refresh" width={20} height={20} />}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get current page clients
  const currentClients = getCurrentPageClients();

  return (
    <div className="px-4 py-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {planId ? "Track Plan Progress" : "My Clients"}
        </h1>
        <p className="text-zinc-400">
          {planId
            ? "Select a client to track their progress with this plan"
            : "Manage your accepted clients and their fitness journeys"}
        </p>
        {planId && (
          <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-center gap-3">
            <Icon
              icon="mdi:information"
              className="text-blue-400"
              width={20}
              height={20}
            />
            <div>
              <p className="text-blue-200 text-sm font-medium">
                Plan Tracking Mode:{" "}
                {planType === "nutrition" ? "Nutrition Plan" : "Training Plan"}
              </p>
              <p className="text-blue-300/80 text-xs">
                Click on a client to view their progress with the selected plan
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status Banner */}
      <div className="mb-6">
        <InfoBanner
          icon="mdi:account-group"
          title={`Active Clients (${totalClients})`}
          subtitle={
            totalClients === 0
              ? "No active clients yet. Accept client requests to start coaching!"
              : `You are currently coaching ${totalClients} client${
                  totalClients === 1 ? "" : "s"
                }.`
          }
          variant="info"
        />
      </div>

      {/* Sort Controls */}
      <SortControls
        ref={searchInputRef}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search clients by name or email..."
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        itemCount={totalClients}
        itemLabel="clients"
        enableLocation={false}
        sortOptions={[
          { value: "name", label: "Name" },
          { value: "createdAt", label: "Date Added" },
          { value: "lastActive", label: "Last Active" },
        ]}
        onClearFilters={handleClearFilters}
        className="mb-6"
        showSortControls={false}
        variant="blue"
      />

      {/* Clients Grid with Pagination */}
      <ClientsGrid
        clients={currentClients}
        handleViewClient={handleViewClient}
        isPlanTracking={!!planId}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        handleSearchClear={handleClearFilters}
        searchQuery={searchQuery}
        loading={loading}
      />
    </div>
  );
}

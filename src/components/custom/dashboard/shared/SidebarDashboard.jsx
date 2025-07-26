"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import React, { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/common/Button";
import { CompactLanguageSelector } from "@/components/custom/shared/CompactLanguageSelector";

// Compact Profile Capsule Component
const ProfileCapsule = ({
  profileType,
  userData,
  loading,
  onProfileClick,
  isCollapsed,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const fullName = userData
    ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User"
    : "User";

  if (loading) {
    return (
      <div className="p-3 mb-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-xl" />
            {!isCollapsed && (
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const profileSubtitle =
    profileType === "trainer" ? "Personal Trainer" : "Fitness Enthusiast";

  return (
    <div className="px-3 mb-3">
      {/* Profile Info */}
      <div
        className={`p-3 cursor-pointer group transition-all duration-200 hover:bg-white/[0.02] rounded-xl ${
          isCollapsed ? "flex justify-center" : ""
        }`}
        onClick={onProfileClick}
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onProfileClick?.();
          }
        }}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "gap-3"
          }`}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-200">
              {userData?.profileImage && !imageError && (
                <Image
                  src={userData.profileImage}
                  alt="Profile"
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="40px"
                  onError={() => setImageError(true)}
                  onLoad={() => setIsImageLoaded(true)}
                />
              )}
              {(!userData?.profileImage || imageError || !isImageLoaded) && (
                <span>{getInitials(fullName)}</span>
              )}
            </div>
            {/* Online Status */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900" />
          </div>

          {/* Profile Info - Hidden when collapsed */}
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white truncate group-hover:text-[#FF6B00] transition-colors duration-200">
                {fullName}
              </h3>
              <p className="text-sm text-zinc-400 truncate">
                {profileSubtitle}
              </p>
            </div>
          )}
        </div>

        {/* Hover indicator for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 bg-zinc-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {fullName}
          </div>
        )}
      </div>

      {/* Language Selector */}
      <div className="mt-2">
        <CompactLanguageSelector isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ item, isActive, isCollapsed, badgeCount, onClick }) => {
  // Special handling for logout item
  const isLogout = item.id === "logout";
  const handleClick = (e) => {
    if (isLogout && onClick) {
      e.preventDefault();
      onClick();
      return;
    }
  };

  return (
    <div className="relative">
      <Link
        href={item.route}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative no-underline focus:outline-none focus:ring-2 focus:ring-[#FF6B00] ${
          isActive
            ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-lg shadow-orange-500/20"
            : isLogout
            ? "text-red-400 hover:text-white hover:bg-red-500/20"
            : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
        } ${isCollapsed ? "justify-center" : ""}`}
        tabIndex={0}
        onClick={handleClick}
      >
        {/* Icon */}
        <Icon
          icon={item.icon}
          width={22}
          height={22}
          className={`flex-shrink-0 transition-colors duration-200 ${
            isActive
              ? "text-white"
              : isLogout
              ? "text-red-400 group-hover:text-white"
              : "text-[#FF6B00] group-hover:text-white"
          }`}
        />

        {/* Label - Hidden when collapsed */}
        {!isCollapsed && (
          <>
            <span className="text-base font-medium truncate">{item.label}</span>

            {/* Badge */}
            {badgeCount > 0 && (
              <span className="ml-auto bg-[#FF6B00] text-white text-sm px-2.5 py-1 rounded-full font-bold min-w-[24px] text-center">
                {badgeCount}
              </span>
            )}
          </>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 bg-zinc-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 flex items-center gap-2">
            {item.label}
            {badgeCount > 0 && (
              <span className="bg-[#FF6B00] text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                {badgeCount}
              </span>
            )}
          </div>
        )}

        {/* Badge for collapsed state */}
        {isCollapsed && badgeCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-[#FF6B00] text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center">
            {badgeCount}
          </div>
        )}
      </Link>
    </div>
  );
};

// Main Sidebar Component
export const SidebarDashboard = ({
  profileType = "client",
  userData,
  loading,
  navigationItems = [],
  bottomNavigationItems = [],
  activeItem,
  onNavigationChange,
  onProfileClick,
  onCollapseChange,
  className = "",
}) => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false); // Don't auto-collapse on mobile
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // Notify parent about collapse state changes
  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  }, [router]);

  // Handle navigation item click
  const handleNavItemClick = useCallback(
    (item) => {
      if (item.id === "logout") {
        handleLogout();
      } else {
        onNavigationChange?.(item.id);
      }
    },
    [onNavigationChange, handleLogout]
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="small"
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 hover:bg-zinc-700/80 text-white p-2"
      >
        <Icon icon="mdi:menu" width={20} height={20} />
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 backdrop-blur-xl border-r border-zinc-800/60 transition-all duration-300 ease-in-out z-50 flex flex-col ${
          isCollapsed ? "w-20" : "w-80"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${className}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800/60">
          <div
            className={`flex items-center ${
              !isCollapsed ? "justify-between" : "justify-center"
            }`}
          >
            {!isCollapsed && (
              <h2 className="text-lg font-bold text-white">Dashboard</h2>
            )}

            {/* Desktop Collapse Toggle */}
            <Button
              variant="ghost"
              size="small"
              onClick={toggleCollapse}
              className="hidden lg:flex p-2 text-zinc-400 hover:text-white hover:bg-white/[0.05]"
            >
              <Icon
                icon={isCollapsed ? "mdi:chevron-right" : "mdi:chevron-left"}
                width={16}
                height={16}
              />
            </Button>

            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="small"
              onClick={toggleMobile}
              className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/[0.05]"
            >
              <Icon icon="mdi:close" width={16} height={16} />
            </Button>
          </div>
        </div>

        {/* Profile Capsule */}
        <ProfileCapsule
          profileType={profileType}
          userData={userData}
          loading={loading}
          onProfileClick={onProfileClick}
          isCollapsed={isCollapsed}
        />

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                isCollapsed={isCollapsed}
                badgeCount={item.badgeCount || 0}
                onClick={() => handleNavItemClick(item)}
              />
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        {bottomNavigationItems.length > 0 && (
          <div className="px-3 py-4 border-t border-zinc-800/60">
            <div className="space-y-1">
              {bottomNavigationItems.map((item) => (
                <div key={item.id}>
                  {/* Add divider before logout item */}
                  {item.id === "logout" && (
                    <div className="my-2 border-t border-zinc-800/80"></div>
                  )}
                  <NavItem
                    item={item}
                    isActive={activeItem === item.id}
                    isCollapsed={isCollapsed}
                    badgeCount={item.badgeCount || 0}
                    onClick={() => handleNavItemClick(item)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800/60">
          {!isCollapsed ? (
            <div className="text-xs text-zinc-500 text-center">
              Antique Body Training
            </div>
          ) : (
            <div className="flex justify-center">
              <Icon
                icon="mdi:dumbbell"
                width={16}
                height={16}
                className="text-zinc-500"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

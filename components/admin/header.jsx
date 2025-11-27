"use client";

import { Search, Bell, Menu, ShoppingBag, ShoppingCart } from "lucide-react";
import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import Link from "next/link";

export default function Header({ notifications = [] }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignUp } = useClerk();

  if (!isLoaded) {
    return (
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`;
  const role = user?.publicMetadata?.role || "guest";
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu and Search */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors md:hidden"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="hidden md:flex items-center w-full max-w-md bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-[#D4A574]/20 transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, products, or customers..."
              className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-[#2C1810] placeholder:text-gray-400"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <button
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
          <Link
            href={"cart"}
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <ShoppingCart className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </Link>
          <button
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

          {/* User Info */}
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#2C1810]">
                  {fullName}
                </p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox:
                      "w-10 h-10 rounded-full bg-[#2C1810] border-2 border-[#D4A574] shadow-sm",
                    userButtonAvatarImage: "object-cover",
                  },
                }}
                userProfileMode="modal"
              />
            </div>
          ) : (
            <button
              onClick={() => openSignUp()}
              className="px-4 py-2 rounded-full bg-[#2C1810] text-[#D4A574] font-semibold hover:scale-105 transition-transform"
            >
              Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

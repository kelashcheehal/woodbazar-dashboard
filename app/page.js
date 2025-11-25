"use client";

import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { openSignIn, signOut } = useClerk();

  const handleSignIn = useCallback(async () => {
    await signOut();
    await openSignIn();
  }, [signOut, openSignIn]);

  useEffect(() => {
    if (!isLoaded) return;

    if (user?.publicMetadata?.role === "admin") {
      router.replace("/admin");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) return <p>Loading...</p>;

  const role = user?.publicMetadata?.role || "guest";
  const fullName = user?.fullName || "Guest User";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center border border-gray-200">
        <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-[#2C1810] mb-3">{fullName}</h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          You don't have permission to view this page.
        </p>
        <div className="flex flex-col gap-3">
          <button
            className="px-4 py-3 rounded-full bg-gray-100 text-[#2C1810] font-medium hover:bg-gray-200 transition"
            onClick={handleSignIn}
          >
            Sign In with Another Account <ArrowRight className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

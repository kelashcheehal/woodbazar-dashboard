import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { userId } = params;
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    console.log("Clerk user data for", userId, ":", user); // Add logging
    return NextResponse.json(user);
  } catch (error) {
    console.error("Clerk API error for userId", userId, ":", error);
    return NextResponse.json({ error: "User not found" }, { status: 500 });
  }
}

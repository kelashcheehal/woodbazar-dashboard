import { clerkMiddleware, redirectToSignIn } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Not logged in → redirect to sign in
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Logged in but not admin → block access to all pages
  const role = sessionClaims?.publicMetadata?.role;

  if (role !== "admin") {
    return Response.redirect(new URL("/unauthorized", req.url));
  }

  // If admin, allow access
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - Clerk auth pages (sign-in, sign-up, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth).*)",
  ],
};

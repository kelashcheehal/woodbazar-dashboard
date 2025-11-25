import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // 1) If not logged in → block immediately
  if (!userId && isAdminRoute(req)) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }

  // 2) If logged in → check role
  const role = sessionClaims?.publicMetadata?.role;

  if (isAdminRoute(req) && role !== "admin") {
    return Response.redirect(new URL("/unauthorized", req.url));
  }
});

export const config = {
  matcher: [
    "/admin/:path*", // Only protect admin, avoid messing with whole site
    "/dashboard/:path*",
    "/api/:path*",
  ],
};

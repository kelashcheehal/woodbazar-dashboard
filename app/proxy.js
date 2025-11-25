import { clerkMiddleware, createRouteMatcher, redirectToSignIn } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // 1) Not logged in → redirect to sign-in
  if (!userId && isAdminRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // 2) Check user role
  const role = sessionClaims?.publicMetadata?.role;

  if (isAdminRoute(req) && role !== "admin") {
    return Response.redirect(new URL("/unauthorized", req.url));
  }
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/:path*",
  ],
};

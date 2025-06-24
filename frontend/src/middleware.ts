import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/about",
    "/api/webhook",
    "/api/create-checkout-session",
  ],
  
  // Routes that can be accessed while signed out
  ignoredRoutes: [
    "/api/webhook",
    "/api/create-checkout-session"
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 
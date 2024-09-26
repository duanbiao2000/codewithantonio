import { authMiddleware } from "@clerk/nextjs";
 
// 导入authMiddleware函数，用于处理用户认证
export default authMiddleware({
  // Routes that can be accessed while signed out
  // 可以在未登录状态下访问的路由
  publicRoutes: ['/anyone-can-visit-this-route'],
  // Routes that can always be accessed, and have
  // no authentication information
  // 可以始终访问的路由，没有认证信息
  ignoredRoutes: ['/no-auth-in-this-route'],
  
});
 
export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  // 保护所有路由，包括api/trpc。
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
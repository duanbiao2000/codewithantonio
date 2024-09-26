// 使用客户端脚本
"use client";

// 导入Clerk和Convex相关的库和组件
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  AuthLoading,
  Authenticated,
  ConvexReactClient,
} from "convex/react";

// 导入自定义组件
import { Loading } from "@/components/auth/loading";

// 定义ConvexClientProvider的属性接口
interface ConvexClientProviderProps {
  children: React.ReactNode;
};

// 从环境变量中获取Convex服务的URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

// 创建一个新的ConvexReactClient实例，用于与Convex服务通信
const convex = new ConvexReactClient(convexUrl);

// 定义ConvexClientProvider组件，用于提供Convex客户端和服务的封装
// 包含Clerk认证服务，为子组件提供认证状态和Convex客户端
export const ConvexClientProvider = (props: ConvexClientProviderProps) => {
  const { children } = props;
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>
          {children}
        </Authenticated>
        <AuthLoading>
          <Loading />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
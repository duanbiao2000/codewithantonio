"use client";

import { useEffect, useState } from "react";

import { RenameModal } from "@/components/modals/rename-modal";

/**
 * 提供模态框组件的父组件
 * 
 * 该组件确保在客户端环境下正确地挂载模态框组件，避免在 SSR（服务器端渲染）过程中出现问题
 */
export const ModalProvider = () => {
  // 用于跟踪组件是否已挂载到客户端
  const [isMounted, setIsMounted] = useState(false);

  // 仅在组件挂载时运行一次，用于设置isMounted状态为true
  // 这是用来避免在SSR过程中出现的hydration问题
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 如果组件尚未挂载到客户端，则返回null，避免渲染组件树
  if (!isMounted) {
    return null;
  }

  // 返回模态框组件
  return (
    <>
      <RenameModal />
    </>
  );
};
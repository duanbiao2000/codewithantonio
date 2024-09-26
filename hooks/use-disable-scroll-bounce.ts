// 导入React中的useEffect钩子
import { useEffect } from "react";

// 定义一个名为useDisableScrollBounce的函数
export const useDisableScrollBounce = () => {
  // 使用useEffect钩子，在组件挂载时添加overflow-hidden和overscroll-none类到body元素上
  useEffect(() => {
    document.body.classList.add("overflow-hidden", "overscroll-none");
    // 在组件卸载时移除overflow-hidden和overscroll-none类
    return () => {
      document.body.classList.remove("overflow-hidden", "overscroll-none");
    };
  }, []); // 依赖项为空数组，表示只在组件挂载和卸载时执行
};

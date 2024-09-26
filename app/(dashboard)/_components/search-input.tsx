"use client";

// 导入query-string库，用于处理URL查询字符串
import qs from "query-string";
// 导入lucide-react库，用于使用图标
import { Search } from "lucide-react";
// 导入usehooks-ts库，用于使用防抖功能
import { useDebounce, useDebounceValue } from "usehooks-ts";
// 导入next/navigation库，用于使用路由功能
import { useRouter } from "next/navigation";
// 导入react库，用于使用useState和useEffect等钩子函数
import { ChangeEvent, useEffect, useState } from "react";

// 导入Input组件
import { Input } from "@/components/ui/input";

// 定义SearchInput组件
export const SearchInput = () => {
  // 使用useRouter钩子函数获取路由对象
  const router = useRouter();
  // 使用useDebounceValue钩子函数创建一个防抖的值，初始值为空字符串，防抖时间为500毫秒
  const [debouncedValue, setValue] = useDebounceValue('', 500);

  // 定义handleChange函数，用于处理输入框的值变化
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // 使用useEffect钩子函数，当debouncedValue或router发生变化时，执行回调函数
  useEffect(() => {
    // 使用query-string库将debouncedValue转换为URL查询字符串
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: {
          search: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    // 使用router.push方法，将URL查询字符串添加到当前URL中
    router.push(url)
  }, [debouncedValue, router]);

  // 返回组件的JSX结构
  return (
    <div className="w-full relative">
      {/* 使用lucide-react库中的Search图标 */}
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      {/* 使用Input组件，设置输入框的样式和onChange事件 */}
      <Input
        className="w-full max-w-[516px] pl-9"
        placeholder="Search boards"
        onChange={handleChange}
      />
    </div>
  );
};
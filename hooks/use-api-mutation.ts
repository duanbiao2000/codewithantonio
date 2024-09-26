import { useState } from "react";
import { useMutation } from "convex/react";

/**
 * 用于API突变的钩子
 * 
 * 该钩子封装了凸凸的useMutation方法，提供了一种简便的方式来进行API的突变操作
 * 它主要做了两件事：
 * 1. 管理突变请求的状态（pending）
 * 2. 封装了突变请求的调用逻辑，处理了请求的发送以及异常的抛出
 * 
 * @param mutationFunction 凸凸的突变函数，用于执行API突变操作
 * @returns 返回一个对象，包含mutate函数和pending状态
 *          - mutate: 实际用于执行突变操作的函数
 *          - pending: 表示当前是否有突变请求正在处理中
 */
export const useApiMutation = (mutationFunction: any) => {
  // 管理突变请求的状态，用于指示当前是否有请求正在处理中
  const [pending, setPending] = useState(false);
  // 使用凸凸的useMutation钩子获取突变函数
  const apiMutation = useMutation(mutationFunction);

  /**
   * 封装的突变函数，用于发送突变请求
   * 
   * 它会先将pending状态设置为true，发送请求，然后在请求结束（无论成功或失败）后将pending状态重置为false
   * 如果请求成功，它会返回成功的结果；如果请求失败，它会捕获异常并抛出错误
   * 
   * @param payload 突变请求的负载数据
   * @returns 返回一个Promise，包含突变操作的结果
   * @throws 如果突变操作失败，会抛出错误
   */
  const mutate = (payload: any) => {
    setPending(true);
    return apiMutation(payload)
      .finally(() => setPending(false))
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  };

  // 返回mutate函数和pending状态，供外部使用
  return {
    mutate,
    pending,
  };
};
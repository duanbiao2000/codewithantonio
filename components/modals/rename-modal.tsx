"use client";

// 导入所需的React和sonner库
import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

// 导入所需的组件
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRenameModal } from "@/store/use-rename-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";

// 定义重命名模态框组件
export const RenameModal = () => {
  // 使用useApiMutation钩子获取mutate和pending状态
  const { mutate, pending } = useApiMutation(api.board.update);

  // 使用useRenameModal钩子获取isOpen、onClose和initialValues状态
  const { isOpen, onClose, initialValues } = useRenameModal();
  // 使用useState钩子定义title状态
  const [title, setTitle] = useState(initialValues.title);

  // 当initialValues.title发生变化时，更新title状态
  useEffect(() => {
    setTitle(initialValues.title);
  }, [initialValues.title]);

  // 定义表单提交事件处理函数
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // 调用mutate函数更新board的title
    mutate({ id: initialValues.id, title })
      .then(() => {
        // 成功更新后，显示成功提示，并关闭模态框
        toast.success("Board renamed");
        onClose();
      })
      .catch(() => toast.error("Failed to rename board"));
  };

  // 返回重命名模态框组件
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit board title</DialogTitle>
          <DialogDescription>
            Enter a new title for this board
          </DialogDescription>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              disabled={pending}
              required
              maxLength={60}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Board title"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={pending} type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
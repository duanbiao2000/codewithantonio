import { create } from "zustand";

const defaultvalues = { id: "", title: "" };

interface IRenameModal {
  isOpen: boolean;
  initialValues: typeof defaultvalues;
  onOpen: (id: string, title: string) => void;
  onClose: () => void;
}

// 定义一个用于重命名操作的Modal组件的自定义hook
export const useRenameModal = create<IRenameModal>((set) => ({
  // 初始状态下，Modal是关闭的
  isOpen: false,
  
  // 打开Modal的方法，传入id和标题
  onOpen: (id, title) =>
    set({
      // 设置Modal为打开状态，并设置初始值
      isOpen: true,
      initialValues: { id, title },
    }),
  
  // 关闭Modal的方法，重置初始值
  onClose: () =>
    set({
      // 设置Modal为关闭状态，并将初始值重置为默认值
      isOpen: false,
      initialValues: defaultvalues,
    }),
  
  // 定义初始值，这里应该是根据具体需求设定的
  initialValues: defaultvalues,
}));
// 导入shallow函数
import { shallow } from "@liveblocks/client";

// 导入Layer和XYWH类型
import { Layer, XYWH } from "@/types/canvas";
// 导入useStorage和useSelf函数
import { useStorage, useSelf } from "@/liveblocks.config";

// 定义boundingBox函数，用于计算多个图层的外接矩形
const boundingBox = (layers: Layer[]): XYWH | null => {
  // 获取第一个图层
  const first = layers[0];

  // 如果没有图层，返回null
  if (!first) {
    return null;
  }

  // 初始化外接矩形的左、右、上、下边界
  let left = first.x;
  let right = first.x + first.width;
  let top = first.y;
  let bottom = first.y + first.height;

  // 遍历其他图层，更新外接矩形的边界
  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];

    if (left > x) {
      left = x;
    }

    if (right < x + width) {
      right = x + width;
    }

    if (top > y) {
      top = y;
    }
    if (bottom < y + height) {
      bottom = y + height;
    }
  }

  // 返回外接矩形的坐标和尺寸
  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
};

// 定义useSelectionBounds函数，用于获取选中的图层的外接矩形
export const useSelectionBounds = () => {
  // 获取当前用户选中的图层
  const selection = useSelf((me) => me.presence.selection);

  // 返回选中的图层的外接矩形
  return useStorage((root) => {
    // 获取选中的图层
    const selectedLayers = selection
      .map((layerId) => root.layers.get(layerId)!)
      .filter(Boolean);

    // 计算外接矩形
    return boundingBox(selectedLayers);
  },shallow);
};
// 导入必要的库以处理类和样式合并
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 导入自定义的类型定义
import {
  Camera,
  Color,
  Layer,
  LayerType,
  PathLayer,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";

// 定义一组用于连接的颜色
const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

/**
 * 合并多个类值为一个字符串
 * @param inputs 多个类值
 * @returns 合并后的类字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 将连接ID转换为颜色
 * @param connectionId 连接ID，用于确定颜色索引
 * @returns 颜色字符串
 */
export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

/**
 * 将指针事件转换为画布坐标点
 * @param e React的指针事件
 * @param camera 画布相机对象，用于计算相对坐标
 * @returns 转换后的点坐标
 */
export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}

/**
 * 将RGB颜色对象转换为CSS颜色字符串
 * @param color 颜色对象，包含RGB分量
 * @returns CSS颜色字符串
 */
export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g
    .toString(16)
    .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}

/**
 * 调整边界大小，根据给定的角点和新点
 * @param bounds 原始的边界框
 * @param corner 调整的角点
 * @param point 新的角点位置
 * @returns 调整后的边界框
 */
export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  // 根据角点调整边界框的x和宽度
  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(point.x - bounds.x);
  }

  // 根据角点调整边界框的y和高度
  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(point.y - bounds.y);
  }

  return result;
}

/**
 * 查找与矩形相交的图层ID
 * @param layerIds 图层ID列表
 * @param layers 图层的映射表
 * @param a 第一个点
 * @param b 第二个点
 * @returns 相交的图层ID列表
 */
export function findIntersectingLayersWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point
) {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };

  const ids = [];

  // 遍历图层，检查是否与矩形相交
  for (const layerId of layerIds) {
    const layer = layers.get(layerId);

    if (layer == null) {
      continue;
    }

    const { x, y, height, width } = layer;

    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId);
    }
  }

  return ids;
}

/**
 * 根据颜色的亮度获取对比文本颜色
 * @param color 颜色对象，包含RGB分量
 * @returns 对比文本颜色（黑或白）
 */
export function getContrastingTextColor(color: Color) {
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;

  return luminance > 182 ? "black" : "white";
}

/**
 * 将一组点转换为路径图层
 * @param points 二维点数组
 * @param color 图层的颜色
 * @returns 转换后的路径图层对象
 */
export function penPointsToPathLayer(
  points: number[][],
  color: Color
): PathLayer {
  if (points.length < 2) {
    throw new Error("Cannot transform points with less than 2 points");
  }

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  // 计算边界框
  for (const point of points) {
    const [x, y] = point;

    if (left > x) {
      left = x;
    }

    if (top > y) {
      top = y;
    }

    if (right < x) {
      right = x;
    }

    if (bottom < y) {
      bottom = y;
    }
  }

  // 构造路径图层对象
  return {
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure]),
  };
}

/**
 * 从描边数据生成SVG路径字符串
 * @param stroke 描边数据，每两个点之间采用二次贝塞尔曲线
 * @returns SVG路径字符串
 */
export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";

  // 生成SVG路径命令
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}
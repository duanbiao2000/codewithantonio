// 定义颜色类型，用于表示RGB颜色
export type Color = {
  r: number; // 红色分量
  g: number; // 绿色分量
  b: number; // 蓝色分量
};

// 定义相机类型，用于表示相机的位置
export type Camera = {
  x: number; // 相机在x轴的位置
  y: number; // 相机在y轴的位置
};

// 定义图层类型枚举，用于表示不同的图形类型
export enum LayerType {
  Rectangle, // 矩形图层
  Ellipse, // 椭圆图层
  Path, // 路径图层
  Text, // 文本图层
  Note, // 注释图层
}

// 定义矩形图层类型，包含矩形的具体属性
export type RectangleLayer = {
  type: LayerType.Rectangle; // 图层类型为矩形
  x: number; // 矩形左上角x坐标
  y: number; // 矩形左上角y坐标
  height: number; // 矩形高度
  width: number; // 矩形宽度
  fill: Color; // 填充颜色
  value?: string; // 可选的附加值
};

// 定义椭圆图层类型，包含椭圆的具体属性
export type EllipseLayer = {
  type: LayerType.Ellipse; // 图层类型为椭圆
  x: number; // 椭圆中心x坐标
  y: number; // 椭圆中心y坐标
  height: number; // 椭圆高度
  width: number; // 椭圆宽度
  fill: Color; // 填充颜色
  value?: string; // 可选的附加值
};

// 定义路径图层类型，包含路径的具体属性
export type PathLayer = {
  type: LayerType.Path; // 图层类型为路径
  x: number; // 路径起点x坐标
  y: number; // 路径起点y坐标
  height: number; // 路径高度
  width: number; // 路径宽度
  fill: Color; // 填充颜色
  points: number[][]; // 路径上的点坐标数组
  value?: string; // 可选的附加值
};

// 定义文本图层类型，包含文本的具体属性
export type TextLayer = {
  type: LayerType.Text; // 图层类型为文本
  x: number; // 文本左上角x坐标
  y: number; // 文本左上角y坐标
  height: number; // 文本高度
  width: number; // 文本宽度
  fill: Color; // 填充颜色
  value?: string; // 可选的文本内容
};

// 定义注释图层类型，包含注释的具体属性
export type NoteLayer = {
  type: LayerType.Note; // 图层类型为注释
  x: number; // 注释左上角x坐标
  y: number; // 注释左上角y坐标
  height: number; // 注释高度
  width: number; // 注释宽度
  fill: Color; // 填充颜色
  value?: string; // 可选的注释内容
};

// 定义点类型，用于表示二维空间中的点坐标
export type Point = {
  x: number; // 点的x坐标
  y: number; // 点的y坐标
};

// 定义XYWH类型，用于表示一个区域的左上角坐标、宽度和高度
export type XYWH = {
  x: number; // 区域左上角x坐标
  y: number; // 区域左上角y坐标
  width: number; // 区域宽度
  height: number; // 区域高度
};

// 定义方向枚举，用于表示方位（上、下、左、右）
export enum Side {
  Top = 1, // 上
  Bottom = 2, // 下
  Left = 4, // 左
  Right = 8, // 右
}

// 定义画布状态类型，用于表示画布的不同操作模式
export type CanvasState =
  | {
      mode: CanvasMode.None; // 无操作模式
    }
  | {
      mode: CanvasMode.SelectionNet; // 选择网模式
      origin: Point; // 选择网的起点
      current?: Point; // 当前选择点（可选）
    }
  | {
      mode: CanvasMode.Translating; // 移动模式
      current: Point; // 当前移动点
    }
  | {
      mode: CanvasMode.Inserting; // 插入模式
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note; // 插入的图层类型
    }
  | {
      mode: CanvasMode.Pencil; // 铅笔模式
    }
  | {
      mode: CanvasMode.Pressing; // 按压模式
      origin: Point; // 按压起点
    }
  | {
      mode: CanvasMode.Resizing; // 缩放模式
      initialBounds: XYWH; // 初始区域
      corner: Side; // 缩放的角位置
    };

// 定义画布操作模式枚举
export enum CanvasMode {
  None, // 无操作
  Pressing, // 按压
  SelectionNet, // 选择网
  Translating, // 移动
  Inserting, // 插入
  Resizing, // 缩放
  Pencil, // 铅笔
}

// 定义图层类型，包含各种具体的图层类型
export type Layer =
  | RectangleLayer
  | EllipseLayer
  | PathLayer
  | TextLayer
  | NoteLayer;
  
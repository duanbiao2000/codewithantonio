// 导入convex/values模块中的v对象
import { v } from "convex/values";
// 导入convex/server模块中的defineSchema和defineTable函数
import { defineSchema, defineTable } from "convex/server";

// 导出默认的schema定义
export default defineSchema({
  // 定义boards表
  boards: defineTable({
    // 定义title字段，类型为字符串
    title: v.string(),
    // 定义orgId字段，类型为字符串
    orgId: v.string(),
    // 定义authorId字段，类型为字符串
    authorId: v.string(),
    // 定义authorName字段，类型为字符串
    authorName: v.string(),
    // 定义imageUrl字段，类型为字符串
    imageUrl: v.string(),
  })
    // 定义by_org索引，根据orgId字段进行索引
    .index("by_org", ["orgId"])
    // 定义search_title索引，根据title字段进行索引，并设置filterFields为orgId字段
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["orgId"],
    }),
  // 定义userFavorites表
  userFavorites: defineTable({
    // 定义orgId字段，类型为字符串
    orgId: v.string(),
    // 定义userId字段，类型为字符串
    userId: v.string(),
    // 定义boardId字段，类型为boards表的id
    boardId: v.id("boards"),
  })
    // 定义by_board索引，根据boardId字段进行索引
    .index("by_board", ["boardId"])
    // 定义by_user_org索引，根据userId和orgId字段进行索引
    .index("by_user_org", ["userId", "orgId"])
    // 定义by_user_board索引，根据userId和boardId字段进行索引
    .index("by_user_board", ["userId", "boardId"])
    // 定义by_user_board_org索引，根据userId、boardId和orgId字段进行索引
    .index("by_user_board_org", ["userId", "boardId", "orgId"]),
});
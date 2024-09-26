// 导入v模块
import { v } from "convex/values";

// 导入query模块
import { query } from "./_generated/server";
// 导入getAllOrThrow模块
import { getAllOrThrow } from "convex-helpers/server/relationships";

// 定义get函数
export const get = query({
  // 定义参数
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  // 定义处理函数
  handler: async (ctx, args) => {
    // 获取用户身份
    const identity = await ctx.auth.getUserIdentity();

    // 如果没有身份，抛出错误
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // 如果有收藏参数
    if (args.favorites) {
      // 获取收藏的看板
      const favoritedBoards = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", identity.subject).eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();

      // 获取看板id
      const ids = favoritedBoards.map((b) => b.boardId);

      // 获取看板
      const boards = await getAllOrThrow(ctx.db, ids);

      // 返回看板，并标记为收藏
      return boards.map((board) => ({...board,isFavorite: true}))
    }

    // 获取搜索参数
    const title = args.search as string;
    let boards = [];

    // 如果有搜索参数
    if (title) {
      // 搜索看板
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q.search("title", title).eq("orgId", args.orgId)
        )
        .collect();
    } else {
      // 获取看板
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

    // 获取看板收藏关系
    const boardsWithFavoritesRelation = boards.map((board) => {
      return ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", identity.subject).eq("boardId", board._id)
        )
        .unique()
        .then((favorite) => {
          return {
            ...board,
            isFavorite: !!favorite,
          };
        });
    });

    // 获取看板收藏关系
    const boardWithFavoriteBoolean = Promise.all(boardsWithFavoritesRelation);

    // 返回看板收藏关系
    return boardWithFavoriteBoolean;
  },
});
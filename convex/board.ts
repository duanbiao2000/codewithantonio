import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// 定义一组图片路径
const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
  "/placeholders/7.svg",
  "/placeholders/8.svg",
  "/placeholders/9.svg",
  "/placeholders/10.svg",
];

// 创建新看板
export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // 获取当前用户身份
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    // 随机选择一张图片
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // 插入新看板数据
    const board = await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });

    return board;
  },
});

// 删除看板
export const remove = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    // 获取当前用户身份
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;

    // 查询用户是否已经收藏该看板
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", args.id)
      )
      .unique();

    if (existingFavorite) {
      // 如果已经收藏，则删除收藏记录
      await ctx.db.delete(existingFavorite._id);
    }

    // 删除看板
    await ctx.db.delete(args.id);
  },
});

// 更新看板
export const update = mutation({
  args: {
    id: v.id("boards"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // 获取当前用户身份
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error("Title is required");
    }

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters");
    }

    // 更新看板数据
    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return board;
  },
});

// 收藏看板
export const favorite = mutation({
  args: { id: v.id("boards"), orgId: v.string() },
  handler: async (ctx, args) => {
    // 获取当前用户身份
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    // 获取看板数据
    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    // 查询用户是否已经收藏该看板
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (existingFavorite) {
      throw new Error("Board already favorited");
    }

    // 插入收藏记录
    await ctx.db.insert("userFavorites", {
      userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return board;
  },
});

// 取消收藏看板
export const unfavorite = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    // 获取当前用户身份
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    // 获取看板数据
    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    // 查询用户是否已经收藏该看板
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex(
        "by_user_board",
        (q) => q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (!existingFavorite) {
      throw new Error("Favorite board not found");
    }

    // 删除收藏记录
    await ctx.db.delete(existingFavorite._id);

    return board;
  },
});

// 获取看板
export const get = query({
  args: {id: v.id('boards')},
  handler: async (ctx,args)=>{
    // 获取看板数据
    const board= ctx.db.get(args.id)

    return board;
  }
})
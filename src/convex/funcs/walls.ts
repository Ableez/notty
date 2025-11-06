import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Doc } from "../_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const wallId = await ctx.db.insert("walls", {
      title: args.title,
      userId: args.userId,
    });

    return wallId;
  },
});

export const get = query({
  args: { userId: v.union(v.string(), v.null()) },
  handler: async (ctx, args): Promise<Doc<"walls">[]> => {
    if (args.userId === null) return [];
    return await ctx.db
      .query("walls")
      .withIndex("by_user", (q) => q.eq("userId", args.userId!))
      .order("desc")
      .collect();
  },
});

export const getByShareId = query({
  args: { shareId: v.string() },
  handler: async (ctx, args): Promise<Doc<"walls"> | null> => {
    return await ctx.db
      .query("walls")
      .withIndex("by_shareId", (q) => q.eq("shareId", args.shareId))
      .unique();
  },
});

export const update = mutation({
  args: {
    id: v.id("walls"),
    title: v.optional(v.string()),
    shareId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fieldsToUpdate } = args;
    await ctx.db.patch(id, fieldsToUpdate);
    return id;
  },
});

export const deleteWall = mutation({
  args: { id: v.id("walls") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

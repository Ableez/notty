import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Doc } from "../_generated/dataModel";

export const create = mutation({
  args: {
    wallId: v.id("walls"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const noteId = await ctx.db.insert("notes", {
      wallId: args.wallId,
      content: args.content,
    });

    return noteId;
  },
});

export const get = query({
  args: { wallId: v.id("walls") },
  handler: async (ctx, args): Promise<Doc<"notes">[]> => {
    return await ctx.db
      .query("notes")
      .withIndex("by_wall", (q) => q.eq("wallId", args.wallId))
      .order("desc")
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("notes"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...fieldsToUpdate } = args;
    await ctx.db.patch(id, fieldsToUpdate);
    return id;
  },
});

export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

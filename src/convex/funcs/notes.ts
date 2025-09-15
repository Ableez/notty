import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Doc } from "../_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    userId: v.string(),
    tags: v.optional(v.array(v.string())),
    folderId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      content: args.content,
      userId: args.userId,
      isArchived: false,
      isPinned: false,
      lastUpdated: Date.now(),
      tags: args.tags ?? [],
      folderId: args.folderId,
    });

    return noteId;
  },
});

// Get a note by ID
export const getById = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args): Promise<Doc<"notes"> | null> => {
    return await ctx.db.get(args.id);
  },
});

// Get all notes for a user
export const getByUser = query({
  args: { userId: v.union(v.string(), v.null()) },
  handler: async (ctx, args): Promise<Doc<"notes">[]> => {
    if (args.userId === null) return [];
    return await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId!))
      .order("desc")
      .collect();
  },
});

// Get notes by folder
export const getByFolder = query({
  args: {
    userId: v.string(),
    folderId: v.id("folders"),
  },
  handler: async (ctx, args): Promise<Doc<"notes">[]> => {
    return await ctx.db
      .query("notes")
      .withIndex("by_folder", (q) => q.eq("folderId", args.folderId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

// Get archived notes
export const getArchived = query({
  args: { userId: v.string() },
  handler: async (ctx, args): Promise<Doc<"notes">[]> => {
    return await ctx.db
      .query("notes")
      .withIndex("by_user_and_archived", (q) =>
        q.eq("userId", args.userId).eq("isArchived", true),
      )
      .order("desc")
      .collect();
  },
});

// Get pinned notes
export const getPinned = query({
  args: { userId: v.string() },
  handler: async (ctx, args): Promise<Doc<"notes">[]> => {
    return await ctx.db
      .query("notes")
      .withIndex("by_user_and_pinned", (q) =>
        q.eq("userId", args.userId).eq("isPinned", true),
      )
      .order("desc")
      .collect();
  },
});

// Update a note
export const update = mutation({
  args: {
    id: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    isArchived: v.optional(v.boolean()),
    isPinned: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    folderId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    const { id, ...fieldsToUpdate } = args;

    // Only include fields that were provided
    const updateFields: Partial<Doc<"notes">> = {
      ...fieldsToUpdate,
      lastUpdated: Date.now(),
    };

    await ctx.db.patch(id, updateFields);
    return id;
  },
});

// Delete a note permanently
export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Move note to trash
export const trashNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isTrashed: true,
      lastUpdated: Date.now(),
    });
    return args.id;
  },
});

// Restore note from trash
export const restoreNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isTrashed: false,
      lastUpdated: Date.now(),
    });
    return args.id;
  },
});

// Toggle archive status
export const toggleArchive = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) throw new Error("Note not found");

    await ctx.db.patch(args.id, {
      isArchived: !note.isArchived,
      lastUpdated: Date.now(),
    });

    return args.id;
  },
});

// Toggle pin status
export const togglePin = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) throw new Error("Note not found");

    await ctx.db.patch(args.id, {
      isPinned: !note.isPinned,
      lastUpdated: Date.now(),
    });

    return args.id;
  },
});

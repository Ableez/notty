import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    isPinned: v.boolean(),
    isTrashed: v.optional(v.boolean()),
    lastUpdated: v.number(),
    tags: v.array(v.string()),
    folderId: v.optional(v.id("folders")),
  })
    .index("by_user", ["userId"])
    .index("by_folder", ["folderId"])
    .index("by_user_and_archived", ["userId", "isArchived"])
    .index("by_user_and_pinned", ["userId", "isPinned"]),

  folders: defineTable({
    name: v.string(),
    userId: v.string(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    parentFolderId: v.optional(v.id("folders")),
  })
    .index("by_user", ["userId"])
    .index("by_parent", ["parentFolderId"]),

  tags: defineTable({
    name: v.string(),
    userId: v.string(),
    color: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  collaborators: defineTable({
    noteId: v.id("notes"),
    userId: v.string(),
    role: v.string(), // "viewer", "editor", "owner"
    addedAt: v.number(),
  })
    .index("by_note", ["noteId"])
    .index("by_user", ["userId"]),

  attachments: defineTable({
    noteId: v.id("notes"),
    fileName: v.string(),
    fileId: v.string(), // Reference to storage system
    fileSize: v.number(),
    fileType: v.string(),
    uploadedAt: v.number(),
    uploadedBy: v.string(),
  }).index("by_note", ["noteId"]),
});

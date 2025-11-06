import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  walls: defineTable({
    title: v.string(),
    userId: v.string(),
    shareId: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_shareId", ["shareId"]),

  notes: defineTable({
    wallId: v.id("walls"),
    content: v.string(),
  }).index("by_wall", ["wallId"]),
});

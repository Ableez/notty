"use client";

import { useQuery } from "convex/react";
import { api } from "#/convex/_generated/api";

export default function SharedWallPage({ params }: { params: { shareId: string } }) {
  const wall = useQuery(api.walls.getByShareId, {
    shareId: params.shareId,
  });

  const notes = useQuery(
    api.notes.get,
    wall ? { wallId: wall._id } : "skip"
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{wall?.title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notes?.map((note) => (
          <div key={note._id} className="p-4 border rounded-lg">
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

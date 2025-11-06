"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "#/convex/_generated/api";
import { Id } from "#/convex/_generated/dataModel";
import { useState } from "react";
import { createId } from "@paralleldrive/cuid2";

export default function WallPage({ params }: { params: { wallId: Id<"walls"> } }) {
  const notes = useQuery(api.notes.get, {
    wallId: params.wallId,
  });
  const createNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);
  const deleteNote = useMutation(api.notes.deleteNote);
  const updateWall = useMutation(api.walls.update);

  const [editingNoteId, setEditingNoteId] = useState<Id<"notes"> | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const handleCreateNote = async () => {
    await createNote({
      wallId: params.wallId,
      content: "New Note",
    });
  };

  const handleUpdateNote = async (noteId: Id<"notes">) => {
    if (editingContent.trim() === "") {
      await deleteNote({ id: noteId });
    } else {
      await updateNote({
        id: noteId,
        content: editingContent,
      });
    }
    setEditingNoteId(null);
    setEditingContent("");
  };

  const handleDeleteNote = async (noteId: Id<"notes">) => {
    await deleteNote({ id: noteId });
  };

  const handleShare = async () => {
    const shareId = createId();
    await updateWall({
      id: params.wallId,
      shareId: shareId,
    });
    alert(`Share this link: ${window.location.origin}/share/${shareId}`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notes</h1>
        <div>
          <button
            onClick={handleShare}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Share
          </button>
          <button
            onClick={handleCreateNote}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Note
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notes?.map((note) => (
          <div key={note._id} className="p-4 border rounded-lg">
            {editingNoteId === note._id ? (
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                onBlur={() => handleUpdateNote(note._id)}
                className="w-full h-full bg-transparent border-none focus:outline-none"
                autoFocus
              />
            ) : (
              <p
                onClick={() => {
                  setEditingNoteId(note._id);
                  setEditingContent(note.content);
                }}
              >
                {note.content}
              </p>
            )}
            <button
              onClick={() => handleDeleteNote(note._id)}
              className="text-red-500 hover:text-red-700 text-xs mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

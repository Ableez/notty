"use client";

import React, { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "#/convex/_generated/api";
import { type Doc } from "#/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import NoteActions from "#/components/note-actions";
import { IconTrashOff } from "@tabler/icons-react";

type NoteCardProps = {
  note: Doc<"notes">;
  onRestore: () => void;
};

const NoteCard: React.FC<NoteCardProps> = ({ note, onRestore }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const restoreNote = useMutation(api.funcs.notes.restoreNote);

  useEffect(() => {
    if (cardRef.current) {
      autoAnimate(cardRef.current);
    }
  }, []);

  const handleRestore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await restoreNote({
        id: note._id,
      });
      onRestore();
    } catch (error) {
      console.error("Failed to restore note:", error);
    }
  };

  return (
    <div
      ref={cardRef}
      className="animate-fadeIn w-full rounded-lg border bg-white p-2 px-4 transition-all duration-300 ease-in-out hover:shadow-md dark:bg-neutral-900"
    >
      <div className="flex items-center justify-between">
        <h3 className="mb-2 truncate text-lg font-semibold">{note.title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRestore}
            className="rounded-full p-1 text-neutral-500 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400"
          >
            <IconTrashOff className="h-4 w-4" />
          </button>
          <NoteActions note={note} />
        </div>
      </div>
      <p className="line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">
        {note.content}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 transition-all hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-neutral-500">
          {new Date(note.lastUpdated).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

const EmptyTrash: React.FC = () => {
  const emptyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (emptyRef.current) {
      autoAnimate(emptyRef.current);
    }
  }, []);

  return (
    <div
      ref={emptyRef}
      className="animate-fadeIn flex flex-col items-center justify-center py-12"
    >
      <div className="mb-4 rounded-full bg-neutral-100 p-6 transition-transform duration-300 hover:scale-105 dark:bg-neutral-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold">Trash is empty</h2>
      <p className="mb-6 max-w-md text-center text-neutral-600 dark:text-neutral-400">
        Notes you delete will appear here for 30 days before being permanently
        removed.
      </p>
    </div>
  );
};

const TrashPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      autoAnimate(containerRef.current);
    }
  }, []);

  const getTrashedNotes = useQuery(api.funcs.notes.getByUser, {
    userId: user?.id ?? null,
  });

  const trashedNotes =
    getTrashedNotes?.filter((note) => note.isTrashed === true) || [];

  if (!getTrashedNotes) {
    return (
      <div className="animate-pulse p-6 text-center">Loading trash...</div>
    );
  }

  if (!isLoaded) {
    return <div className="animate-pulse p-6 text-center">Please wait...</div>;
  }

  return (
    <div
      ref={containerRef}
      className="container mx-auto p-6 transition-all duration-300"
    >
      <h1 className="mb-6 text-2xl font-bold">Trash</h1>

      {trashedNotes.length === 0 ? (
        <EmptyTrash />
      ) : (
        <div className="animate-fadeIn space-y-4">
          <div className="flex w-full flex-col gap-2">
            {trashedNotes.map((note) => (
              <NoteCard key={note._id} note={note} onRestore={() => {}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrashPage;

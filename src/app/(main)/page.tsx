"use client";

import React, { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "#/convex/_generated/api";
import { type Doc } from "#/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import NoteCard from "#/components/note-card";


const EmptyNotes: React.FC = () => {
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold">No notes yet</h2>
      <p className="mb-6 max-w-md text-center text-neutral-600 dark:text-neutral-400">
        Create your first note to get started with organizing your thoughts and
        ideas.
      </p>
      <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 active:scale-95">
        Create Note
      </button>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const pinnedParentRef = useRef<HTMLDivElement>(null);
  const regularParentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pinnedParentRef.current) {
      autoAnimate(pinnedParentRef.current);
    }
    if (regularParentRef.current) {
      autoAnimate(regularParentRef.current);
    }
    if (containerRef.current) {
      autoAnimate(containerRef.current);
    }
  }, []);

  const notes = useQuery(api.funcs.notes.getByUser, {
    userId: user?.id ?? null,
  });

  if (!notes) {
    return (
      <div className="animate-pulse p-6 text-center">Loading notes...</div>
    );
  }

  const pinnedNotes = notes.filter((note) => note.isPinned);
  const regularNotes = notes.filter(
    (note) => !note.isPinned && !note.isArchived,
  );

  if (!isLoaded) {
    return <div className="animate-pulse p-6 text-center">Please wait...</div>;
  }

  if (isLoaded && (!user || !isSignedIn)) {
    return (
      <div className="animate-fadeIn flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6 dark:bg-neutral-900">
        <h1 className="mb-4 text-center text-3xl font-bold transition-all duration-500 hover:scale-105">
          Welcome to NotesApp
        </h1>
        <p className="max-w-2xl text-center text-neutral-600 transition-opacity duration-300 hover:opacity-80 dark:text-neutral-400">
          Your personal knowledge base for capturing ideas, organizing thoughts,
          and collaborating with others.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="container mx-auto p-2 transition-all duration-300 md:p-6"
    >
      {notes.length === 0 ? (
        <EmptyNotes />
      ) : (
        <div className="animate-fadeIn space-y-8">
          {pinnedNotes.length > 0 && (
            <div className="transition-all duration-300">
              <h2 className="mb-4 flex items-center text-xl font-semibold">
                <span className="mr-2 animate-bounce">📌</span> Pinned Notes
              </h2>
              <div className="flex w-full flex-col gap-2" ref={pinnedParentRef}>
                {pinnedNotes.map((note) => (
                  <NoteCard key={note._id} note={note} />
                ))}
              </div>
            </div>
          )}

          <div className="transition-all duration-300">
            <h2 className="mb-4 text-xl font-semibold">All Notes</h2>
            <div className="flex w-full flex-col gap-2" ref={regularParentRef}>
              {regularNotes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

"use client";

import React from "react";
import {
  IconPin,
  IconTrash,
  IconArchive,
  IconPinFilled,
  IconArchiveOff,
} from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { api } from "#/convex/_generated/api";
import { type Doc } from "#/convex/_generated/dataModel";
import { cn } from "#/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type NoteActionsProps = {
  note: Doc<"notes">;
  onAction?: () => void;
  className?: string;
};

const NoteActions = ({ note, onAction, className }: NoteActionsProps) => {
  const togglePin = useMutation(api.funcs.notes.togglePin);
  const toggleArchive = useMutation(api.funcs.notes.toggleArchive);
  const trashNote = useMutation(api.funcs.notes.trashNote);

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await togglePin({ id: note._id });
      onAction?.();
    } catch (error) {
      console.error("Failed to toggle pin status:", error);
    }
  };

  const handleToggleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleArchive({ id: note._id });
      onAction?.();
    } catch (error) {
      console.error("Failed to toggle archive status:", error);
    }
  };

  const handleTrashNote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      confirm(
        "Are you sure you want to trash this note? This action cannot be undone.",
      )
    ) {
      try {
        await trashNote({ id: note._id });
        onAction?.();
      } catch (error) {
        console.error("Failed to trash note:", error);
      }
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleTogglePin}
              className="rounded-full p-1 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              {note.isPinned ? (
                <IconPinFilled className="h-4 w-4" />
              ) : (
                <IconPin className="h-4 w-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {note.isPinned ? "Unpin note" : "Pin note"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleToggleArchive}
              className="rounded-full p-1 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              {note.isArchived ? (
                <IconArchiveOff className="h-4 w-4" />
              ) : (
                <IconArchive className="h-4 w-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {note.isArchived ? "Unarchive note" : "Archive note"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleTrashNote}
              className="rounded-full p-1 text-neutral-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-red-500">Trash note</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default NoteActions;

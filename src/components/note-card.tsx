"use client";

import type { Doc } from "#/convex/_generated/dataModel";
import autoAnimate from "@formkit/auto-animate";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import NoteActions from "./note-actions";
import { useRouter } from "next/navigation";
import { cn } from "#/lib/utils";

type NoteCardProps = {
  note: Doc<"notes">;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
};

// Constants to avoid recalculation
const SWIPE_THRESHOLD = 100;
const DRAG_CONSTRAINT_MULTIPLIER = 0.4;
const ANIMATION_EXIT_DISTANCE = 500;
const BACKGROUND_OPACITY_MAX = 0.2;

const NoteCard: React.FC<NoteCardProps> = ({ note, onArchive, onDelete }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Use motion values for better performance - no re-renders on drag
  const x = useMotionValue(0);

  // Transform motion values to derived values
  const dragPercentage = useTransform(x, (latest) => {
    const containerWidth = cardRef.current?.clientWidth ?? 300;
    return Math.min(
      Math.abs(latest) / (containerWidth * DRAG_CONSTRAINT_MULTIPLIER),
      1,
    );
  });

  const backgroundOpacity = useTransform(
    dragPercentage,
    [0, 1],
    [0, BACKGROUND_OPACITY_MAX],
  );

  const leftIndicatorOpacity = useTransform(x, [0, 50], [0, 1]);
  const rightIndicatorOpacity = useTransform(x, [-50, 0], [1, 0]);

  const leftIndicatorScale = useTransform(x, [0, 100], [0.9, 1]);
  const rightIndicatorScale = useTransform(x, [-100, 0], [1, 0.9]);

  useEffect(() => {
    if (cardRef.current) {
      autoAnimate(cardRef.current);
    }
  }, []);

  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      const offsetX = info.offset.x;

      if (offsetX > SWIPE_THRESHOLD) {
        // Swipe right → Archive
        x.set(ANIMATION_EXIT_DISTANCE);
        setTimeout(() => onArchive?.(note._id), 200);
      } else if (offsetX < -SWIPE_THRESHOLD) {
        // Swipe left → Delete
        x.set(-ANIMATION_EXIT_DISTANCE);
        setTimeout(() => onDelete?.(note._id), 200);
      } else {
        // Snap back with spring animation
        x.set(0);
      }
    },
    [x, onArchive, onDelete, note._id],
  );

  const handleClick = useCallback(() => {
    router.push(`/note/${note._id}`);
  }, [router, note._id]);

  // Memoize formatted date to avoid recalculation
  const formattedDate = useMemo(
    () => new Date(note.lastUpdated).toLocaleDateString(),
    [note.lastUpdated],
  );

  // Memoize tag elements to avoid recreation
  const tagElements = useMemo(
    () =>
      note.tags.map((tag, index) => (
        <span
          key={index}
          className="rounded-full bg-blue-100/70 px-2 py-0.5 text-xs text-blue-700 transition-all hover:bg-blue-200 dark:bg-blue-800/50 dark:text-blue-200 dark:hover:bg-blue-700"
        >
          #{tag}
        </span>
      )),
    [note.tags],
  );

  return (
    <div ref={cardRef} className="relative w-full overflow-hidden rounded-2xl">
      {/* Background gradient layers - using motion.div for better performance */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(34, 197, 94, 1), transparent)",
          opacity: leftIndicatorOpacity,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to left, rgba(239, 68, 68, 1), transparent)",
          opacity: rightIndicatorOpacity,
        }}
      />

      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition-shadow duration-300 will-change-transform hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
      >
        {/* Title & actions */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {note.title}
          </h3>
          <NoteActions note={note} />
        </div>

        {/* Content */}
        <p className="mt-2 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">
          {note.content}
        </p>

        {/* Tags & Date */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">{tagElements}</div>
          <span className="text-xs text-neutral-400">{formattedDate}</span>
        </div>
      </motion.div>

      {/* Archive indicator */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 left-4 flex items-center"
        style={{
          opacity: leftIndicatorOpacity,
          scale: leftIndicatorScale,
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/90 dark:bg-green-400/90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        </div>
      </motion.div>

      {/* Delete indicator */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 right-4 flex items-center"
        style={{
          opacity: rightIndicatorOpacity,
          scale: rightIndicatorScale,
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/90 dark:bg-red-400/90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default NoteCard;

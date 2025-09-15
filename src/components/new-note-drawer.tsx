"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { IconPlus, IconSquareRoundedPlus } from "@tabler/icons-react";
import NoteForm from "./note-form";

type NewNoteProps = {
  isActive?: boolean;
  onNoteCreated?: () => void;
};

const NewNote: React.FC<NewNoteProps> = ({
  isActive = false,
  onNoteCreated,
}) => {
  const [open, setOpen] = useState(false);

  const isDesktop =
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false;

  const triggerButton = (
    <button
      aria-label="New Note"
      className={`flex w-1/3 cursor-pointer place-items-center justify-center rounded-xl bg-neutral-900 p-3 align-middle text-white transition-all duration-300 ease-in-out hover:bg-neutral-200 active:scale-95 md:h-12 md:w-16 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 dark:hover:text-white`}
    >
      {isActive ? (
        <IconSquareRoundedPlus className="h-6 w-6" />
      ) : (
        <IconPlus className="h-6 w-6" />
      )}
    </button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>New Note</DialogTitle>
            <DialogDescription>Create a new note here.</DialogDescription>
          </DialogHeader>
          <NoteForm
            setOpen={(e: boolean) => setOpen(e)}
            onNoteCreated={onNoteCreated}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>New Note</DrawerTitle>
            <DrawerDescription>Create a new note here.</DrawerDescription>
          </DrawerHeader>
          <NoteForm
            className="p-4"
            setOpen={(e: boolean) => setOpen(e)}
            onNoteCreated={onNoteCreated}
          />
          <DrawerFooter>
            <DrawerClose asChild>
              <button className="w-full rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800">
                Cancel
              </button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NewNote;

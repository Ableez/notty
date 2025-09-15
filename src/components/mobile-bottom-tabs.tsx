"use client";

import {
  IconHome,
  IconHomeFilled,
  IconPlus,
  IconSquareRoundedPlus,
  IconTrash,
  IconTrashFilled,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import NewNote from "./new-note-drawer";
import { cn } from "../lib/utils";

type NavItem = {
  path: string;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  label: string;
};

const MobileBottomTabs: React.FC = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      path: "/",
      activeIcon: <IconHomeFilled className="h-5 w-5" />,
      inactiveIcon: <IconHome className="h-5 w-5" />,
      label: "Home",
    },
    {
      path: "/new",
      activeIcon: <IconSquareRoundedPlus className="h-5 w-5" />,
      inactiveIcon: <IconPlus className="h-5 w-5" />,
      label: "New Note",
    },
    {
      path: "/trash",
      activeIcon: <IconTrashFilled className="h-5 w-5" />,
      inactiveIcon: <IconTrash className="h-5 w-5" />,
      label: "Trash",
    },
  ];

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex w-full items-center justify-around gap-2 bg-white p-1.5 md:hidden dark:bg-neutral-900/80">
      {navItems.map((item) => {
        const isActive = pathname === item.path;

        if (item.path === "/new") {
          return <NewNote key={item.label} isActive={isActive} />;
        }

        return (
          <Link
            href={item.path}
            key={item.path}
            className="flex h-12 w-1/3 cursor-pointer flex-col place-items-center items-center justify-center gap-1 rounded-xl align-middle transition-all duration-300 ease-in-out hover:bg-neutral-200 active:scale-95 dark:hover:bg-neutral-900 dark:hover:text-white"
          >
            <button
              aria-label={item.label}
              className={cn(
                isActive
                  ? "text-blue-600 dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400",
              )}
            >
              {isActive ? item.activeIcon : item.inactiveIcon}
            </button>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileBottomTabs;

"use client";

import {
  IconHome,
  IconHomeFilled,
  IconMenu,
  IconPlus,
  IconSquareRoundedPlus,
  IconTrash,
  IconTrashFilled,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import NewNote from "./new-note-drawer";

type NavItem = {
  path: string;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  label: string;
};

const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      path: "/",
      activeIcon: <IconHomeFilled className="h-6 w-6" />,
      inactiveIcon: <IconHome className="h-6 w-6" />,
      label: "Home",
    },
    {
      path: "/new",
      activeIcon: <IconSquareRoundedPlus className="h-6 w-6" />,
      inactiveIcon: <IconPlus className="h-6 w-6" />,
      label: "New Note",
    },
    {
      path: "/trash",
      activeIcon: <IconTrashFilled className="h-6 w-6" />,
      inactiveIcon: <IconTrash className="h-6 w-6" />,
      label: "Trash",
    },
  ];

  return (
    <div
      className={
        "hidden flex-col place-items-center justify-between p-3 pt-8 align-middle md:flex"
      }
    >
      <div className="aspect-square h-7 w-7 rounded-full border-8 border-blue-600 bg-neutral-50 dark:bg-neutral-950" />

      <div className="flex flex-col place-items-center justify-center gap-2 align-middle">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          if (item.path === "/new") {
            return <NewNote key={item.label} />;
          }
          return (
            <Link href={item.path} key={item.path}>
              <button
                aria-label={item.label}
                className={`flex h-12 w-16 cursor-pointer place-items-center justify-center rounded-xl p-3 align-middle transition-all duration-300 ease-in-out hover:bg-neutral-200 active:scale-95 dark:hover:bg-neutral-800 dark:hover:text-white ${
                  isActive ? "dark:text-white" : "dark:text-neutral-600"
                }`}
              >
                {isActive ? item.activeIcon : item.inactiveIcon}
              </button>
            </Link>
          );
        })}
      </div>
      <div>
        <button className="flex h-12 w-14 cursor-pointer place-items-center justify-center rounded-xl p-3 align-middle transition-all duration-300 ease-in-out hover:bg-neutral-200 active:scale-95 dark:hover:bg-neutral-800">
          <IconMenu className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default DesktopSidebar;

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import React, { type ReactNode } from "react";
import DesktopSidebar from "#/components/desktop-sidebar";
import MobileBottomTabs from "#/components/mobile-bottom-tabs";
import { Button } from "#/components/ui/button";

type Props = {
  children: ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen w-screen">
      <DesktopSidebar />

      <div className={"mx-auto flex h-screen w-full max-w-2xl flex-col"}>
        <div className="flex w-full place-items-center justify-between p-4 align-middle">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>

          <Button>New</Button>
        </div>
        <div className="flex-1 rounded-t-3xl p-4 dark:bg-neutral-900/80">
          {children}
        </div>
      </div>

      <MobileBottomTabs />
    </div>
  );
};

export default MainLayout;

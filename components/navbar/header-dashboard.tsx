"use client";
import React, { useState } from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BellIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Input } from "../ui/input";
import { AccountSwitcher } from "./switcher-account";

export function Headerdashboard() {
  // toggle mata
  const [showBalance, setShowBalance] = useState(true);
  const { state } = useSidebar();
  const sidebarWidth = state === "collapsed" ? "5rem" : "14.5rem";

  const toggleBalance = () => {
    setShowBalance((prev) => !prev);
  };

  interface AccountData {
    listAccounts: AccountMenu[];
  }

  interface AccountMenu {
    name: string;
    balance: string;
  }

  const data: AccountData = {
    listAccounts: [
      {
        name: "Exness",
        balance: "$ 1.000",
      },
      {
        name: "Orbi Trade",
        balance: "$ 5.000",
      },
    ],
  };
  return (
    <>
      <header
        className="fixed top-0 right-0 bg-background h-fit transition-all duration-300 z-30 border-b-1 border-zinc-800 py-4"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100% - ${sidebarWidth})`,
        }}
      >
        <div className="flex h-full items-center justify-between mr-5 mt-1">
          {/* SidebarTrigger di kiri */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger />

            {/* Input search di samping SidebarTrigger */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Cari"
                className="bg-white/5 pl-7 pr-3 py-1.5 text-sm rounded-md border border-none"
              />
              <MagnifyingGlassIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-700" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Bell Icon */}
            <div className="relative">
              <BellIcon className="h-5 w-5 cursor-pointer text-white" />
              <span className="absolute top-0.5 right-1 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-sky-500 text-white" />
            </div>

            {/* Eye Icon */}
            <div onClick={toggleBalance} className="w-5 h-5 cursor-pointer">
              {showBalance ? (
                <EyeIcon className="h-5 w-5 text-white transition-all duration-600 ease-in-out" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 text-white transition-all duration-600 ease-in-out" />
              )}
            </div>

            {/* Account Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <AccountSwitcher
                  accounts={data.listAccounts}
                  showBalance={showBalance}
                />
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}

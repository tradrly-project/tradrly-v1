"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Wallet } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function AccountSwitcher({
  accounts,
  showBalance,
}: {
  accounts: {
    name: string;
    balance: string;
  }[];
  showBalance: boolean;
}) {
  const [activeAccount, setActiveAccount] = React.useState(accounts[0]);

  if (!activeAccount) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="py-5 cursor-pointer pointer-events-auto border w-auto rounded-lg bg-black focus:outline-none focus:ring-0 transform-gpu will-change-transform transition duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_0_8px_1px_rgba(59,130,246,0.2)] hover:bg-black">
          <div className="bg-black text-white flex aspect-square size-6 items-center justify-center rounded-md  ">
            <Wallet className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-[13px] leading-tight text-white">
            <span className="truncate font-medium mb-1">
              {activeAccount.name}
            </span>
            <span className="truncate text-[11px]">
              {showBalance ? activeAccount.balance : "* * * * *"}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-44 p-3 rounded-lg mr-4 bg-background text-foreground "
        align="start"
        side="bottom"
        sideOffset={10}
      >
        <DropdownMenuItem className="gap-2 pt-1 pb-2 mb-2 cursor-pointer ">
          <div className=" flex size-6 items-center justify-center rounded-md bg-background mt-1">
            <Plus className="size-4 text-foreground" />
          </div>
          <div className="text-foreground font-medium">Tambah Akun</div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="h-[0.5px] bg-white/20" />
        
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Akun Kamu
        </DropdownMenuLabel>

        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.name}
            onClick={() => setActiveAccount(account)}
            className="gap-2 p-2 cursor-pointer"
          >
            {account.name}
            <DropdownMenuShortcut>{account.balance}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

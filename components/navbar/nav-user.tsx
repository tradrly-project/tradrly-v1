"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQueryClient } from "@tanstack/react-query";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  if (!session?.user) return null; // or a loading skeleton

  const user = {
    name: session.user.name ?? "Unknown",
    userName: session.user.userName ?? "@Unknown",
    avatar: session.user.image ?? "",
  };

  const menuItems = [
    {
      label: "Upgrade Account",
      icon: Sparkles,
      onClick: () => console.log("Upgrade clicked"),
    },
    {
      label: "Account",
      icon: BadgeCheck,
      onClick: () => console.log("Account clicked"),
    },
    {
      label: "Billing",
      icon: CreditCard,
      onClick: () => console.log("Billing clicked"),
    },
  ];
  const logoutItem = {
    label: "Log out",
    icon: LogOut,
    onClick: () => console.log("Logged out"),
  };

  const handleLogout = async () => {
    queryClient.removeQueries(); // ✅ ini lebih aman daripada .clear()
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group border bg-sidebar cursor-pointer pointer-events-auto
              group-data-[collapsible=icon]:border-none 
              hover:bg-white/10
              hover:text-sidebar-accent
              data-[state=open]:bg-white
              data-[state=open]:text-sidebar
              transition-colors duration-300"
            >
              <Avatar className="h-8 w-8 rounded-lg text-sidebar font-bold group-data-[state=open]:text-sidebar-accent">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback
                  className="rounded-lg text-xl font-bold
                group-data-[state=open]:bg-black
                group-data-[collapsible=icon]:group-data-[state=open]:bg-sidebar-accent
                group-data-[collapsible=icon]:group-data-[state=open]:text-sidebar"
                >
                  {user.name.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.userName}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* Content Dropdown */}
          <DropdownMenuContent
            className="-mt-2 w-[--radix-dropdown-menu-trigger-width] min-w-44 rounded-lg bg-sidebar text-sidebar-accent p-3"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-4 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg text-sidebar font-bold text-xl">
                    {user.name.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.userName}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="h-[0.5px] bg-white/20" />
            <DropdownMenuGroup>
              {menuItems.map((item, i) => (
                <DropdownMenuItem
                  key={i}
                  onClick={item.onClick}
                  className="cursor-pointer text-xs gap-4.5"
                >
                  <item.icon />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="h-[0.5px] bg-white/20" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="py-3 mt-2 cursor-pointer text-xs gap-4.5 hover:!bg-red-600 hover:!text-sidebar-accent"
            >
              <logoutItem.icon className="hover:!text-red-500" />
              {logoutItem.label}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

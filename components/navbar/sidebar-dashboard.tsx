"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { NavUser } from "./nav-user";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "../ui/separator";
import {
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  TableCellsIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

// Menu items.
const MainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Squares2X2Icon,
  },
  {
    title: "Journal",
    url: "/dashboard/journal",
    icon: TableCellsIcon,
  },
  {
    title: "Statistik",
    url: "/dashboard/statistik",
    icon: ArrowTrendingUpIcon,
  },
  {
    title: "Setup Trade",
    url: "/dashboard/setup",
    icon: RectangleStackIcon,
  },
];

const OthersItems = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: WrenchScrewdriverIcon,
  },
  {
    title: "Support",
    url: "/dashboard/support",
    icon: ChatBubbleLeftRightIcon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const user = {
    name: session?.user?.name ?? "Unknown",
    userName: session?.user.userName ?? "@Unknown",
    avatar: session?.user?.image ?? "/avatars/default.jpg",
  };
  
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader className="items-center">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={35}
            height={35}
            priority
            className="items-center group-data-[collapsible=icon]:p-1  "
          />
          <span className=" text-white text-3xl font-semibold mt-1.5 ml-2 group-data-[collapsible=icon]:hidden">
            tradrly
          </span>
        </Link>
        <Separator className="mt-2 bg-zinc-800" />
      </SidebarHeader>
      <SidebarContent className="py-1.5 px-2 group-data-[collapsible=icon]:p-0">
        <SidebarGroup>
          <NavUser user={user}></NavUser>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="-ml-3">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="-ml-3">Others</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {OthersItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

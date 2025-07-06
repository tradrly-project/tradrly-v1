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
import { NavUser } from "./nav-user";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "../ui/separator";
import {
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  BookmarkIcon,
  WrenchScrewdriverIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Menu items.
const MainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Squares2X2Icon,
  },
  {
    title: "Setup Trade",
    url: "/dashboard/setup",
    icon: RectangleStackIcon,
  },
  {
    title: "Journal",
    url: "/dashboard/journal",
    icon: BookmarkIcon,
  },
  {
    title: "Statistik",
    url: "/dashboard/statistics",
    icon: ArrowTrendingUpIcon,
  },
  {
    title: "News",
    url: "/dashboard/news",
    icon: NewspaperIcon,
  },
  
];

const OthersItems = [
  {
    title: "Pengaturan",
    url: "/dashboard/settings/user",
    icon: WrenchScrewdriverIcon,
  },
  {
    title: "Support",
    url: "/dashboard/support",
    icon: ChatBubbleLeftRightIcon,
  },
];

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

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
          <NavUser />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="-ml-3">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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

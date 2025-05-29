
import { Headerdashboard } from "@/components/navbar/header-dashboard";
import { AppSidebar } from "@/components/navbar/sidebar-dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1">
          <Headerdashboard />
          <main className="mt-16 p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
    </SessionProvider>
  );
}

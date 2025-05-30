import { DynamicBreadcrumb } from "@/components/asset/breadcrumb";
import { Headerdashboard } from "@/components/navbar/header-dashboard";
import { AppSidebar } from "@/components/navbar/sidebar-dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Headerdashboard />
            <main className="flex-1 mt-18.5 p-4 flex flex-col min-h-[calc(100vh-4rem)]">
              <header className="flex h-8 shrink-0 items-center mb-2 justify-between">
                <DynamicBreadcrumb />
              </header>
              <div className="flex-1">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}

import { DynamicBreadcrumb } from "@/components/asset/breadcrumb";
import { Headerdashboard } from "@/components/navbar/header-dashboard";
import { AppSidebar } from "@/components/navbar/sidebar-dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth(); // Ambil session di level server
  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar /> {/* AppSidebar dapat session dari auth() secara internal */}
          <div className="flex-1 flex flex-col">
            <Headerdashboard /> {/* Tidak perlu session di sini */}
            <main className="flex-1 mt-11 p-4 flex flex-col min-h-[calc(100vh-4rem)]">
              <header className="sticky top-[78px] z-20 bg-background pt-2 bg-red- mb-4">
                <div className="flex h-8 items-center px-1">
                  <DynamicBreadcrumb />
                </div>
              </header>
              <div className="flex-1">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}

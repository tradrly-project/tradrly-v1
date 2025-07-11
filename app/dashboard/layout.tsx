// app/dashboard/layout.tsx
import { DynamicBreadcrumb } from "@/components/asset/breadcrumb";
import { Headerdashboard } from "@/components/navbar/header-dashboard";
import { AppSidebar } from "@/components/navbar/sidebar-dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { QueryProvider } from "@/components/query-provider"; // ✅ Tambahkan ini
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <QueryProvider>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Headerdashboard />
              <main className="flex-1 mt-11 p-4 flex flex-col min-h-[calc(100vh-4rem)]">
                <header className="sticky top-[78px] z-20 bg-background pt-2 mb-4">
                  <div className="flex h-8 items-center px-1">
                    <DynamicBreadcrumb />
                  </div>
                </header>

                {/* ✅ TanStack Query aktif di seluruh dashboard */}

                <div className="flex-1">{children}</div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </QueryProvider>
    </SessionProvider>
  );
}

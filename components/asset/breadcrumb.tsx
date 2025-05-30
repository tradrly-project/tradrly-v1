"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Split path dan hilangkan 'dashboard' dari breadcrumb karena ditampilkan statis
  const pathSegments = pathname
    .split("/")
    .filter((seg) => seg && seg !== "dashboard");

  // Untuk membangun href dinamis berdasarkan path
  const generatePath = (index: number) => {
    // tambahkan '/dashboard' sebagai prefix ke semua breadcrumb path
    return "/dashboard/" + pathSegments.slice(0, index + 1).join("/");
  };

  // Optional: mapping segment → label lebih ramah
  const nameMap: Record<string, string> = {
    "edit-profile": "Edit Profile",
    "user-settings": "User Settings",
    users: "Users",
    posts: "Posts",
    // tambahkan lainnya sesuai kebutuhan
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Statis awal: Dashboard */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="text-sm">
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dinamis dari segment */}
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = generatePath(index);

          const formatted =
            nameMap[segment] ||
            segment
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <div key={href} className="flex items-center text-sm">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formatted}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{formatted}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

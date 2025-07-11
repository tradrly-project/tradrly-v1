import type { Metadata } from "next";
import "@/app/globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Tradrly",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        {children}
        <Toaster
        position="top-center"
        theme="dark"
        richColors={false}
        />
      </body>
    </html>
  );
}

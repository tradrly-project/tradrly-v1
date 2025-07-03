// app/dashboard/journal/page.tsx

import { auth } from "@/auth";
import JournalClient from "@/app/dashboard/journal/journal-client";
import { redirect } from "next/navigation";


export default async function JournalPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User tidak terautentikasi");
    redirect("/login");
  }

  return (
    <JournalClient />
  );
}

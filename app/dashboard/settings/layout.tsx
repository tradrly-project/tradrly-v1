import { auth } from "@/auth"; // ini fungsi `auth()` dari NextAuth, server-only
import { SessionProvider } from "@/context/session-context";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth(); // server-side session fetch (sekali, tanpa API hit)

  return (
    <SessionProvider session={session!}>
      {children}
    </SessionProvider>
  );
}

"use client";

import { Session } from "next-auth";
import { createContext, useContext } from "react";

const SessionContext = createContext<Session | null>(null);

export function useAppSession() {
  return useContext(SessionContext);
}

export function SessionProvider({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

import { type DefaultSession } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      userName: string;
      accounts: { id: string; brokerName: string }[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    userName: string;
    accounts: { id: string; brokerName: string }[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    role: string;
    userName: string;
    accounts: { id: string; brokerName: string }[];
  }
}

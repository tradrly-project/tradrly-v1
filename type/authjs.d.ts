// type/authjs.d.ts

import { type DefaultSession } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

// Tambahkan tipe untuk SubscriptionPlan
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  tier: string; // bisa juga pakai enum kalau kamu define
  features: JsonValue | null; // bisa disesuaikan jika kamu punya tipe khusus
}

interface Subscription {
  status: "active" | "cancelled" | "expired";
  startedAt: string; // ISO Date string
  endsAt: string;    // ISO Date string
  plan: SubscriptionPlan;
}


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      userName: string;
      accounts: { id: string; brokerName: string }[];
      subscription?: Subscription;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    userName: string;
    accounts: { id: string; brokerName: string }[];
    subscription?: Subscription;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    role: string;
    userName: string;
    accounts: { id: string; brokerName: string }[];
    subscription?: Subscription;
  }
}

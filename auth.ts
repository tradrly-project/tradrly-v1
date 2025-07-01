// auth.ts
export const runtime = "nodejs";

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { SigninSchema } from "@/lib/zod";
import { compare } from "bcrypt-ts";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 2, // 2 jam
    updateAge: 60 * 60,  // refresh token setiap 1 jam
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const validated = SigninSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            accounts: true,
            subscriptions: {
              where: { status: "active" },
              include: { plan: true },
            },
          },
        });

        if (!user || !user.password) throw new Error("Akun belum terdaftar");

        const match = await compare(password, user.password);
        if (!match) return null;

        return {
          id: user.id,
          name: user.name,
          userName: user.username,
          email: user.email,
          role: user.role,
          accounts: user.accounts.map((acc) => ({
            id: acc.id,
            brokerName: acc.brokerName,
          })),
          subscription: user.subscriptions?.[0] && {
            status: user.subscriptions[0].status,
            startedAt: user.subscriptions[0].startedAt.toISOString(),
            endsAt: user.subscriptions[0].endsAt.toISOString(),
            plan: {
              id: user.subscriptions[0].plan.id,
              name: user.subscriptions[0].plan.name,
              price: user.subscriptions[0].plan.price.toNumber(),
              tier: user.subscriptions[0].plan.tier,
              features: user.subscriptions[0].plan.features,
            },
          },
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accounts = user.accounts;
        token.userName = user.userName;
        token.email = user.email;
        token.subscription = user.subscription;
      }
      return token;
    },
    async session({ session, token }) {
      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub },
        include: {
          accounts: true,
          subscriptions: {
            where: { status: "active" },
            include: { plan: true },
          },
        },
      });

      if (!dbUser) return session;

      session.user = {
        ...session.user,
        id: dbUser.id,
        name: dbUser.name,
        userName: dbUser.username,
        email: dbUser.email,
        image: dbUser.image,
        role: dbUser.role,
        accounts: dbUser.accounts.map((acc) => ({
          id: acc.id,
          brokerName: acc.brokerName,
        })),
        subscription: dbUser.subscriptions?.[0] && {
          status: dbUser.subscriptions[0].status,
          startedAt: dbUser.subscriptions[0].startedAt.toISOString(),
          endsAt: dbUser.subscriptions[0].endsAt.toISOString(),
          plan: {
            id: dbUser.subscriptions[0].plan.id,
            name: dbUser.subscriptions[0].plan.name,
            price: dbUser.subscriptions[0].plan.price.toNumber(),
            tier: dbUser.subscriptions[0].plan.tier,
            features: dbUser.subscriptions[0].plan.features,
          },
        },
      };

      return session;
    },
  },
});

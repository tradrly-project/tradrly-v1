import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { SigninSchema } from "@/lib/zod";
import { compareSync } from "bcrypt-ts";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedFields = SigninSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            accounts: true,
            subscriptions: {
              where: {
                status: "active",
              },
              include: {
                plan: true,
              },
            },
          },
        });

        if (!user || !user.password) throw new Error("Akun belum terdaftar");

        const passwordMatch = compareSync(password, user.password);
        if (!passwordMatch) return null;

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

  // callback
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const ProtectedRoutes = ["/dashboard", "/user"];
      if (!isLoggedIn && ProtectedRoutes.includes(nextUrl.pathname)) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },

    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accounts = user.accounts;
        token.userName = user.userName;
        token.email = user.email;
        token.subscription = user.subscription;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub!,
          role: token.role,
          accounts: token.accounts,
          userName: token.userName,
          email: token.email,
          subscription: token.subscription,
        },
      };
    },
  },
});

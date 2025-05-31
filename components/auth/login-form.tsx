"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/button";
import Link from "next/link";
import { signInCredentials } from "@/lib/actions/auth";
import { useActionState } from "react";
import { ShineBorder } from "../magicui/shine-border";
import { Input } from "@/components/input-glow";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    signInCredentials,
    null
  );

  return (
    <div className="relative mt-6 w-full max-w-md p-[2px] rounded-2xl overflow-hidden">
      <ShineBorder shineColor={"white"} />
      <div className=" relative z-10 rounded-2xl bg-black p-4 md:p-8 shadow-input">
        <h2 className="md: text-5xl font-bold text-white">Tradrly</h2>
        <p className="mt-5 max-w-sm text-sm text-white">
          Selamat Datang Kembali!
        </p>

        <form className="my-8 w-64 md:w-80" action={formAction}>
          {state?.message && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100">
              <span className="font-medium">{state.message}</span>
            </div>
          )}
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="emailkamu@gmail.com"
              type="email"
            />
            <FieldError>{state?.errors?.email}</FieldError>
          </LabelInputContainer>

          <LabelInputContainer className="mb-8">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              className="bg-zinc-900"
            />
            <FieldError>{state?.errors?.password}</FieldError>
          </LabelInputContainer>

          <LoginButton
            type="submit"
            className="w-full flex flex-1 items-center justify-center"
            disabled={isPending}
            isLoading={isPending}
          >
            <span className="text-md text-foreground">Masuk</span>
          </LoginButton>

          <div className="my-7 text-sm text-zinc-200">
            Belum punya akun?
            <Link href="/register" className="ml-2 text-sky-400">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);

const FieldError = ({ children }: { children?: string | string[] }) => {
  if (!children) return null;
  return (
    <div className="-mt-3 ml-2">
      <span className="text-xs text-red-700">
        {Array.isArray(children) ? children.join(", ") : children}
      </span>
    </div>
  );
};

"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/input-glow";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { RegisterButton } from "@/components/button";
import Link from "next/link";
import { signUpCredentials } from "@/lib/actions/auth";
import { useActionState } from "react";
import { ShineBorder } from "../magicui/shine-border";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    signUpCredentials,
    null
  );

  return (
    <div className="relative rounded-3xl w-full flex items-center justify-center bg-background p-[2.5px]">
        <ShineBorder shineColor={"white"} />
      <div className="relative z-10 rounded-2xl p-8 -px-0.5 shadow-input w-full bg-background">
          <h2 className="text-4xl font-bold text-white">Tradrly</h2>
          <p className="mt-1 text-sm text-white">
            Buat akun Anda untuk memulai pengalaman Anda dengan Tradrly!
          </p>

          <form className="mt-8 space-y-4" action={formAction}>
            {state?.message && (
              <div className="p-4 text-sm text-red-800 rounded-lg bg-red-100 w-full">
                <span className="font-medium">{state.message}</span>
              </div>
            )}

            {/* Nama - 1 baris penuh */}
            <LabelInputContainer className="w-full">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" placeholder="Nama" />
              <FieldError>{state?.errors?.name}</FieldError>
            </LabelInputContainer>

            {/* Username + Email */}
            <div className="flex flex-col md:flex-row gap-4">
              <LabelInputContainer className="w-full md:w-1/2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="email@gmail.com"
                  type="email"
                />
                <FieldError>{state?.errors?.email}</FieldError>
              </LabelInputContainer>
              <LabelInputContainer className="w-full md:w-1/2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" placeholder="user_123" />
                <FieldError>{state?.errors?.username}</FieldError>
              </LabelInputContainer>
            </div>

            {/* Password + Konfirmasi Password */}
            <div className="flex flex-col md:flex-row gap-4">
              <LabelInputContainer className="w-full md:w-1/2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                />
                <FieldError>{state?.errors?.password}</FieldError>
              </LabelInputContainer>

              <LabelInputContainer className="w-full md:w-1/2">
                <Label htmlFor="ConfirmPassword">Konfirmasi Password</Label>
                <Input
                  id="ConfirmPassword"
                  name="ConfirmPassword"
                  placeholder="••••••••"
                  type="password"
                />
                <FieldError>{state?.errors?.ConfirmPassword}</FieldError>
              </LabelInputContainer>
            </div>

            {/* Tombol Submit */}
            <div className="w-full pt-2">
              <RegisterButton
                type="submit"
                className="w-full flex items-center justify-center"
                disabled={isPending}
                isLoading={isPending}
              >
                Daftar Sekarang
              </RegisterButton>
            </div>

            {/* Link login */}
            <div className="text-sm text-zinc-200 text-left">
              Sudah punya akun?
              <Link href="/login" className="ml-2 text-sky-400">
                Masuk
              </Link>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center w-full">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-zinc-400 to-transparent" />
              <span className="mx-4 text-sm text-neutral-400">Atau</span>
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-zinc-400 to-transparent" />
            </div>

            {/* Daftar dengan Google */}
            <div className="flex justify-center">
              <button
                type="button"
                className="w-full group/btn relative flex h-10 items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900"
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Daftar Lewat Google
                </span>
                <BottomGradient />
              </button>
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

const BottomGradient = () => (
  <span className="absolute inset-x-0 -bottom-px block h-px w-auto bg-gradient-to-r from-transparent via-sky-900 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
);

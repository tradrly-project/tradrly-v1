"use client";
import React from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { cn } from "@/lib/utils"; // jika Anda pakai className helper
import { Loader2 } from "lucide-react"; // spinner icon

type RegisterButtonProps = {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type LoginButtonProps = {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type MainButtonProps = {
    children: React.ReactNode;
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function RegisterButton({
  children,
  className,
  isLoading = false,
  disabled,
  ...props
}: RegisterButtonProps) {
  return (
    <HoverBorderGradient
      containerClassName="rounded-full w-full"
      as="button"
      className={cn(
        "flex items-center justify-center space-x-2 cursor-pointer",
        className,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin w-5 h-5 text-white" />
          <span>Tunggu</span>
        </>
      ) : (
        children
      )}
    </HoverBorderGradient>
  );
}

export function LoginButton({
  children,
  className,
  isLoading = false,
  disabled,
  ...props
}: LoginButtonProps) {
  return (
    <HoverBorderGradient
      containerClassName="rounded-full w-full"
      as="button"
      className={cn(
        "flex items-center justify-center space-x-2 cursor-pointer",
        className,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin w-5 h-5 text-white" />
          <span>Tunggu</span>
        </>
      ) : (
        children
      )}
    </HoverBorderGradient>
  );
}

export function MainButton({ children, className, ...props }: MainButtonProps) {
    return (
        <HoverBorderGradient
            containerClassName="rounded-full w-full"
            as="button"
            className={`flex font-semibold items-center justify-center space-x-2 cursor-pointer ${className ?? ""}`}
            {...props}
        >
            {children}
        </HoverBorderGradient>
    );
}
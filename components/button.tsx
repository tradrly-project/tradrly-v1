"use client";
import React, { useTransition } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { cn } from "@/lib/utils"; // jika Anda pakai className helper
import { Loader2, Trash2 } from "lucide-react"; // spinner icon
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "./asset/confirm-dialog";
import { notifyError, notifySuccess } from "./asset/notify";

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

type DeleteButtonProps = {
  id: string;
  type: "setup" | "journal"; // extendable: "user", "journal", dll
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  buttonText?: string;
  iconOnly?: boolean;
  disabled?: boolean;
  onSuccess?: () => void;
};

export type SetupPayload = {
  name: string;
  strategy: string;
  notes?: string;
  indicatorIds: string[];
  timeframe: string[];
};

export type ScreenshotPayload = {
  type: "BEFORE" | "AFTER";
  url: string;
};

export type TradePayload = {
  date: string;
  setupTradeId?: string;
  psychologyIds: string[];
  direction: "buy" | "sell";
  entryPrice: number;
  takeProfit: number;
  stoploss: number;
  exitPrice: number;
  lotSize: number;
  notes?: string;
  screenshots?: ScreenshotPayload[];
};


type SaveChangesButtonProps<T> = {
  id: string;
  payload: T | (() => Promise<T>);
  type: "setup" | "journal"; // bisa kamu tambah "journal", "user", dll
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  buttonText?: string;
  disabled?: boolean;
  onSuccess?: () => void;
};


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
      className={`flex font-semibold items-center justify-center space-x-2 cursor-pointer ${className ?? ""
        }`}
      {...props}
    >
      {children}
    </HoverBorderGradient>
  );
}

export function SubmitButton({
  children = "Simpan",
}: {
  children?: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="cursor-pointer py-4 px-8"
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Tunggu..." : children}
    </Button>
  );
}

export function DeleteButton({
  id,
  type,
  onSuccess,
  disabled = false,
  title = "Konfirmasi Hapus Data",
  description = "Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.",
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  buttonText = "Hapus",
  iconOnly = false,
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/${type}/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Gagal menghapus data");

        notifySuccess("Data berhasil dihapus");
        onSuccess?.();
      } catch (err) {
        console.error(err);
        notifyError("Gagal menghapus data");
      }
    });
  };

  return (
    <ConfirmDialog
      trigger={
        <Button
          variant="destructive"
          size="sm"
          disabled={isPending || disabled}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menghapus...
            </>
          ) : iconOnly ? (
            <Trash2 className="w-4 h-4" />
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              {buttonText}
            </>
          )}
        </Button>
      }
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={handleDelete}
      isLoading={isPending}
      disabled={disabled}
    />
  );
}

export function SaveChangesButton<T extends SetupPayload | TradePayload>({
  id,
  type,
  payload,
  onSuccess,
  disabled = false,
  title = "Konfirmasi Simpan Perubahan",
  description = "Apakah kamu yakin ingin menyimpan perubahan ini?",
  confirmText = "Ya, Simpan",
  cancelText = "Batal",
  buttonText = "Simpan",
}: SaveChangesButtonProps<T>) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    startTransition(async () => {
      try {
        const resolvedPayload = typeof payload === "function"
          ? await payload()
          : payload;

        const res = await fetch(`/api/${type}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resolvedPayload),
        });

        if (!res.ok) throw new Error("Gagal menyimpan perubahan");

        notifySuccess("Perubahan berhasil disimpan");
        onSuccess?.();
        router.refresh();
      } catch (err) {
        console.error(err);
        notifyError("Gagal menyimpan perubahan");
      }
    });
  };

  return (
    <ConfirmDialog
      trigger={
        <Button disabled={isPending || disabled}>
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isPending ? "Menyimpan..." : buttonText}
        </Button>
      }
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={handleSave}
      isLoading={isPending}
      disabled={disabled}
    />
  );
}




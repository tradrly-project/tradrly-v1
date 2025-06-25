"use client";
import React, { useTransition } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { cn } from "@/lib/utils"; // jika Anda pakai className helper
import { Loader2 } from "lucide-react"; // spinner icon
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "./asset/confirm-dialog";

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
  onSuccess?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  buttonText?: string;
  disabled?: boolean;
};

type SaveChangesButtonProps = {
  setupId: string;
  payload: {
    name: string;
    strategy: string;
    notes?: string;
    indicatorIds: string[];
    timeframe: string[];
  };
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
      className={`flex font-semibold items-center justify-center space-x-2 cursor-pointer ${
        className ?? ""
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
  onSuccess,
  title = "Yakin ingin menghapus data ini?",
  description = "Tindakan ini tidak bisa dibatalkan.",
  confirmText = "Hapus",
  cancelText = "Batal",
  buttonText = "Hapus",
  disabled = false,
}: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/setup/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Gagal menghapus setup");

        toast.success("Data berhasil dihapus");
        onSuccess?.(); // optional callback
        router.refresh();
      } catch (err) {
        console.error(err);
        toast.error("Gagal menghapus data");
      }
    });
  };

  return (
    <ConfirmDialog
      trigger={
        <Button variant="default" disabled={isPending || disabled} className="border-red-700">
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isPending ? "Menghapus..." : buttonText}
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

export function SaveChangesButton({
  setupId,
  payload,
  onSuccess,
  disabled = false,
  title = "Konfirmasi Simpan Perubahan",
  description = "Apakah kamu yakin ingin menyimpan perubahan pada setup ini?",
  confirmText = "Ya, Simpan",
  cancelText = "Batal",
  buttonText = "Simpan",
}: SaveChangesButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/setup/${setupId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Gagal menyimpan perubahan");

        toast.success("Perubahan berhasil disimpan");
        onSuccess?.();
        router.refresh();
      } catch (err) {
        console.error(err);
        toast.error("Gagal menyimpan perubahan");
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


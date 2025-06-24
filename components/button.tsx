"use client";
import React, { useTransition } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { cn } from "@/lib/utils"; // jika Anda pakai className helper
import { Loader2 } from "lucide-react"; // spinner icon
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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

export function DeleteButton({ id }: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/setup/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Gagal menghapus setup");
        }

        toast.success("Setup berhasil dihapus");
        router.refresh(); // atau router.push("/setup")
      } catch (err) {
        console.log(err);
        toast.error("Gagal menghapus setup");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Yakin ingin menghapus setup ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak bisa dibatalkan. Data setup akan dihapus secara
            permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function SaveChangesButton({
  setupId,
  payload,
  disabled = false,
  onSuccess,
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

        if (!res.ok) {
          throw new Error("Gagal menyimpan perubahan");
        }

        toast.success("Perubahan berhasil disimpan");
        onSuccess?.(); // Optional: nonaktifkan edit mode, dll
        router.refresh();
      } catch (err) {
        console.log(err);
        toast.error("Gagal menyimpan perubahan");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled || isPending} type="button">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              Simpan
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Simpan Perubahan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin menyimpan perubahan pada setup ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave} disabled={isPending}>
            Ya, Simpan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


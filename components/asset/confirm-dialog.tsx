// components/common/ConfirmDialog.tsx
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
import { ReactNode } from "react";

interface ConfirmDialogProps {
    trigger: ReactNode;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export function ConfirmDialog({
    trigger,
    title,
    description,
    confirmText = "Hapus",
    cancelText = "Batal",
    onConfirm,
    isLoading = false,
    disabled = false,
}: ConfirmDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading || disabled}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={isLoading || disabled}>
                        {isLoading ? "Memproses..." : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
  
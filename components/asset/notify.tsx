import { toast } from "sonner";
import { AnimatedCheckStroke, AnimatedXStroke } from "./animatednotif";

export function notifySuccess(message = "Berhasil disimpan!") {
  toast.success(message, {
    className: "bg-background text-sky-500 border border-white",
    icon: <AnimatedCheckStroke />, // 👈 ini dia
    position: "top-center",
    duration: 4000,
  });
}

export function notifyError(message = "Gagal menyimpan data!") {
  toast.error(message, {
    className: "bg-background text-red-500 border border-white",
    icon: <AnimatedXStroke />,
    position: "top-center",
    duration: 4000,
  });
}
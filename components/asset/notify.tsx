import { toast } from "sonner"
import { CheckCircle, XCircle } from "lucide-react"

export function notifySuccess(message: string = "Berhasil disimpan!") {
  toast.success(message, {
    className: "bg-background text-sky-500 border border-white",
    icon: <CheckCircle className="text-sky-500 w-5 h-5" />,
    position: "top-center",
    duration: 4000,
  })
}

export function notifyError(message: string = "Gagal menyimpan data!") {
  toast.error(message, {
    className: "bg-background text-red-500 border border-white",
    icon: <XCircle className="text-red-500 w-5 h-5" />,
    position: "top-center",
    duration: 4000,
  })
}

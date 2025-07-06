"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { notifyError, notifySuccess } from "../asset/notify";
import { ConfirmDialog } from "../asset/confirm-dialog";

export default function UserSettingsForm() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    image: "",
    subscription: {
      status: "",
      plan: { name: "" },
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (
    field: keyof typeof passwordForm,
    value: string
  ) => {
    setPasswordForm({ ...passwordForm, [field]: value });
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        userName: session.user.userName || "",
        email: session.user.email || "",
        image: session.user.image || "",
        subscription: session.user.subscription || {
          status: "expired",
          plan: { name: "-" },
        },
      });
      setLoading(false);
    }
  }, [session]);

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.userName,
          email: formData.email,
          image: formData.image,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menyimpan data");

      notifySuccess("Data berhasil diperbarui!");

      // Paksa refresh session agar data langsung update
      await update();

      setFormData((prev) => ({
        ...prev,
        name: result.name,
        userName: result.username,
        email: result.email,
        image: result.image || "",
      }));

      setIsEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        notifyError(err.message);
      } else {
        notifyError("Terjadi kesalahan yang tidak diketahui.");
      }
    }
  };

  const handleSubmitPassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notifyError("Konfirmasi password tidak cocok");
      return;
    }

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordForm),
      });

      const result = await res.json();

      if (!res.ok) {
        notifyError(result.error || "Gagal mengganti password");
        return;
      }

      notifySuccess("Password berhasil diubah. Silahkan login kembali.");

      setTimeout(() => {
        signOut({ callbackUrl: "/login" }); // Logout dan redirect ke /login
      }, 1500);

      setIsPasswordDialogOpen(false);
    } catch (err) {
      console.error(err);
      notifyError("Terjadi kesalahan saat mengganti password");
    }
  };

  const badgeMap = {
    active: { label: "Aktif", className: "bg-sky-500 text-white" },
    cancelled: { label: "Ditangguhkan", className: "bg-zinc-900 text-white" },
    expired: { label: "Expired", className: "bg-red-500 text-white" },
  } as const;

  const badge =
    badgeMap[formData.subscription?.status as keyof typeof badgeMap];

  if (loading)
    return <div className="text-sm text-muted-foreground">Memuat data...</div>;

  return (
    <div className="w-[40%] h-full">
      <Card className="bg-background shadow-md rounded-2xl min-h-[100%]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground text-lg font-semibold tracking-tight">
            Pengaturan User
          </CardTitle>
          <Button className="cursor-pointer" size="sm">
            Upgrade Plan
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col-3 justify-between h-auto">
            <div className="flex items-center">
              <Avatar className="rounded-lg w-18 h-18">
                <AvatarImage src={formData.image || "#"} alt="@user" />
                <AvatarFallback className="p-2">
                  <span className="text-5xl font-bold">
                    {formData.name.charAt(0).toUpperCase() || "?"}
                  </span>
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col pl-5 text-foreground gap-1">
                {isEditing ? (
                  <>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Nama"
                    />
                    <Input
                      value={formData.userName}
                      onChange={(e) =>
                        handleInputChange("userName", e.target.value)
                      }
                      placeholder="Username"
                    />
                  </>
                ) : (
                  <>
                    <Label className="text-[16px] font-bold">
                      {formData.name}
                    </Label>
                    <Label className="text-[14px] font-bold text-zinc-700">
                      @{formData.userName}
                    </Label>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col text-foreground">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <ConfirmDialog
                    trigger={
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                      >
                        Simpan
                      </Button>
                    }
                    title="Konfirmasi Perubahan User"
                    description="Apakah kamu yakin ingin menyimpan perubahan ini?"
                    confirmText="Ya, Simpan"
                    cancelText="Batal"
                    onConfirm={handleSave}
                  />
                  <Button
                    size="sm"
                    onClick={handleEditToggle}
                    className="cursor-pointer"
                  >
                    Batal
                  </Button>
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={handleEditToggle}
                      className="cursor-pointer"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          <div className="flex flex-col mt-6 text-foreground gap-4">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <Label className="text-sm font-bold">Email</Label>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-60"
                />
              ) : (
                <span className="text-sm text-foreground mr-2">
                  {formData.email}
                </span>
              )}
            </div>

            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <Label className="text-sm font-bold">Password</Label>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPasswordDialogOpen(true)}
                  >
                    Ubah Password
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground font-mono tracking-widest">
                    ●●●●●●
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <Label className="text-sm font-bold">Status Akun</Label>
              {badge && (
                <Badge className={`text-xs mr-2 rounded-sm ${badge.className}`}>
                  {badge.label}
                </Badge>
              )}
            </div>

            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <Label className="text-sm font-bold">Limit Jurnal</Label>
              <span className="text-sm text-foreground mr-2">5 dari 10</span>
            </div>

            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <Label className="text-sm font-bold">Paket Akun</Label>
              <Badge className="rounded-sm">
                {formData.subscription?.plan?.name || "-"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent
          className="w-[20%] py-4"
          showCloseButton={false}
        >
          <div className="flex justify-between items-center mb-2 w-full">
            <DialogTitle className="text-xl">Ubah Password</DialogTitle>
          </div>
          <div className="flex flex-col gap-6 py-2">
            <Input
              type="password"
              placeholder="Password lama"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                handlePasswordChange("oldPassword", e.target.value)
              }
            />
            <Input
              type="password"
              placeholder="Password baru"
              value={passwordForm.newPassword}
              onChange={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
            />
            <Input
              type="password"
              placeholder="Konfirmasi password baru"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                handlePasswordChange("confirmPassword", e.target.value)
              }
            />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setIsPasswordDialogOpen(false)}>
              Batal
            </Button>
            <ConfirmDialog
              trigger={<Button type="button" variant="outline" >Simpan</Button>}
              title="Konfirmasi Ubah Password"
              description="Apakah kamu yakin ingin mengubah password?"
              confirmText="Ya, Ubah"
              cancelText="Batal"
              onConfirm={handleSubmitPassword}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

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
import { useAppSession } from "@/context/session-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function UserSettingsForm() {
  const session = useAppSession();
  const status = session?.user.subscription?.status;

  const statusMap = {
    active: {
      label: "Aktif",
      className: "bg-sky-500 text-white",
    },
    cancelled: {
      label: "Ditangguhkan",
      className: "bg-zinc-900 text-white",
    },
    expired: {
      label: "Expired",
      className: "bg-red-500 text-white",
    },
  } as const;

  const badge = status ? statusMap[status] : null;

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user.name || "",
    userName: session?.user.userName || "",
    email: session?.user.email || "",
    image: session?.user.image || "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  return (
    <div className="w-[40%]">
      <Card className="bg-background shadow-md rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground text-lg font-semibold tracking-tight">
            Pengaturan User
          </CardTitle>
          <Button className="cursor-pointer" size="sm">
            Upgrade Plan
          </Button>
        </CardHeader>

        <CardContent>
          {/* Header */}
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
                      {session?.user.name}
                    </Label>
                    <Label className="text-[14px] font-bold text-zinc-700">
                      @{session?.user.userName}
                    </Label>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col text-foreground">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm">
                        Simpan
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Simpan perubahan</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEditToggle}
                      >
                        Batal
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Batal edit</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" onClick={handleEditToggle} className="cursor-pointer">
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

          {/* Body */}
          <div className="flex flex-col mt-6 text-foreground gap-4">
            {/* Email */}
            <div className="flex flex-row items-center justify-between border-b border-zinc-800 pb-2">
              <Label className="text-sm font-bold">Email</Label>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-60"
                />
              ) : (
                <span className="text-sm text-foreground mr-2">
                  {session?.user.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-row items-center justify-between border-b border-zinc-800 pb-2">
              <Label className="text-sm font-bold">Password</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPasswordDialogOpen(true)}
              >
                Ubah Password
              </Button>
            </div>

            {/* Status Akun */}
            <div className="flex flex-row items-center justify-between border-b border-zinc-800 pb-2">
              <Label className="text-sm font-bold">Status Akun</Label>
              {badge && (
                <Badge className={`text-xs mr-2 rounded-sm ${badge.className}`}>
                  {badge.label}
                </Badge>
              )}
            </div>

            {/* Limit */}
            <div className="flex flex-row items-center justify-between border-b border-zinc-800 pb-2">
              <Label className="text-sm font-bold">Limit Jurnal</Label>
              <span className="text-sm text-foreground mr-2">5 dari 10</span>
            </div>

            {/* Paket Akun */}
            <div className="flex flex-row items-center justify-between border-b border-zinc-800 pb-2">
              <Label className="text-sm font-bold">Paket Akun</Label>
              <span className="text-sm text-foreground mr-2">
                <Badge className="rounded-sm">
                  {session?.user.subscription?.plan.name}
                </Badge>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Ubah Password */}
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ubah Password</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <Input type="password" placeholder="Password lama" />
            <Input type="password" placeholder="Password baru" />
            <Input type="password" placeholder="Konfirmasi password baru" />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPasswordDialogOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

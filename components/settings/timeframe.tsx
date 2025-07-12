"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserTimeframes, deleteUserTimeframe } from "@/lib/api/timeframe";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, TrashIcon } from "lucide-react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { AddTimeframeForm } from "./addtimeframe";
import { ConfirmDialog } from "../asset/confirm-dialog";
import { notifyError, notifySuccess } from "../asset/notify";
import { useSession } from "next-auth/react";

type SetupTrade = {
  id: string;
  userTimeframeId: string;
};

type UserTimeframe = {
  id: string;
  customName?: string;
  hidden?: boolean;
  timeframe: {
    id: string;
    name: string;
    label?: string;
  };
  setupTrades?: SetupTrade[];
};

export const TimeframeSettingsForm = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: userTimeframes = [], isLoading } = useQuery({
    queryKey: ["user-timeframe"],
    queryFn: fetchUserTimeframes,
    enabled: !!userId, // Tetap pastikan tidak dijalankan jika belum login
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserTimeframe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-timeframe"] });
      notifySuccess("Timeframe berhasil dihapus");
    },
  });

  const handleDelete = useCallback(
    (id: string) => {
      const tf = userTimeframes.find((t: UserTimeframe) => t.id === id);
      if (!tf) return;

      const usageCount = tf.setupTrades?.length ?? 0;
      if (usageCount > 0) {
        notifyError(
          "Timeframe tidak bisa dihapus, karena digunakan pada setup."
        );
        return;
      }

      deleteMutation.mutate(id);
    },
    [deleteMutation, userTimeframes]
  );

  const filteredTimeframes = userTimeframes.filter((item: UserTimeframe) => {
    const rawName = item.customName || item.timeframe?.name;
    return rawName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Helper: konversi nama timeframe ke jumlah menit
  function convertToMinutes(name: string): number {
    const match = name.match(/^(\d+)([smhdwMy])$/i);
    if (!match) return Infinity; // fallback jika format tidak dikenali

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case "s":
        return value / 60;
      case "m":
        return value; // minute
      case "h":
        return value * 60;
      case "D":
        return value * 60 * 24;
      case "w":
        return value * 60 * 24 * 7;
      case "M":
        return value * 60 * 24 * 30; // Month, uppercase!
      case "y":
        return value * 60 * 24 * 365;
      default:
        return Infinity;
    }
  }

  const getTimeframeValue = (item: UserTimeframe) =>
    convertToMinutes(item.customName || item.timeframe?.name || "");

  const sortedTimeframes = [...filteredTimeframes].sort(
    (a, b) => getTimeframeValue(a) - getTimeframeValue(b)
  );

  const renderRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="h-[200px] p-0">
            <div className="flex items-center justify-center h-full w-full">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (filteredTimeframes.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="text-center text-muted-foreground">
            Tidak ada timeframe ditemukan.
          </TableCell>
        </TableRow>
      );
    }

    return sortedTimeframes.map((item: UserTimeframe) => {
      const name = item.customName || item.timeframe.name;

      return (
        <TableRow key={item.id} className="hover:bg-background">
          <TableCell>{name}</TableCell>
          <TableCell className="text-center">
            {item.setupTrades?.length ?? 0}
          </TableCell>
          <TableCell className="flex justify-end">
            <Popover
              open={openPopoverId === item.id}
              onOpenChange={(open) => {
                setOpenPopoverId(open ? item.id : null);
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setOpenPopoverId(item.id)}
                  className="hover:bg-foreground/5 hover:text-foreground"
                >
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-36 py-3 px-3 bg-background text-foreground"
                align="start"
                side="right"
              >
                <ConfirmDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-600 hover:bg-foreground/10 hover:text-red-600"
                      disabled={deleteMutation.isPending}
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Hapus
                    </Button>
                  }
                  title="Konfirmasi Penghapusan"
                  description="Apakah kamu yakin ingin menghapus timeframe ini? Tindakan ini tidak dapat dibatalkan."
                  confirmText="Ya, Hapus"
                  cancelText="Batal"
                  onConfirm={() => handleDelete(item.id)}
                />
              </PopoverContent>
            </Popover>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className="w-[40%] h-full">
      <Card className="bg-background shadow-md rounded-2xl h-[100%]">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-foreground text-lg font-semibold tracking-tight">
            Pengaturan Timeframe
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-2 px-6 gap-2">
          <Input
            type="text"
            placeholder="Cari timeframe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-foreground"
          />
          <div className="flex justify-end">
            <Popover open={isAddOpen} onOpenChange={setIsAddOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="font-semibold text-foreground cursor-pointer py-1 text-lg"
                >
                  +
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 bg-background"
                align="start"
                sideOffset={10}
                side="right"
              >
                <AddTimeframeForm
                  onSuccess={() => setIsAddOpen(false)}
                  onCancel={() => setIsAddOpen(false)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <CardContent className="max-h-[400px] overflow-y-auto">
          <Table>
            <colgroup>
              <col style={{ width: "50%" }} />
              <col style={{ width: "40%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <TableHeader>
              <TableRow className="hover:bg-background">
                <TableHead>Nama Timeframe</TableHead>
                <TableHead>Total Digunakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-foreground">{renderRows()}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

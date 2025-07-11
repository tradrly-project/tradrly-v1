"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserPsychologies,
  deleteUserPsychology,
} from "@/lib/api/psychology";

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
import { TrashIcon } from "lucide-react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { AddPsychologyForm } from "./addpsychology";
import { notifyError, notifySuccess } from "../asset/notify";
import { ConfirmDialog } from "../asset/confirm-dialog";

type Journal = {
  id: string;
  userPairId: string;
  entry: string;
  createdAt: string;
  updatedAt: string;
};

type UserPsychology = {
  id: string;
  customName?: string;
  hidden?: boolean;
  psychology: {
    id: string;
    name: string;
    category?: string;
  };
  journals?: Journal[];
};

export const PsychologySettingsForm = () => {
  const queryClient = useQueryClient();

  const [activePopoverId, setActivePopoverId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: userPsychologies = [], isLoading } = useQuery({
    queryKey: ["user-psychology"],
    queryFn: fetchUserPsychologies,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserPsychology(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-psychology"] });
      notifySuccess("Psikologi berhasil dihapus");
    },
  });

  const handleDelete = useCallback(
    (item: UserPsychology) => {
      if ((item.journals?.length ?? 0) > 0) {
        notifyError(
          "Psikologi ini tidak bisa dihapus karena sudah digunakan di jurnal."
        );
        return;
      }

      deleteMutation.mutate(item.id);
    },
    [deleteMutation]
  );

  const filteredPsychologies = userPsychologies.filter(
    (item: UserPsychology) => {
      const rawName = item.customName || item.psychology?.name;
      return rawName?.toLowerCase().includes(searchTerm.toLowerCase());
    }
  );

  const sortedPsychologies = [...filteredPsychologies].sort((a, b) => {
    const nameA = (a.customName || a.psychology?.name || "").toLowerCase();
    const nameB = (b.customName || b.psychology?.name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const renderRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="text-center">
            Memuat...
          </TableCell>
        </TableRow>
      );
    }

    if (filteredPsychologies.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="text-center text-muted-foreground">
            Tidak ada psikologi ditemukan.
          </TableCell>
        </TableRow>
      );
    }

    return sortedPsychologies.map((item: UserPsychology) => {
      const name = item.customName || item.psychology.name;

      return (
        <TableRow key={item.id} className="hover:bg-background">
          <TableCell>{name}</TableCell>
          <TableCell className="text-center">
            {item.journals?.length ?? 0}
          </TableCell>
          <TableCell className="flex justify-end">
            <Popover
              open={activePopoverId === item.id}
              onOpenChange={(open) => {
                setActivePopoverId(open ? item.id : null);
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActivePopoverId(item.id)}
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
                <div className="space-y-1">
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
                    title="Konfirmasi Hapus"
                    description="Apakah kamu yakin ingin menghapus psikologi ini?"
                    confirmText="Ya, Hapus"
                    cancelText="Batal"
                    onConfirm={() => handleDelete(item)}
                  />
                </div>
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
            Pengaturan Psikologi
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-2 px-6 gap-2">
          <Input
            type="text"
            placeholder="Cari psikologi..."
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
                <AddPsychologyForm
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
                <TableHead>Nama Psikologi</TableHead>
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

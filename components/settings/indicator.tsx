"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserIndicators, deleteUserIndicator } from "@/lib/api/indicator";

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
import { AddIndicatorForm } from "./addindicator";
import { ConfirmDialog } from "../asset/confirm-dialog";
import { notifyError, notifySuccess } from "../asset/notify";
import { useSession } from "next-auth/react";

type SetupTrade = {
  id: string;
  userIndicatorId: string;
};

type UserIndicator = {
  id: string;
  customCode?: string;
  indicator: {
    id: string;
    name: string;
    code: string;
  };
  setups?: SetupTrade[];
};

export const IndicatorSettingsForm = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: userIndicators = [], isLoading } = useQuery({
    queryKey: ["user-indicator"],
    queryFn: fetchUserIndicators,
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserIndicator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-indicator"] });
      notifySuccess("Indikator berhasil dihapus");
    },
  });

  const handleDelete = useCallback(
    (id: string) => {
      const ind = userIndicators.find((i: UserIndicator) => i.id === id);
      if (!ind) return;

      const usageCount = ind.setups?.length ?? 0;
      if (usageCount > 0) {
        notifyError(
          "Indikator tidak bisa dihapus, karena digunakan pada setup."
        );
        return;
      }

      deleteMutation.mutate(id);
    },
    [deleteMutation, userIndicators]
  );

  const filteredIndicators = userIndicators.filter((item: UserIndicator) => {
    const rawName = item.customCode || item.indicator?.name;
    return rawName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedIndicators = [...filteredIndicators].sort((a, b) =>
    (a.customCode || a.indicator.name).localeCompare(
      b.customCode || b.indicator.name
    )
  );

  return (
    <div className="w-[40%] h-full">
      <Card className="bg-background shadow-md rounded-2xl h-[100%]">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-foreground text-lg font-semibold tracking-tight">
            Pengaturan Indikator
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-2 px-6 gap-2">
          <Input
            type="text"
            placeholder="Cari indikator..."
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
                <AddIndicatorForm
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
              <col style={{ width: "40%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "5%" }} />
            </colgroup>
            <TableHeader>
              <TableRow className="hover:bg-background">
                <TableHead>Nama Indikator</TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Digunakan</TableHead>
                <TableHead/>
              </TableRow>
            </TableHeader>
            <TableBody className="text-foreground">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-[200px] p-0">
                    <div className="flex items-center justify-center h-full w-full">
                      <Loader2 className="w-10 h-10 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredIndicators.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    Tidak ada indikator ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                sortedIndicators.map((item: UserIndicator) => {
                  const name = item.customCode || item.indicator.name;
                  const code = item.customCode ?? item.indicator?.code ?? "-";


                  return (
                    <TableRow key={item.id} className="hover:bg-background">
                      <TableCell>{name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {code}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.setups?.length ?? 0}
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
                              description="Apakah kamu yakin ingin menghapus indikator ini? Tindakan ini tidak dapat dibatalkan."
                              confirmText="Ya, Hapus"
                              cancelText="Batal"
                              onConfirm={() => handleDelete(item.id)}
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserPairs, deleteUserPair } from "@/lib/api/pair";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { AddPairForm } from "./addpair";
import { Input } from "../ui/input";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { notifyError, notifySuccess } from "../asset/notify";
import { ConfirmDialog } from "../asset/confirm-dialog";

type Journal = {
  id: string;
  userPairId: string;
  entry: string;
  createdAt: string;
  updatedAt: string;
};

type PairItem = {
  id: string;
  customName: string | null;
  customType?: "crypto" | "forex" | "stock" | "index";
  pair: {
    symbol: string;
    type: "crypto" | "forex" | "stock" | "index";
  };
  journals?: Journal[];
};

export const PairSettingsForm = () => {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const { data: pairs = [], isLoading } = useQuery({
    queryKey: ["user-pairs"],
    queryFn: fetchUserPairs,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserPair(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-pairs"] });
      notifySuccess("Pair berhasil dihapus");
    },
  });

  const handleDelete = (pair: PairItem) => {
    if ((pair.journals?.length ?? 0) > 0) {
      notifyError(
        "Pair ini tidak bisa dihapus karena sudah digunakan di jurnal."
      );
      return;
    }

    deleteMutation.mutate(pair.id);
  };

  const sortedPairs = [...(pairs as PairItem[])].sort((a, b) => {
    const typeA = a.pair?.type ?? "";
    const typeB = b.pair?.type ?? "";

    const symbolA = a.pair?.symbol ?? a.customName ?? "";
    const symbolB = b.pair?.symbol ?? b.customName ?? "";

    return typeA.localeCompare(typeB) || symbolA.localeCompare(symbolB);
  });

  const filteredPairs = sortedPairs.filter((pair: PairItem) =>
    (pair.customName || pair.pair.symbol)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const capitalizeFirst = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="w-[40%] h-full">
      <Card className="bg-background shadow-md rounded-2xl h-[100%]">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-foreground text-lg font-semibold tracking-tight">
            Pengaturan Pair
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-2 px-6 gap-2">
          <Input
            type="text"
            placeholder="Cari pair..."
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
                <AddPairForm
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
              <col style={{ width: "30%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <TableHeader>
              <TableRow className="hover:bg-background">
                <TableHead>Nama Pair</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Total Trade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-foreground">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-full">
                    Memuat...
                  </TableCell>
                </TableRow>
              ) : filteredPairs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    Tidak ada pair ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPairs.map((pair: PairItem) => (
                  <TableRow key={pair.id} className="hover:bg-background">
                    <TableCell>
                      {pair.customName || pair.pair?.symbol}
                    </TableCell>
                    <TableCell>
                      {pair.pair?.type
                        ? capitalizeFirst(pair.pair.type)
                        : pair.customType
                        ? capitalizeFirst(pair.customType)
                        : "Custom"}
                    </TableCell>
                    <TableCell className="text-center">
                      {pair.journals?.length ?? 0}
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Popover
                        open={openPopoverId === pair.id}
                        onOpenChange={(open) => {
                          setOpenPopoverId(open ? pair.id : null);
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setOpenPopoverId(pair.id)}
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
                                className="w-full justify-start text-left text-red-600 hover:bg-foreground/10 hover:text-red-600"
                                disabled={deleteMutation.isPending}
                              >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Hapus
                              </Button>
                            }
                            title="Konfirmasi Hapus"
                            description="Apakah kamu yakin ingin menghapus pair ini?"
                            confirmText="Ya, Hapus"
                            cancelText="Batal"
                            onConfirm={() => handleDelete(pair)}
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

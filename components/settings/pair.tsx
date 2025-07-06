"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserPairs, deleteUserPair, updateUserPair } from "@/lib/api/pair";

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
import { PencilIcon, TrashIcon } from "lucide-react";
import { AddPairForm } from "./addpair";
import { Input } from "../ui/input";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

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
  pair: {
    symbol: string;
    type: "crypto" | "forex" | "stock" | "index";
  };
  journals?: Journal[];
};

export const PairSettingsForm = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [popoverMode, setPopoverMode] = useState<"menu" | "edit" | null>(null);

  const { data: pairs = [], isLoading } = useQuery({
    queryKey: ["user-pairs"],
    queryFn: fetchUserPairs,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserPair(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user-pairs"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, customName }: { id: string; customName: string }) =>
      updateUserPair({ id, customName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-pairs"] });
      setEditingId(null);
      setEditingName("");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus pair ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const sortedPairs = pairs.slice().sort((a: PairItem, b: PairItem) => {
    const typeCompare = a.pair.type.localeCompare(b.pair.type);
    if (typeCompare !== 0) return typeCompare;
    return a.pair.symbol.localeCompare(b.pair.symbol);
  });

  const filteredPairs = sortedPairs.filter((pair: PairItem) =>
    (pair.customName || pair.pair.symbol)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-[40%] h-full">
      <Card className="bg-background shadow-md rounded-2xl max-h-[100%]">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-foreground text-lg font-semibold tracking-tight">
            Pengaturan Pair
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-2 px-6 gap-2">
          {/* ✅ Input pencarian */}
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
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pair</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Total Trade</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-foreground">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
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
                  <TableRow key={pair.id}>
                    <TableCell>{pair.customName || pair.pair.symbol}</TableCell>
                    <TableCell>{pair.pair.type}</TableCell>
                    <TableCell>{pair.journals?.length ?? 0}</TableCell>
                    <TableCell className="flex justify-end">
                      <Popover
                        open={editingId === pair.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setEditingId(null);
                            setPopoverMode(null);
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(pair.id);
                              setPopoverMode("menu");
                            }}
                          >
                            <EllipsisHorizontalIcon className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-64 bg-background text-foreground">
                          {popoverMode === "menu" && (
                            <div className="space-y-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-left"
                                onClick={() => {
                                  setEditingName(
                                    pair.customName || pair.pair.symbol
                                  );
                                  setPopoverMode("edit");
                                }}
                              >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-left text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(pair.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Hapus
                              </Button>
                            </div>
                          )}

                          {popoverMode === "edit" && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Edit Pair</h4>
                              <input
                                type="text"
                                className="w-full border px-2 py-1 rounded text-sm"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setPopoverMode("menu")}
                                >
                                  Batal
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    updateMutation.mutate({
                                      id: pair.id,
                                      customName: editingName,
                                    });
                                  }}
                                  disabled={updateMutation.isPending}
                                >
                                  Simpan
                                </Button>
                              </div>
                            </div>
                          )}
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

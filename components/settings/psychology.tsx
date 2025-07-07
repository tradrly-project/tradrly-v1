"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserPsychologies,
  deleteUserPsychology,
  updateUserPsychology,
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
import { PencilIcon, TrashIcon } from "lucide-react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { AddPsychologyForm } from "./addpsychology";

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [popoverMode, setPopoverMode] = useState<"menu" | "edit" | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: userPsychologies = [], isLoading } = useQuery({
    queryKey: ["user-psychology"],
    queryFn: fetchUserPsychologies,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserPsychology(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user-psychology"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, customName }: { id: string; customName: string }) =>
      updateUserPsychology({ id, customName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-psychology"] });
      setEditingId(null);
      setEditingName("");
      setPopoverMode(null);
    },
  });

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm("Yakin ingin menghapus psikologi ini?")) {
        deleteMutation.mutate(id);
      }
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
              open={editingId === item.id}
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
                    setEditingId(item.id);
                    setPopoverMode("menu");
                  }}
                  className="hover:bg-foreground/5 hover:text-foreground"
                >
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={`${
                  popoverMode === "edit" ? "w-64" : "w-36 py-3 px-3"
                } bg-background text-foreground`}
                align="start"
                side="right"
              >
                {popoverMode === "menu" ? (
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover:bg-foreground/10"
                      onClick={() => {
                        setEditingName(name);
                        setPopoverMode("edit");
                      }}
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-600 hover:bg-foreground/10 hover:text-red-600"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Hapus
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Edit Psikologi</h4>
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
                            id: item.id,
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
      );
    });
  };

  return (
    <div className="w-[40%] h-full">
      <Card className="bg-background shadow-md rounded-2xl max-h-[100%]">
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

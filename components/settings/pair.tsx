"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";

type PairItem = {
  id: string;
  name: string;
  status: "Aktif" | "Nonaktif";
  totalTrade: number;
};

export const PairSettingsForm = () => {
  const [pairs, setPairs] = useState<PairItem[]>([
    { id: "1", name: "BTCUSD", status: "Aktif", totalTrade: 4 },
    { id: "2", name: "ETHUSD", status: "Nonaktif", totalTrade: 2 },
    // Tambahkan data dummy lainnya bila perlu
  ]);

  const handleEdit = (pair: PairItem) => {
    console.log("Edit", pair);
    // TODO: buka dialog / navigasi ke halaman edit
  };

  const handleDelete = (id: string) => {
    // TODO: konfirmasi hapus
    setPairs((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-[40%]">
      <Card className="bg-background shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-foreground text-lg font-semibold tracking-tight">
            Pengaturan Pair
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pair</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Trade</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pairs.map((pair) => (
                <TableRow key={pair.id} className="text-foreground">
                  <TableCell>{pair.name}</TableCell>
                  <TableCell>{pair.status}</TableCell>
                  <TableCell>{pair.totalTrade}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(pair)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(pair.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {pairs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Belum ada pair ditambahkan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

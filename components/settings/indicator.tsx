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

type IndicatorItem = {
  id: string;
  name: string;
  usage: number;
};

export const IndicatorSettingsForm = () => {
  const [data, setData] = useState<IndicatorItem[]>([
    { id: "1", name: "RSI", usage: 6 },
    { id: "2", name: "MACD", usage: 1 },
  ]);

  const handleEdit = (item: IndicatorItem) => {
    console.log("Edit", item);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-[40%]">
      <Card className="bg-background shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-foreground text-lg font-semibold tracking-tight">
            Pengaturan Indikator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Indikator</TableHead>
                <TableHead>Total Digunakan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id} className="text-foreground">
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.usage}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Belum ada data ditambahkan.
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

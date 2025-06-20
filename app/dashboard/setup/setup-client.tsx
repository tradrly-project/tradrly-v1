"use client";

import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { SetupTradeWithPair } from "@/lib/types";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import SetupTradeForm from "@/components/setup/form";
import { XIcon } from "lucide-react";

interface SetupClientProps {
    setups: SetupTradeWithPair[];
    pairs: { id: string; symbol: string }[];
}

export default function SetupClient({ setups, pairs }: SetupClientProps) {
    const { state } = useSidebar();
    const sidebarWidth = state === "collapsed" ? "6rem" : "16rem";

    const [filter, setFilter] = useState("");

    const filteredSetups = setups.filter((setup) => {
        const name = setup.name?.toLowerCase() || "";
        const strategy = setup.strategy?.toLowerCase() || "";
        const tf = setup.timeframe?.toLowerCase() || "";
        const keyword = filter.toLowerCase();

        return (
            name.includes(keyword) ||
            strategy.includes(keyword) ||
            tf.includes(keyword)
        );
    });

    return (
        <div
            className="h-full p-4 transition-all ease-in-out duration-400"
            style={{ width: `calc(100vw - ${sidebarWidth})` }}
        >
            <h1 className="text-2xl font-semibold mb-4">Setup Trade</h1>

            {/* Pencarian dan tombol tambah */}
            <div className="flex items-center justify-between py-4 gap-2">
                <Input
                    placeholder="Cari Setup..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-sm"
                />

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <PlusIcon className="w-4 h-4" />
                            Tambah Setup
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-3xl">
                        <div className="flex justify-between items-center mb-2">
                            <DialogTitle className="text-xl">Setup Baru</DialogTitle>
                            <DialogPrimitive.Close asChild>
                                <Button variant="ghost" size="icon">
                                    <XIcon className="w-4 h-4" />
                                </Button>
                            </DialogPrimitive.Close>
                        </div>
                        <DialogDescription className="mb-4">
                            Buat dan kelola setup trading kamu sebelum entry market.
                        </DialogDescription>
                        <SetupTradeForm pairs={pairs} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Tabel Data Setup */}
            <DataTable columns={columns} data={filteredSetups} />
        </div>
    );
}

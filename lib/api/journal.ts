// lib/api/journal.ts

import { TradeWithPair } from "@/lib/types";

export interface JournalResponse {
    journals: TradeWithPair[];
    pairs: { id: string; symbol: string }[];
    setupTrade: { id: string; name: string }[];
    allPsychologies: { id: string; name: string }[];
}

export async function fetchJournalData(): Promise<JournalResponse> {
    const res = await fetch("/api/journal", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Gagal mengambil data jurnal");
    }

    return res.json();
}

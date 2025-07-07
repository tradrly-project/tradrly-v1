// lib/api/journal.ts

import { TradeWithPair, UserPsychology } from "@/lib/types";

export interface JournalResponse {
    journals: TradeWithPair[];
    pairs: { id: string; symbol: string }[];
    setupTrade: { id: string; name: string }[];
    userPsychologies: UserPsychology[]
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

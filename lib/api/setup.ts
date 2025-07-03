// /lib/api/setup.ts
// types/setup.ts

export type Indicator = {
    id: string;
    name: string;
    code: string;
};

export type Timeframe = {
    id: string;
    code: string;
};

export type SetupTrade = {
    id: string;
    name: string;
    strategy: string;
    winrate: number | null; // Tambahkan winrate jika diperlukan
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    indicators: Indicator[];
    timeframes: Timeframe[];
};

export type SetupTradeResponse = {
    setups: SetupTrade[];
    indicators: Indicator[];
    timeframes: Timeframe[];
};

export type SetupTradeClient = Omit<SetupTrade, "createdAt" | "updatedAt"> & {
    createdAt: string;  // karena dari API JSON
    updatedAt: string;
};
  
export type SetupTradeWithIndicator = SetupTradeClient & {
    winrate: number | null;
    indicators: Indicator[] | null;
    timeframes: Timeframe[] | null;
};
  
  
export async function fetchSetupTrade(): Promise<SetupTradeResponse> {
    const res = await fetch("/api/setup");
    if (!res.ok) throw new Error("Gagal mengambil data setup trade");

    const data = await res.json();

    // Konversi createdAt & updatedAt ke Date
    data.setups = data.setups.map((setup: SetupTrade) => ({
        ...setup,
        createdAt: new Date(setup.createdAt),
        updatedAt: new Date(setup.updatedAt),
    }));
      

    return data;
}

export const fetchSetups = async (): Promise<SetupTradeResponse[]> => {
    const res = await fetch("/api/setup"); // atau endpoint kamu
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  };
  
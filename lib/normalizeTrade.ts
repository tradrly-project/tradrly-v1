import { TradeWithPair } from "./types";

export type NormalizedTrade = {
  pair: { symbol: string };
  direction: "buy" | "sell";
  entryPrice: string;
  exitPrice: string;
  stoploss: string;
  takeProfit: string;
  lotSize: string;
  result: "win" | "loss" | "bep";
  riskRatio: string;
  profitLoss: string;
  date: string;
  notes?: string | null;
  screenshotUrl?: string | null;
  setupTrade?: { name: string } | null;
  psychologies?: { name: string }[];
};

export function normalizeTrade(trade: TradeWithPair): NormalizedTrade {
  return {
    pair: {
      symbol: trade.pair?.pair?.symbol ?? "-", // ✅ ambil simbol dari relasi nested
    },
    direction: trade.direction,
    entryPrice: trade.entryPrice.toString(),
    exitPrice: trade.exitPrice.toString(),
    stoploss: trade.stoploss.toString(),
    takeProfit: trade.takeProfit.toString(),
    lotSize: trade.lotSize.toString(),
    riskRatio: trade.riskRatio?.toString() ?? "",
    profitLoss: trade.profitLoss?.toString() ?? "",
    date:
      typeof trade.date === "string"
        ? trade.date
        : trade.date.toISOString(),
    result: trade.result.toLowerCase() as "win" | "loss" | "bep",
    notes: trade.notes ?? null,
    screenshotUrl: trade.screenshots?.[0]?.url ?? null,
    setupTrade: trade.setupTrade
      ? { name: trade.setupTrade.name }
      : undefined,
    psychologies: trade.psychologies?.map((p) => ({
      name: p.psychology?.name ?? "-",
    })),
  };
}


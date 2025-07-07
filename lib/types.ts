import {
  Pair,
  Journal,
  SetupTrade,
  Indicator,
  Timeframe,
  Psychology,
  ScreenshotType,
  TradeScreenshot,
  UserPair,
} from "@prisma/client";

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  userId: string;
};

export type TradeWithPair = Journal & {
  pair: UserPair & {
    pair: Pair | null; // dari model global
  };
  setupTrade?: Pick<SetupTrade, "id" | "name"> | null;
  customName: string | null;
  customType: "crypto" | "forex" | "stock" | "index" | null;
  psychologies: (UserPsychology & {
    psychology: Psychology | null;
  })[];
  screenshots: TradeScreenshot[];
};

export type TradeWithPairExtended = TradeWithPair & {
  customName: string | null;
  customType: "crypto" | "forex" | "stock" | "index" | null;
};


export type TradeFormState = {
  message: string;
  errors?: Partial<Record<keyof TradeFormValues, string[]>>;
  values: TradeFormValues;
};

// ✅ Ganti ini dari SetupTradeWithPair ke SetupTradeWithIndicator
export type SetupTradeWithIndicator = SetupTrade & {
  winrate: number | null;
  indicators: Indicator[] | null;
  timeframes: Timeframe[] | null; // relasi bisa null
};

export type SetupTradeFormValues = {
  name: string;
  strategy: string;
  timeframe: string[];
  indicatorIds: string[]; // Ini menyimpan indicatorId (string)
  notes?: string;
};

export type SetupTradeFormState = {
  message: string;
  errors?: Partial<Record<keyof SetupTradeFormValues, string[]>>;
  values: SetupTradeFormValues;
};

export type TradeFormValues = {
  pairId?: string;
  direction?: string;
  entryPrice?: string;
  stoploss?: string;
  exitPrice?: string;
  takeProfit?: string;
  lotSize?: string;
  result?: string;
  riskRatio?: string;
  profitLoss?: string;
  psychology?: string[];
  strategy?: string[];
  setupTradeId?: string;
  notes?: string;
  screenshots?: {
    type: ScreenshotType; // atau "BEFORE" | "AFTER"
    url: string;
  }[];
  date?: string;
};

export type UserPsychology = {
  id: string;
  userId: string;
  psychologyId: string | null;
  customName: string | null;
  psychology: {
    name: string;
  } | null;
};
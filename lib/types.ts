import { Pair, Trade, SetupTrade } from "@prisma/client"

export type JournalEntry = {
  id: string
  title: string
  content: string
  createdAt: Date
  userId: string
}

export type TradeWithPair = Trade & {
  pair: Pair
}

export type TradeFormState = {
  message: string;
  errors?: Partial<Record<keyof TradeFormValues, string[]>>;
  values: TradeFormValues;
};

export type SetupTradeWithPair = SetupTrade & {
  pairs: Pair[];
};

export type SetupTradeFormValues = {
  name: string;
  strategy: string;
  timeframe: string;
  rrRatio: string;
  appliesToAllPairs: boolean;
  pairId?: string;
  checklist: string[];
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
  strategi?: string[];
  setupTradeId?: string; // New field for Setup Trade
  notes?: string;
  screenshotUrl?: string;
  date?: string;
};

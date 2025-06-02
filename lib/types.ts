import { Pair, Trade } from "@prisma/client"

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

export type TradeFormValues = {
  pairId?: string;
  direction?: string;
  entryPrice?: string;
  stoploss?: string;
  exitPrice?: string;
  takeProfit?: string;
  result?: string;
  riskRatio?: string;
  profitLoss?: string;
  psychology?: string;
  strategi?: string;
  notes?: string;
  screenshotUrl?: string;
  date?: string;
};

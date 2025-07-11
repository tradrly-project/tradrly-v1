import { TypePair } from "@prisma/client";

export const defaultPairs = [
  // === CRYPTO ===
  { symbol: "BTCUSD", type: TypePair.crypto },
  { symbol: "ETHUSD", type: TypePair.crypto },
  { symbol: "BNBUSD", type: TypePair.crypto },
  { symbol: "XRPUSD", type: TypePair.crypto },
  { symbol: "ADAUSD", type: TypePair.crypto },
  { symbol: "SOLUSD", type: TypePair.crypto },
  { symbol: "DOGEUSD", type: TypePair.crypto },
  { symbol: "AVAXUSD", type: TypePair.crypto },
  { symbol: "DOTUSD", type: TypePair.crypto },
  { symbol: "TRXUSD", type: TypePair.crypto },
  { symbol: "MATICUSD", type: TypePair.crypto },
  { symbol: "LINKUSD", type: TypePair.crypto },
  { symbol: "LTCUSD", type: TypePair.crypto },
  { symbol: "SHIBUSD", type: TypePair.crypto },
  { symbol: "ATOMUSD", type: TypePair.crypto },
  { symbol: "XLMUSD", type: TypePair.crypto },
  { symbol: "NEARUSD", type: TypePair.crypto },
  { symbol: "ETCUSD", type: TypePair.crypto },
  { symbol: "FILUSD", type: TypePair.crypto },
  { symbol: "AAVEUSD", type: TypePair.crypto },

  // === FOREX ===
  { symbol: "XAUUSD", type: TypePair.forex },
  { symbol: "EURUSD", type: TypePair.forex },
  { symbol: "GBPUSD", type: TypePair.forex },
  { symbol: "USDJPY", type: TypePair.forex },
  { symbol: "USDCHF", type: TypePair.forex },
  { symbol: "USDCAD", type: TypePair.forex },
  { symbol: "AUDUSD", type: TypePair.forex },
  { symbol: "NZDUSD", type: TypePair.forex },
  { symbol: "EURGBP", type: TypePair.forex },
  { symbol: "EURJPY", type: TypePair.forex },
  { symbol: "GBPJPY", type: TypePair.forex },
  { symbol: "AUDJPY", type: TypePair.forex },
  { symbol: "EURCHF", type: TypePair.forex },
  { symbol: "CADJPY", type: TypePair.forex },
  { symbol: "NZDJPY", type: TypePair.forex },
  { symbol: "CHFJPY", type: TypePair.forex },
  { symbol: "AUDNZD", type: TypePair.forex },
  { symbol: "EURNZD", type: TypePair.forex },
  { symbol: "GBPCAD", type: TypePair.forex },
  { symbol: "GBPCHF", type: TypePair.forex },

  // === STOCK ===
  { symbol: "AAPL", type: TypePair.stock },
  { symbol: "MSFT", type: TypePair.stock },
  { symbol: "GOOGL", type: TypePair.stock },
  { symbol: "AMZN", type: TypePair.stock },
  { symbol: "TSLA", type: TypePair.stock },
  { symbol: "META", type: TypePair.stock },
  { symbol: "NVDA", type: TypePair.stock },
  { symbol: "NFLX", type: TypePair.stock },
  { symbol: "INTC", type: TypePair.stock },
  { symbol: "AMD", type: TypePair.stock },
  { symbol: "BABA", type: TypePair.stock },
  { symbol: "ORCL", type: TypePair.stock },
  { symbol: "CSCO", type: TypePair.stock },
  { symbol: "UBER", type: TypePair.stock },
  { symbol: "PYPL", type: TypePair.stock },
  { symbol: "ADBE", type: TypePair.stock },
  { symbol: "CRM", type: TypePair.stock },
  { symbol: "SHOP", type: TypePair.stock },
  { symbol: "SQ", type: TypePair.stock },
  { symbol: "SPOT", type: TypePair.stock },

  // === INDEX ===
  { symbol: "US100", type: TypePair.index },
  { symbol: "US30", type: TypePair.index },
  { symbol: "SPX500", type: TypePair.index },
  { symbol: "UK100", type: TypePair.index },
  { symbol: "JP225", type: TypePair.index },
  { symbol: "GER40", type: TypePair.index },
  { symbol: "FRA40", type: TypePair.index },
  { symbol: "HK50", type: TypePair.index },
  { symbol: "CHINA50", type: TypePair.index },
  { symbol: "AUS200", type: TypePair.index },
  { symbol: "EU50", type: TypePair.index },
  { symbol: "IT40", type: TypePair.index },
  { symbol: "SPAIN35", type: TypePair.index },
  { symbol: "VIX", type: TypePair.index },
  { symbol: "DXY", type: TypePair.index },
  { symbol: "RUSSELL2000", type: TypePair.index },
  { symbol: "NASDAQ100", type: TypePair.index },
  { symbol: "DAX", type: TypePair.index },
  { symbol: "CAC40", type: TypePair.index },
  { symbol: "S&P500", type: TypePair.index }
];

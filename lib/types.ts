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
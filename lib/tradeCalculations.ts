// utils/tradeCalculations.ts

export type TradeDirection = "buy" | "sell";

export interface CalculateInput {
    direction: TradeDirection;
    entryPrice: number;
    exitPrice: number;
    takeProfit: number;
    stoploss: number;
    lotSize: number;
}

export interface CalculateOutput {
    result: "win" | "loss" | "break-even";
    profitLoss: number;
    riskRatio: number;
}

export function calculateDerivedFields({
    direction,
    entryPrice,
    exitPrice,
    takeProfit,
    stoploss,
    lotSize,
}: CalculateInput): CalculateOutput {
    let result: CalculateOutput["result"] = "break-even";

    if (direction === "buy") {
        if (exitPrice > entryPrice) result = "win";
        else if (exitPrice < entryPrice) result = "loss";
    } else {
        if (exitPrice < entryPrice) result = "win";
        else if (exitPrice > entryPrice) result = "loss";
    }

    const priceDiff =
        direction === "buy" ? exitPrice - entryPrice : entryPrice - exitPrice;

    const profitLoss = priceDiff * lotSize;

    const risk = Math.abs(entryPrice - stoploss) * lotSize;
    const reward = Math.abs(takeProfit - entryPrice) * lotSize;

    const riskRatio = risk > 0 ? reward / risk : 0;

    return { result, profitLoss, riskRatio };
}

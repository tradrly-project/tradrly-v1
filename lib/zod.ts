import { object, string, number, date, enum as zEnum } from "zod";

export const RegisterSchema = object({
  name: string().min(1, "Harus lebih dari 1 huruf !"),
  username: string().min(1, "Harus lebih dari 1 huruf !"),
  email: string().email("Email tidak valid"),
  password: string()
    .min(3, "Password harus lebih dari 3 karakter")
    .max(5, "Password harus lebih dari 5 karakter"),
  ConfirmPassword: string()
    .min(3, "Password harus lebih dari 3 karakter")
    .max(5, "Password harus lebih dari 5 karakter"),
}).refine((data) => data.password === data.ConfirmPassword, {
  message: "Password tidak sama",
  path: ["ConfirmPassword"],
});

export const SigninSchema = object({
  email: string().email("Email Tidak valid"),
  password: string()
    .min(3, "Password harus lebih dari 3 karakter")
    .max(5, "Password harus lebih dari 5 karakter"),
});

export const TradeDirectionEnum = zEnum(["buy", "sell"])
export const ResultEnum = zEnum(["win", "loss", "bep"])

// Trade Schema
export const TradeSchema = object({
  userId: string().uuid({ message: "User ID harus berupa UUID" }),
  pairId: string().uuid({ message: "Pair ID harus berupa UUID" }),
  direction: TradeDirectionEnum,
  entryPrice: number({ required_error: "Harga entry wajib diisi" }),
  stoploss: number({ required_error: "Stoploss wajib diisi" }),
  takeProfit: number({ required_error: "Take profit wajib diisi" }),
  lotSize: number({ required_error: "Lot size wajib diisi" }),
  exitPrice: number({ required_error: "Exit price wajib diisi" }),
  result: ResultEnum,
  profitLoss: number({ required_error: "Profit/loss wajib diisi" }),
  riskRatio: number({ required_error: "Risk ratio wajib diisi" }),
  psychology: string().optional().nullable(),
  strategi: string().optional().nullable(),
  notes: string().optional().nullable(),
  screenshotUrl: string().url("URL tidak valid").optional().nullable(),
  date: date({ required_error: "Tanggal buka wajib diisi" }),
})


export const TradeCreateSchema = TradeSchema;
export const TradeUpdateSchema = TradeSchema.partial();
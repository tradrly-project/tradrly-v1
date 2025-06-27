import { object, array, string, number, date, enum as zEnum } from "zod";

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

export const TradeDirectionEnum = zEnum(["buy", "sell"]);
export const ResultEnum = zEnum(["win", "loss", "bep"]);
export const ScreenshotEnum = zEnum(["BEFORE", "AFTER"]);

// Base schema tanpa refine dulu
export const TradeBaseSchema = object({
  userId: string().uuid({ message: "User ID harus berupa UUID" }),
  pairId: string().min(1, "Pair ID wajib diisi"),
  direction: TradeDirectionEnum,
  entryPrice: number({ required_error: "Harga entry wajib diisi" }),
  stoploss: number({ required_error: "Stoploss wajib diisi" }),
  takeProfit: number({ required_error: "Take profit wajib diisi" }),
  lotSize: number({ required_error: "Lot size wajib diisi" }),
  exitPrice: number({ required_error: "Exit price wajib diisi" }),
  result: ResultEnum,
  profitLoss: number({ required_error: "Profit/loss wajib diisi" }),
  riskRatio: number({ required_error: "Risk ratio wajib diisi" }),
  psychologyIds: array(string()).optional(),
  setupTradeId: string().uuid("Setup ID tidak valid").optional(),
  notes: string().optional().nullable(),
  screenshots: array(
    object({
      type: ScreenshotEnum,
      url: string().url("URL tidak valid"),
    })
  ).optional(),
  date: date({ required_error: "Tanggal buka wajib diisi" }),
});

// Tambahkan .refine untuk validasi ekstra (direction/pairId harus diisi jika field angka terisi)
export const TradeSchema = TradeBaseSchema.refine(
  (data) => {
    const angkaDiisi =
      data.entryPrice ||
      data.stoploss ||
      data.takeProfit ||
      data.exitPrice ||
      data.lotSize;

    const missingDirection = !data.direction;
    const missingPair = !data.pairId;

    if (angkaDiisi && (missingDirection || missingPair)) {
      return false;
    }

    return true;
  },
  {
    message: "Pair dan Direction wajib diisi jika field harga/lot diisi",
    path: ["direction"], // tampilkan error di field direction
  }
);

// Buat schema create dan update
export const TradeCreateSchema = TradeSchema;
export const TradeUpdateSchema = TradeBaseSchema
  .omit({ userId: true, pairId: true }) // 🛑 tidak boleh diupdate
  .partial();

const BaseSetupTradeSchema = object({
  name: string().min(1, "Nama setup wajib diisi").max(30, "Maksimal 50 karakter"),
  strategy: string().min(1, "Strategi wajib diisi"),
  timeframe: array(string()).optional(),
  indicator: array(string()).optional(),
  notes: string().optional().nullable(),
});

export const SetupTradeSchema = BaseSetupTradeSchema;

// Jika diperlukan untuk update (semua optional):
export const SetupTradeUpdateSchema = BaseSetupTradeSchema.partial();

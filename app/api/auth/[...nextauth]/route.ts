// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

// ⬇️ Tambahkan baris ini untuk memaksa Node.js runtime (bukan Edge)
export const runtime = "nodejs";

// ⬇️ Ekspor handler
export const GET = handlers.GET;
export const POST = handlers.POST;

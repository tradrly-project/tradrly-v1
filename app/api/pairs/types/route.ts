// app/api/pairs/types/route.ts
import { TypePair } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const types = Object.values(TypePair); // ["forex", "crypto", ...]
  return NextResponse.json(types);
}

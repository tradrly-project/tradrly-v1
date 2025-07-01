// app/api/blob/delete/route.ts
import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { url } = await req.json();

  try {
    await del(url); // akan melempar error kalau URL tidak valid
    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const PUT = async (request: Request) => {
  const form = await request.formData();
  const file = form.get("file") as File;

  if(file.size > 2000000) {
    return NextResponse.json({ message: "File harus lebih kecil dari 2MB" }, { status: 400 });
  }
  if(!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "File harus berupa gambar" }, { status: 400 });
  }

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true
  });
  return NextResponse.json(blob);
}
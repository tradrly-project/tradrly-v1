import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const PUT = async (request: Request) => {
  try {
    const form = await request.formData();
    const file = form.get("file") as File;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { message: "File tidak ditemukan atau tidak valid" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "File harus berupa gambar (.jpg, .jpeg, .png, .webp)" },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "Ukuran file maksimal 2MB" },
        { status: 400 }
      );
    }

    const blob = await put(file.name, file, {
      access: "public",
      multipart: true,
    });

    return NextResponse.json({
      message: "Upload berhasil",
      ...blob,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat upload" },
      { status: 500 }
    );
  }
};

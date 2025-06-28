// utils/uploadFile.ts
export async function uploadScreenshot(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Gagal upload gambar");
  }

  const blob = await res.json();
  return blob.url; // ✅ URL publik dari vercel blob
}

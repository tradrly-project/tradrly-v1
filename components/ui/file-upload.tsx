"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { IconUpload } from "@tabler/icons-react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type Role = "BEFORE" | "AFTER";

export type FileWithMeta = {
  file: File;
  url?: string;
  role: Role;
};

export type FileUploadProps = {
  mode?: "immediate" | "manual";
  role: Role;
  files: FileWithMeta[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithMeta[]>>;
  onChange?: (filesOrUrls: (string | File)[]) => void;
};

const uploadToServer = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "PUT",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Upload failed");

  return data.url;
};

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 5, y: -3, opacity: 0.9 },
};

export const FileUpload = ({
  mode = "immediate",
  role,
  files,
  setFiles,
  onChange,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (newFiles: File[]) => {
    if (mode === "manual") {
      const prepared = newFiles.map((file) => ({ file, role }));
      setFiles((prev) => [...prev, ...prepared]);
      onChange?.(prepared.map((f) => f.file));
      return;
    }

    const uploaded = await Promise.all(
      newFiles.map(async (file) => {
        try {
          const url = await uploadToServer(file);
          return { file, url, role };
        } catch (e) {
          console.error("Upload error:", e);
          return { file, url: undefined, role };
        }
      })
    );

    const valid = uploaded.filter((u) => u.url);
    setFiles((prev) => [...prev, ...valid]);
    onChange?.(valid.map((f) => f.url!) as string[]);
  };

  const { getRootProps, isDragActive } = useDropzone({
    noClick: true,
    multiple: true,
    onDrop: handleFileChange,
  });

  const triggerInput = () => inputRef.current?.click();

  const displayedFiles = files.filter((f) => f.role === role);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-full rounded-xl border-2 border-dashed transition-all duration-300",
        isDragActive
          ? "border-sky-400 bg-sky-50/30 dark:bg-sky-900/30"
          : "border-neutral-300 dark:border-neutral-700"
      )}
    >
      <motion.div
        onClick={triggerInput}
        whileHover="animate"
        initial="initial"
        className={`group cursor-pointer w-full h-[255px] flex transition-all items-center
    ${files.length > 0 ? "py-4 px-3" : "py-8 px-6"}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            const selected = Array.from(e.target.files || []);
            handleFileChange(selected);
          }}
        />

        <>
          {displayedFiles.length === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <motion.div
                layoutId={`upload-${role}`}
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-18 h-18 flex items-center justify-center rounded-lg bg-background border shadow-md"
              >
                <IconUpload className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
              </motion.div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                Klik atau Drop Screenshot <strong>{role.toUpperCase()}</strong>{" "}
                di sini
              </p>
            </div>
          ) : (
            displayedFiles.map((f) => (
              <motion.div
                key={`${f.file.name}-${f.file.lastModified}-${role}`}
                layoutId={`file-${f.file.name}-${role}`}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative aspect-[4/5] w-full max-w-xs rounded-lg overflow-hidden shadow border border-zinc-600 bg-background"
              >
                {/* Gambar Preview */}
                {f.file.type.startsWith("image/") ? (
                  <>
                    <div className="relative w-full h-full">
                      <Image
                        src={URL.createObjectURL(f.file)}
                        alt={f.file.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Tombol X di pojok kanan atas */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newFiles = files.filter((_, i) => files[i] !== f);
                        setFiles(newFiles);
                        onChange?.(
                          mode === "manual"
                            ? newFiles.map((f) => f.file)
                            : newFiles.filter((f) => f.url).map((f) => f.url!)
                        );
                      }}
                      className="bg-zinc-700 rounded-sm absolute top-2 right-2 text-foreground/80 hover:text-foreground/25 z-10 cursor-pointer"
                    >
                      <XIcon className="w-5 h-5 drop-shadow" />
                    </button>

                    {/* Overlay info nama dan size di bawah */}
                    <div className="absolute bottom-1 left-1 right-1 px-2 py-1 bg-black/60 backdrop-blur-sm flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-white text-[10px] sm:text-xs rounded-md z-10">
                      <p className="truncate grow basis-0">{f.file.name}</p>
                      <p className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-[10px] sm:text-xs whitespace-nowrap">
                        {(f.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-neutral-400">
                    File tidak dapat dipreview
                  </div>
                )}
              </motion.div>
            ))
          )}
        </>
      </motion.div>
    </div>
  );
};

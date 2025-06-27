"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { IconUpload } from "@tabler/icons-react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
        className="py-8 px-6 group cursor-pointer w-full h-full relative transition-all"
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

        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {displayedFiles.length === 0 ? (
            <>
              <motion.div
                layoutId={`upload-${role}`}
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-20 h-20 flex items-center justify-center rounded-lg bg-background border shadow-md"
              >
                <IconUpload className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
              </motion.div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Klik atau Drop Screenshot <strong>{role.toUpperCase()}</strong>{" "}
                di sini
              </p>
            </>
          ) : (
            displayedFiles.map((f) => (
              <motion.div
                key={`${f.file.name}-${f.file.lastModified}-${role}`}
                layoutId={`file-${f.file.name}-${role}`}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative bg-background p-4 w-full max-w-lg mx-auto rounded-md shadow border border-zinc-600"
              >
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
                  className="absolute top-2 right-2 text-neutral-400 hover:text-red-500"
                >
                  <XIcon className="w-4 h-4" />
                </button>

                <div className="flex justify-between items-center">
                  <motion.p className="text-sm font-semibold truncate max-w-xs">
                    {f.file.name}
                  </motion.p>
                  <motion.p className="text-xs bg-neutral-100 dark:bg-neutral-800 rounded-full px-2 py-0.5 text-neutral-700 dark:text-neutral-300">
                    {(f.file.size / (1024 * 1024)).toFixed(2)} MB
                  </motion.p>
                </div>
                <div className="flex justify-between text-xs mt-2 text-neutral-500 dark:text-neutral-400">
                  <p>{f.file.type}</p>
                  <p>{new Date(f.file.lastModified).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

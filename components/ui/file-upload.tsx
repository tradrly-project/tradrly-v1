import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { XIcon } from "lucide-react";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 5,
    y: -3,
    opacity: 0.9,
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (urls: string[]) => void; // berubah dari File[] ke string[] (URL dari Vercel Blob)
}) => {
  const [files, setFiles] = useState<
    { file: File; url: string | null }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadToVercelBlob = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Upload failed");

    return data.url as string;
  };

  const handleFileChange = async (newFiles: File[]) => {
    const uploads = await Promise.all(
      newFiles.map(async (file) => {
        try {
          const url = await handleUploadToVercelBlob(file);
          return { file, url };
        } catch (e) {
          console.error("Upload error:", e);
          return { file, url: null };
        }
      })
    );

    const validUploads = uploads.filter((u) => u.url !== null);
    setFiles((prev) => [...prev, ...validUploads]);

    if (onChange) {
      onChange(validUploads.map((f) => f.url!) as string[]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div
      className={cn(
        "w-full h-fit rounded-xl border-2 border-dashed transition-all duration-300",
        isDragActive ? "border-sky-400 bg-sky-50/30 dark:bg-sky-900/30" : "border-neutral-300 dark:border-neutral-700"
      )}
      {...getRootProps()}
    >
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="py-8 px-6 group/file block rounded-lg cursor-pointer w-full h-full relative overflow-hidden transition-all"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          multiple
          type="file"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || []);
            handleFileChange(selectedFiles);
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {!files.length && (
            <>
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "w-20 h-20 flex items-center justify-center rounded-lg bg-background border shadow-md"
                )}
              >
                <IconUpload className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
              </motion.div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Klik atau Drop Screenshoot disini
              </p>
            </>
          )}

          {files.length > 0 &&
            files.map(({ file }, idx) => (
              <motion.div
                key={"file" + idx}
                layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                className={cn(
                  "relative overflow-hidden z-40 bg-background flex flex-col items-start justify-start md:h-24 p-4 w-full max-w-lg mx-auto rounded-md shadow border border-zinc-600 pr-7"
                )}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newFiles = files.filter((_, i) => i !== idx);
                    setFiles(newFiles);
                    onChange?.(newFiles.map((f) => f.url!).filter(Boolean));
                  }}
                  className="absolute top-2 right-2 text-neutral-400 hover:text-red-500 transition"
                  aria-label="Remove file"
                >
                  <XIcon className="w-4.5 h-4.5" />
                </button>

                <div className="flex justify-between w-full items-center">
                  <motion.p className="text-[14px] text-foreground font-semibold truncate max-w-xs">
                    {file.name}
                  </motion.p>
                  <motion.p className="rounded-full px-3 py-1 text-[12px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </motion.p>
                </div>
                <div className="flex justify-between w-full text-[13px] mt-5 text-neutral-500 dark:text-neutral-400">
                  <p>{file.type}</p>
                  <p>{new Date(file.lastModified).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </div>
  );
};

"use client";

import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type Option = {
  label: string;
  value: string;
};

type ComboBoxProps = {
  name: string;
  value?: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string | string[];
  className?: string;
};

export function ComboBox({
  name,
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  error,
  className,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  const filteredOptions = options.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: Option) => {
    onChange(item.value);
    setOpen(false);
    setSearch("");
    setHighlightedIndex(-1);
  };

  const selectedLabel = options.find((o) => o.value === value)?.label;

  React.useEffect(() => {
    if (open) {
      setSearch("");
      setHighlightedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, filteredOptions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    }
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-left text-sm border cursor-pointer",
              selectedLabel
                ? "bg-background hover:bg-foreground/7 hover:text-foreground"
                : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-muted-foreground data-[state=open]:bg-white/20",
              error && "border-red-500",
              className
            )}
          >
            {selectedLabel || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          disablePortal
          className="w-[--radix-popover-trigger-width] p-2 bg-background text-foreground"
          sideOffset={4}
          align="start"
        >
          <Input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder ?? "Cari..."}
            className="mb-2"
            autoFocus
          />
          <div className="max-h-[170px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="text-sm px-2 py-1 text-muted-foreground">
                Data tidak ditemukan.
              </div>
            ) : (
              filteredOptions.map((item, idx) => (
                <div
                  key={item.value}
                  ref={(el) => {
                    if (idx === highlightedIndex && el) {
                      el.scrollIntoView({ block: "nearest" });
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
                  className={cn(
                    "cursor-pointer px-2 py-1 text-sm flex items-center justify-between rounded text-foreground",
                    idx === highlightedIndex && "bg-foreground text-background",
                    "hover:bg-foreground hover:text-background"
                  )}
                >
                  {item.label}
                  {value === item.value && (
                    <Check className="h-4 w-4 text-foreground" />
                  )}
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      <input type="hidden" name={name} value={value ?? ""} />

      {error && (
        <div className="mt-1 text-xs text-red-600">
          {Array.isArray(error) ? error.join(", ") : error}
        </div>
      )}
    </div>
  );
}

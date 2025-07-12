"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

type Option = {
  label: string;
  value: string;
};

type IndicatorSelectProps = {
  name: string;
  selected: Option[];
  onChange: (selected: Option[]) => void;
  options: Option[];
  placeholder?: string;
  error?: string | string[];
  className?: string;
};

export function IndicatorSelect({
  selected,
  onChange,
  options,
  placeholder = "Indicator",
  error,
  className,
}: IndicatorSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  const badgeScrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = React.useState(false);
  const [showRightFade, setShowRightFade] = React.useState(false);

  const isSelected = (value: string) =>
    selected.some((item) => item.value === value);

  const filteredOptions = options.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (option: Option) => {
    if (isSelected(option.value)) {
      onChange(selected.filter((item) => item.value !== option.value));
    } else {
      onChange([...selected, option]);
    }
    setSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, filteredOptions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleToggle(filteredOptions[highlightedIndex]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item.value !== value));
  };

  React.useEffect(() => {
    if (badgeScrollRef.current) {
      badgeScrollRef.current.scrollTo({
        left: badgeScrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [selected]);

  const updateFade = () => {
    const el = badgeScrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 0);
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  React.useEffect(() => {
    updateFade();
  }, [selected]);

  React.useEffect(() => {
    const el = badgeScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="relative max-w-[500px] w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "flex min-h-[44px] items-center justify-between p-1 pl-1.5",
              "w-full max-w-full flex-shrink-0 overflow-x-auto relative focus:border-transparent",
              selected.length
                ? "bg-background hover:bg-background hover:text-foreground"
                : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-muted-foreground data-[state=open]:bg-white/20",
              error && "border-red-500",
              className
            )}
          >
            <div className="flex-1 min-w-0 max-w-full overflow-x-auto relative h-fit">
              {showLeftFade && (
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background/100 to-background/0 pointer-events-none z-10" />
              )}
              {showRightFade && (
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background/100 to-background/0 pointer-events-none z-10" />
              )}

              <div
                ref={badgeScrollRef}
                onScroll={updateFade}
                className="flex gap-1 overflow-x-auto whitespace-nowrap pr-2 max-w-full scroll-smooth scrollbar-gutter: stable"
              >
                {selected.length === 0 ? (
                  <span className="px-2">{placeholder}</span>
                ) : (
                  selected.map((item) => (
                    <Badge
                      key={item.value}
                      variant="secondary"
                      className="flex items-center gap-1 p-1 leading-0"
                    >
                      {item.label}
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            handleRemove(item.value);
                          }
                        }}
                        className="flex items-center justify-center cursor-pointer"
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                      </span>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div className="flex-shrink-0 pl-2 pr-1 z-20">
              <ChevronDownIcon />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-2 bg-background text-foreground"
          sideOffset={4}
          align="start"
        >
          <Input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari indicator..."
            className="mb-2"
            autoFocus
          />

          <div className="max-h-[170px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="text-sm px-2 py-1 text-muted-foreground">
                Tidak ditemukan.
              </div>
            ) : (
              filteredOptions.map((item, idx) => (
                <div
                  key={item.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleToggle(item);
                  }}
                  className={cn(
                    "cursor-pointer px-2 py-1 text-sm flex items-center justify-between rounded",
                    idx === highlightedIndex && "bg-foreground text-background",
                    "hover:bg-foreground hover:text-background"
                  )}
                >
                  {item.label}
                  {isSelected(item.value) && <Check className="h-4 w-4" />}
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selected.map((item) => (
        <input key={item.value} type="hidden" name="indicator" value={item.value} />
      ))}

      {error && (
        <div className="mt-1 text-xs text-red-600">
          {Array.isArray(error) ? error.join(", ") : error}
        </div>
      )}
    </div>
  );
}

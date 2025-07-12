"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { ChevronDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchGlobalIndicators,
  fetchUserIndicators,
  addUserIndicator,
} from "@/lib/api/indicator";
import { notifyError, notifySuccess } from "../asset/notify";

interface Option {
  label: string;
  value: string;
}

interface Indicator {
  id: string;
  name: string;
  code: string;
}

interface UserIndicator {
  id: string;
  indicatorId: string | null;
}

type AddIndicatorFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const AddIndicatorForm = ({
  onSuccess,
  onCancel,
}: AddIndicatorFormProps) => {
  const queryClient = useQueryClient();

  const [isCustom, setIsCustom] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [customName, setCustomName] = useState("");
  const [selectedIndicator, setSelectedIndicator] = useState<Option | null>(
    null
  );
  const [openIndicator, setOpenIndicator] = useState(false);

  const { data: globalIndicators = [] } = useQuery({
    queryKey: ["global-indicators"],
    queryFn: fetchGlobalIndicators,
  });

  const { data: userIndicators = [] } = useQuery({
    queryKey: ["user-indicator"],
    queryFn: fetchUserIndicators,
  });

  const addMutation = useMutation({
    mutationFn: addUserIndicator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-indicator"] });
      notifySuccess("Indikator berhasil ditambahkan");
      onSuccess?.();
    },
    onError: (error: Error) => {
      notifyError(
        error.message || "Terjadi kesalahan saat menambahkan indikator"
      );
    },
  });

  const usedIndicatorIds = useMemo(
    () =>
      userIndicators
        .filter((i: UserIndicator) => i.indicatorId !== null)
        .map((i: UserIndicator) => i.indicatorId),
    [userIndicators]
  );

  const filteredIndicators = useMemo(() => {
    return globalIndicators.filter(
      (ind: Indicator) => !usedIndicatorIds.includes(ind.id)
    );
  }, [globalIndicators, usedIndicatorIds]);

  const indicatorOptions: Option[] = filteredIndicators.map(
    (ind: Indicator) => ({
      label: `${ind.name} (${ind.code})`,
      value: ind.id,
    })
  );

  const handleSubmit = () => {
    if (isCustom) {
      if (!customCode || !customName) return;
      addMutation.mutate({ customCode, customName });
    } else {
      if (!selectedIndicator) return;
      addMutation.mutate({ indicatorId: selectedIndicator.value });
    }

    // Reset form
    setCustomCode("");
    setCustomName("");
    setSelectedIndicator(null);
    setIsCustom(false);
  };

  return (
    <div className="space-y-4 bg-background text-foreground">
      <div className="text-lg font-bold p-2 border-b border-zinc-800">
        Tambah Indikator
      </div>

      {/* Toggle Custom */}
      <div className="flex items-center justify-between space-x-2">
        <label className="text-sm font-medium">Gunakan indikator custom</label>
        <Switch checked={isCustom} onCheckedChange={setIsCustom} />
      </div>

      {/* Custom Fields */}
      {isCustom ? (
        <div className="space-y-2">
          <div>
            <label>Kode</label>
            <Input
              type="text"
              placeholder="Contoh: EMA 50"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
            />
          </div>
          <div>
            <label>Nama Indikator</label>
            <Input
              type="text"
              placeholder="Contoh: Exponensial MA 50"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label>Pilih Indikator</label>
          <Popover open={openIndicator} onOpenChange={setOpenIndicator}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openIndicator}
                className="w-full justify-between cursor-pointer hover:bg-foreground/8 hover:text-foreground"
              >
                {selectedIndicator
                  ? selectedIndicator.label
                  : "Pilih indikator"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <Command className="bg-background text-foreground">
                <div className="px-2 pt-2 pb-1 sticky top-0 z-10 bg-background">
                  <CommandInput placeholder="Cari indikator..." />
                </div>
                <CommandEmpty className="text-xs text-center font-bold italic text-zinc-700 mt-2 px-2">
                  Semua indikator telah digunakan
                </CommandEmpty>
                <div className="max-h-40 overflow-y-auto">
                  <CommandGroup className="bg-background px-2 pb-2">
                    {indicatorOptions.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.label.toLowerCase()}
                        onSelect={() => {
                          setSelectedIndicator(item);
                          setOpenIndicator(false);
                        }}
                        className="cursor-pointer"
                      >
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedIndicator(null);
            setCustomCode("");
            setCustomName("");
            setIsCustom(false);
            onCancel?.();
          }}
        >
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            addMutation.isPending ||
            (isCustom ? !customCode || !customName : !selectedIndicator)
          }
        >
          Simpan
        </Button>
      </div>
    </div>
  );
};

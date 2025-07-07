"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addUserPair, fetchGlobalPairs, fetchPairTypes } from "@/lib/api/pair";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ChevronDown } from "lucide-react";
import { notifySuccess } from "../asset/notify";

interface Option {
  label: string;
  value: string;
}

type GlobalPair = {
  id: string;
  symbol: string;
  type: "crypto" | "forex" | "stock" | "index"; // sesuaikan enum yang kamu pakai
};

type AddPairFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void; // << Tambahkan ini
};

export const AddPairForm = ({ onSuccess, onCancel }: AddPairFormProps) => {
  const queryClient = useQueryClient();

  const [isCustom, setIsCustom] = useState(false);
  const [selectedType, setSelectedType] = useState<Option | null>(null);
  const [selectedPair, setSelectedPair] = useState<Option | null>(null);
  const [customName, setCustomName] = useState("");
  const [openType, setOpenType] = useState(false);
  const [openPair, setOpenPair] = useState(false);

  const { data: types = [] } = useQuery({
    queryKey: ["pair-types"],
    queryFn: fetchPairTypes,
  });

  const { data: pairs = [] } = useQuery({
    queryKey: ["global-pairs"],
    queryFn: fetchGlobalPairs,
  });

  const filteredPairs = selectedType
    ? (pairs as GlobalPair[]).filter((p) => p.type === selectedType.value)
    : [];

  const addMutation = useMutation({
    mutationFn: addUserPair,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-pairs"] });
      onSuccess?.();
      notifySuccess("Pair berhasil ditambahkan");
    },
  });

  const handleSubmit = () => {
    if (!selectedType) return;

    if (isCustom) {
      if (!customName.trim()) return alert("Nama custom tidak boleh kosong");

      addMutation.mutate({
        customName: customName.trim(),
        customType: selectedType?.value as
          | "crypto"
          | "forex"
          | "stock"
          | "index", // ✅ Type assertion
      });
    } else {
      if (!selectedPair) return;

      addMutation.mutate({
        pairId: selectedPair.value,
      });
    }

    // Reset form
    setIsCustom(false);
    setSelectedType(null);
    setSelectedPair(null);
    setCustomName("");
  };

  return (
    <div className="space-y-4 bg-background text-foreground">
      <div className="text-lg font-bold bg-red- p-2 border-b border-zinc-800">
        <span>Tambah Baru</span>
      </div>
      {/* Custom Switch */}
      <div className="flex items-center gap-2">
        <Switch
          checked={isCustom}
          onCheckedChange={setIsCustom}
          id="custom-toggle"
          className="cursor-pointer"
        />
        <Label htmlFor="custom-toggle">Custom Pair</Label>
      </div>

      {/* Type Selector */}
      <div className="space-y-2">
        <Label>Tipe Pair</Label>
        <Popover open={openType} onOpenChange={setOpenType}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openType}
              className="w-full justify-between cursor-pointer hover:bg-foreground/8 hover:text-foreground"
            >
              {selectedType ? selectedType.label : "Pilih tipe"}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0 text-background "
            side="bottom"
            align="end"
          >
            <Command className="w-28 bg-background text-foreground py-1 pr-2">
              <CommandEmpty>Tidak ditemukan</CommandEmpty>
              <CommandGroup>
                {types.map((type: string) => {
                  const formattedType =
                    type.charAt(0).toUpperCase() + type.slice(1);
                  return (
                    <CommandItem
                      key={type}
                      value={type}
                      onSelect={() => {
                        setSelectedType({ label: formattedType, value: type }); // label sudah diformat
                        setSelectedPair(null);
                        setOpenType(false);
                      }}
                      className="hover:cursor-pointer data-[selected=true]:bg-background data-[selected=true]:text-foreground/25"
                    >
                      {formattedType}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Jika custom: Input nama */}
      {isCustom && (
        <div className="space-y-2">
          <Label>Nama Custom</Label>
          <Input
            value={customName}
            onChange={(e) => setCustomName(e.target.value.toUpperCase())}
            placeholder="Masukkan Pair"
            className="uppercase placeholder:normal-case"
          />
        </div>
      )}

      {/* Jika bukan custom: Pilih pair */}
      {!isCustom && (
        <div className="space-y-2">
          <Label>Pair</Label>
          <Popover open={openPair} onOpenChange={setOpenPair}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openPair}
                className="w-full justify-between cursor-pointer hover:bg-foreground/8 hover:text-foreground"
                disabled={!selectedType}
              >
                {selectedPair ? selectedPair.label : "Pilih pair"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0" align="center" side="right">
              <Command className="bg-background text-foreground">
                {/* Input tetap di luar area scroll */}
                <div className="px-2 pt-2 pb-1 sticky top-0 z-10 bg-background">
                  <CommandInput placeholder="Cari pair..." />
                </div>

                <CommandEmpty className="px-2">Tidak ditemukan</CommandEmpty>

                {/* Scroll hanya di bagian list item */}
                <div className="max-h-40 overflow-y-auto">
                  <CommandGroup className="bg-background px-2 pb-2">
                    {filteredPairs.map((pair: GlobalPair) => (
                      <CommandItem
                        key={pair.id}
                        value={pair.symbol}
                        onSelect={() => {
                          setSelectedPair({
                            label: pair.symbol,
                            value: pair.id,
                          });
                          setOpenPair(false);
                        }}
                        className="cursor-pointer data-[selected=true]:bg-background data-[selected=true]:text-foreground/25"
                      >
                        {pair.symbol}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            // Reset semua field
            setIsCustom(false);
            setSelectedType(null);
            setSelectedPair(null);
            setCustomName("");

            // Tutup popover/dialog jika tersedia
            onCancel?.();
          }}
        >
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={addMutation.isPending}>
          Simpan
        </Button>
      </div>
    </div>
  );
};

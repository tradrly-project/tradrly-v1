"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchGlobalPsychologies,
  fetchUserPsychologies,
  addUserPsychology,
} from "@/lib/api/psychology";
import { notifyError, notifySuccess } from "../asset/notify";

interface Option {
  label: string;
  value: string | null;
}

type UserPsychology = {
  id: string;
  psychologyId: string | null;
  customName: string | null;
};

type AddPsychologyFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const AddPsychologyForm = ({
  onSuccess,
  onCancel,
}: AddPsychologyFormProps) => {
  const queryClient = useQueryClient();

  const [isCustom, setIsCustom] = useState(false);
  const [selectedPsychology, setSelectedPsychology] = useState<Option | null>(
    null
  );
  const [customName, setCustomName] = useState("");
  const [openPsychology, setOpenPsychology] = useState(false);

  const { data: globalPsychologies = [] } = useQuery({
    queryKey: ["global-psychologies"],
    queryFn: fetchGlobalPsychologies,
  });

  const { data: userPsychologies = [] } = useQuery({
    queryKey: ["user-psychology"],
    queryFn: fetchUserPsychologies,
  });

  const addMutation = useMutation({
    mutationFn: addUserPsychology,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-psychology"] });
      notifySuccess("Psikologi berhasil ditambahkan");
      onSuccess?.();
    },
  });

  const handleSubmit = () => {
    if (isCustom && !customName.trim()) return;
    if (!isCustom && !selectedPsychology) return;

    const payload: Record<string, string> = {};
    if (isCustom && customName.trim()) {
      payload.customName = customName.trim();
    } else if (selectedPsychology?.value) {
      payload.psychologyId = selectedPsychology.value;
    }

    const trimmedName = customName.trim().toLowerCase();

    const isCustomDuplicate = customUserPsychologies.some(
      (p: UserPsychology) => p.customName?.toLowerCase() === trimmedName
    );

    const isGlobalDuplicate = globalPsychologies.some(
      (p: { name: string }) => p.name.toLowerCase() === trimmedName
    );

    if (isCustom && (isCustomDuplicate || isGlobalDuplicate)) {
      notifyError("Nama psikologi sudah digunakan.");
      return;
    }

    addMutation.mutate(payload);

    // Reset form
    setIsCustom(false);
    setSelectedPsychology(null);
    setCustomName("");
  };

  // Ambil ID psychology yang sudah digunakan user
  const usedPsychologyIds = userPsychologies
    .filter((p: UserPsychology) => p.psychologyId !== null)
    .map((p: UserPsychology) => p.psychologyId);

  // Filter globalPsychologies agar tidak menampilkan yang sudah dipakai
  const availableGlobalPsychologies = globalPsychologies.filter(
    (p: { id: string }) => !usedPsychologyIds.includes(p.id)
  );

  const customUserPsychologies = userPsychologies.filter(
    (p: UserPsychology) => p.psychologyId === null && p.customName !== null
  );

  const combinedOptions: Option[] = [
    ...availableGlobalPsychologies.map(
      (item: { id: string; name: string }) => ({
        label: item.name,
        value: item.id,
      })
    ),
    ...customUserPsychologies.map((item: UserPsychology) => ({
      label: item.customName!,
      value: null,
    })),
  ];

  return (
    <div className="space-y-4 bg-background text-foreground">
      <div className="text-lg font-bold p-2 border-b border-zinc-800">
        Tambah Psikologi
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={isCustom}
          onCheckedChange={setIsCustom}
          id="custom-toggle"
          className="cursor-pointer"
        />
        <Label htmlFor="custom-toggle">Custom Nama</Label>
      </div>

      {!isCustom && (
        <div className="space-y-2">
          <Label>Psikologi</Label>
          <Popover open={openPsychology} onOpenChange={setOpenPsychology}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openPsychology}
                className="w-full justify-between cursor-pointer hover:bg-foreground/8 hover:text-foreground"
              >
                {selectedPsychology
                  ? selectedPsychology.label
                  : "Pilih psikologi"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <Command className="bg-background text-foreground">
                <div className="px-2 pt-2 pb-1 sticky top-0 z-10 bg-background">
                  <CommandInput placeholder="Cari psikologi..." />
                </div>
                <CommandEmpty>Tidak ditemukan</CommandEmpty>
                <div className="max-h-40 overflow-y-auto">
                  <CommandGroup className="bg-background px-2 pb-2">
                    {combinedOptions.map((item: Option) => (
                      <CommandItem
                        key={`${item.label}-${item.value}`}
                        value={item.label}
                        onSelect={() => {
                          setSelectedPsychology(item);
                          setOpenPsychology(false);
                        }}
                        className="cursor-pointer data-[selected=true]:bg-background data-[selected=true]:text-foreground/25"
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

      {isCustom && (
        <div className="space-y-2">
          <Label>Nama Custom</Label>
          <Input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Masukkan nama custom"
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setIsCustom(false);
            setSelectedPsychology(null);
            setCustomName("");
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

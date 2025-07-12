"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
  fetchGlobalTimeframes,
  fetchUserTimeframes,
  addUserTimeframe,
} from "@/lib/api/timeframe";
import { notifySuccess } from "../asset/notify";

interface Option {
  label: string;
  value: string;
}

interface Timeframe {
  id: string;
  name: string;
  group: string;
}

interface UserTimeframe {
  id: string;
  timeframeId: string | null;
}

type AddTimeframeFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

const groupOptions: Option[] = [
  { label: "Semua", value: "" },
  { label: "Detik", value: "second" },
  { label: "Menit", value: "minute" },
  { label: "Jam", value: "hour" },
  { label: "Harian / Mingguan / Bulanan", value: "dayweekmonth" },
];

function convertTimeframeToMinutes(name: string): number {
  const match = name.match(/^(\d+)([smhdwM])$/i); // tambahkan 'M'
  if (!match) return Infinity;

  const value = parseInt(match[1], 10);
  const unit = match[2]; // pastikan lowercase untuk konsistensi

  const unitToMinutes: Record<string, number> = {
    s: 1 / 60,
    m: 1,
    h: 60,
    D: 1440,
    w: 10080,
    M: 43200, // 1 bulan = 30 hari = 43200 menit
  };

  return value * (unitToMinutes[unit] || Infinity);
}

export const AddTimeframeForm = ({
  onSuccess,
  onCancel,
}: AddTimeframeFormProps) => {
  const queryClient = useQueryClient();

  const [selectedGroup, setSelectedGroup] = useState<Option>(groupOptions[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Option | null>(
    null
  );
  const [openGroup, setOpenGroup] = useState(false);
  const [openTimeframe, setOpenTimeframe] = useState(false);

  const { data: globalTimeframes = [] } = useQuery({
    queryKey: ["global-timeframes"],
    queryFn: fetchGlobalTimeframes,
  });

  const { data: userTimeframes = [] } = useQuery({
    queryKey: ["user-timeframe"],
    queryFn: fetchUserTimeframes,
  });

  const addMutation = useMutation({
    mutationFn: addUserTimeframe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-timeframe"] });
      notifySuccess("Timeframe berhasil ditambahkan");
      onSuccess?.();
    },
  });

  const usedTimeframeIds = useMemo(
    () =>
      userTimeframes
        .filter((t: UserTimeframe) => t.timeframeId !== null)
        .map((t: UserTimeframe) => t.timeframeId),
    [userTimeframes]
  );

  const filteredTimeframes = useMemo(() => {
    return globalTimeframes
      .filter(
        (tf: Timeframe) =>
          !usedTimeframeIds.includes(tf.id) &&
          (selectedGroup.value === "" || tf.group === selectedGroup.value)
      )
      .sort(
        (a: Timeframe, b: Timeframe) =>
          convertTimeframeToMinutes(a.name) - convertTimeframeToMinutes(b.name)
      );
  }, [globalTimeframes, usedTimeframeIds, selectedGroup]);

  const timeframeOptions: Option[] = filteredTimeframes.map(
    (item: Timeframe) => ({
      label: item.name,
      value: item.id,
    })
  );

  const handleSubmit = () => {
    if (!selectedTimeframe) return;

    addMutation.mutate({ timeframeId: selectedTimeframe.value });

    setSelectedTimeframe(null);
    setSelectedGroup(groupOptions[0]);
  };

  return (
    <div className="space-y-4 bg-background text-foreground">
      <div className="text-lg font-bold p-2 border-b border-zinc-800">
        Tambah Timeframe
      </div>

      {/* Dropdown GROUP */}
      <div className="space-y-2">
        <label>Interval Waktu</label>
        <Popover open={openGroup} onOpenChange={setOpenGroup}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openGroup}
              className="w-full justify-between cursor-pointer hover:bg-foreground/8 hover:text-foreground"
            >
              {selectedGroup.label}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-0">
            <Command className="bg-background text-foreground">
              <CommandInput placeholder="Cari grup..." />
              <CommandGroup className="bg-background px-2 pb-2">
                {groupOptions.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label.toLowerCase()}
                    onSelect={() => {
                      setSelectedGroup(item);
                      setOpenGroup(false);
                      setSelectedTimeframe(null); // reset timeframe
                    }}
                    className="cursor-pointer"
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Dropdown TIMEFRAME */}
      <div className="space-y-2">
        <label>Timeframe</label>
        <Popover open={openTimeframe} onOpenChange={setOpenTimeframe}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openTimeframe}
              className="w-full justify-between cursor-pointer hover:bg-foreground/8 hover:text-foreground"
            >
              {selectedTimeframe ? selectedTimeframe.label : "Pilih timeframe"}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-0">
            <Command className="bg-background text-foreground">
              <div className="px-2 pt-2 pb-1 sticky top-0 z-10 bg-background">
                <CommandInput placeholder="Cari timeframe..." />
              </div>
              <CommandEmpty className="text-xs text-center font-bold italic text-zinc-700 mt-2 px-2">
                Semua timeframe telah digunakan
              </CommandEmpty>
              <div className="max-h-40 overflow-y-auto">
                <CommandGroup className="bg-background px-2 pb-2">
                  {timeframeOptions.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.label.toLowerCase()}
                      onSelect={() => {
                        setSelectedTimeframe(item);
                        setOpenTimeframe(false);
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

      {/* Tombol */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedTimeframe(null);
            setSelectedGroup(groupOptions[0]);
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

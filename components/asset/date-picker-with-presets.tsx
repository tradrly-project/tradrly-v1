"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { id } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"

type Props = {
    name: string
    value?: Date
    onChange: (date: Date) => void
    error?: string | string[]
}

const presetOptions: { label: string; value: string }[] = [
    { label: "Hari ini", value: "0" },
    { label: "Kemarin", value: "-1" },
    { label: "Minggu Lalu", value: "-7" },
    { label: "Bulan Lalu", value: "-30" },
]

export function DatePickerWithPresets({ name, value, onChange, error }: Props) {
    const [calendarMonth, setCalendarMonth] = React.useState<Date | undefined>(value)
    const [presetLabel, setPresetLabel] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (value) {
            setCalendarMonth(value)
        }
    }, [value])

    return (
        <div className="w-full">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal cursor-pointer",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value
                            ? format(value, "dd MMMM yyyy", { locale: id })
                            : <span className="text-zinc-400">Pilih tanggal</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2 bg-background">
                    <Select
                        onValueChange={(v) => {
                            const newDate = addDays(new Date(), parseInt(v))
                            onChange(newDate)
                            setCalendarMonth(newDate)
                            const selected = presetOptions.find(opt => opt.value === v)
                            setPresetLabel(selected?.label ?? null)
                        }}
                    >
                        <SelectTrigger className="group cursor-pointer border-none bg-white/5 hover:bg-white/10 data-[state=open]:bg-white/20 px-3 py-2">
                            <span
                                className={cn(
                                    "transition-colors",
                                    presetLabel ? "text-white" : "text-white group-hover:text-white"
                                )}
                            >
                                {presetLabel ?? "Hari ini"}
                            </span>
                        </SelectTrigger>
                        <SelectContent position="popper" className="cursor-pointer bg-background text-foreground p-1">
                            {presetOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="cursor-pointer hover:bg-white/10">
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="rounded-md border">
                        <Calendar
                            mode="single"
                            selected={value}
                            locale={id}
                            onSelect={(d) => {
                                if (d) {
                                    onChange(d)
                                    setCalendarMonth(d)
                                    setPresetLabel(null) // reset label jika pilih manual
                                }
                            }}
                            month={calendarMonth}
                            onMonthChange={setCalendarMonth}
                            className="text-foreground"
                        />
                    </div>
                </PopoverContent>
            </Popover>

            {/* Hidden input agar data dikirim ke server */}
            <input type="hidden" name={name} value={value ? format(value, "yyyy-MM-dd") : ""} />

            {error && (
                <div className="-mt-2 ml-2 text-xs text-red-700">
                    {Array.isArray(error) ? error.join(", ") : error}
                </div>
            )}
        </div>
    )
}

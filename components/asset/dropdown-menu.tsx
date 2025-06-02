"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"

type Option = {
    label: string
    value: string
}

type Props = {
    name: string
    value?: string
    onChange: (value: string) => void
    options: Option[]
    placeholder?: string
    error?: string | string[]
}

export function DropdownMenuSelect({
    name,
    value,
    onChange,
    options,
    placeholder = "Pilih salah satu",
    error,
}: Props) {
    return (
        <div className="w-full">
            <Select
                name={name}
                value={value}
                onValueChange={(val) => onChange(val)}
            >
                <SelectTrigger
                    className={cn(
                        "w-full px-3 py-2 border border-input text-sm pointer-events-auto cursor-pointer",
                        value
                            ? "bg-background"
                            : "bg-white/5 hover:bg-white/10 data-[state=open]:bg-white/20",
                        error && "border-red-500"
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent
                    className="cursor-pointer bg-background text-foreground px-1 py-2"
                    sideOffset={3}
                    align="end"
                    
                >
                    {options.map((opt) => (
                        <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="cursor-pointer hover:bg-white/10 px-2"
                        >
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <input type="hidden" name={name} value={value ?? ""} />

            {error && (
                <div className="mt-1 text-xs text-red-700">
                    {Array.isArray(error) ? error.join(", ") : error}
                </div>
            )}
        </div>
    )
}

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LeftPlaceholderInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    unit: string; // e.g., "TP", "SL", "RR", "P/L"
}

const LeftPlaceholderInput = React.forwardRef<
    HTMLInputElement,
    LeftPlaceholderInputProps
>(({ unit, className, ...props }, ref) => {
    return (
        <div className="relative w-full">
            <Input
                {...props}
                ref={ref}
                className={cn("pl-12", className)} // beri ruang kiri
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                {unit}
            </span>
        </div>
    );
});

LeftPlaceholderInput.displayName = "LeftPlaceholderInput";

export { LeftPlaceholderInput };

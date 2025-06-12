import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RightPlaceholderInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    unit: string; // e.g., "lot"
}

const RightPlaceholderInput = React.forwardRef<HTMLInputElement, RightPlaceholderInputProps>(
    ({ unit, className, ...props }, ref) => {
        return (
            <div className="relative w-full">
                <Input
                    {...props}
                    ref={ref}
                    className={cn("pr-12", className)} // beri ruang kanan
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                    {unit}
                </span>
            </div>
        );
    }
);

RightPlaceholderInput.displayName = "RightPlaceholderInput";

export { RightPlaceholderInput };

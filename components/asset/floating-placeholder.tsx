import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
    ({ label, className, value, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const showLabelAsFloating = isFocused || Boolean(value);

        return (
            <div className="relative w-full">
                <label
                    className={cn(
                        "absolute left-3 text-muted-foreground text-sm transition-all duration-200 pointer-events-none",
                        showLabelAsFloating
                            ? "text-xs top-1.5" // naik lebih tinggi
                            : "top-1/2 -translate-y-1/2"
                    )}
                >
                    {label}
                </label>
                <Input
                    {...props}
                    ref={ref}
                    value={value}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={cn(
                        "pt-6", // tambahkan padding atas agar teks tidak tabrakan dengan label
                        className
                    )}
                    placeholder={showLabelAsFloating ? "" : " "} // untuk jaga agar label di tengah jika kosong
                />
            </div>
        );
    }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };

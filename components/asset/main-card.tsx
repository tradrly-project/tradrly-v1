import { cn } from "@/lib/utils";
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/solid";
import React from "react";

type CardStatusProps = {
    title: string;
    value?: React.ReactNode;
    percentageChange: string;
    icon?: React.ReactNode;
    changeDescription?: string;
    className?: string;
};

export const MainCard: React.FC<CardStatusProps> = ({
    title,
    value,
    percentageChange,
    icon,
    changeDescription,
    className,
}) => {
    // **Cek apakah percentageChange bernilai negatif**
    const isNegative = percentageChange.startsWith("-");

    return (
        <div
            className={cn(
                "flex flex-col justify-between bg-white rounded-2xl shadow-md lg:p-4 sm:p-4 border",
                className
            )}
        >
            <div className="flex justify-between items-center">
                <h3 className={cn("font-medium text-gray-700", className)}>{title}</h3>
                <div className="text-gray-400">{icon}</div>
            </div>
            <div className="mt-2">
                <p className="xl:text-xl lg:text-md sm:text-sm font-bold text-black">{value}</p>
                <p className="mt-1 text-xs text-gray-500">
                    <span className={cn("font-semibold flex items-center gap-1", isNegative ? "text-red-500" : "text-emerald-600")}>
                        {isNegative ? (
                            <ArrowTrendingDownIcon className="w-5 h-5" />
                        ) : (
                            <ArrowTrendingUpIcon className="w-5 h-5" />
                        )}
                        {percentageChange}
                    </span>
                    {` ${changeDescription}`}
                </p>
            </div>
        </div>
    );
};
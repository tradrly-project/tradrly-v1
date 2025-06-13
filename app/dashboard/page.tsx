"use client";

import React from "react";
import {
  PerformanceCard,
  ProfitLossCard,
  PositionSummaryCard,
} from "@/components/asset/cards-multi";
import { useSidebar } from "@/components/ui/sidebar";

export default function Dashboard() {
  const { state } = useSidebar();
  const sidebarWidth = state === "collapsed" ? "6rem" : "16rem";

  return (
    <div
      className=" px-2 transition-all duration-300 ease-in-out bg-red-300"
      style={{
        width: `calc(100vw - ${sidebarWidth})`,
      }}
    >
      {/* Row 1 */}
      <div className="bg-blue-500 grid-cols-3 grid items h-full">
        <PerformanceCard />
        <ProfitLossCard />
        <PositionSummaryCard />

      </div>
    </div>
  );
}

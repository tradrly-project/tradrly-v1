"use client";

import React from "react";
import {
  PerformanceCard,
  ProfitLossCard,
  PositionSummaryCard,
  CalendarCard,
  ProfitLossChartCard,
  TradeHistoryCard,
  TopGainerCard,
  TopLoserCard,
} from "@/components/asset/cards-multi";
import { useSidebar } from "@/components/ui/sidebar";

export default function Dashboard() {
  const { state } = useSidebar();
  const sidebarWidth = state === "collapsed" ? "6rem" : "16rem";

  return (
    <div
      className="px-2 py-4 transition-all duration-300 ease-in-out"
      style={{
        width: `calc(100vw - ${sidebarWidth})`,
      }}
    >
      <div className={`flex items-start ${state === "collapsed" ? "gap-x-6" : "gap-x-6"} transition-all duration-300 ease-in-out`}>
        {/* Left: Performance (440px) */}
        <div className="w-[500px]">
          <PerformanceCard />
        </div>

        {/* Middle: ProfitLoss (200px) */}
        <div className="w-[260px]">
          <ProfitLossCard />
        </div>

        {/* Right: Position Summary (440px) */}
        <div className="w-[500px]">
          <PositionSummaryCard />
        </div>
      </div>

      {/* Baris Kedua */}
      <div className={`flex items-start mt-6 ${state === "collapsed" ? "gap-x-6" : "gap-x-6"} transition-all duration-300 ease-in-out`}>
        {/* Card Besar (2 bagian) */}
        <div className="w-[445px]">
          {/* Ganti dengan komponen card kamu */}
          <CalendarCard />
        </div>

        {/* Card Kecil (1 bagian) */}
        <div className="w-[700px]">
          {/* Ganti dengan komponen card kamu */}
          <ProfitLossChartCard />
        </div>
      </div>

      {/* Baris Ketiga */}
      <div className={`flex items-start mt-6 ${state === "collapsed" ? "gap-x-6" : "gap-x-6"} transition-all duration-300 ease-in-out`}>
        {/* Left: Performance (440px) */}
        <div className="w-[740px]">
          <TradeHistoryCard />
        </div>

        {/* Middle: ProfitLoss (200px) */}
        <div className="w-[260px]">
          <TopGainerCard />
        </div>

        {/* Right: Position Summary (440px) */}
        <div className="w-[260px]">
          <TopLoserCard />
        </div>
      </div>
    </div>
  );
}



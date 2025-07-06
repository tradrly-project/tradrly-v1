"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";

// Tab config sama seperti page.tsx
const settingTabs = [
  { id: "user", label: "User" },
  { id: "pair", label: "Pair" },
  { id: "psikologi", label: "Psikologi" },
  { id: "timeframe", label: "Timeframe" },
  { id: "indikator", label: "Indikator" },
];

export default function SettingsLoading() {
  const [activeTab, setActiveTab] = useState("user");
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const { state } = useSidebar();
  const sidebarWidth = state === "collapsed" ? "6rem" : "16rem";

  useEffect(() => {
    const index = settingTabs.findIndex((t) => t.id === activeTab);
    const tab = tabsRef.current[index];
    if (tab) {
      const { offsetLeft, offsetWidth } = tab;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  return (
    <div
      className="mt-4 px-4"
      style={{ width: `calc(100vw - ${sidebarWidth})` }}
    >
      <Tabs
        defaultValue="user"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="relative">
          <TabsList className="relative flex p-1 overflow-hidden bg-background rounded-none">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 50 }}
              className="absolute top-0 bottom-0 rounded-lg bg-primary z-0 transition-all"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
            />

            {settingTabs.map((tab, i) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                className="!bg-transparent relative z-10 px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Separator className="mt-2 bg-zinc-800" />
        </div>

        {/* Spinner Content */}
        <div className="flex justify-center items-center mt-10">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Tabs>
    </div>
  );
}

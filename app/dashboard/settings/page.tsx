"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import UserSettingsForm from "@/components/settings/user";
import { useSidebar } from "@/components/ui/sidebar";

const settingTabs = [
  { id: "user", label: "User", content: <UserSettingsForm /> },
  { id: "pair", label: "Pair", content: "CRUD Pair di sini." },
  { id: "psikologi", label: "Psikologi", content: "CRUD Psikologi di sini." },
  { id: "timeframe", label: "Timeframe", content: "CRUD Timeframe di sini." },
  { id: "indikator", label: "Indikator", content: "CRUD Indikator di sini." },
];

export default function SettingsPage() {
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
    <div className="mx-auto mt-6 px-4"
    style={{ width: `calc(100vw - ${sidebarWidth})` }}>
      <Tabs
        defaultValue="account"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="relative">
          <TabsList className="relative flex p-1 overflow-hidden bg-background rounded-none">
            {/* Active tab background (animated) */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 50 }}
              className="absolute top-0 bottom-0 rounded-lg bg-primary z-0 transition-all"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
            />

            {/* Tab buttons */}
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

        {/* Tab Content */}
        {settingTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
             {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

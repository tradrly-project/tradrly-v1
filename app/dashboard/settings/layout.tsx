// app/settings/layout.tsx

"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const settingTabs = [
  { id: "user", label: "User" },
  { id: "pair", label: "Pair" },
  { id: "psychology", label: "Psikologi" },
  { id: "indicator", label: "Indikator" },
  { id: "timeframe", label: "Timeframe" },
  { id: "strategy", label: "Strategi" },
  
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentTab = pathname.split("/").pop() || "user";

  const [activeTab, setActiveTab] = useState(currentTab);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const { state } = useSidebar();
  const sidebarWidth = state === "collapsed" ? "6rem" : "16rem";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const index = settingTabs.findIndex((t) => t.id === activeTab);
    const tab = tabsRef.current[index];
    if (tab) {
      const { offsetLeft, offsetWidth } = tab;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  if (!mounted) return null;

  return (
    <div className="px-4" style={{ width: `calc(100vw - ${sidebarWidth})` }}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="relative flex p-1 overflow-hidden bg-background rounded-none mt-3">
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
            <Link key={tab.id} href={`/dashboard/settings/${tab.id}`} passHref>
              <TabsTrigger
                value={tab.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                className="!bg-transparent relative z-10 px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                {tab.label}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>

        <div className="h-[70svh]">
          <Separator className="bg-zinc-800 mb-3" />
          {children}
        </div>
      </Tabs>
    </div>
  );
}

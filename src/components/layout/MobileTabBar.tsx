"use client";

import React from "react";
import { MessageSquare, Layers, Calendar } from "lucide-react";

export type MobileTab = "chat" | "plan" | "events";

interface MobileTabBarProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  hasPlan: boolean;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTab,
  onChangeTab,
  hasPlan,
}) => {
  return (
    <div className="lg:hidden w-full bg-surface border-t border-token py-2 px-6 flex items-center justify-around shrink-0 z-20">
      <button
        onClick={() => onChangeTab("chat")}
        className={`flex flex-col items-center gap-1 text-xs cursor-pointer ${
          activeTab === "chat"
            ? "text-[#7A3E9D] font-bold"
            : "text-muted hover:text-main"
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px]">Chat</span>
      </button>

      <button
        onClick={() => onChangeTab("plan")}
        className={`relative flex flex-col items-center gap-1 text-xs cursor-pointer ${
          activeTab === "plan"
            ? "text-[#7A3E9D] font-bold"
            : "text-muted hover:text-main"
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px]">Plan</span>
        {hasPlan && (
          <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#1F8A5B]" />
        )}
      </button>

      <button
        onClick={() => onChangeTab("events")}
        className={`flex flex-col items-center gap-1 text-xs cursor-pointer ${
          activeTab === "events"
            ? "text-[#7A3E9D] font-bold"
            : "text-muted hover:text-main"
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span className="text-[10px]">Events</span>
      </button>
    </div>
  );
};


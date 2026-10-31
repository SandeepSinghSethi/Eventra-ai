"use client";

import React from "react";
import { EventPlan } from "@/lib/types";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Plus, Calendar, Sparkles, Trash2, Heart, PartyPopper, Users } from "lucide-react";

interface SidebarProps {
  events: EventPlan[];
  activeEventId: string | null;
  onSelectEvent: (plan: EventPlan) => void;
  onNewPlan: () => void;
  onDeleteEvent: (id: string, e: React.MouseEvent) => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  events,
  activeEventId,
  onSelectEvent,
  onNewPlan,
  onDeleteEvent,
  onCloseMobile,
}) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "wedding":
        return <Heart className="w-3.5 h-3.5 text-[#7A3E9D]" />;
      case "birthday":
        return <PartyPopper className="w-3.5 h-3.5 text-[#E8684A]" />;
      case "community":
        return <Users className="w-3.5 h-3.5 text-[#1F8A5B]" />;
      default:
        return <Calendar className="w-3.5 h-3.5 text-muted" />;
    }
  };

  return (
    <div className="w-[280px] h-full bg-surface border-r border-token flex flex-col justify-between shrink-0 select-none">
      {/* Brand & New Plan Header */}
      <div className="p-4 border-b border-token space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#7A3E9D] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              E
            </div>
            <div>
              <h1 className="font-bold text-main text-base tracking-tight leading-none">
                Eventra
              </h1>
              <span className="text-[10px] text-muted font-medium">
                Celebration Planner
              </span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-muted hover:text-main lg:hidden"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={onNewPlan}
          className="w-full py-2.5 px-3 rounded-xl bg-[#7A3E9D] hover:bg-[#693288] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Plan</span>
        </button>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted px-2 py-1">
          Your Events ({events.length})
        </div>

        {events.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted border border-dashed border-token rounded-xl my-2">
            No saved events yet. Start by sending a message!
          </div>
        ) : (
          events.map((evt) => {
            const isSelected = evt.id === activeEventId;

            return (
              <div
                key={evt.id}
                onClick={() => {
                  onSelectEvent(evt);
                  onCloseMobile?.();
                }}
                className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                  isSelected
                    ? "bg-[#7A3E9D]/10 border-[#7A3E9D] text-main shadow-2xs"
                    : "bg-surface border-token hover:border-token/80 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 shrink-0 p-1 rounded-md bg-black/5 dark:bg-white/5">
                    {getEventIcon(evt.event.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-main line-clamp-2 leading-tight break-words">
                      {evt.event.title}
                    </h4>
                    <p className="text-[11px] text-muted line-clamp-1 mt-0.5 break-words">
                      {evt.date || "Date TBD"} • {evt.location || "Local"}
                    </p>
                    <div className="text-[10px] font-medium text-[#7A3E9D] dark:text-[#C9A0E6] mt-1">
                      {evt.currency === "INR" ? "₹" : "$"}
                      {evt.total_budget.toLocaleString()}
                    </div>
                  </div>
                </div>

                {evt.id && (
                  <button
                    onClick={(e) => onDeleteEvent(evt.id!, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted hover:text-[#C0392B] hover:bg-[#C0392B]/10 transition-all shrink-0 cursor-pointer"
                    title="Delete plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Theme Toggle */}
      <div className="p-3 border-t border-token flex items-center justify-between text-xs text-muted bg-surface/50">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-main">Gemini Flash AI</span>
          <span className="text-[10px] text-muted">Intelligent Engine Active</span>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};


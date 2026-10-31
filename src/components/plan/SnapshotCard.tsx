"use client";

import React from "react";
import { EventPlan } from "@/lib/types";
import { Calendar, MapPin, Users, Wallet, Clock } from "lucide-react";

interface SnapshotCardProps {
  plan: EventPlan;
}

export const SnapshotCard: React.FC<SnapshotCardProps> = ({ plan }) => {
  let daysRemaining: number | null = null;
  if (plan.date) {
    const target = new Date(plan.date).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  const currencySymbol =
    plan.currency === "INR" ? "₹" : plan.currency === "USD" ? "$" : plan.currency;

  return (
    <div className="bg-surface rounded-2xl p-5 border border-token shadow-xs space-y-4">
      {/* Title & Occasion Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex-1 min-w-[200px]">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#7A3E9D]/10 text-[#7A3E9D] border border-[#7A3E9D]/20 mb-1.5">
            {plan.event.type}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-main leading-snug break-words">
            {plan.event.title}
          </h2>
          <p className="text-xs text-muted mt-0.5 break-words">{plan.event.occasion}</p>
        </div>

        {daysRemaining !== null && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8684A]/10 text-[#E8684A] border border-[#E8684A]/20 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">
              {daysRemaining === 0 ? "Today!" : `${daysRemaining} days left`}
            </span>
          </div>
        )}
      </div>

      {/* Grid of Key Info (Full visible text, no snipping) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-token/60">
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4 text-muted shrink-0" />
          <span className="text-main font-medium">
            {plan.date ? new Date(plan.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "Date TBD"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <MapPin className="w-4 h-4 text-muted shrink-0" />
          <span className="text-main font-medium break-words">
            {plan.location || "Location TBD"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Users className="w-4 h-4 text-muted shrink-0" />
          <span className="text-main font-medium">
            {plan.guests ? `~${plan.guests} Guests` : "Guests TBD"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs col-span-1 sm:col-span-3 pt-1">
          <Wallet className="w-4 h-4 text-[#1F8A5B] shrink-0" />
          <span className="text-main font-bold text-sm">
            Total Budget: {currencySymbol}{plan.total_budget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Assumptions Chips */}
      {plan.assumptions && plan.assumptions.length > 0 && (
        <div className="pt-2 border-t border-token/60 space-y-1.5">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">
            Key Planning Assumptions
          </div>
          <div className="flex flex-wrap gap-1.5">
            {plan.assumptions.slice(0, 6).map((assumption, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-muted border border-token leading-tight break-words max-w-full"
              >
                {assumption}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

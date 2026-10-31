"use client";

import React, { useState } from "react";
import { VendorItem } from "@/lib/types";
import { IconHelper } from "../ui/IconHelper";
import { ChevronDown, ChevronRight, AlertTriangle, ShieldCheck, CheckSquare, Square } from "lucide-react";

interface VendorChecklistProps {
  vendors: VendorItem[];
}

export const VendorChecklist: React.FC<VendorChecklistProps> = ({ vendors }) => {
  // First vendor is open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-surface rounded-2xl p-5 border border-token shadow-xs space-y-4">
      <div className="border-b border-token pb-3">
        <h3 className="text-lg font-bold text-main">Vendor Due Diligence</h3>
        <p className="text-xs text-muted">
          Screening questions, contract requirements, and red flags
        </p>
      </div>

      <div className="space-y-3">
        {vendors.map((vendor, vIdx) => {
          const isOpen = openIndex === vIdx;

          return (
            <div
              key={vIdx}
              className="rounded-xl border border-token overflow-hidden bg-surface transition-all"
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleAccordion(vIdx)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#7A3E9D]/10 text-[#7A3E9D]">
                    <IconHelper name={vendor.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-main">
                      {vendor.type}
                    </h4>
                    <span className="text-[11px] text-muted">
                      {vendor.ask_before_booking.length} Questions • {vendor.contract_must_include.length} Contract Clauses
                    </span>
                  </div>
                </div>

                <div className="text-muted">
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-token/60 space-y-4 text-xs">
                  {/* Ask Before Booking */}
                  <div>
                    <div className="font-semibold text-main uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5 text-[#7A3E9D] dark:text-[#C9A0E6]">
                      <CheckSquare className="w-3.5 h-3.5" />
                      Ask Before Booking
                    </div>
                    <ul className="space-y-1.5 pl-1">
                      {vendor.ask_before_booking.map((q, qIdx) => {
                        const checkId = `q-${vIdx}-${qIdx}`;
                        const isChecked = !!checkedItems[checkId];
                        return (
                          <li
                            key={qIdx}
                            onClick={() => toggleCheck(checkId)}
                            className="flex items-start gap-2 text-muted hover:text-main cursor-pointer"
                          >
                            <span className="mt-0.5 text-[#7A3E9D]">
                              {isChecked ? (
                                <CheckSquare className="w-3.5 h-3.5 text-[#1F8A5B]" />
                              ) : (
                                <Square className="w-3.5 h-3.5" />
                              )}
                            </span>
                            <span className={`break-words leading-relaxed ${isChecked ? "line-through opacity-60" : ""}`}>
                              {q}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Contract Must Include */}
                  <div>
                    <div className="font-semibold text-main uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5 text-[#1F8A5B]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Contract Must Include
                    </div>
                    <ul className="space-y-1.5 pl-1">
                      {vendor.contract_must_include.map((c, cIdx) => {
                        const checkId = `c-${vIdx}-${cIdx}`;
                        const isChecked = !!checkedItems[checkId];
                        return (
                          <li
                            key={cIdx}
                            onClick={() => toggleCheck(checkId)}
                            className="flex items-start gap-2 text-muted hover:text-main cursor-pointer"
                          >
                            <span className="mt-0.5 text-[#1F8A5B]">
                              {isChecked ? (
                                <CheckSquare className="w-3.5 h-3.5" />
                              ) : (
                                <Square className="w-3.5 h-3.5" />
                              )}
                            </span>
                            <span className={`break-words leading-relaxed ${isChecked ? "line-through opacity-60" : ""}`}>
                              {c}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Payment Advice */}
                  <div className="p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-token">
                    <span className="font-semibold text-main">Payment advice: </span>
                    <span className="text-muted">{vendor.payment_advice}</span>
                  </div>

                  {/* Red Flags */}
                  {vendor.red_flags && vendor.red_flags.length > 0 && (
                    <div>
                      <div className="font-semibold text-[#C0392B] uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Red Flags to Watch Out For
                      </div>
                      <ul className="space-y-1 pl-1">
                        {vendor.red_flags.map((flag, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2 text-[#C0392B]/80 text-[11px]">
                            <span className="mt-1 w-1 h-1 rounded-full bg-current shrink-0" />
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


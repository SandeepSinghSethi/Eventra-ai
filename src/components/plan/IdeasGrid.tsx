"use client";

import React, { useState } from "react";
import { IdeaItem } from "@/lib/types";
import { Palette, Sparkles, Utensils, Home, ChevronLeft, ChevronRight, Layers, Eye } from "lucide-react";

interface IdeasGridProps {
  ideas: IdeaItem[];
}

export const IdeasGrid: React.FC<IdeasGridProps> = ({ ideas }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<"slider" | "stack">("slider");

  if (!ideas || ideas.length === 0) return null;

  const currentIdea = ideas[currentSlide] || ideas[0];

  const getStyleLabel = (style: string) => {
    switch (style) {
      case "classic":
        return { label: "Classic Elegance", color: "bg-[#7A3E9D]/10 text-[#7A3E9D] border-[#7A3E9D]/30" };
      case "modern":
        return { label: "Modern Minimalist", color: "bg-[#E8684A]/10 text-[#E8684A] border-[#E8684A]/30" };
      case "budget_diy":
        return { label: "Budget DIY & Eco", color: "bg-[#1F8A5B]/10 text-[#1F8A5B] border-[#1F8A5B]/30" };
      default:
        return { label: "Theme Concept", color: "bg-black/5 text-muted border-token" };
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ideas.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + ideas.length) % ideas.length);
  };

  return (
    <div className="bg-surface rounded-2xl p-5 border border-token shadow-xs space-y-4">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between border-b border-token pb-3 gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-main">Personalized Ideas & Themes</h3>
          <p className="text-xs text-muted">
            Curated aesthetic directions tailored for your event
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-token shrink-0">
          <button
            onClick={() => setViewMode("slider")}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === "slider"
                ? "bg-surface shadow-2xs text-[#7A3E9D] font-bold"
                : "text-muted hover:text-main"
            }`}
            title="Slideable Carousel View"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Slideable</span>
          </button>
          <button
            onClick={() => setViewMode("stack")}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === "stack"
                ? "bg-surface shadow-2xs text-[#7A3E9D] font-bold"
                : "text-muted hover:text-main"
            }`}
            title="Stacked Comparison View"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Stack</span>
          </button>
        </div>
      </div>

      {viewMode === "slider" ? (
        /* Slideable Carousel Mode */
        <div className="space-y-4">
          {/* Slide Category Pills & Arrow Navigation */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {ideas.map((idea, idx) => {
                const isSelected = idx === currentSlide;
                const badge = getStyleLabel(idea.style);
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#7A3E9D] text-white border-[#7A3E9D] shadow-xs scale-102"
                        : "bg-surface text-muted hover:text-main border-token hover:border-[#7A3E9D]/30"
                    }`}
                  >
                    {idea.style === "classic"
                      ? "✨ Classic"
                      : idea.style === "modern"
                      ? "⚡ Modern"
                      : "🌿 Budget DIY"}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={prevSlide}
                className="p-1.5 rounded-xl border border-token hover:border-[#7A3E9D] hover:bg-black/5 dark:hover:bg-white/5 text-muted hover:text-main transition-colors cursor-pointer"
                title="Previous Theme (←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-medium text-muted px-1">
                {currentSlide + 1}/{ideas.length}
              </span>
              <button
                onClick={nextSlide}
                className="p-1.5 rounded-xl border border-token hover:border-[#7A3E9D] hover:bg-black/5 dark:hover:bg-white/5 text-muted hover:text-main transition-colors cursor-pointer"
                title="Next Theme (→)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Idea Slide Card */}
          <div className="rounded-2xl border border-token p-5 bg-app/60 space-y-4 transition-all">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  getStyleLabel(currentIdea.style).color
                }`}
              >
                {getStyleLabel(currentIdea.style).label}
              </span>
              <span className="text-[11px] text-muted italic">Theme Concept</span>
            </div>

            <h4 className="text-base font-bold text-main leading-snug break-words">
              {currentIdea.theme}
            </h4>

            {/* Vibe Quote */}
            <div className="p-3 rounded-xl bg-surface border border-token/80 text-xs italic text-muted leading-relaxed">
              "{currentIdea.vibe}"
            </div>

            {/* Color Palette Swatches */}
            <div>
              <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#7A3E9D]" />
                Color Palette & Theme Swatches
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentIdea.palette.map((color, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-2 rounded-xl bg-surface border border-token shadow-2xs flex flex-col gap-1.5"
                  >
                    <div
                      className="w-full h-8 rounded-lg shadow-inner border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-main truncate" title={color.name}>
                        {color.name}
                      </div>
                      <div className="text-[10px] font-mono text-muted">
                        {color.hex}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decor & Food Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-surface border border-token/80 space-y-1">
                <div className="font-semibold text-xs text-main flex items-center gap-1.5 text-[#7A3E9D] dark:text-[#C9A0E6]">
                  <Home className="w-3.5 h-3.5" />
                  Decor & Atmosphere
                </div>
                <p className="text-xs text-muted leading-relaxed break-words">
                  {currentIdea.decor}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-token/80 space-y-1">
                <div className="font-semibold text-xs text-main flex items-center gap-1.5 text-[#E8684A]">
                  <Utensils className="w-3.5 h-3.5" />
                  Food & Beverage Concept
                </div>
                <p className="text-xs text-muted leading-relaxed break-words">
                  {currentIdea.food}
                </p>
              </div>
            </div>

            {/* Signature Moment */}
            <div className="p-3 rounded-xl bg-[#1F8A5B]/5 border border-[#1F8A5B]/20 space-y-1">
              <div className="font-semibold text-xs text-[#1F8A5B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Signature Moment
              </div>
              <p className="text-xs text-main leading-relaxed break-words font-medium">
                {currentIdea.signature_moment}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Stacked Comparison View */
        <div className="space-y-4">
          {ideas.map((idea, idx) => {
            const badge = getStyleLabel(idea.style);
            return (
              <div
                key={idx}
                className="rounded-2xl border border-token p-4 bg-app/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                  <h4 className="text-xs font-bold text-main">{idea.theme}</h4>
                </div>

                <p className="text-xs text-muted italic">"{idea.vibe}"</p>

                {/* Swatches */}
                <div className="flex gap-1.5">
                  {idea.palette.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex-1 h-6 rounded-md shadow-2xs border border-black/10"
                      style={{ backgroundColor: c.hex }}
                      title={`${c.name} (${c.hex})`}
                    />
                  ))}
                </div>

                <div className="text-xs text-muted">
                  <strong className="text-main">Decor: </strong>{idea.decor}
                </div>
                <div className="text-xs text-muted">
                  <strong className="text-main">Food: </strong>{idea.food}
                </div>
                <div className="text-xs text-[#1F8A5B]">
                  <strong>Signature: </strong>{idea.signature_moment}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

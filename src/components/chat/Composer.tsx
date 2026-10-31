"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

interface ComposerProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const QUICK_REPLIES = [
  "Adjust budget",
  "Add vendors",
  "Draft invitation message",
  "Compress timeline",
  "Plan 6th unicorn birthday in Pune, 25 kids, ₹40,000",
];

export const Composer: React.FC<ComposerProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize up to 5 lines (~120px)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-surface border-t border-token px-4 py-3 shrink-0">
      {/* Quick reply chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        <Sparkles className="w-3.5 h-3.5 text-[#E8684A] shrink-0" />
        {QUICK_REPLIES.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(chip)}
            disabled={isLoading}
            className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap bg-black/5 dark:bg-white/5 text-muted hover:text-main hover:bg-[#7A3E9D]/10 hover:border-[#7A3E9D]/30 border border-token transition-colors cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Main input container */}
      <div className="relative flex items-end gap-2 bg-app rounded-xl border border-token p-2 focus-within:ring-2 focus-within:ring-[#7A3E9D]/30 focus-within:border-[#7A3E9D] transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Eventra... (e.g. Plan a wedding for 150 guests in Goa, ₹15 Lakhs)"
          disabled={isLoading}
          rows={1}
          className="w-full resize-none bg-transparent outline-none text-main placeholder:text-muted/60 text-sm px-2 py-1 max-h-[140px]"
        />

        {/* Character counter (shows after 1500 chars) */}
        {input.length > 1500 && (
          <span className="text-[11px] text-muted self-center pr-1 font-mono">
            {input.length} chars
          </span>
        )}

        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-[#7A3E9D] hover:bg-[#693288] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
          title="Send message (Enter)"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


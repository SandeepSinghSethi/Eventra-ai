"use client";

import React, { useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Composer } from "./Composer";
import { Sparkles, Calendar, Heart, PartyPopper } from "lucide-react";

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (msg: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  onSendMessage,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-app overflow-hidden">
      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        {messages.length === 0 ? (
          /* Empty State Welcome Card */
          <div className="max-w-md mx-auto my-auto text-center py-12 px-6 bg-surface rounded-2xl border border-token shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#7A3E9D]/10 text-[#7A3E9D] flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-main mb-2">
              Meet Eventra
            </h2>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              Your expert celebration & event planner. Get a realistic budget breakdown, backward timeline, vendor checklists, and bespoke ideas in seconds.
            </p>

            <div className="space-y-2 text-left">
              <button
                onClick={() =>
                  onSendMessage(
                    "Plan my daughter's 6th birthday, 25 kids, ₹40,000, in Pune, next month. Unicorn theme."
                  )
                }
                className="w-full text-left p-3 rounded-xl border border-token hover:border-[#7A3E9D] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex items-center gap-3 cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-[#E8684A]/10 text-[#E8684A] group-hover:scale-105 transition-transform">
                  <PartyPopper className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-main">
                    6th Birthday Party (Unicorn)
                  </div>
                  <div className="text-[11px] text-muted">
                    Pune • 25 kids • ₹40,000
                  </div>
                </div>
              </button>

              <button
                onClick={() =>
                  onSendMessage(
                    "Plan a traditional destination wedding in Goa for 120 guests with ₹18 Lakhs budget, next winter."
                  )
                }
                className="w-full text-left p-3 rounded-xl border border-token hover:border-[#7A3E9D] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex items-center gap-3 cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-[#7A3E9D]/10 text-[#7A3E9D] group-hover:scale-105 transition-transform">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-main">
                    Destination Wedding
                  </div>
                  <div className="text-[11px] text-muted">
                    Goa • 120 guests • ₹18 Lakhs
                  </div>
                </div>
              </button>

              <button
                onClick={() =>
                  onSendMessage(
                    "Plan a community neighborhood cultural festival in Bengaluru for 300 people, ₹1.5 Lakhs budget."
                  )
                }
                className="w-full text-left p-3 rounded-xl border border-token hover:border-[#7A3E9D] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex items-center gap-3 cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-[#1F8A5B]/10 text-[#1F8A5B] group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-main">
                    Community Cultural Festival
                  </div>
                  <div className="text-[11px] text-muted">
                    Bengaluru • 300 guests • ₹1.5 Lakhs
                  </div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-3 max-w-[85%] md:max-w-[78%] ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-[#7A3E9D] text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-serif font-bold">
                      E
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`rounded-2xl p-4 shadow-xs border transition-colors ${
                      isUser
                        ? "bg-[#7A3E9D] text-white border-transparent"
                        : "bg-surface text-main border-token"
                    }`}
                  >
                    {isUser ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    ) : (
                      <MarkdownRenderer content={message.content} />
                    )}

                    <div
                      className={`text-[10px] mt-2 opacity-60 text-right ${
                        isUser ? "text-white/80" : "text-muted"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-[#7A3E9D] text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-serif font-bold">
              E
            </div>
            <div className="bg-surface border border-token rounded-2xl px-4 py-3 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7A3E9D] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-[#7A3E9D] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-[#7A3E9D] animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-xs text-muted ml-2">Eventra is calculating...</span>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <Composer onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};


"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, EventPlan, RuntimeContext } from "@/lib/types";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { PlanPanel } from "@/components/layout/PlanPanel";
import { MobileTabBar, MobileTab } from "@/components/layout/MobileTabBar";
import { Menu, Layers, GripVertical } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activePlan, setActivePlan] = useState<EventPlan | null>(null);
  const [savedEvents, setSavedEvents] = useState<EventPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Responsive UI States
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
  const [showTabletSidebar, setShowTabletSidebar] = useState(false);
  const [showTabletPlanDrawer, setShowTabletPlanDrawer] = useState(false);

  // Slideable Panel Width State (Desktop)
  const [planWidth, setPlanWidth] = useState<number>(470);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartWidthRef = useRef<number>(470);

  // Fetch saved plans on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setSavedEvents(data);
        if (data.length > 0 && !activePlan) {
          setActivePlan(data[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load events", e);
    }
  };

  // Draggable Splitter Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = isExpanded ? 640 : planWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = dragStartXRef.current - moveEvent.clientX;
      const newWidth = Math.min(Math.max(dragStartWidthRef.current + delta, 360), 800);
      setPlanWidth(newWidth);
      if (newWidth > 580) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const toggleExpand = () => {
    if (isExpanded) {
      setPlanWidth(470);
      setIsExpanded(false);
    } else {
      setPlanWidth(650);
      setIsExpanded(true);
    }
  };

  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const context: RuntimeContext = {
        today: todayStr,
        locale: "en-IN",
        country: "IN",
        currency: "INR",
        mode: "CHAT",
        viewport: window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop",
        plan_state: activePlan || "none",
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context,
          plan_state: activePlan || "none",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.content || data?.error || "Chat request failed");
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date().toISOString(),
        plan: data.plan,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (data.plan) {
        setActivePlan(data.plan);
        setSavedEvents((prev) => {
          const idx = prev.findIndex((p) => p.id === data.plan.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = data.plan;
            return updated;
          }
          return [data.plan, ...prev];
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: "Exact figures could not be calculated right now. Please verify your event parameters and let's retry!",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPlan = () => {
    setActivePlan(null);
    setMessages([]);
    setMobileTab("chat");
    setShowTabletSidebar(false);
  };

  const handleSelectEvent = (plan: EventPlan) => {
    setActivePlan(plan);
    setMobileTab("plan");
    setShowTabletSidebar(false);
  };

  const handleDeleteEvent = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSavedEvents((prev) => prev.filter((p) => p.id !== id));
        if (activePlan?.id === id) {
          setActivePlan(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete plan", err);
    }
  };

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden bg-app ${
        isDragging ? "select-none cursor-col-resize" : ""
      }`}
    >
      {/* 1. Desktop & Tablet Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          events={savedEvents}
          activeEventId={activePlan?.id || null}
          onSelectEvent={handleSelectEvent}
          onNewPlan={handleNewPlan}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>

      {/* Tablet Slide-over Sidebar Drawer */}
      {showTabletSidebar && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowTabletSidebar(false)}
          />
          <div className="relative z-50 w-[280px] h-full shadow-xl">
            <Sidebar
              events={savedEvents}
              activeEventId={activePlan?.id || null}
              onSelectEvent={handleSelectEvent}
              onNewPlan={handleNewPlan}
              onDeleteEvent={handleDeleteEvent}
              onCloseMobile={() => setShowTabletSidebar(false)}
            />
          </div>
        </div>
      )}

      {/* 2. Main Center / Chat Zone */}
      <div
        className={`flex-1 flex flex-col h-full min-w-0 ${
          mobileTab !== "chat" ? "hidden lg:flex" : "flex"
        }`}
      >
        {/* Tablet / Mobile Top Navigation Bar */}
        <div className="lg:hidden px-4 py-3 bg-surface border-b border-token flex items-center justify-between shrink-0">
          <button
            onClick={() => setShowTabletSidebar(true)}
            className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-black/5"
            title="Open events menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="text-sm font-bold text-main font-serif">
            {activePlan ? activePlan.event.title : "Eventra"}
          </div>

          <button
            onClick={() => setShowTabletPlanDrawer(true)}
            className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-black/5 flex items-center gap-1 text-xs"
            title="Open plan drawer"
          >
            <Layers className="w-5 h-5 text-[#7A3E9D]" />
          </button>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>

      {/* 3. Slideable / Draggable Splitter Handle (Desktop) */}
      <div
        onMouseDown={handleMouseDown}
        className="hidden lg:flex w-2.5 hover:w-3 bg-transparent hover:bg-[#7A3E9D]/20 active:bg-[#7A3E9D]/40 cursor-col-resize shrink-0 h-full items-center justify-center transition-all group z-10"
        title="Drag left/right to slide & resize Plan view"
      >
        <div className="w-1 h-8 rounded-full bg-token group-hover:bg-[#7A3E9D] transition-colors flex items-center justify-center">
          <GripVertical className="w-2.5 h-2.5 text-muted group-hover:text-white" />
        </div>
      </div>

      {/* 4. Desktop Right Plan Panel (Slideable Width) */}
      <div
        style={{ width: `${planWidth}px` }}
        className="hidden lg:block shrink-0 h-full transition-[width] duration-75 ease-out"
      >
        <PlanPanel
          plan={activePlan}
          isExpanded={isExpanded}
          onToggleExpand={toggleExpand}
        />
      </div>

      {/* Tablet Slide-over Plan Drawer */}
      {showTabletPlanDrawer && (
        <div className="fixed inset-0 z-40 hidden md:flex lg:hidden justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowTabletPlanDrawer(false)}
          />
          <div className="relative z-50 w-[470px] max-w-full h-full shadow-2xl">
            <PlanPanel
              plan={activePlan}
              onClose={() => setShowTabletPlanDrawer(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Plan View (When Plan tab is selected) */}
      {mobileTab === "plan" && (
        <div className="lg:hidden flex-1 flex flex-col h-full min-w-0">
          <PlanPanel plan={activePlan} />
        </div>
      )}

      {/* Mobile Events View (When Events tab is selected) */}
      {mobileTab === "events" && (
        <div className="lg:hidden flex-1 flex flex-col h-full min-w-0 bg-surface">
          <div className="p-4 border-b border-token flex items-center justify-between">
            <h2 className="text-base font-bold text-main">Your Saved Events</h2>
            <button
              onClick={handleNewPlan}
              className="px-3 py-1.5 rounded-xl bg-[#7A3E9D] text-white text-xs font-semibold"
            >
              + New Plan
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {savedEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => handleSelectEvent(evt)}
                className="p-3 rounded-xl border border-token bg-app"
              >
                <div className="text-sm font-bold text-main">{evt.event.title}</div>
                <div className="text-xs text-muted mt-1">
                  {evt.date || "Date TBD"} • {evt.currency === "INR" ? "₹" : "$"}{evt.total_budget.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden">
        <MobileTabBar
          activeTab={mobileTab}
          onChangeTab={setMobileTab}
          hasPlan={!!activePlan}
        />
      </div>
    </div>
  );
}

import { z } from "zod";

export type EventType = "wedding" | "birthday" | "community" | "other";
export type TaskOwner = "user" | "family" | "vendor" | "volunteer";
export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "do_now" | "upcoming" | "done";
export type IdeaStyle = "classic" | "modern" | "budget_diy";

export type AllowedIcon =
  | "building-2"
  | "utensils"
  | "camera"
  | "flower-2"
  | "music"
  | "mic"
  | "shirt"
  | "mail"
  | "car"
  | "shield-check"
  | "piggy-bank"
  | "cake"
  | "gift"
  | "megaphone"
  | "tent"
  | "users"
  | "package";

export interface BudgetItem {
  category: string;
  icon: AllowedIcon;
  percent: number;
  amount: number;
  notes: string;
}

export interface TimelineItem {
  when: string;
  due_date: string | null;
  task: string;
  owner: TaskOwner;
  priority: TaskPriority;
  status: TaskStatus;
  done: boolean;
}

export interface VendorItem {
  type: string;
  icon: AllowedIcon;
  ask_before_booking: string[];
  contract_must_include: string[];
  payment_advice: string;
  red_flags: string[];
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface IdeaItem {
  theme: string;
  style: IdeaStyle;
  vibe: string;
  palette: ColorSwatch[];
  decor: string;
  food: string;
  signature_moment: string;
}

export interface RiskItem {
  risk: string;
  backup_plan: string;
}

export interface EventPlan {
  id?: string;
  event: {
    type: EventType;
    title: string;
    occasion: string;
  };
  date: string | null;
  location: string | null;
  guests: number | null;
  currency: string;
  total_budget: number;
  assumptions: string[];
  budget: BudgetItem[];
  timeline: TimelineItem[];
  vendors: VendorItem[];
  ideas: IdeaItem[];
  risks: RiskItem[];
  next_actions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  plan?: EventPlan;
}

export interface RuntimeContext {
  today: string;
  locale: string;
  country: string;
  currency: string;
  mode: "CHAT" | "PLAN";
  viewport: "mobile" | "tablet" | "desktop";
  plan_state: EventPlan | "none";
}


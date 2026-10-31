import { z } from "zod";

export const AllowedIcons = [
  "building-2",
  "utensils",
  "camera",
  "flower-2",
  "music",
  "mic",
  "shirt",
  "mail",
  "car",
  "shield-check",
  "piggy-bank",
  "cake",
  "gift",
  "megaphone",
  "tent",
  "users",
  "package",
] as const;

export const IconSchema = z.enum(AllowedIcons);

export const EventMetaSchema = z.object({
  type: z.enum(["wedding", "birthday", "community", "other"]),
  title: z.string().max(60),
  occasion: z.string().max(80),
});

export const BudgetItemSchema = z.object({
  category: z.string().max(60),
  icon: IconSchema,
  percent: z.number().min(0).max(100),
  amount: z.number().nonnegative(),
  notes: z.string().max(80),
});

export const TimelineItemSchema = z.object({
  when: z.string().max(60),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  task: z.string().max(90),
  owner: z.enum(["user", "family", "vendor", "volunteer"]),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["do_now", "upcoming", "done"]),
  done: z.boolean().default(false),
});

export const VendorItemSchema = z.object({
  type: z.string().max(60),
  icon: IconSchema,
  ask_before_booking: z.array(z.string().max(100)),
  contract_must_include: z.array(z.string().max(100)),
  payment_advice: z.string().max(100),
  red_flags: z.array(z.string().max(100)),
});

export const PaletteColorSchema = z.object({
  name: z.string().max(50),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const IdeaItemSchema = z.object({
  theme: z.string().max(60),
  style: z.enum(["classic", "modern", "budget_diy"]),
  vibe: z.string().max(140),
  palette: z.array(PaletteColorSchema).min(3).max(5),
  decor: z.string().max(140),
  food: z.string().max(140),
  signature_moment: z.string().max(140),
});

export const RiskItemSchema = z.object({
  risk: z.string().max(120),
  backup_plan: z.string().max(120),
});

export const PlanSchema = z.object({
  id: z.string().optional(),
  event: EventMetaSchema,
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  location: z.string().max(100).nullable(),
  guests: z.number().int().positive().nullable(),
  currency: z.string().length(3),
  total_budget: z.number().nonnegative(),
  assumptions: z.array(z.string().max(50)).max(6),
  budget: z.array(BudgetItemSchema).min(6).max(10),
  timeline: z.array(TimelineItemSchema).min(6).max(20),
  vendors: z.array(VendorItemSchema).min(3).max(10),
  ideas: z.array(IdeaItemSchema).length(3),
  risks: z.array(RiskItemSchema).min(3).max(5),
  next_actions: z.array(z.string().max(80)).length(3),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Tool 1: calculateBudget input schema
export const CalculateBudgetInputSchema = z.object({
  total: z.number().positive(),
  currency: z.string().length(3),
  eventType: z.enum(["wedding", "birthday", "community", "other"]),
  guests: z.number().nullable().optional(),
  allocations: z.array(
    z.object({
      category: z.string().max(60),
      icon: IconSchema,
      percent: z.number().min(0).max(100),
      notes: z.string().max(80),
    })
  ),
  contingencyPercent: z.number().min(8).max(15),
});

// Tool 2: buildTimeline input schema
export const BuildTimelineInputSchema = z.object({
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  today: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  eventType: z.enum(["wedding", "birthday", "community", "other"]),
  tasks: z.array(
    z.object({
      leadTimeWeeks: z.number().nonnegative(),
      task: z.string().max(90),
      owner: z.enum(["user", "family", "vendor", "volunteer"]),
      priority: z.enum(["high", "medium", "low"]),
    })
  ),
});

// Tool 3: saveEvent input schema
export const SaveEventInputSchema = PlanSchema;


import { z } from "zod";
import {
  BudgetItem,
  TimelineItem,
  EventPlan,
} from "./types";
import {
  CalculateBudgetInputSchema,
  BuildTimelineInputSchema,
  SaveEventInputSchema,
} from "./schema";
import { savePlanToDb } from "./db";

/**
 * Tool 1: calculateBudget
 * Computes exact category amounts that sum to the total budget,
 * with contingency strictly reserved and positioned at the end.
 */
export function calculateBudget(
  rawInput: z.infer<typeof CalculateBudgetInputSchema>
): BudgetItem[] {
  const input = CalculateBudgetInputSchema.parse(rawInput);
  const { total, allocations, contingencyPercent } = input;

  const validContingency = Math.min(Math.max(contingencyPercent, 8), 15);
  const spendingBudgetPercent = 100 - validContingency;

  const totalRawPercent = allocations.reduce((sum, item) => sum + item.percent, 0);

  const budgetItems: BudgetItem[] = allocations.map((item) => {
    // Normalize percentage to fit in (100 - contingencyPercent)
    const normalizedPercent =
      totalRawPercent > 0
        ? Number(((item.percent / totalRawPercent) * spendingBudgetPercent).toFixed(1))
        : 0;
    const amount = Math.round((total * normalizedPercent) / 100);
    return {
      category: item.category,
      icon: item.icon,
      percent: normalizedPercent,
      amount,
      notes: item.notes.slice(0, 80),
    };
  });

  // Calculate sum of category amounts
  const currentCategorySum = budgetItems.reduce((acc, item) => acc + item.amount, 0);
  const contingencyAmount = Math.max(0, total - currentCategorySum);
  const actualContingencyPercent = Number(
    ((contingencyAmount / total) * 100).toFixed(1)
  );

  // Contingency row is ALWAYS last
  budgetItems.push({
    category: "Contingency",
    icon: "piggy-bank",
    percent: actualContingencyPercent,
    amount: contingencyAmount,
    notes: "Reserve fund for unexpected costs or overtime.",
  });

  return budgetItems;
}

/**
 * Tool 2: buildTimeline
 * Builds dated milestones and tasks working backward from the event date.
 * Never places a task in the past: overdue items are marked do_now with today's date.
 */
export function buildTimeline(
  rawInput: z.infer<typeof BuildTimelineInputSchema>
): TimelineItem[] {
  const input = BuildTimelineInputSchema.parse(rawInput);
  const { eventDate, today, tasks } = input;

  const targetDateObj = new Date(eventDate);
  const todayDateObj = new Date(today);

  const timelineItems: TimelineItem[] = tasks.map((taskItem) => {
    const taskDateObj = new Date(targetDateObj);
    taskDateObj.setDate(taskDateObj.getDate() - taskItem.leadTimeWeeks * 7);

    const isPastOrToday = taskDateObj <= todayDateObj;
    const dueDateStr = isPastOrToday
      ? today
      : taskDateObj.toISOString().split("T")[0];

    // Priority & status logic
    let status: "do_now" | "upcoming" | "done" = "upcoming";
    if (isPastOrToday || taskItem.leadTimeWeeks <= 1) {
      status = "do_now";
    }

    const whenLabel =
      taskItem.leadTimeWeeks === 0
        ? "Event Day"
        : isPastOrToday
        ? "Immediate / This Week"
        : `T-${taskItem.leadTimeWeeks} weeks`;

    return {
      when: whenLabel,
      due_date: dueDateStr,
      task: taskItem.task.slice(0, 90),
      owner: taskItem.owner,
      priority: taskItem.priority,
      status,
      done: false,
    };
  });

  // Sort ascending by due_date
  timelineItems.sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  return timelineItems;
}

/**
 * Tool 3: saveEvent
 * Persists the event plan in the database.
 */
export async function saveEvent(rawPlan: unknown): Promise<{ success: boolean; id: string; plan: EventPlan }> {
  const validatedPlan = SaveEventInputSchema.parse(rawPlan);
  const saved = await savePlanToDb(validatedPlan);
  return {
    success: true,
    id: saved.id || "event-default",
    plan: saved,
  };
}


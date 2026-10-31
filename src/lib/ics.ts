import { EventPlan } from "./types";

export function generateICS(plan: EventPlan): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Eventra//Event Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${cleanText(plan.event.title)}`,
    "X-WR-TIMEZONE:UTC",
  ];

  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  // Main event day
  if (plan.date) {
    const dateFormatted = plan.date.replace(/-/g, "");
    lines.push(
      "BEGIN:VEVENT",
      `UID:main-event-${plan.id || Date.now()}@eventra.app`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${dateFormatted}`,
      `SUMMARY:🎉 ${cleanText(plan.event.title)}`,
      `DESCRIPTION:${cleanText(plan.event.occasion + " - " + (plan.location || ""))}`,
      `LOCATION:${cleanText(plan.location || "")}`,
      "STATUS:CONFIRMED",
      "END:VEVENT"
    );
  }

  // Milestones and tasks
  plan.timeline.forEach((item, index) => {
    if (!item.due_date) return;
    const dueDateFormatted = item.due_date.replace(/-/g, "");
    const priorityCode = item.priority === "high" ? "1" : item.priority === "medium" ? "5" : "9";

    lines.push(
      "BEGIN:VEVENT",
      `UID:task-${index}-${plan.id || Date.now()}@eventra.app`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${dueDateFormatted}`,
      `SUMMARY:Task: ${cleanText(item.task)}`,
      `DESCRIPTION:Due: ${item.when}\\nOwner: ${item.owner}\\nPriority: ${item.priority}`,
      `PRIORITY:${priorityCode}`,
      "STATUS:CONFIRMED",
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function cleanText(text: string): string {
  return text.replace(/[\n\r]+/g, " ").replace(/[;,]/g, " ");
}


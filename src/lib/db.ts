import fs from "fs";
import path from "path";
import { EventPlan } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "events.json");

function ensureDbFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

export async function getAllPlans(): Promise<EventPlan[]> {
  try {
    ensureDbFile();
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data) as EventPlan[];
  } catch (error) {
    console.error("Failed to read events DB:", error);
    return [];
  }
}

export async function getPlanById(id: string): Promise<EventPlan | null> {
  const plans = await getAllPlans();
  return plans.find((p) => p.id === id) || null;
}

export async function savePlanToDb(plan: EventPlan): Promise<EventPlan> {
  ensureDbFile();
  const plans = await getAllPlans();

  const now = new Date().toISOString();
  const planId = plan.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const existingIndex = plans.findIndex((p) => p.id === planId);

  const planToSave: EventPlan = {
    ...plan,
    id: planId,
    createdAt: existingIndex >= 0 ? plans[existingIndex].createdAt : now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    plans[existingIndex] = planToSave;
  } else {
    plans.unshift(planToSave);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(plans, null, 2), "utf8");
  return planToSave;
}

export async function deletePlanFromDb(id: string): Promise<boolean> {
  ensureDbFile();
  const plans = await getAllPlans();
  const filtered = plans.filter((p) => p.id !== id);
  if (filtered.length !== plans.length) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf8");
    return true;
  }
  return false;
}


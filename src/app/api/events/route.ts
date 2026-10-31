import { NextRequest, NextResponse } from "next/server";
import { getAllPlans, savePlanToDb } from "@/lib/db";
import { PlanSchema } from "@/lib/schema";

export async function GET() {
  try {
    const plans = await getAllPlans();
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = PlanSchema.parse(body);
    const saved = await savePlanToDb(validated);
    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Validation failed", details: error.errors || error.message },
      { status: 400 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { getPlanById } from "@/lib/db";
import { generateICS } from "@/lib/ics";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    const plan = await getPlanById(id);
    if (!plan) {
      return NextResponse.json({ error: "Event plan not found" }, { status: 404 });
    }

    const icsContent = generateICS(plan);

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${plan.event.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.ics"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate .ics file" }, { status: 500 });
  }
}


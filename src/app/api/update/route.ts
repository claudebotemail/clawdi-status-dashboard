import { NextResponse } from "next/server";
import { z } from "zod";
import { setStatus } from "@/lib/status";

const BodySchema = z.object({
  source: z.string().optional(),
  checks: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        ok: z.boolean(),
        detail: z.string().optional(),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  const secret = process.env.DASHBOARD_UPDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Missing DASHBOARD_UPDATE_SECRET" },
      { status: 500 }
    );
  }

  const provided = req.headers.get("x-dashboard-secret");
  if (provided !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  await setStatus({
    updatedAt: new Date().toISOString(),
    source: parsed.data.source,
    checks: parsed.data.checks,
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST" }, { status: 405 });
}

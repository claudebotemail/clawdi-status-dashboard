import { kv } from "@vercel/kv";

export type SkillStatus = {
  key: string;
  label: string;
  ok: boolean;
  detail?: string;
};

export type DashboardStatus = {
  updatedAt: string; // ISO
  source?: string;
  checks: SkillStatus[];
};

const STATUS_KEY = "clawdi:dashboard:status:v1";

export async function getStatus(): Promise<DashboardStatus | null> {
  const data = await kv.get<DashboardStatus>(STATUS_KEY);
  return data ?? null;
}

export async function setStatus(status: DashboardStatus): Promise<void> {
  await kv.set(STATUS_KEY, status);
}

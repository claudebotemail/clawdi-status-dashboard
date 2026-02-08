import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStatus } from "@/lib/status";

function StatusPill({ ok }: { ok: boolean }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
        (ok
          ? "bg-emerald-100 text-emerald-800"
          : "bg-rose-100 text-rose-800")
      }
    >
      {ok ? "OK" : "ISSUE"}
    </span>
  );
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const status = await getStatus();

  const updated = status?.updatedAt
    ? new Date(status.updatedAt).toLocaleString("en-US", {
        timeZone: "America/New_York",
      })
    : "—";

  return (
    <main className="min-h-screen bg-neutral-50 p-6">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">System Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Signed in as <span className="font-medium">{session?.user?.email}</span>
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Last update (ET): <span className="font-medium">{updated}</span>
            </p>
          </div>
          <a
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm hover:bg-neutral-100"
            href="/api/auth/signout"
          >
            Sign out
          </a>
        </header>

        <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-4">
          {!status ? (
            <p className="text-sm text-neutral-600">
              No status posted yet. Once OpenClaw pushes the first healthcheck update, it’ll
              appear here.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {status.checks.map((c) => (
                <li key={c.key} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <div className="font-medium">{c.label}</div>
                    {c.detail ? (
                      <div className="mt-0.5 text-sm text-neutral-600">{c.detail}</div>
                    ) : null}
                  </div>
                  <StatusPill ok={c.ok} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-4 text-xs text-neutral-500">
          <p>
            Updates are posted by OpenClaw via <code>/api/update</code> with an
            <code> x-dashboard-secret</code> header.
          </p>
        </section>
      </div>
    </main>
  );
}

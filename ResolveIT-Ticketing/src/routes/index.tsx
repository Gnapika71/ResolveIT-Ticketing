import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PriorityChip, StatusBadge } from "@/components/badges";
import { timeAgo, useTickets, type TicketStatus } from "@/lib/tickets";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResolveIT — Smart Issue & Service Ticket Management" },
      {
        name: "description",
        content:
          "ResolveIT streamlines reporting, tracking, and resolving IT issues and service requests with a live ticket dashboard.",
      },
      { property: "og:title", content: "ResolveIT — Smart Issue & Service Ticket Management" },
      {
        property: "og:description",
        content:
          "Report, track, and resolve IT issues and service requests from one live dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const H = 3_600_000;

function Dashboard() {
  const tickets = useTickets();

  const countBy = (s: TicketStatus) => tickets.filter((t) => t.status === s).length;
  const open = countBy("open");
  const inProgress = countBy("in-progress");
  const resolved = countBy("resolved");
  const closed = countBy("closed");

  const priorityCounts = (["critical", "high", "medium", "low"] as const).map(
    (p) => ({
      p,
      n: tickets.filter((t) => t.priority === p && (t.status === "open" || t.status === "in-progress")).length,
    }),
  );
  const maxPriority = Math.max(1, ...priorityCounts.map((x) => x.n));

  const recent = [...tickets].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);

  const resolvedTickets = tickets.filter((t) => t.resolvedAt);
  const avgH = resolvedTickets.length
    ? resolvedTickets.reduce((s, t) => s + (t.resolvedAt! - t.createdAt), 0) /
      resolvedTickets.length /
      H
    : 0;
  const weeklyBars = [40, 60, 45, 75, 55, 90];

  const critical = tickets.filter((t) => t.priority === "critical");
  const criticalDone = critical.filter(
    (t) => t.status === "resolved" || t.status === "closed",
  ).length;
  const criticalPct = critical.length
    ? Math.round((criticalDone / critical.length) * 100)
    : 0;

  const statusRows: { label: string; value: number; status: TicketStatus }[] = [
    { label: "Open", value: open, status: "open" },
    { label: "In Progress", value: inProgress, status: "in-progress" },
    { label: "Resolved", value: resolved, status: "resolved" },
    { label: "Closed", value: closed, status: "closed" },
  ];

  return (
    <AppShell>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-3">
          <div className="glass-card p-5">
            <p className="mb-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Tickets
            </p>
            <div className="space-y-1.5">
              {statusRows.map((row, i) => (
                <Link
                  key={row.status}
                  to="/tickets"
                  search={{ status: row.status }}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                    i === 0
                      ? "bg-brand/10 font-medium text-brand"
                      : "text-muted-foreground hover:bg-white/50",
                  )}
                >
                  {row.label}
                  <span className="font-display">{row.value}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <p className="mb-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Active Priority
            </p>
            <div className="space-y-3">
              {priorityCounts.map(({ p, n }) => (
                <div key={p}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="capitalize text-muted-foreground">{p}</span>
                    <span className="font-display">{n}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all",
                        p === "critical" && "bg-critical",
                        p === "high" && "bg-high",
                        p === "medium" && "bg-medium",
                        p === "low" && "bg-low",
                      )}
                      style={{ width: `${Math.max(6, (n / maxPriority) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center column */}
        <div className="space-y-5 lg:col-span-6">
          <div className="glass-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-base font-semibold">
                Recent Tickets
              </p>
              <Link
                to="/tickets"
                search={{ status: "all" }}
                className="text-xs text-muted-foreground transition-colors hover:text-brand"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-2.5">
              {recent.map((t) => (
                <Link
                  key={t.id}
                  to="/tickets"
                  search={{ status: "all", ticket: t.id }}
                  className="glass-row flex items-center gap-3 rounded-2xl p-3"
                >
                  <PriorityChip priority={t.priority} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.id} · {t.reporter} · {timeAgo(t.updatedAt)}
                    </p>
                  </div>
                  <StatusBadge status={t.status} />
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <p className="mb-4 font-display text-base font-semibold">
              Resolution Workflow
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="rounded-2xl border border-brand/20 bg-brand/10 p-3 text-center">
                  <p className="font-display text-lg font-semibold text-brand">
                    {open}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Reported</p>
                </div>
              </div>
              <span className="text-lg text-muted-foreground/50">→</span>
              <div className="flex-1">
                <div className="rounded-2xl border border-progress/20 bg-progress/10 p-3 text-center">
                  <p className="font-display text-lg font-semibold text-progress">
                    {inProgress}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Assigned</p>
                </div>
              </div>
              <span className="text-lg text-muted-foreground/50">→</span>
              <div className="flex-1">
                <div className="rounded-2xl border border-resolved/20 bg-resolved/10 p-3 text-center">
                  <p className="font-display text-lg font-semibold text-resolved">
                    {resolved + closed}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Resolved</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5 lg:col-span-3">
          <div className="glass-card p-5">
            <p className="mb-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Avg. Resolution
            </p>
            <p className="font-display text-4xl font-bold tracking-tight">
              {avgH.toFixed(1)}
              <span className="text-lg text-muted-foreground">h</span>
            </p>
            <p className="mt-1 text-xs font-medium text-resolved">
              ▼ 18% this week
            </p>
            <div className="mt-4 flex h-16 items-end gap-1.5">
              {weeklyBars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-brand"
                  style={{ height: `${h}%`, opacity: 0.3 + i * 0.14 }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/40 bg-gradient-to-br from-brand/90 to-low/80 p-5 text-brand-foreground shadow-xl shadow-brand/30 backdrop-blur-2xl">
            <p className="mb-2 text-xs uppercase tracking-[0.15em] text-brand-foreground/70">
              Sprint Goal
            </p>
            <p className="font-display text-2xl font-semibold leading-tight">
              Clear {critical.length} critical tickets
            </p>
            <div className="mt-4 h-2 rounded-full bg-white/25">
              <div
                className="h-2 rounded-full bg-white transition-all"
                style={{ width: `${criticalPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-brand-foreground/70">
              {criticalDone} of {critical.length} resolved · {criticalPct}%
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

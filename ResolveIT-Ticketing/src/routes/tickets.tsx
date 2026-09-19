import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AppShell } from "@/components/app-shell";
import { PriorityChip, StatusBadge } from "@/components/badges";
import { TicketDetail } from "@/components/ticket-detail";
import {
  STATUS_LABEL,
  timeAgo,
  useTickets,
  type TicketStatus,
} from "@/lib/tickets";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  status: z
    .enum(["all", "open", "in-progress", "resolved", "closed"])
    .catch("all"),
  ticket: z.string().optional(),
});

export const Route = createFileRoute("/tickets")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Tickets — ResolveIT" },
      {
        name: "description",
        content:
          "Browse, filter, and work the full ResolveIT ticket queue — open, in progress, resolved, and closed.",
      },
      { property: "og:title", content: "Tickets — ResolveIT" },
      {
        property: "og:description",
        content:
          "Browse, filter, and work the full ResolveIT ticket queue.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TicketsPage,
});

const filters: { value: "all" | TicketStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

function TicketsPage() {
  const tickets = useTickets();
  const { status, ticket: ticketParam } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      tickets.filter((t) => {
        if (status !== "all" && t.status !== status) return false;
        if (
          query &&
          !`${t.id} ${t.title} ${t.reporter} ${t.assignee ?? ""} ${t.category}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
          return false;
        return true;
      }),
    [tickets, status, query],
  );

  const selected =
    tickets.find((t) => t.id === ticketParam) ?? filtered[0] ?? tickets[0];

  return (
    <AppShell>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Ticket Queue
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {filtered.length} of {tickets.length} tickets
          </p>
        </div>
        <div className="glass-pill ml-auto flex items-center gap-1 rounded-full p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() =>
                navigate({ search: (prev) => ({ ...prev, status: f.value }) })
              }
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs transition-colors",
                status === f.value
                  ? "bg-brand font-medium text-brand-foreground shadow-md shadow-brand/30"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tickets…"
          className="glass-pill w-52 rounded-full bg-transparent px-4 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="glass-card overflow-hidden xl:col-span-2">
          <div className="divide-y divide-white/40">
            {filtered.length === 0 && (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No tickets match this filter.
              </p>
            )}
            {filtered.map((t) => (
              <button
                key={t.id}
                onClick={() =>
                  navigate({ search: (prev) => ({ ...prev, ticket: t.id }) })
                }
                className={cn(
                  "flex w-full items-center gap-3 p-3.5 text-left transition-colors",
                  selected?.id === t.id
                    ? "bg-brand/10"
                    : "hover:bg-white/50",
                )}
              >
                <PriorityChip priority={t.priority} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.id} · {t.category} · {t.reporter} ·{" "}
                    {timeAgo(t.updatedAt)}
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-xs text-muted-foreground">
                    {t.assignee ?? "Unassigned"}
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </button>
            ))}
          </div>
        </div>

        {selected && <TicketDetail key={selected.id} ticket={selected} />}
      </div>
    </AppShell>
  );
}

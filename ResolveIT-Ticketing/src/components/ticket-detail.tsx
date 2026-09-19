import { useState } from "react";
import { PriorityBadge, StatusBadge } from "@/components/badges";
import {
  addTicketNote,
  setTicketStatus,
  timeAgo,
  type Ticket,
} from "@/lib/tickets";

export function TicketDetail({ ticket }: { ticket: Ticket }) {
  const [note, setNote] = useState("");

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    addTicketNote(ticket.id, "You", note.trim());
    setNote("");
  };

  return (
    <aside className="glass-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{ticket.id}</p>
          <h3 className="mt-0.5 font-display text-lg font-semibold leading-snug tracking-tight">
            {ticket.title}
          </h3>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      {ticket.description && (
        <p className="mt-3 rounded-2xl bg-white/50 p-3 text-sm leading-relaxed text-muted-foreground">
          {ticket.description}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
        <div className="rounded-xl bg-white/60 p-2.5">
          <p className="uppercase tracking-wider text-muted-foreground">
            Assignee
          </p>
          <p className="mt-1 font-medium text-foreground">
            {ticket.assignee ?? "Unassigned"}
          </p>
        </div>
        <div className="rounded-xl bg-white/60 p-2.5">
          <p className="uppercase tracking-wider text-muted-foreground">
            Priority
          </p>
          <p className="mt-1">
            <PriorityBadge priority={ticket.priority} />
          </p>
        </div>
        <div className="rounded-xl bg-white/60 p-2.5">
          <p className="uppercase tracking-wider text-muted-foreground">
            Category
          </p>
          <p className="mt-1 font-medium text-foreground">{ticket.category}</p>
        </div>
        <div className="rounded-xl bg-white/60 p-2.5">
          <p className="uppercase tracking-wider text-muted-foreground">
            Reported
          </p>
          <p className="mt-1 font-medium text-foreground">
            {ticket.reporter} · {timeAgo(ticket.createdAt)}
          </p>
        </div>
      </div>

      {/* Status timeline */}
      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Status Timeline
        </p>
        <div className="mt-3 space-y-3">
          {ticket.history.map((h, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="mt-1 size-2.5 rounded-full bg-brand" />
                {i < ticket.history.length - 1 && (
                  <span className="w-px flex-1 bg-muted-foreground/20" />
                )}
              </div>
              <div className="pb-1">
                <p className="text-[13px] font-medium">{h.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {timeAgo(h.at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Notes
        </p>
        <div className="mt-3 space-y-2.5">
          {ticket.notes.length === 0 && (
            <p className="text-[13px] text-muted-foreground">
              No notes yet — add the first update below.
            </p>
          )}
          {ticket.notes.map((n, i) => (
            <div key={i} className="rounded-xl bg-white/60 p-2.5 text-[13px]">
              <span className="font-medium">{n.author}</span>{" "}
              <span className="text-muted-foreground">
                · {timeAgo(n.at)}
              </span>
              <p className="mt-1 text-muted-foreground">{n.text}</p>
            </div>
          ))}
        </div>
        <form onSubmit={addNote} className="mt-3 flex gap-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note…"
            className="min-w-0 flex-1 rounded-xl border border-input bg-white/60 px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <button
            type="submit"
            className="rounded-xl bg-brand px-3.5 py-2 text-sm font-medium text-brand-foreground shadow-md shadow-brand/30"
          >
            Add
          </button>
        </form>
      </div>

      {/* Workflow actions */}
      <div className="mt-5 flex flex-wrap gap-2">
        {ticket.status === "open" && (
          <>
            <button
              onClick={() => setTicketStatus(ticket.id, "in-progress")}
              className="flex-1 rounded-full bg-brand px-3 py-2 text-sm font-medium text-brand-foreground shadow-md shadow-brand/30 transition-transform hover:-translate-y-0.5"
            >
              Start Work
            </button>
            <button
              onClick={() => setTicketStatus(ticket.id, "resolved")}
              className="flex-1 rounded-full bg-resolved/10 px-3 py-2 text-sm font-semibold text-resolved transition-colors hover:bg-resolved/15"
            >
              Mark Resolved
            </button>
          </>
        )}
        {ticket.status === "in-progress" && (
          <button
            onClick={() => setTicketStatus(ticket.id, "resolved")}
            className="w-full rounded-full bg-resolved/10 px-3 py-2 text-sm font-semibold text-resolved transition-colors hover:bg-resolved/15"
          >
            Mark Resolved
          </button>
        )}
        {ticket.status === "resolved" && (
          <>
            <button
              onClick={() => setTicketStatus(ticket.id, "closed")}
              className="flex-1 rounded-full bg-brand px-3 py-2 text-sm font-medium text-brand-foreground shadow-md shadow-brand/30 transition-transform hover:-translate-y-0.5"
            >
              Close Ticket
            </button>
            <button
              onClick={() => setTicketStatus(ticket.id, "open")}
              className="glass-pill flex-1 rounded-full px-3 py-2 text-sm font-medium"
            >
              Reopen
            </button>
          </>
        )}
        {ticket.status === "closed" && (
          <button
            onClick={() => setTicketStatus(ticket.id, "open")}
            className="glass-pill w-full rounded-full px-3 py-2 text-sm font-medium"
          >
            Reopen Ticket
          </button>
        )}
      </div>
    </aside>
  );
}

import { useState } from "react";
import {
  CATEGORIES,
  PRIORITY_LABEL,
  createTicket,
  type TicketPriority,
} from "@/lib/tickets";

interface Props {
  open: boolean;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-xl border border-input bg-white/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40";

export function NewTicketDialog({ open, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [priority, setPriority] = useState<TicketPriority>("medium");

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTicket({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      reporter: "You",
    });
    setTitle("");
    setDescription("");
    setCategory(CATEGORIES[0]);
    setPriority("medium");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg font-semibold tracking-tight">
          New Ticket
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Report an issue or request a service. It lands in the open queue.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Title
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. VPN drops every 20 minutes"
              className={inputClass}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className={inputClass}
              >
                {(Object.keys(PRIORITY_LABEL) as TicketPriority[]).map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened, when it started, and anything you already tried."
              rows={4}
              className={inputClass}
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="glass-pill rounded-full px-5 py-2.5 text-sm font-medium text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground shadow-md shadow-brand/30 transition-transform hover:-translate-y-0.5"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useSyncExternalStore } from "react";

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "critical" | "high" | "medium" | "low";

export interface HistoryEvent {
  label: string;
  at: number;
}

export interface TicketNote {
  author: string;
  text: string;
  at: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee: string | null;
  reporter: string;
  createdAt: number;
  updatedAt: number;
  resolvedAt: number | null;
  history: HistoryEvent[];
  notes: TicketNote[];
}

export const STATUS_LABEL: Record<TicketStatus, string> = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const PRIORITY_LABEL: Record<TicketPriority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const PRIORITY_CODE: Record<TicketPriority, string> = {
  critical: "CR",
  high: "HI",
  medium: "MD",
  low: "LO",
};

export const CATEGORIES = [
  "Hardware",
  "Software",
  "Network",
  "Access",
  "Email",
  "Security",
  "Facilities",
] as const;

const M = 60_000;
const H = 3_600_000;
const now = Date.now();

function seed(): Ticket[] {
  const make = (
    n: number,
    title: string,
    category: string,
    priority: TicketPriority,
    status: TicketStatus,
    reporter: string,
    assignee: string | null,
    ageMs: number,
    description: string,
    notes: TicketNote[] = [],
  ): Ticket => {
    const createdAt = now - ageMs;
    const resolvedAt =
      status === "resolved" || status === "closed"
        ? createdAt + Math.min(ageMs - M, 3.6 * H)
        : null;
    const history: HistoryEvent[] = [{ label: "Ticket opened", at: createdAt }];
    if (assignee)
      history.push({ label: `Assigned to ${assignee}`, at: createdAt + 6 * M });
    if (status === "in-progress")
      history.push({ label: "Work started", at: createdAt + 12 * M });
    if (resolvedAt)
      history.push({
        label: status === "closed" ? "Resolved and closed" : "Marked resolved",
        at: resolvedAt,
      });
    return {
      id: `TCK-${n}`,
      title,
      description,
      category,
      priority,
      status,
      assignee,
      reporter,
      createdAt,
      updatedAt: notes.length ? notes[notes.length - 1]!.at : createdAt + 5 * M,
      resolvedAt,
      history,
      notes,
    };
  };

  return [
    make(
      2047,
      "Database connection timeout on checkout",
      "Software",
      "critical",
      "open",
      "Priya N.",
      null,
      12 * M,
      "Checkout API intermittently times out connecting to the primary database. Affecting ~15% of transactions since 08:40.",
    ),
    make(
      2046,
      "SSO login failing for finance team",
      "Access",
      "high",
      "in-progress",
      "Marcus T.",
      "Dana K.",
      48 * M,
      "All finance team members get an 'invalid token' error when signing in via SSO since this morning.",
      [
        {
          author: "Dana K.",
          text: "Reproduced on staging. Token refresh endpoint returning 401 — investigating with identity provider.",
          at: now - 20 * M,
        },
      ],
    ),
    make(
      2045,
      "VPN drops every 20 minutes",
      "Network",
      "high",
      "open",
      "Leo F.",
      null,
      74 * M,
      "VPN connection drops roughly every 20 minutes and requires manual reconnect. Started after last night's gateway update.",
    ),
    make(
      2044,
      "Request new laptop docking station",
      "Hardware",
      "low",
      "resolved",
      "Elena V.",
      "Sam O.",
      2 * H,
      "Requesting a USB-C docking station for a new desk setup on floor 2.",
    ),
    make(
      2043,
      "Email sync failing on mobile app",
      "Email",
      "medium",
      "in-progress",
      "Aisha R.",
      "Dana K.",
      3 * H,
      "Mail on iOS app stops syncing after ~30 minutes. Removing and re-adding the account fixes it temporarily.",
      [
        {
          author: "Dana K.",
          text: "Exchange logs show throttling on the mailbox. Raised quota and monitoring.",
          at: now - 40 * M,
        },
      ],
    ),
    make(
      2042,
      "Printer queue stalled on floor 3",
      "Hardware",
      "medium",
      "open",
      "Tom W.",
      null,
      5 * H,
      "Jobs pile up in the print queue and never print. Restarting the spooler clears it for a few minutes only.",
    ),
    make(
      2041,
      "Shared drive Q: access denied",
      "Access",
      "high",
      "resolved",
      "Nina P.",
      "Sam O.",
      7 * H,
      "Getting 'access denied' on the shared drive Q: since the permissions migration.",
      [
        {
          author: "Sam O.",
          text: "User was missing from the new finance ACL group. Added and verified access.",
          at: now - 5 * H,
        },
      ],
    ),
    make(
      2040,
      "Monitor flickering on workstation 22",
      "Hardware",
      "low",
      "closed",
      "Raj M.",
      "Sam O.",
      9 * H,
      "Second monitor flickers at random intervals. Cable swap did not help.",
    ),
    make(
      2039,
      "Security patch failed on web-02",
      "Security",
      "critical",
      "in-progress",
      "Auto-Monitor",
      "Dana K.",
      26 * H,
      "Nightly patch job failed on web-02 with rollback error 0x800f0922. Server is one patch behind baseline.",
      [
        {
          author: "Dana K.",
          text: "CBS log points to a corrupted component store. Running DISM repair tonight during the maintenance window.",
          at: now - 2 * H,
        },
      ],
    ),
    make(
      2038,
      "New hire account provisioning",
      "Access",
      "medium",
      "closed",
      "HR Desk",
      "Sam O.",
      30 * H,
      "Provision accounts, email, and VPN access for two new hires starting Monday.",
    ),
    make(
      2037,
      "Database backup job failing nightly",
      "Software",
      "critical",
      "resolved",
      "Auto-Monitor",
      "Dana K.",
      2 * 24 * H,
      "Nightly backup job has failed three nights in a row with disk space warnings on the backup volume.",
      [
        {
          author: "Dana K.",
          text: "Pruned 400GB of expired snapshots and set retention policy to 14 days. Backup succeeded last night.",
          at: now - 20 * H,
        },
      ],
    ),
    make(
      2036,
      "Wi-Fi dead zone in conference room B",
      "Network",
      "low",
      "closed",
      "Elena V.",
      "Sam O.",
      2 * 24 * H,
      "Signal drops to one bar in conference room B. Video calls frequently freeze.",
    ),
  ];
}

let tickets: Ticket[] = seed();
let counter = 2048;
let version = 0;
const listeners = new Set<() => void>();

function emit() {
  version += 1;
  listeners.forEach((l) => l());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getVersion() {
  return version;
}

export function useTickets(): Ticket[] {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return tickets;
}

export function createTicket(input: {
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
  reporter: string;
}): Ticket {
  const at = Date.now();
  const ticket: Ticket = {
    id: `TCK-${counter++}`,
    title: input.title,
    description: input.description,
    category: input.category,
    priority: input.priority,
    status: "open",
    assignee: null,
    reporter: input.reporter,
    createdAt: at,
    updatedAt: at,
    resolvedAt: null,
    history: [{ label: "Ticket opened", at }],
    notes: [],
  };
  tickets = [ticket, ...tickets];
  emit();
  return ticket;
}

export function setTicketStatus(id: string, status: TicketStatus) {
  const at = Date.now();
  tickets = tickets.map((t) => {
    if (t.id !== id) return t;
    const label =
      status === "in-progress"
        ? "Work started"
        : status === "resolved"
          ? "Marked resolved"
          : status === "closed"
            ? "Ticket closed"
            : "Ticket reopened";
    return {
      ...t,
      status,
      updatedAt: at,
      resolvedAt:
        status === "resolved" || status === "closed" ? (t.resolvedAt ?? at) : null,
      assignee: status === "in-progress" && !t.assignee ? "You" : t.assignee,
      history: [...t.history, { label, at }],
    };
  });
  emit();
}

export function addTicketNote(id: string, author: string, text: string) {
  const at = Date.now();
  tickets = tickets.map((t) =>
    t.id === id
      ? { ...t, updatedAt: at, notes: [...t.notes, { author, text, at }] }
      : t,
  );
  emit();
}

export function timeAgo(at: number): string {
  const diff = Date.now() - at;
  if (diff < M) return "just now";
  if (diff < H) return `${Math.floor(diff / M)}m ago`;
  if (diff < 24 * H) return `${Math.floor(diff / H)}h ago`;
  return `${Math.floor(diff / (24 * H))}d ago`;
}

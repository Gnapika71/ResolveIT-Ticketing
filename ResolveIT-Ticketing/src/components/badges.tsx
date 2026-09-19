import {
  PRIORITY_CODE,
  PRIORITY_LABEL,
  STATUS_LABEL,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/tickets";
import { cn } from "@/lib/utils";

const statusStyles: Record<TicketStatus, string> = {
  open: "bg-open/10 text-open",
  "in-progress": "bg-progress/15 text-progress",
  resolved: "bg-resolved/10 text-resolved",
  closed: "bg-closed/10 text-closed",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
        statusStyles[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

const priorityStyles: Record<TicketPriority, string> = {
  critical: "bg-critical/10 text-critical",
  high: "bg-high/10 text-high",
  medium: "bg-medium/10 text-medium",
  low: "bg-low/10 text-low",
};

export function PriorityChip({ priority }: { priority: TicketPriority }) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-xl font-display text-xs font-semibold",
        priorityStyles[priority],
      )}
      title={PRIORITY_LABEL[priority]}
    >
      {PRIORITY_CODE[priority]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
        priorityStyles[priority],
      )}
    >
      {PRIORITY_LABEL[priority]}
    </span>
  );
}

import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { NewTicketDialog } from "@/components/new-ticket-dialog";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-body text-foreground">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/15 via-background to-low/20" />
      <div className="animate-float-a absolute -left-24 -top-24 size-[420px] rounded-full bg-brand/30 blur-3xl" />
      <div className="animate-float-b absolute -right-20 top-1/3 size-[380px] rounded-full bg-low/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 size-[360px] rounded-full bg-low/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1360px] px-6 py-8">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="glass-pill grid size-11 place-items-center rounded-2xl">
              <span className="font-display text-lg font-bold text-brand">
                R
              </span>
            </div>
            <div>
              <p className="font-display text-lg font-bold leading-none tracking-tight">
                ResolveIT
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Smart Issue &amp; Service Tickets
              </p>
            </div>
          </Link>

          <nav className="glass-pill flex items-center gap-2 rounded-full px-2 py-1.5">
            {[
              { to: "/", label: "Dashboard" },
              { to: "/tickets", label: "Tickets" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{
                  className: cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium bg-brand text-brand-foreground shadow-md shadow-brand/30",
                  ),
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDialogOpen(true)}
              className="glass-pill rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition-transform hover:-translate-y-0.5"
            >
              New Ticket
            </button>
            <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-brand to-low font-display text-sm font-semibold text-brand-foreground ring-2 ring-white/70">
              GK
            </div>
          </div>
        </header>

        {children}
      </div>

      <NewTicketDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}

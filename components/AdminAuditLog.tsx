"use client";

import { useEffect, useMemo, useState } from "react";
import { useWs } from "@/lib/ws";
import { useGates } from "@/services/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  Bolt,
  CalendarDays,
  Cog,
  MapPin,
  Radio,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AdminEvent = {
  adminId: string;
  action:
    | "category-rates-changed"
    | "zone-closed"
    | "zone-opened"
    | "vacation-added"
    | "rush-updated";
  targetType: "category" | "zone" | "vacation" | "rush";
  targetId: string;
  details?: Record<string, unknown>;
  timestamp: string; // ISO
};

const actionLabel: Record<AdminEvent["action"], string> = {
  "category-rates-changed": "Category rates changed",
  "zone-closed": "Zone closed",
  "zone-opened": "Zone opened",
  "vacation-added": "Vacation added",
  "rush-updated": "Rush hours updated",
};

const targetIcon: Record<AdminEvent["targetType"], React.ReactNode> = {
  category: <Cog className="h-4 w-4" />,
  zone: <MapPin className="h-4 w-4" />,
  vacation: <CalendarDays className="h-4 w-4" />,
  rush: <Bolt className="h-4 w-4" />,
};

const actionTone: Record<AdminEvent["action"], string> = {
  "zone-opened": "bg-emerald-600",
  "zone-closed": "bg-rose-600",
  "category-rates-changed": "bg-indigo-600",
  "vacation-added": "bg-amber-600",
  "rush-updated": "bg-sky-600",
};

export function AdminAuditLog() {
  const { data: gates } = useGates();

  // socket helpers
  const subscribeMany = useWs((s) => s.subscribeMany);
  const unsubscribeGate = useWs((s) => s.unsubscribeGate);
  const addAdminListener = useWs((s) => s.addAdminListener);
  const wsStatus = useWs((s) => s.status);

  const [events, setEvents] = useState<AdminEvent[]>([]);

  // subscribe to ALL gates to receive admin-update broadcasts
  useEffect(() => {
    if (!gates?.length) return;
    const ids = gates.map((g) => g.id);
    subscribeMany(ids);
    return () => ids.forEach((id) => unsubscribeGate(id));
  }, [gates, subscribeMany, unsubscribeGate]);

  // listen for admin updates
  useEffect(() => {
    const off = addAdminListener((payload) => {
      setEvents((prev) => [payload as AdminEvent, ...prev].slice(0, 100));
    });
    return off;
  }, [addAdminListener]);

  const statusChip = useMemo(() => {
    if (wsStatus === "connected")
      return (
        <Badge className="bg-emerald-600 !p-1">
          <Radio className="mr-1 h-3 w-3 " /> Live
        </Badge>
      );
    if (wsStatus === "connecting")
      return (
        <Badge className="bg-amber-600 !p-1">
          <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Connecting
        </Badge>
      );
    return (
      <Badge className="bg-rose-600 !p-1">
        <Radio className="mr-1 h-3 w-3" /> Offline
      </Badge>
    );
  }, [wsStatus]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between !my-2">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Admin Audit Log
        </h2>
        {statusChip}
      </div>

      <div className="rounded-xl border bg-white/60">
        <ScrollArea className="max-h-72">
          <ul className="divide-y">
            {events.length === 0 && (
              <li className="!p-4 text-sm text-muted-foreground">
                No updates yet.
              </li>
            )}

            {events.map((e, idx) => (
              <li
                key={`${e.timestamp}-${e.action}-${e.targetId}-${idx}`}
                className="!p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex h-5 w-5 items-center justify-center rounded-full text-white",
                        actionTone[e.action]
                      )}
                    >
                      {targetIcon[e.targetType]}
                    </span>
                    <div className="font-medium">
                      {actionLabel[e.action]}
                      {" · "}
                      <span className="text-muted-foreground">
                        {e.targetType}:{e.targetId}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(e.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  by <span className="font-medium">{e.adminId}</span>
                </div>

                {e.details && Object.keys(e.details).length > 0 && (
                  <details className="!mt-2">
                    <summary className="cursor-pointer text-xs underline">
                      Details
                    </summary>
                    <pre className="!mt-1 overflow-auto rounded bg-black/5 !p-2 text-xs">
                      {JSON.stringify(e.details, null, 2)}
                    </pre>
                  </details>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>

      <div className="flex justify-end !my-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEvents([])}
          className="text-xs !p-4"
        >
          Clear
        </Button>
      </div>
    </section>
  );
}

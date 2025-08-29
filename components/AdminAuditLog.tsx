"use client";
import { useEffect, useState } from "react";
import { useWs } from "@/lib/ws";

export function AdminAuditLog() {
  const setHandlers = useWs((s) => s.setHandlers);
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    setHandlers({
      onAdminUpdate: (payload) =>
        setEvents((e) => [{ ...payload }, ...e].slice(0, 20)),
    });
  }, [setHandlers]);
  return (
    <div className="space-y-2">
      <div className="font-medium">Live Admin Updates</div>
      <ul className="text-sm space-y-1 max-h-64 overflow-auto">
        {events.map((e, i) => (
          <li key={i} className="border rounded p-2">
            <div>
              {e.action} → {e.targetType}:{e.targetId}
            </div>
            <div className="text-muted-foreground">
              by {e.adminId} @ {new Date(e.timestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useUiStore } from "@/store/ui.store";
import { FaToriiGate } from "react-icons/fa6";

export function GateHeader({ gateName }: { gateName: string }) {
  const wsStatus = useUiStore((s) => s.wsStatus);
  const [now, setNow] = useState<string>(new Date().toLocaleTimeString());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="flex items-center relative  justify-between !p-3">
      <div className="text-3xl text-white bg-custom-orange rounded-3xl !px-4 !py-2 font-semibold flex items-center justify-center gap-4  !mb-4">
        <FaToriiGate />

        <span>{gateName}</span>
      </div>
      <div className="flex items-center gap-3">
        <Badge
          className={`!px-2 !py-1 animate-pulse rounded-xl
            ${wsStatus === "connected" ? "bg-green-600 text-white" : ""}
            `}
          variant={
            wsStatus === "connected"
              ? "secondary"
              : wsStatus === "connecting"
              ? "secondary"
              : "destructive"
          }
        >
          {wsStatus}
        </Badge>
        {/* <span className="tabular-nums text-muted-foreground">{now}</span> */}
      </div>
    </div>
  );
}

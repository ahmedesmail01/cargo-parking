"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Zone } from "@/services/types";

export function ZoneCard({
  zone,
  disabled,
  onSelect,
  selectedZone,
}: {
  zone: Zone;
  disabled?: boolean;
  onSelect?: (z: Zone) => void;
  selectedZone: Zone | null;
}) {
  return (
    <Card
      role="button"
      aria-disabled={disabled}
      onClick={() => !disabled && onSelect?.(zone)}
      className={`!p-4 !space-y-2
        
        ${selectedZone?.id === zone.id ? "bg-custom-orange text-white" : ""}
        ${
          disabled
            ? "opacity-50 pointer-events-none"
            : "cursor-pointer hover:shadow"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{zone.name}</div>
        <div className="flex gap-2">
          <Badge
            className="!px-2 !py-1 "
            variant={zone.open && zone.free > 0 ? "default" : "destructive"}
          >
            {zone.open && zone.free > 0 ? "Open" : "Closed"}
          </Badge>
          {/* Bonus: visually highlight special rate if server indicates it via WS (handled at parent) */}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          Occupied: <b>{zone.occupied}</b>
        </div>
        <div>
          Free: <b>{zone.free}</b>
        </div>
        <div>
          Reserved: <b>{zone.reserved}</b>
        </div>
        <div>
          Avail Visitors: <b>{zone.availableForVisitors}</b>
        </div>
        <div>
          Avail Subscribers: <b>{zone.availableForSubscribers}</b>
        </div>
        <div>
          Rates: <b>{zone.rateNormal}</b> / <b>{zone.rateSpecial}</b>
        </div>
      </div>
    </Card>
  );
}

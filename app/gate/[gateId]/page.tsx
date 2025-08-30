"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useGates, useZones, useCheckin } from "@/services/hooks";
import { useWs } from "@/lib/ws";
import { useUiStore } from "@/store/ui.store";
import { GateHeader } from "@/components/GateHeader";
import { ZoneCard } from "@/components/ZoneCard";
import { TicketModal } from "@/components/TicketModal";
import { SubscriberVerify } from "@/components/SubscriberVerify";
import type { Zone } from "@/services/types";

export default function GatePage() {
  const { gateId } = useParams<{ gateId: string }>();
  const { data: gates } = useGates();
  const { data: zones, refetch } = useZones(gateId);
  const gate = useMemo(
    () => gates?.find((g) => g.id === gateId),
    [gates, gateId]
  );
  const ws = useWs();
  const setWsStatus = useUiStore((s) => s.setWsStatus);
  const gateTab = useUiStore((s) => s.gateTab);
  const setGateTab = useUiStore((s) => s.setGateTab);
  const openTicket = useUiStore((s) => s.openTicket);
  const { mutate: checkin, isPending, error } = useCheckin();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | undefined>();

  useEffect(() => {
    ws.setHandlers({
      onZoneUpdate: () => refetch(),
    });
    ws.subscribeGate(gateId);
    setWsStatus(ws.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gateId]);

  useEffect(() => setWsStatus(ws.status), [ws.status, setWsStatus]);

  const canSelect = (z: Zone) =>
    z.open &&
    (gateTab === "visitor"
      ? z.availableForVisitors > 0
      : z.availableForSubscribers > 0);

  const onGo = () => {
    if (!selectedZone) return;
    const body: any = { gateId, zoneId: selectedZone.id, type: gateTab };
    if (gateTab === "subscriber") body.subscriptionId = subscriptionId;
    checkin(body, {
      onSuccess: (data) => openTicket(data.ticket),
    });
  };

  return (
    <main className="relative p-4 space-y-4 trucks-parking h-screen  overflow-auto flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-custom-orange/30 to-custom-deep-blue"></div>

      <div className="z-10 max-w-6xl">
        <GateHeader gateName={gate?.name || String(gateId)} />
        <Tabs value={gateTab} onValueChange={(v) => setGateTab(v as any)}>
          <TabsList>
            <TabsTrigger value="visitor">Visitor</TabsTrigger>
            <TabsTrigger value="subscriber">Subscriber</TabsTrigger>
          </TabsList>
          <div className="grid md:grid-cols-3 gap-3 mt-3">
            {zones?.map((z) => (
              <ZoneCard
                key={z.id}
                zone={z}
                disabled={!canSelect(z)}
                onSelect={setSelectedZone}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 pt-3">
            {gateTab === "subscriber" && (
              <SubscriberVerify onVerified={(id) => setSubscriptionId(id)} />
            )}
            <Button
              disabled={
                !selectedZone ||
                isPending ||
                (gateTab === "subscriber" && !subscriptionId)
              }
              onClick={onGo}
            >
              Go
            </Button>
            {error && (
              <span className="text-red-600 text-sm">{String(error)}</span>
            )}
          </div>
        </Tabs>
        <TicketModal />
      </div>
    </main>
  );
}

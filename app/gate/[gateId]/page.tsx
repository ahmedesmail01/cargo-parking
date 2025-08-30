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
    <main className="relative   !p-4  trucks-parking min-h-screen   flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full !h-full bg-gradient-to-b from-custom-orange/30 to-custom-deep-blue"></div>

      <div className="z-10 bg-white/50 rounded-3xl !p-6 relative top-14 !mb-10 !h-full max-w-6xl">
        <GateHeader gateName={gate?.name || String(gateId)} />
        <Tabs value={gateTab} onValueChange={(v) => setGateTab(v as any)}>
          <div className="flex items-center justify-between  gap-2 ">
            <TabsList>
              <TabsTrigger className="!px-4 !py-2" value="visitor">
                Visitor
              </TabsTrigger>
              <TabsTrigger className="!px-4 !py-2" value="subscriber">
                Subscriber
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="grid md:grid-cols-3  gap-3 !my-3">
            {zones?.map((z) => (
              <ZoneCard
                key={z.id}
                zone={z}
                disabled={!canSelect(z)}
                onSelect={setSelectedZone}
                selectedZone={selectedZone}
              />
            ))}
          </div>
        </Tabs>
        <TicketModal />
        <div className="flex items-start gap-3 pt-3">
          {gateTab === "subscriber" && (
            <SubscriberVerify onVerified={(id) => setSubscriptionId(id)} />
          )}
          <Button
            className="!px-6 !py-2 bg-custom-deep-blue text-white cursor-pointer hover:bg-custom-orange"
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
            <span className="text-red-600 font-bold  text-sm">
              {String(error)}
            </span>
          )}
        </div>
      </div>
    </main>
  );
}

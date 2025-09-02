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
import { Loader2, WifiOff } from "lucide-react";

export default function GatePage() {
  const { gateId } = useParams<{ gateId: string }>();
  const { data: gates } = useGates();
  const { data: zones, refetch } = useZones(gateId);

  const gate = useMemo(
    () => gates?.find((g) => g.id === gateId),
    [gates, gateId]
  );

  const subscribeGate = useWs((s) => s.subscribeGate);
  const unsubscribeGate = useWs((s) => s.unsubscribeGate);
  const addZoneListener = useWs((s) => s.addZoneListener);
  const wsStatus = useWs((s) => s.status);

  const setWsStatus = useUiStore((s) => s.setWsStatus);
  const gateTab = useUiStore((s) => s.gateTab);
  const setGateTab = useUiStore((s) => s.setGateTab);
  const openTicket = useUiStore((s) => s.openTicket);

  const { mutate: checkin, isPending, error } = useCheckin();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | undefined>();

  useEffect(() => {
    const off = addZoneListener(() => refetch());
    return off;
  }, [addZoneListener, refetch]);

  useEffect(() => {
    if (!gateId) return;
    subscribeGate(gateId);
    return () => unsubscribeGate(gateId);
  }, [gateId, subscribeGate, unsubscribeGate]);

  useEffect(() => setWsStatus(wsStatus), [wsStatus, setWsStatus]);

  const canSelect = (z: Zone) =>
    z.open &&
    (gateTab === "visitor"
      ? z.availableForVisitors > 0
      : z.availableForSubscribers > 0);

  const onGo = () => {
    if (!selectedZone) return;
    const body: any = { gateId, zoneId: selectedZone.id, type: gateTab };
    if (gateTab === "subscriber") body.subscriptionId = subscriptionId;
    checkin(body, { onSuccess: (data) => openTicket(data.ticket) });
  };

  const isConnecting = wsStatus === "connecting";
  const isDisconnected = wsStatus === "disconnected";

  return (
    <main className="relative !p-4 trucks-parking min-h-screen flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full !h-full bg-gradient-to-b from-custom-orange/30 to-custom-deep-blue" />

      <div className="relative z-10 bg-white/50 rounded-3xl !p-6 top-14 !mb-10 !h-full max-w-6xl w-full">
        <GateHeader gateName={gate?.name || String(gateId)} />

        {/* content wrapper becomes overlay host */}
        <div className="relative">
          <Tabs value={gateTab} onValueChange={(v) => setGateTab(v as any)}>
            <div className="flex items-center justify-between gap-2">
              <TabsList>
                <TabsTrigger className="!px-4 !py-2" value="visitor">
                  Visitor
                </TabsTrigger>
                <TabsTrigger className="!px-4 !py-2" value="subscriber">
                  Subscriber
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex items-start gap-3 !pt-3">
              {gateTab === "subscriber" && (
                <SubscriberVerify onVerified={(id) => setSubscriptionId(id)} />
              )}
              <Button
                className="!px-6 !py-2 bg-custom-deep-blue text-white hover:bg-custom-orange"
                disabled={
                  isConnecting ||
                  isDisconnected ||
                  !selectedZone ||
                  isPending ||
                  (gateTab === "subscriber" && !subscriptionId)
                }
                onClick={onGo}
              >
                Go
              </Button>
              {error && (
                <span className="text-red-600 font-bold text-sm">
                  {String(error)}
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-3 !my-3">
              {zones?.map((z) => (
                <ZoneCard
                  key={z.id}
                  zone={z}
                  disabled={!canSelect(z) || isDisconnected || isConnecting}
                  onSelect={setSelectedZone}
                  selectedZone={selectedZone}
                />
              ))}
            </div>
          </Tabs>

          {/* OVERLAY WHILE CONNECTING / DISCONNECTED */}
          {(isConnecting || isDisconnected) && (
            <div className="absolute inset-0 z-20 grid place-items-center rounded-2xl bg-white/70 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-custom-deep-blue">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Connecting to gate…</span>
              </div>
            </div>
          )}
        </div>

        <TicketModal />
      </div>
    </main>
  );
}

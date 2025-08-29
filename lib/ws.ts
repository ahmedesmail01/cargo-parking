import { create } from "zustand";

type AdminUpdate = {
  type: "admin-update";
  payload: {
    adminId: string;
    action: string;
    targetType: string;
    targetId: string;
    details?: Record<string, unknown>;
    timestamp: string;
  };
};

type ZoneUpdate = {
  type: "zone-update";
  payload: any; // Zone object from server
};

type Message = AdminUpdate | ZoneUpdate;

interface WsState {
  status: "disconnected" | "connecting" | "connected";
  socket?: WebSocket;
  subscribeGate: (gateId: string) => void;
  unsubscribeGate: (gateId: string) => void;
  onZoneUpdate?: (zone: any) => void;
  onAdminUpdate?: (evt: AdminUpdate["payload"]) => void;
  setHandlers: (h: {
    onZoneUpdate?: (z: any) => void;
    onAdminUpdate?: (a: AdminUpdate["payload"]) => void;
  }) => void;
}

export const useWs = create<WsState>((set, get) => ({
  status: "disconnected",
  subscribeGate: (gateId: string) => {
    let ws = get().socket;
    if (!ws || ws.readyState > 1) {
      set({ status: "connecting" });
      ws = new WebSocket(String(process.env.NEXT_PUBLIC_WS_URL));
      ws.onopen = () => {
        set({ status: "connected", socket: ws! });
        ws!.send(JSON.stringify({ type: "subscribe", payload: { gateId } }));
      };
      ws.onmessage = (ev) => {
        try {
          const msg: Message = JSON.parse(ev.data);
          if (msg.type === "zone-update" && get().onZoneUpdate)
            get().onZoneUpdate!(msg.payload);
          if (msg.type === "admin-update" && get().onAdminUpdate)
            get().onAdminUpdate!(msg.payload);
        } catch {}
      };
      ws.onclose = () => set({ status: "disconnected", socket: undefined });
      ws.onerror = () => set({ status: "disconnected" });
      set({ socket: ws });
    } else {
      ws.send(JSON.stringify({ type: "subscribe", payload: { gateId } }));
    }
  },
  unsubscribeGate: (gateId: string) => {
    const ws = get().socket;
    if (ws && ws.readyState === 1)
      ws.send(JSON.stringify({ type: "unsubscribe", payload: { gateId } }));
  },
  setHandlers: (h) => set(h),
}));

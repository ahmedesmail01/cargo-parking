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
type ZoneUpdate = { type: "zone-update"; payload: any };
type Message = AdminUpdate | ZoneUpdate;

interface WsState {
  status: "disconnected" | "connecting" | "connected";
  socket?: WebSocket;

  // queue to handle StrictMode double effects / CONNECTING state
  pendingSubs: Set<string>;
  pendingUnsubs: Set<string>;

  subscribeGate: (gateId: string) => void;
  unsubscribeGate: (gateId: string) => void;

  onZoneUpdate?: (zone: any) => void;
  onAdminUpdate?: (evt: AdminUpdate["payload"]) => void;
  setHandlers: (h: {
    onZoneUpdate?: (z: any) => void;
    onAdminUpdate?: (a: AdminUpdate["payload"]) => void;
  }) => void;
}

function openSocket(set: any, get: any) {
  const url = String(process.env.NEXT_PUBLIC_WS_URL);
  const ws = new WebSocket(url);

  set({ status: "connecting", socket: ws });

  ws.onopen = () => {
    set({ status: "connected" });

    // flush queued (de-duplicated) messages
    const { pendingSubs, pendingUnsubs } = get() as WsState;
    pendingSubs.forEach((gateId) =>
      ws.send(JSON.stringify({ type: "subscribe", payload: { gateId } }))
    );
    pendingUnsubs.forEach((gateId) =>
      ws.send(JSON.stringify({ type: "unsubscribe", payload: { gateId } }))
    );
    pendingSubs.clear();
    pendingUnsubs.clear();
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

  return ws;
}

export const useWs = create<WsState>((set, get) => ({
  status: "disconnected",
  socket: undefined,
  pendingSubs: new Set<string>(),
  pendingUnsubs: new Set<string>(),

  subscribeGate: (gateId: string) => {
    let ws = get().socket;

    // record intention first (dedupe)
    get().pendingSubs.add(gateId);
    get().pendingUnsubs.delete(gateId);

    if (!ws || ws.readyState === WebSocket.CLOSED) {
      ws = openSocket(set, get);
      return; // will flush on open
    }

    if (ws.readyState === WebSocket.CONNECTING) {
      // do nothing: will flush on open
      return;
    }

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "subscribe", payload: { gateId } }));
      get().pendingSubs.delete(gateId);
    }
  },

  unsubscribeGate: (gateId: string) => {
    const ws = get().socket;

    get().pendingUnsubs.add(gateId);
    get().pendingSubs.delete(gateId);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "unsubscribe", payload: { gateId } }));
      get().pendingUnsubs.delete(gateId);
    }
    // if CONNECTING/CLOSED: will flush when (re)opened
  },

  setHandlers: (h) => set(h),
}));

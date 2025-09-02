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

  // de-duped, flushed on open
  pendingSubs: Set<string>;
  pendingUnsubs: Set<string>;

  // subscribe/unsubscribe
  subscribeGate: (gateId: string) => void;
  subscribeMany: (gateIds: string[]) => void;
  unsubscribeGate: (gateId: string) => void;

  // listeners (multiple allowed)
  addZoneListener: (fn: (zone: any) => void) => () => void;
  addAdminListener: (fn: (evt: AdminUpdate["payload"]) => void) => () => void;
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
      if (msg.type === "zone-update") {
        (get()._zoneListeners as Set<(z: any) => void>).forEach((fn) =>
          fn(msg.payload)
        );
      }
      if (msg.type === "admin-update") {
        (
          get()._adminListeners as Set<(p: AdminUpdate["payload"]) => void>
        ).forEach((fn) => fn(msg.payload));
      }
    } catch {
      // ignore bad frames
    }
  };

  ws.onclose = () => set({ status: "disconnected", socket: undefined });
  ws.onerror = () => set({ status: "disconnected" });

  return ws;
}

export const useWs = create<
  WsState & {
    _zoneListeners: Set<(z: any) => void>;
    _adminListeners: Set<(p: AdminUpdate["payload"]) => void>;
  }
>((set, get) => ({
  status: "disconnected",
  socket: undefined,
  pendingSubs: new Set<string>(),
  pendingUnsubs: new Set<string>(),

  // internal listener registries
  _zoneListeners: new Set(),
  _adminListeners: new Set(),

  subscribeGate: (gateId: string) => {
    const ws = get().socket;

    // record intention first (dedupe)
    get().pendingSubs.add(gateId);
    get().pendingUnsubs.delete(gateId);

    if (!ws || ws.readyState === WebSocket.CLOSED) {
      openSocket(set, get); // will flush on open
      return;
    }
    if (ws.readyState === WebSocket.CONNECTING) {
      // will flush on open
      return;
    }
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "subscribe", payload: { gateId } }));
      get().pendingSubs.delete(gateId);
    }
  },

  subscribeMany: (gateIds: string[]) => {
    gateIds.forEach((id) => get().subscribeGate(id));
  },

  unsubscribeGate: (gateId: string) => {
    const ws = get().socket;

    get().pendingUnsubs.add(gateId);
    get().pendingSubs.delete(gateId);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "unsubscribe", payload: { gateId } }));
      get().pendingUnsubs.delete(gateId);
    }
    // if CONNECTING/CLOSED: will flush on open
  },

  // pub/sub API (multiple listeners, safe in StrictMode)
  addZoneListener: (fn) => {
    get()._zoneListeners.add(fn);
    return () => get()._zoneListeners.delete(fn);
  },
  addAdminListener: (fn) => {
    get()._adminListeners.add(fn);
    return () => get()._adminListeners.delete(fn);
  },
}));

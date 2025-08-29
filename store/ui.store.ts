import { create } from "zustand";

interface UiState {
  gateTab: "visitor" | "subscriber";
  setGateTab: (t: UiState["gateTab"]) => void;
  wsStatus: "disconnected" | "connecting" | "connected";
  setWsStatus: (s: UiState["wsStatus"]) => void;
  ticketModal: { open: boolean; ticket?: any };
  openTicket: (ticket: any) => void;
  closeTicket: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  gateTab: "visitor",
  setGateTab: (t) => set({ gateTab: t }),
  wsStatus: "disconnected",
  setWsStatus: (s) => set({ wsStatus: s }),
  ticketModal: { open: false },
  openTicket: (ticket) => set({ ticketModal: { open: true, ticket } }),
  closeTicket: () => set({ ticketModal: { open: false } }),
}));

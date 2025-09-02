import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Gate,
  Zone,
  Ticket,
  CheckoutResult,
  Subscription,
  Category,
  RushHour,
} from "./types";

const RUSH_QK = ["admin", "rush-hours"];

export const useGates = () =>
  useQuery({
    queryKey: ["gates"],
    queryFn: async () => (await api.get<Gate[]>("/master/gates")).data,
  });
export const useZones = (gateId?: string) =>
  useQuery({
    queryKey: ["zones", gateId],
    enabled: !!gateId,
    queryFn: async () =>
      (await api.get<Zone[]>(`/master/zones`, { params: { gateId } })).data,
  });
export const useSubscription = (id?: string) =>
  useQuery({
    queryKey: ["subscription", id],
    enabled: !!id,
    queryFn: async () =>
      (await api.get<Subscription>(`/subscriptions/${id}`)).data,
  });
export const useCheckin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      gateId: string;
      zoneId: string;
      type: "visitor" | "subscriber";
      subscriptionId?: string;
    }) => {
      const { data } = await api.post<{ ticket: Ticket; zoneState: Zone }>(
        "/tickets/checkin",
        body
      );
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["zones", vars.gateId] });
    },
  });
};
export const useCheckout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      ticketId: string;
      forceConvertToVisitor?: boolean;
    }) => {
      const { data } = await api.post<CheckoutResult>(
        "/tickets/checkout",
        body
      );
      return data;
    },
    onSuccess: (data) => {
      // Invalidate zones for that gate (we don't know gate here—rely on WS for realtime or add param upstream)
      qc.invalidateQueries();
    },
  });
};
// Admin
export const useAdminParkingState = () =>
  useQuery({
    queryKey: ["admin", "parking-state"],
    queryFn: async () => (await api.get(`/admin/reports/parking-state`)).data,
  });
export const useAdminUsers = () =>
  useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => (await api.get(`/admin/users`)).data,
  });
export const useAdminUpdateCategory = () =>
  useMutation({
    mutationFn: async ({
      id,
      ...body
    }: {
      id: string;
      rateNormal?: number;
      rateSpecial?: number;
      name?: string;
      description?: string;
    }) => (await api.put(`/admin/categories/${id}`, body)).data,
  });
export const useAdminOpenZone = () =>
  useMutation({
    mutationFn: async ({ id, open }: { id: string; open: boolean }) =>
      (await api.put(`/admin/zones/${id}/open`, { open })).data,
  });
export const useAdminCreateRush = () =>
  useMutation({
    mutationFn: async (body: { weekDay: number; from: string; to: string }) =>
      (await api.post(`/admin/rush-hours`, body)).data,
  });
export const useAdminCreateVacation = () =>
  useMutation({
    mutationFn: async (body: { name: string; from: string; to: string }) =>
      (await api.post(`/admin/vacations`, body)).data,
  });

export function useAdminRushHours() {
  return useQuery({
    queryKey: RUSH_QK,
    queryFn: async () => {
      const { data } = await api.get<RushHour[]>("/admin/rush-hours");
      return data;
    },
    staleTime: 15_000,
  });
}

export function useAdminUpdateRush() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: {
      id: string;
      weekDay: number;
      from: string;
      to: string;
    }) => api.put(`/admin/rush-hours/${p.id}`, p).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: RUSH_QK }),
    meta: {
      successMessage: "Rush window updated",
      errorMessage: "Failed to update rush window",
    },
  });
}

export function useAdminDeleteRush() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id: string }) =>
      api.delete(`/admin/rush-hours/${p.id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: RUSH_QK }),
    meta: {
      successMessage: "Rush window deleted",
      errorMessage: "Failed to delete rush window",
    },
  });
}

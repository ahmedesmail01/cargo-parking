export type Category = {
  id: string;
  name: string;
  description?: string;
  rateNormal: number;
  rateSpecial: number;
};

export type Zone = {
  id: string;
  name: string;
  categoryId: string;
  gateIds: string[];
  totalSlots: number;
  occupied: number;
  free: number;
  reserved: number;
  availableForVisitors: number;
  availableForSubscribers: number;
  rateNormal: number;
  rateSpecial: number;
  open: boolean;
};

export type Gate = {
  id: string;
  name: string;
  zoneIds: string[];
  location?: string;
};

export type Subscription = {
  id: string;
  userName: string;
  active: boolean;
  category: string; // categoryId
  cars: { plate: string; brand: string; model: string; color: string }[];
  startsAt: string;
  expiresAt: string;
  currentCheckins?: { ticketId: string; zoneId: string; checkinAt: string }[];
};

export type Ticket = {
  id: string;
  type: "visitor" | "subscriber";
  zoneId: string;
  gateId: string;
  checkinAt: string;
  subscriptionId?: string;
};

export type CheckoutResult = {
  ticketId: string;
  checkinAt: string;
  checkoutAt: string;
  durationHours: number;
  breakdown: {
    from: string;
    to: string;
    hours: number;
    rateMode: "normal" | "special";
    rate: number;
    amount: number;
  }[];
  amount: number;
  zoneState: Zone;
};

export type RushHour = {
  id: string;
  weekDay: number; // ISO: 1=Mon ... 7=Sun  (adjust if your backend is 0-based)
  from: string; // "HH:mm"
  to: string; // "HH:mm"
};

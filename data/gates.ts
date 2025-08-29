// Server-only helper to fetch gates
export type Gate = {
  id: string;
  name: string;
  zoneIds: string[];
  location?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getGates(): Promise<Gate[]> {
  const res = await fetch(`${API_BASE}/master/gates`, {
    cache: "no-store", // true SSR on every request
    // next: { revalidate: 0 },  // (alt) same effect
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to load gates: ${res.status} ${text}`);
  }
  return res.json();
}

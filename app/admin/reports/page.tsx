"use client";
import { useAdminParkingState } from "@/services/hooks";

export default function ReportsPage() {
  const { data, isLoading, error } = useAdminParkingState();
  if (isLoading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{String(error)}</div>;
  return (
    <main className="p-6 space-y-3">
      <h1 className="text-xl font-semibold">Parking State</h1>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="p-2">Zone</th>
              <th className="p-2">Occupied</th>
              <th className="p-2">Free</th>
              <th className="p-2">Reserved</th>
              <th className="p-2">Avail (V)</th>
              <th className="p-2">Avail (S)</th>
              <th className="p-2">Open</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((z: any) => (
              <tr key={z.id} className="odd:bg-muted/30">
                <td className="p-2">{z.name}</td>
                <td className="p-2">{z.occupied}</td>
                <td className="p-2">{z.free}</td>
                <td className="p-2">{z.reserved}</td>
                <td className="p-2">{z.availableForVisitors}</td>
                <td className="p-2">{z.availableForSubscribers}</td>
                <td className="p-2">{z.open ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

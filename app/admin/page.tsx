import { AdminAuditLog } from "@/components/AdminAuditLog";

export default function AdminHome() {
  return (
    <main className="space-y-6">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <AdminAuditLog />
    </main>
  );
}

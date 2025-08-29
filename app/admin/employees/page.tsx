"use client";
import { useAdminUsers } from "@/services/hooks";

export default function EmployeesPage() {
  const { data, isLoading, error } = useAdminUsers();
  if (isLoading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{String(error)}</div>;
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-3">Employees</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Username</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((u: any) => (
            <tr key={u.id} className="odd:bg-muted/30">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

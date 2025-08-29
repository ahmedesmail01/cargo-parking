import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 space-y-4">
      <nav className="space-x-3">
        <Link className="underline" href="/admin">
          Home
        </Link>
        <Link className="underline" href="/admin/employees">
          Employees
        </Link>
        <Link className="underline" href="/admin/reports">
          Parking State
        </Link>
        <Link className="underline" href="/admin/control">
          Control Panel
        </Link>
      </nav>
      {children}
    </div>
  );
}

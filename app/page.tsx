import HomePage from "@/components/Home";
import Link from "next/link";
export default function Home() {
  return (
    <main className="p-6 space-y-4">
      {/* <h1 className="text-2xl font-semibold">Parking Reservation System</h1>
      <div className="space-x-3">
        <Link className="underline" href="/gate/gate_1">
          Gate (gate_1)
        </Link>
        <Link className="underline" href="/checkpoint">
          Checkpoint
        </Link>
        <Link className="underline" href="/admin">
          Admin
        </Link>
      </div> */}
      <HomePage />
    </main>
  );
}

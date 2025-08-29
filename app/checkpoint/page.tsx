"use client";
import { useAuthStore } from "@/store/auth.store";
import { CheckoutPanel } from "@/components/CheckoutPanel";
import Link from "next/link";

export default function Checkpoint() {
  const token = useAuthStore((s) => s.token);
  if (!token) {
    return (
      <main className="p-6">
        <p>
          Employee access only. Please{" "}
          <Link className="underline" href="/login/employee">
            login
          </Link>
          .
        </p>
      </main>
    );
  }
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Checkpoint — Checkout</h1>
      <CheckoutPanel />
    </main>
  );
}

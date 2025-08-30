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
    <main className="!p-6 relative !space-y-4 trucks-checkout flex items-start justify-center min-h-screen">
      <div className="absolute top-0 left-0 w-full !h-full bg-gradient-to-b from-custom-deep-blue to-custom-orange/50"></div>

      <div className="relative top-18 max-w-6xl m-auto w-full">
        <h1 className="text-3xl !mb-4 text-white font-semibold">
          Checkpoint — Checkout
        </h1>
        <CheckoutPanel />
      </div>
    </main>
  );
}

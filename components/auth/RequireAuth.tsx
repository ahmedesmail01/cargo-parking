"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Loader2 } from "lucide-react";

type RequireAuthProps = {
  children: React.ReactNode;
  // Only allow these roles. Omit to allow any authenticated user.
  roles?: Array<"admin" | "employee">;
  // Where to send unauthenticated/unauthorized users
  redirectTo?: string;
  // Optional: render nothing instead of spinner while deciding
  silent?: boolean;
};

export default function RequireAuth({
  children,
  roles,
  redirectTo = "/login/employee",
  silent = false,
}: RequireAuthProps) {
  const router = useRouter();
  const { user, token } = useAuthStore();

  // Hydration guard for Zustand persist
  const [hydrated, setHydrated] = React.useState(
    // in case it's already hydrated
    useAuthStore.persist?.hasHydrated?.() ?? false
  );

  React.useEffect(() => {
    // subscribe to the end of hydration
    const unsub = useAuthStore.persist?.onFinishHydration?.(() => {
      setHydrated(true);
    });
    // edge: if already hydrated sync
    if (useAuthStore.persist?.hasHydrated?.()) setHydrated(true);
    return () => {
      unsub?.();
    };
  }, []);

  // After hydration, decide and redirect if needed
  React.useEffect(() => {
    if (!hydrated) return;

    const authed = Boolean(token);
    const roleOk = !roles?.length || (user && roles.includes(user.role));

    if (!authed || !roleOk) {
      router.replace(redirectTo);
    }
  }, [hydrated, token, user, roles, redirectTo, router]);

  // UI while deciding / redirecting
  if (!hydrated) {
    if (silent) return null;
    return (
      <div className="fixed inset-0 z-[999] grid place-items-center bg-background/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-custom-deep-blue" />
          <span className="text-foreground/80">Loading…</span>
        </div>
      </div>
    );
  }

  // If unauth/unauthorized, we just returned a redirect; render nothing
  if (!token || (roles?.length && (!user || !roles.includes(user.role)))) {
    return null;
  }

  return <>{children}</>;
}

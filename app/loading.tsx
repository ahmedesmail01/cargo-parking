// app/loading.tsx
import { Loader2 } from "lucide-react";

export default function Loading() {
  // This replaces the `children` slot while the route (or any nested segment) loads.
  // Navbar/Footer in your layout remain visible.
  return (
    <div className="fixed inset-0 z-[998] grid place-items-center bg-background/70 backdrop-blur">
      <div className="flex items-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-custom-deep-blue" />
        <span className="text-foreground/80">Loading…</span>
      </div>
    </div>
  );
}

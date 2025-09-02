"use client";
import { ReactNode, useState } from "react";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast, Toaster } from "sonner";

function getErrorMessage(err: any) {
  // axios-style
  const api = err?.response?.data;
  if (api?.message) return api.message;
  if (api?.error) return api.error;
  // fetch-style
  if (err?.message) return err.message;
  return "Something went wrong";
}

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onSuccess: (data, variables, context, mutation) => {
            // allow per-mutation override via `meta.successMessage`
            const msg =
              (mutation.options as any)?.meta?.successMessage ?? "Done";
            toast.success(msg);
          },
          onError: (error, variables, context, mutation) => {
            const fallback =
              (mutation.options as any)?.meta?.errorMessage ?? "Request failed";
            const msg = getErrorMessage(error) || fallback;
            toast.error(msg);
          },
        }),
        defaultOptions: {
          queries: {
            // recommended defaults; tweak if you like
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}

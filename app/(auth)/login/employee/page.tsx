"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export default function EmployeeLogin() {
  const login = useAuthStore((s) => s.login);
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const onSubmit = async () => {
    try {
      await login(u, p);
      router.push("/checkpoint");
    } catch (e: any) {
      setErr(e.message);
    }
  };
  return (
    <main className="p-6 max-w-sm mx-auto space-y-3">
      <h1 className="text-xl font-semibold">Employee Login</h1>
      <Input
        placeholder="Username"
        value={u}
        onChange={(e) => setU(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={p}
        onChange={(e) => setP(e.target.value)}
      />
      <Button onClick={onSubmit}>Login</Button>
      {err && <div className="text-red-600 text-sm">{err}</div>}
    </main>
  );
}

"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { toast } from "sonner";

interface LoginPageProps {
  routingPage: string;
}

const LoginPage = ({ routingPage }: LoginPageProps) => {
  const login = useAuthStore((s) => s.login);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      await login(user, pass); // calls /auth/login and stores token+user
      toast.success("Login success");
      router.push(routingPage);
    } catch (e: any) {
      // surface server message if available
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Login failed. Check your credentials and try again.";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh flex items-center justify-center bg-custom-deep-blue px-4">
      <div className="relative top-10 w-full max-w-[890px]">
        <LoginForm
          user={user}
          pass={pass}
          setUser={setUser}
          setPass={setPass}
          onSubmit={onSubmit}
          error={err}
          loading={loading}
        />
      </div>
    </main>
  );
};

export default LoginPage;

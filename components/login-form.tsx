"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import banner from "@/public/images/trucks-parking.jpg";

type LoginFormProps = React.ComponentProps<"div"> & {
  user: string;
  pass: string;
  setUser: (v: string) => void;
  setPass: (v: string) => void;
  onSubmit: () => void; // we’ll call this after preventDefault
  loading?: boolean;
  error?: string | null;
};

export function LoginForm({
  className,
  user,
  pass,
  setUser,
  setPass,
  onSubmit,
  loading = false,
  error,
  ...props
}: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden !p-0">
        <CardContent className="grid !p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="!p-6 md:!p-8 space-y-6">
            <div className="flex flex-col items-center text-center gap-1">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground text-balance">
                Login to your account
              </p>
            </div>

            {error ? (
              <div className="text-sm rounded-md bg-red-500/10 text-red-600 border border-red-200 px-3 py-2">
                {error}
              </div>
            ) : null}

            <div className="grid gap-3 !mb-4">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                inputMode="text"
                placeholder="username"
                required
                className="!p-4"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                aria-invalid={!!error}
              />
            </div>

            <div className="grid gap-3 !mb-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* <a className="text-xs underline text-muted-foreground" href="#">Forgot?</a> */}
              </div>
              <Input
                id="password"
                name="current-password"
                type="password"
                placeholder="password"
                autoComplete="current-password"
                required
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                aria-invalid={!!error}
                className="!p-4"
              />
            </div>

            <Button type="submit" className="w-full !mb-4" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              src={banner}
              width={400}
              height={600}
              alt="Parking"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-white text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

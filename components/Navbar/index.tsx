"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import logo from "@/public/images/cargo-logo.png";
import { Menu, LogOut } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const path = usePathname();
  const pathArr = path.split("/");
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();

  // console.log("user is ", user);

  const handleLogout = () => {
    logout();
    toast.success("Logout success");
    qc.clear();
    router.push("/");
  };

  const checkActive = (p: string) =>
    pathArr[1] === p ? "text-custom-orange" : "text-white";

  if (pathArr[1] === "admin") {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 z-30 w-full bg-white/30 backdrop-blur-md border-b border-white/20">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between !px-4 !py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="cargo-app-logo"
            width={200}
            height={54}
            className="w-[160px] h-auto sm:w-[200px] lg:w-[280px]"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          <Link
            className={`text-lg text ${checkActive(
              ""
            )} hover:text-custom-orange transition`}
            href="/"
          >
            Home
          </Link>
          <Link
            className={`text-lg ${checkActive(
              "checkpoint"
            )} hover:text-custom-orange transition`}
            href={token ? "/checkpoint" : "/login/employee"}
          >
            Checkpoint
          </Link>

          {user?.username ? (
            <div className="ml-2 flex items-center gap-3">
              <span className="text-white/90 text-base">{user.username}</span>
              <Button
                onClick={handleLogout}
                className="rounded-2xl !px-4 !py-1 font-bold bg-white text-custom-deep-blue hover:bg-custom-deep-blue hover:text-white"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link
              href="/login/employee"
              className="rounded-2xl !px-4 !py-1 font-bold bg-white text-custom-deep-blue hover:bg-custom-deep-blue hover:text-white transition"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile: burger */}
        <div className="md:hidden relative z-40">
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/20"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[86vw] bg-white sm:w-[360px]"
            >
              {/* <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src={logo}
                    alt="cargo-app-logo"
                    width={120}
                    height={36}
                    className="h-9 w-auto"
                  />
                </SheetTitle>
              </SheetHeader> */}

              <div className="!mt-6 !p-4 flex flex-col gap-4">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className={`text-sm !text-custom-deep-blue font-bold  `}
                  >
                    Home
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    href={token ? "/checkpoint" : "/login/employee"}
                    className={`text-sm !text-custom-deep-blue font-bold  `}
                  >
                    Checkpoint
                  </Link>
                </SheetClose>

                <div className="!my-2 text-custom-deep-blue font-bold h-px bg-border" />

                {user?.username ? (
                  <>
                    <div className="text-sm ">Signed in as</div>
                    <div className="text-sm font-medium ">{user.username}</div>
                    <SheetClose asChild>
                      <button
                        onClick={handleLogout}
                        className="!mt-2 flex items-center gap-2 text-custom-deep-blue "
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </SheetClose>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Link
                      href="/login/employee"
                      className="rounded-xl  px-4 py-2 text-center font-semibold text-custom-deep-blue   "
                    >
                      Login
                    </Link>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

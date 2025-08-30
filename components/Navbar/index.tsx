"use client";
import Image from "next/image";
import React from "react";
import logo from "@/public/images/cargo-logo.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Navbar = () => {
  const path = usePathname();
  const pathArr = path.split("/");
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();

  const handleLogout = () => {
    // 1) clear auth
    logout();
    toast.success("logout success");
    // 2) clear cached server data (zones, reports, etc.)
    qc.clear();
    // 3) navigate somewhere public
    router.push("/");
  };

  const checkActive = (path: string) => {
    if (pathArr[1] === path) {
      return "text-custom-orange";
    }
    return "text-white";
  };

  return (
    <div className="w-full flex items-center justify-center bg-white/30  m-auto fixed top-0   left-0 z-[999]   ">
      <div className="flex items-center justify-between w-full max-w-6xl !px-4  m-auto">
        <Link href={"/"}>
          <Image
            src={logo}
            alt="cargo-app-logo lg:w-[280px] lg:h-[76px]"
            width={280}
            height={76}
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            className={`text-lg ${checkActive("")}
            hover:text-custom-orange transition-all duration-150`}
            href="/"
          >
            Home
          </Link>
          <Link
            className={`text-lg ${checkActive(
              "checkpoint"
            )}   hover:text-custom-orange transition-all duration-150`}
            href="/checkpoint"
          >
            Checkpoint
          </Link>
          {user?.username ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-white/90 text-base">
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-2xl !px-4 !py-1 font-bold bg-white text-custom-deep-blue hover:bg-custom-deep-blue hover:text-white transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href={"/login/employee"}
              className="hover:bg-custom-deep-blue hover:text-white transition-all duration-300 text-custom-deep-blue  bg-white font-bold cursor-pointer rounded-2xl !px-4 !py-1 "
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

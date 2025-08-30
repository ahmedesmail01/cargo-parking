import Image from "next/image";
import React from "react";
import logo from "@/public/images/cargo-logo.png";
import Link from "next/link";

const Navbar = () => {
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
            className="text-lg text-white hover:text-custom-orange transition-all duration-150"
            href="/checkpoint"
          >
            Checkpoint
          </Link>
          <Link
            href={"/login/employee"}
            className="hover:bg-custom-deep-blue hover:text-white transition-all duration-300 text-custom-deep-blue  bg-white font-bold cursor-pointer rounded-2xl !px-4 !py-1 "
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

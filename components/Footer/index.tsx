"use client";

import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const path = usePathname();
  const pathArr = path.split("/");

  if (pathArr[1] === "admin") {
    return null;
  }
  return (
    <div className="w-full !p-4 text-sm lg:text-base text-nowrap flex-wrap gap-4 bg-custom-deep-blue text-white flex items-center justify-around">
      <p>Copyright © 2025 welinkcargo.com</p>
      <p>TERMS & CONDITIONS</p>
      <p>PRIVACVY POLICY</p>
    </div>
  );
};

export default Footer;

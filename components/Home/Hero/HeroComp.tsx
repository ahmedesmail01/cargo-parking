import Image from "next/image";
import React from "react";
import HeroTruckimg from "@/public/images/hero-home-truck.jpg";
import HeroContent from "./HeroContent";

const HeroComp = () => {
  return (
    <div className="relative w-full flex items-center justify-center h-[80vh]  lg:h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full z-10 h-full bg-gradient-to-r from-custom-deep-blue via-transparent  to-custom-orange/50"></div>
      <Image
        src={HeroTruckimg}
        alt={"hero image bacground truck"}
        width={1024}
        height={800}
        className="absolute w-full h-full top-0 left-0 object-cover"
      />
      <HeroContent />
    </div>
  );
};

export default HeroComp;

import Image from "next/image";
import React from "react";
import HeroTruckimg from "@/public/images/hero-home-truck.jpg";

const HeroComp = () => {
  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-screen overflow-hidden">
      <Image
        src={HeroTruckimg}
        alt={"hero image bacground truck"}
        width={1024}
        height={800}
        className="absolute w-full top-0 left-0 object-cover"
      />
    </div>
  );
};

export default HeroComp;

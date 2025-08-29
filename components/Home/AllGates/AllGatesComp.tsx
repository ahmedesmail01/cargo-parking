import React from "react";
import AllGatesCarousel from "./AllGatesCarousel.client";
import { getGates } from "@/data/gates";

const AllGatesComp = async () => {
  const gates = await getGates();
  return (
    <div
      id="gates"
      className="trucks-parking overflow-hidden relative flex items-center justify-center w-full h-screen !p-14 md:!p-20"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-custom-orange/30 to-custom-deep-blue"></div>

      <AllGatesCarousel gates={gates} />
    </div>
  );
};

export default AllGatesComp;

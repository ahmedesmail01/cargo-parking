import React from "react";

const HeroContent = () => {
  return (
    <div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center gap-4 !p-4">
      <h1 className="text-2xl md:text-3xl lg:text-6xl font-bold text-center text-white">
        Park smarter. Check in faster
      </h1>
      <p className="text-sm lg:text-xl text-white text-center">
        A real-time Parking Reservation System for busy sites. Gate attendants
        check in visitors & subscribers in one tap, employees process checkouts
        with clear fee breakdowns, and admins control zones and rates—all synced
        over WebSocket with no client-side guesswork.
      </p>
      <a
        href="#gates"
        className="hover:bg-custom-deep-blue hover:text-white transition-all duration-300 bg-white font-bold text-sm lg:text-xl cursor-pointer text-custom-deep-blue !px-4 !py-2 rounded-3xl"
      >
        See Gates
      </a>
    </div>
  );
};

export default HeroContent;

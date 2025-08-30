"use client";
import React from "react";
import { motion } from "motion/react";
const HeroContent = () => {
  return (
    <div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center gap-4 !p-4">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1, transition: { duration: 0.7 } }}
        className="text-2xl md:text-3xl lg:text-6xl font-bold text-center text-white"
      >
        Park smarter. Check in faster
      </motion.h1>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        whileInView={{
          y: 0,
          opacity: 1,
          transition: { duration: 1, delay: 0.2 },
        }}
        className="text-sm lg:text-xl font-semibold text-white text-center"
      >
        A real-time Parking Reservation System for busy sites. Gate attendants
        check in visitors & subscribers in one tap.
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: 1,
          transition: { duration: 1, delay: 0.6 },
        }}
        onClick={() => (window.location.href = "#gates")}
        className="hover:bg-custom-deep-blue hover:text-white transition-all duration-300 bg-white font-bold text-sm lg:text-xl cursor-pointer text-custom-deep-blue !px-4 !py-2 rounded-3xl"
      >
        See Gates
      </motion.button>
    </div>
  );
};

export default HeroContent;

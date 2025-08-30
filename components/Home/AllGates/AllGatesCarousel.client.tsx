"use client";
import { FaToriiGate } from "react-icons/fa6";
import { ImCompass2 } from "react-icons/im";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Gate } from "@/data/gates";
import Link from "next/link";

export default function AllGatesCarousel({ gates }: { gates: Gate[] }) {
  return (
    <Carousel opts={{ align: "start" }} className="w-full max-w-5xl">
      <CarouselContent className="!-ml-4">
        {gates.map((g) => (
          <CarouselItem key={g.id} className="md:basis-1/2 !pl-4 lg:basis-1/3">
            <div className="p-1">
              <Link href={`/gate/${g.id}`}>
                <Card className="bg-white/80 cursor-pointer hover:bg-custom-orange hover:text-white transition-all duration-150 border-0  ">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <div className="text-center space-y-2">
                      <div className="text-xl font-semibold flex items-center justify-center gap-2">
                        <FaToriiGate />

                        <span>{g.name}</span>
                      </div>
                      <div className="text-sm flex items-center justify-center gap-2 ">
                        <ImCompass2 />

                        <span>{g.location}</span>
                      </div>
                      <div className="text-sm">
                        Zones:{" "}
                        <span className="font-medium">{g.zoneIds.length}</span>
                      </div>
                      <div className="text-xs  truncate max-w-[18ch]">
                        {g.zoneIds.join(", ")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

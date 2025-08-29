"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Gate } from "@/data/gates";

export default function AllGatesCarousel({ gates }: { gates: Gate[] }) {
  return (
    <Carousel opts={{ align: "start" }} className="w-full max-w-5xl">
      <CarouselContent className="!-ml-4">
        {gates.map((g) => (
          <CarouselItem key={g.id} className="md:basis-1/2 !pl-4 lg:basis-1/3">
            <div className="p-1">
              <Card className="bg-white/40  backdrop-blur">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <div className="text-center space-y-2">
                    <div className="text-xl font-semibold">{g.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {g.location}
                    </div>
                    <div className="text-sm">
                      Zones:{" "}
                      <span className="font-medium">{g.zoneIds.length}</span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[18ch]">
                      {g.zoneIds.join(", ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

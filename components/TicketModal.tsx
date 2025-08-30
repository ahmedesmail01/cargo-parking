"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/store/ui.store";
import { fmtTime } from "@/lib/format";
import QRCode from "react-qr-code";
import Image from "next/image";
import logo from "@/public/images/cargo-logo.png";

export function TicketModal() {
  const { open, ticket } = useUiStore((s) => s.ticketModal);
  const close = useUiStore((s) => s.closeTicket);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="print:w-[80mm] !p-4 print:bg-white">
        <DialogHeader>
          <DialogTitle>Ticket</DialogTitle>
        </DialogHeader>

        {ticket && (
          <div className="space-y-2 text-sm">
            <div>
              <b>ID:</b> {ticket.id}
            </div>
            <div>
              <b>Type:</b> {ticket.type}
            </div>
            <div>
              <b>Gate:</b> {ticket.gateId}
            </div>
            <div>
              <b>Zone:</b> {ticket.zoneId}
            </div>
            <div>
              <b>Check-in:</b> {fmtTime(ticket.checkinAt)}
            </div>

            <div className="pt-3 flex flex-col items-center">
              {/* QR + centered logo */}
              <div className="relative w-[180px] h-[180px] !my-4 print:w-[180px] print:h-[180px]">
                <QRCode
                  value={ticket.id}
                  size={180}
                  bgColor="transparent"
                  fgColor="#111827"
                  level="H" // more robust when logo covers center
                />
              </div>
              <Image
                src={logo}
                alt="App logo"
                width={180}
                height={44}
                className="bg-custom-deep-blue !my-2 
                              !p-1 rounded-md shadow print:shadow-none"
                aria-hidden
              />

              <div className="mt-2 text-xs text-muted-foreground">
                Show this QR at the checkpoint
              </div>
            </div>
          </div>
        )}

        <div className="pt-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="btn !w-full bg-custom-deep-blue text-white !py-2 rounded-lg font-semibold"
          >
            Print
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

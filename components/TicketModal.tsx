"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/store/ui.store";
import { fmtTime } from "@/lib/format";

export function TicketModal() {
  const { open, ticket } = useUiStore((s) => s.ticketModal);
  const close = useUiStore((s) => s.closeTicket);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="print:w-[80mm]">
        <DialogHeader>
          <DialogTitle>Ticket</DialogTitle>
        </DialogHeader>
        {ticket && (
          <div className="space-y-1 text-sm">
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
          </div>
        )}
        <div className="pt-3 print:hidden">
          <button onClick={() => window.print()} className="btn">
            Print
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

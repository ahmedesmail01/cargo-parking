"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCheckout } from "@/services/hooks";
import { fmtCurrency, fmtTime } from "@/lib/format";
import { useState } from "react";
import CustomModal from "./CustomModal";
import QrScanner from "./QrScanner";

export function CheckoutPanel() {
  const [ticketId, setTicketId] = useState("");
  const [force, setForce] = useState(false);
  const { mutate, data, isPending, error, reset } = useCheckout();
  const [isOpenScanQr, setOpenScanQr] = useState(false);

  const onCheckout = () => mutate({ ticketId, forceConvertToVisitor: force });
  const handleOpenScanner = () => setOpenScanQr(true);
  const handleCancel = () => setOpenScanQr(false);

  return (
    // prevent any page-level horizontal scroll from this block
    <div className="space-y-4 max-w-full overflow-x-hidden">
      {/* Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex w-full sm:w-auto flex-col gap-2">
          <Input
            placeholder="Paste/scan ticket id"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className="w-full sm:w-[260px] !p-4 bg-white"
          />
          <label className="flex items-center gap-2 text-xs sm:text-sm text-white sm:whitespace-nowrap">
            <input
              type="checkbox"
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
            />
            <span>Force convert to visitor</span>
          </label>
        </div>

        {/* Buttons wrap nicely; full width on mobile */}
        <div className="flex w-full sm:w-auto gap-2 sm:ml-auto">
          <Button
            className="w-full sm:w-auto !p-4"
            onClick={onCheckout}
            disabled={!ticketId || isPending}
          >
            Checkout
          </Button>
          <Button className="w-full sm:w-auto !p-4" onClick={handleOpenScanner}>
            Scan QR
          </Button>
          <Button
            className="w-full sm:w-auto !p-4"
            variant="secondary"
            onClick={() => {
              setTicketId("");
              setForce(false);
              reset();
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{String(error)}</div>}

      {/* QR modal */}
      {isOpenScanQr && (
        <CustomModal
          open={isOpenScanQr}
          handleCancel={handleCancel}
          title="Scan ticket QR"
        >
          <div className="max-h-[80dvh] overflow-auto">
            <QrScanner setTicketId={setTicketId} handleCancel={handleCancel} />
          </div>
        </CustomModal>
      )}

      {/* Result */}
      {data && (
        <div className="space-y-3 bg-white/50 my-6 py-6 pb-10 px-4 sm:px-6 rounded-3xl">
          <div className="text-sm sm:text-base text-white">
            Check-in: {fmtTime(data.checkinAt)} → Checkout:{" "}
            {fmtTime(data.checkoutAt)} (hrs: {data.durationHours})
          </div>
          <div className="inline-flex text-base sm:text-xl font-medium bg-custom-orange text-white px-4 py-2 rounded-2xl">
            Amount: {fmtCurrency(data.amount)}
          </div>

          {/* Table: horizontal scroll only inside this box on small screens */}
          <div className="border rounded -mx-4 sm:mx-0 overflow-x-auto">
            <table className="min-w-[640px] w-full text-sm sm:text-base">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="!p-2">From</th>
                  <th className="!p-2">To</th>
                  <th className="!p-2">Hours</th>
                  <th className="!p-2">Rate Mode</th>
                  <th className="!p-2">Rate</th>
                  <th className="!p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.breakdown.map((b, i) => (
                  <tr key={i} className="odd:bg-muted/30 font-semibold">
                    <td className="!p-2 whitespace-nowrap">
                      {fmtTime(b.from)}
                    </td>
                    <td className="!p-2 whitespace-nowrap">{fmtTime(b.to)}</td>
                    <td className="!p-2">{b.hours}</td>
                    <td className="!p-2 capitalize">{b.rateMode}</td>
                    <td className="!p-2">{b.rate}</td>
                    <td className="!p-2">{fmtCurrency(b.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

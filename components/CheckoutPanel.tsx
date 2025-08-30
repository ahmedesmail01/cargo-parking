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
  const handleOpenScanner = async () => {
    setOpenScanQr(true);
  };

  const handleCancel = () => {
    setOpenScanQr(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-start">
        <div className="flex items-start justify-start flex-col gap-2">
          <Input
            placeholder="Paste/scan ticket id"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className="!p-4 bg-white"
          />
          <label className="flex  items-center text-nowrap text-white font-semibold gap-1 text-sm">
            <input
              type="checkbox"
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
            />{" "}
            Force convert to visitor
          </label>
        </div>

        <Button
          className="!p-4"
          onClick={onCheckout}
          disabled={!ticketId || isPending}
        >
          Checkout
        </Button>
        <Button className="!p-4" onClick={handleOpenScanner}>
          Scan Qr
        </Button>

        <Button
          className="!p-4"
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
      {error && <div className="text-red-600 text-sm">{String(error)}</div>}

      {/* qr code  */}
      {isOpenScanQr && (
        <CustomModal
          open={isOpenScanQr}
          handleCancel={handleCancel}
          title="Scan QR To Mark Attendance "
        >
          <QrScanner
            setTicketId={setTicketId} // called when user closes (overlay click, ESC, etc.)
            handleCancel={handleCancel}
          />
        </CustomModal>
      )}

      {data && (
        <div className="space-y-2 bg-white/50 !my-6 !py-6 !pb-10 !px-6 rounded-3xl">
          <div className="text-base text-white !mb-4">
            Check-in: {fmtTime(data.checkinAt)} → Checkout:{" "}
            {fmtTime(data.checkoutAt)} (hrs: {data.durationHours})
          </div>
          <div className="text-xl font-medium !mb-4 bg-custom-orange text-white w-fit !px-4 !py-2 rounded-2xl">
            Amount: {fmtCurrency(data.amount)}
          </div>
          <div className="border rounded">
            <table className="w-full text-base ">
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
                    <td className="!p-2">{fmtTime(b.from)}</td>
                    <td className="!p-2">{fmtTime(b.to)}</td>
                    <td className="!p-2">{b.hours}</td>
                    <td className="!p-2">{b.rateMode}</td>
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

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCheckout } from "@/services/hooks";
import { fmtCurrency, fmtTime } from "@/lib/format";
import { useState } from "react";

export function CheckoutPanel() {
  const [ticketId, setTicketId] = useState("");
  const [force, setForce] = useState(false);
  const { mutate, data, isPending, error, reset } = useCheckout();

  const onCheckout = () => mutate({ ticketId, forceConvertToVisitor: force });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Paste/scan ticket id"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          className="!p-4 bg-white"
        />
        <label className="flex items-center text-nowrap text-white font-semibold gap-1 text-sm">
          <input
            type="checkbox"
            checked={force}
            onChange={(e) => setForce(e.target.checked)}
          />{" "}
          Force convert to visitor
        </label>
        <Button
          className="!p-4"
          onClick={onCheckout}
          disabled={!ticketId || isPending}
        >
          Checkout
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
      {data && (
        <div className="space-y-2">
          <div className="text-sm">
            Check-in: {fmtTime(data.checkinAt)} → Checkout:{" "}
            {fmtTime(data.checkoutAt)} (hrs: {data.durationHours})
          </div>
          <div className="text-sm font-medium">
            Amount: {fmtCurrency(data.amount)}
          </div>
          <div className="border rounded">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="p-2">From</th>
                  <th className="p-2">To</th>
                  <th className="p-2">Hours</th>
                  <th className="p-2">Rate Mode</th>
                  <th className="p-2">Rate</th>
                  <th className="p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.breakdown.map((b, i) => (
                  <tr key={i} className="odd:bg-muted/30">
                    <td className="p-2">{fmtTime(b.from)}</td>
                    <td className="p-2">{fmtTime(b.to)}</td>
                    <td className="p-2">{b.hours}</td>
                    <td className="p-2">{b.rateMode}</td>
                    <td className="p-2">{b.rate}</td>
                    <td className="p-2">{fmtCurrency(b.amount)}</td>
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

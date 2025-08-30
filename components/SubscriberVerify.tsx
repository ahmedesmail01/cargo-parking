"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/services/hooks";

export function SubscriberVerify({
  onVerified,
}: {
  onVerified: (subscriptionId: string) => void;
}) {
  const [subId, setSubId] = useState("");
  const { data, error, refetch, isFetching } = useSubscription(
    subId || undefined
  );

  return (
    <div className="!space-y-2  ">
      <div className="flex gap-2">
        <Input
          placeholder="Subscription ID"
          value={subId}
          onChange={(e) => setSubId(e.target.value)}
          className="!px-4 bg-white border-0"
        />
        <Button
          className="!px-4 !py-2"
          disabled={!subId}
          onClick={() => refetch()}
        >
          Verify
        </Button>
      </div>
      {isFetching && (
        <div className="text-sm  text-muted-foreground">Checking…</div>
      )}
      {error && (
        <div className="text-sm font-bold text-red-600">{String(error)}</div>
      )}
      {data && data.active ? (
        <div className="text-sm">
          <div>
            <b>User:</b> {data.userName}
          </div>
          <div>
            <b>Category:</b> {data.category}
          </div>
          <div className="!mt-2">
            <Button className="!px-4 !py-2" onClick={() => onVerified(data.id)}>
              Use this subscription
            </Button>
          </div>
        </div>
      ) : data && !data.active ? (
        <div className="text-sm font-bold text-red-600">
          Subscription inactive
        </div>
      ) : null}
    </div>
  );
}

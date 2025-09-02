"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useAdminOpenZone,
  useAdminUpdateCategory,
  useAdminCreateRush,
  useAdminCreateVacation,
} from "@/services/hooks";
import RushHoursPanel from "@/components/admin/RushHoursPanel";

export default function ControlPage() {
  const [zoneId, setZoneId] = useState("");
  const [open, setOpen] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [rateNormal, setRateNormal] = useState<string>("");
  const [rateSpecial, setRateSpecial] = useState<string>("");
  const [vacName, setVacName] = useState("");
  const [vacFrom, setVacFrom] = useState("");
  const [vacTo, setVacTo] = useState("");

  const openZone = useAdminOpenZone();
  const updCat = useAdminUpdateCategory();
  const addVac = useAdminCreateVacation();

  return (
    <main className=" !space-y-6">
      {/* Rush Hours */}
      <RushHoursPanel />

      <section className="!space-y-2">
        <h2 className="font-medium">Open/Close Zone</h2>
        <div className="flex gap-2">
          <Input
            placeholder="zone id"
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            className="!p-4"
          />
          <select
            title="Zone Status"
            aria-label="Select zone status"
            value={open ? "1" : "0"}
            onChange={(e) => setOpen(e.target.value === "1")}
          >
            <option value="1">Open</option>
            <option value="0">Close</option>
          </select>
          <Button
            onClick={() => openZone.mutate({ id: zoneId, open })}
            className="!p-4"
          >
            Apply
          </Button>
        </div>
      </section>

      <section className="!space-y-2">
        <h2 className="font-medium">Update Category Rates</h2>
        <div className="flex !gap-2">
          <Input
            placeholder="category id"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="!p-4"
          />
          <Input
            placeholder="rateNormal"
            value={rateNormal}
            onChange={(e) => setRateNormal(e.target.value)}
            className="!p-4"
          />
          <Input
            placeholder="rateSpecial"
            value={rateSpecial}
            onChange={(e) => setRateSpecial(e.target.value)}
            className="!p-4"
          />
          <Button
            onClick={() =>
              updCat.mutate({
                id: categoryId,
                rateNormal: Number(rateNormal),
                rateSpecial: Number(rateSpecial),
              })
            }
            className="!p-4"
          >
            Save
          </Button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Add Vacation</h2>
        <div className="flex gap-2">
          <Input
            placeholder="name"
            value={vacName}
            onChange={(e) => setVacName(e.target.value)}
            className="!p-4"
          />
          <Input
            type="date"
            value={vacFrom}
            onChange={(e) => setVacFrom(e.target.value)}
            className="!p-4"
          />
          <Input
            type="date"
            value={vacTo}
            onChange={(e) => setVacTo(e.target.value)}
            className="!p-4"
          />
          <Button
            onClick={() =>
              addVac.mutate({ name: vacName, from: vacFrom, to: vacTo })
            }
            className="!p-4"
          >
            Add
          </Button>
        </div>
      </section>
    </main>
  );
}

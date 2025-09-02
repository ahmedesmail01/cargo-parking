"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAdminRushHours,
  useAdminCreateRush,
  useAdminUpdateRush,
  useAdminDeleteRush,
} from "@/services/hooks";
import type { RushHour } from "@/services/types";
import { useWs } from "@/lib/ws";
import { Loader2, Pencil, Save, Trash2, X } from "lucide-react";

// ISO weekday mapping (API example uses weekDay: 1 for Monday)
const WEEKDAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 7 },
];
// If your backend is 0=Sun..6=Sat, swap to that mapping.

export default function RushHoursPanel() {
  const { data, isLoading, refetch } = useAdminRushHours();
  const createRush = useAdminCreateRush();
  const updateRush = useAdminUpdateRush();
  const deleteRush = useAdminDeleteRush();

  // live WS: refetch when admin updates targetType 'rush'
  const addAdminListener = useWs((s) => s.addAdminListener);
  useEffect(() => {
    const off = addAdminListener((evt) => {
      if (evt.targetType === "rush") refetch();
    });
    return off;
  }, [addAdminListener, refetch]);

  // form state for create
  const [newDay, setNewDay] = useState<number>(1);
  const [newFrom, setNewFrom] = useState("07:00");
  const [newTo, setNewTo] = useState("09:00");

  // inline edit state
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{
    weekDay: number;
    from: string;
    to: string;
  }>({
    weekDay: 1,
    from: "07:00",
    to: "09:00",
  });

  const rows = useMemo(
    () =>
      (data ?? [])
        .slice()
        .sort((a, b) =>
          a.weekDay === b.weekDay
            ? a.from.localeCompare(b.from)
            : a.weekDay - b.weekDay
        ),
    [data]
  );

  const startEdit = (row: RushHour) => {
    setEditing(row.id);
    setDraft({ weekDay: row.weekDay, from: row.from, to: row.to });
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const saveEdit = () => {
    if (!editing) return;
    updateRush.mutate(
      { id: editing, ...draft },
      { onSuccess: () => setEditing(null) }
    );
  };

  const remove = (id: string) => deleteRush.mutate({ id });

  const add = () =>
    createRush.mutate(
      { weekDay: newDay, from: newFrom, to: newTo },
      {
        onSuccess: () => {
          setNewFrom("07:00");
          setNewTo("09:00");
          setNewDay(1);
        },
      }
    );

  return (
    <section className="!space-y-3">
      <h2 className="text-lg font-medium">Rush Hours</h2>

      {/* Create row */}
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-sm">Weekday</label>
          <select
            aria-label="Select weekday"
            className="h-10 rounded-md border bg-background !px-4 text-sm"
            value={newDay}
            onChange={(e) => setNewDay(Number(e.target.value))}
          >
            {WEEKDAYS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm">From</label>
          <Input
            type="time"
            value={newFrom}
            onChange={(e) => setNewFrom(e.target.value)}
            className="!p-4"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm">To</label>
          <Input
            type="time"
            value={newTo}
            onChange={(e) => setNewTo(e.target.value)}
            className="!p-4"
          />
        </div>

        <Button onClick={add} disabled={createRush.isPending} className="!p-4">
          {createRush.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Add"
          )}
        </Button>
      </div>

      {/* List */}
      <div className="border rounded-lg overflow-hidden bg-white/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="!p-2">Weekday</th>
              <th className="!p-2">From</th>
              <th className="!p-2">To</th>
              <th className="!p-2 w-36">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="!p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading…
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="!p-4 text-muted-foreground">
                  No rush hours yet.
                </td>
              </tr>
            )}

            {rows.map((row) => {
              const isEdit = row.id === editing;
              return (
                <tr key={row.id} className="odd:bg-muted/30">
                  <td className="p-2">
                    {isEdit ? (
                      <select
                        aria-label="Edit weekday"
                        className="h-9 rounded-md border bg-background !px-2 text-sm"
                        value={draft.weekDay}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            weekDay: Number(e.target.value),
                          }))
                        }
                      >
                        {WEEKDAYS.map((w) => (
                          <option key={w.value} value={w.value}>
                            {w.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      WEEKDAYS.find((w) => w.value === row.weekDay)?.label ??
                      row.weekDay
                    )}
                  </td>
                  <td className="!p-2">
                    {isEdit ? (
                      <Input
                        type="time"
                        value={draft.from}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, from: e.target.value }))
                        }
                      />
                    ) : (
                      row.from
                    )}
                  </td>
                  <td className="!p-2">
                    {isEdit ? (
                      <Input
                        type="time"
                        value={draft.to}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, to: e.target.value }))
                        }
                      />
                    ) : (
                      row.to
                    )}
                  </td>
                  <td className="!p-2">
                    {isEdit ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={saveEdit}
                          disabled={updateRush.isPending}
                        >
                          <Save className="h-4 w-4 mr-1" /> Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(row)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => remove(row.id)}
                          disabled={deleteRush.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Rush hours are global and affect all categories.
      </p>
    </section>
  );
}

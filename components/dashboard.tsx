"use client";
import { useMemo } from "react";
import { useScanStore } from "@/hooks/use-scan-store";
import { exportEventsToExcel } from "@/services/export/xlsx-export";

export function Dashboard() {
  const events = useScanStore((s) => s.events);
  const fps = useScanStore((s) => s.fps);
  const decodeMs = useScanStore((s) => s.decodeMs);
  const resolution = useScanStore((s) => s.resolution);
  const summary = useScanStore((s) => s.summary());
  const resetAll = useScanStore((s) => s.resetAll);

  const latest = useMemo(() => [...events].slice(-30).reverse(), [events]);

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <section className="card">
        <div className="mb-2 flex gap-3 text-sm text-slate-300">
          <span>FPS: {fps}</span>
          <span>Decode: {decodeMs}ms</span>
          <span>Çözünürlük: {resolution}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded bg-slate-800 p-2">OK: <b className="text-ok">{summary.okCount}</b></div>
          <div className="rounded bg-slate-800 p-2">NOK: <b className="text-nok">{summary.nokCount}</b></div>
          <div className="rounded bg-slate-800 p-2">DUP: <b className="text-duplicate">{summary.duplicateCount}</b></div>
          <div className="rounded bg-slate-800 p-2">Tamamlanan Koli: <b>{summary.completedBoxes}</b></div>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="rounded bg-indigo-400 px-3 py-2 font-semibold text-black" onClick={() => exportEventsToExcel(events)}>Excel Export</button>
          <button className="rounded bg-slate-700 px-3 py-2" onClick={() => void resetAll()}>Batch Reset</button>
        </div>
      </section>

      <section className="card">
        <h2 className="mb-2 font-semibold">Canlý Log</h2>
        <ul className="max-h-[50vh] space-y-1 overflow-auto text-sm">
          {latest.map((event) => (
            <li key={event.id} className="rounded bg-slate-800 p-2">
              {new Date(event.timestamp).toLocaleTimeString("tr-TR")} | Koli {event.boxNo} | <span className={event.status === "OK" ? "text-ok" : event.status === "NOK" ? "text-nok" : "text-duplicate"}>{event.status}</span> | {event.code}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

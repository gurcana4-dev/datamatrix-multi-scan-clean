"use client";
import { useState } from "react";
import type { ScanWizardInput } from "@/types/domain";

function parseReference(input: string): Set<string> {
  return new Set(
    input
      .split(/\r?\n|,|;|\t/)
      .map((x) => x.trim())
      .filter(Boolean),
  );
}

export function Wizard({ onStart }: { onStart: (config: ScanWizardInput) => void }) {
  const [expectedCount, setExpectedCount] = useState(24);
  const [operator, setOperator] = useState("");
  const [workOrder, setWorkOrder] = useState("");
  const [referenceText, setReferenceText] = useState("");

  return (
    <section className="card space-y-3">
      <h1 className="text-xl font-semibold">DataMatrix Tarama Baþlat</h1>
      <label className="block">Koli baþýna hedef adet
        <input className="mt-1 w-full rounded bg-slate-800 p-2" type="number" min={1} value={expectedCount} onChange={(e) => setExpectedCount(Number(e.target.value))} />
      </label>
      <label className="block">Operatör
        <input className="mt-1 w-full rounded bg-slate-800 p-2" value={operator} onChange={(e) => setOperator(e.target.value)} />
      </label>
      <label className="block">Ýþ emri
        <input className="mt-1 w-full rounded bg-slate-800 p-2" value={workOrder} onChange={(e) => setWorkOrder(e.target.value)} />
      </label>
      <label className="block">Referans kod listesi (CSV/TXT satýrlarý)
        <textarea className="mt-1 h-36 w-full rounded bg-slate-800 p-2" value={referenceText} onChange={(e) => setReferenceText(e.target.value)} />
      </label>
      <button
        className="w-full rounded bg-emerald-500 p-2 font-semibold text-black"
        onClick={() => onStart({ expectedCount, operator, workOrder, referenceCodes: parseReference(referenceText) })}
      >
        Baþlat
      </button>
    </section>
  );
}

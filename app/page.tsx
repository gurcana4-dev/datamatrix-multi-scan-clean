"use client";

import { useState } from "react";
import { Dashboard } from "@/components/dashboard";
import { Wizard } from "@/components/wizard";
import { useCameraScanner } from "@/hooks/use-camera-scanner";
import { useScanStore } from "@/hooks/use-scan-store";

export default function Page() {
  const [started, setStarted] = useState(false);
  const setWizard = useScanStore((s) => s.setWizard);
  const { videoRef, canvasRef } = useCameraScanner(started);

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-4">
      {!started ? (
        <Wizard
          onStart={(config) => {
            setWizard(config);
            setStarted(true);
          }}
        />
      ) : (
        <>
          <section className="card">
            <h2 className="mb-2 font-semibold">Kamera</h2>
            <div className="relative">
              <video ref={videoRef} className="w-full rounded-lg border border-slate-600" autoPlay playsInline muted />
              <div className="pointer-events-none absolute inset-[10%] border-2 border-emerald-400/70" />
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </section>
          <Dashboard />
        </>
      )}
    </main>
  );
}

"use client";

import { create } from "zustand";
import { clearSessionData, saveEvent } from "@/services/storage/indexed-db";
import type { CodeStatus, ScanEvent, ScanWizardInput, SessionSummary } from "@/types/domain";
import { soundByStatus } from "@/services/perf/sounds";

interface ScanStore {
  wizard?: ScanWizardInput;
  events: ScanEvent[];
  boxNo: number;
  uniqueInCurrentBox: Set<string>;
  sessionUniqueCodes: Set<string>;
  fps: number;
  decodeMs: number;
  resolution: string;
  setWizard: (input: ScanWizardInput) => void;
  setPerf: (fps: number, decodeMs: number, resolution: string) => void;
  resetAll: () => Promise<void>;
  ingestCodes: (codes: string[]) => Promise<void>;
  summary: () => SessionSummary;
}

export const useScanStore = create<ScanStore>((set, get) => ({
  events: [],
  boxNo: 1,
  uniqueInCurrentBox: new Set<string>(),
  sessionUniqueCodes: new Set<string>(),
  fps: 0,
  decodeMs: 0,
  resolution: "-",

  setWizard: (input) => set({ wizard: input }),
  setPerf: (fps, decodeMs, resolution) => set({ fps, decodeMs, resolution }),

  resetAll: async () => {
    await clearSessionData();
    set({ events: [], boxNo: 1, uniqueInCurrentBox: new Set(), sessionUniqueCodes: new Set() });
  },

  ingestCodes: async (codes) => {
    const state = get();
    if (!state.wizard) return;

    const newEvents: ScanEvent[] = [];
    let nextBoxNo = state.boxNo;
    const currentBoxCodes = new Set(state.uniqueInCurrentBox);
    const globalCodes = new Set(state.sessionUniqueCodes);

    for (const code of codes) {
      let status: CodeStatus;
      if (currentBoxCodes.has(code) || globalCodes.has(code)) {
        status = "DUPLICATE";
      } else if (state.wizard.referenceCodes.has(code)) {
        status = "OK";
      } else {
        status = "NOK";
      }

      if (status !== "DUPLICATE") {
        currentBoxCodes.add(code);
        globalCodes.add(code);
      }

      soundByStatus[status]?.();

      const event: ScanEvent = {
        id: crypto.randomUUID(),
        boxNo: nextBoxNo,
        code,
        status,
        timestamp: Date.now(),
      };
      newEvents.push(event);
      await saveEvent(event);

      if (currentBoxCodes.size >= state.wizard.expectedCount) {
        nextBoxNo += 1;
        currentBoxCodes.clear();
      }
    }

    set({
      events: [...state.events, ...newEvents],
      boxNo: nextBoxNo,
      uniqueInCurrentBox: currentBoxCodes,
      sessionUniqueCodes: globalCodes,
    });
  },

  summary: () => {
    const { events, boxNo, uniqueInCurrentBox } = get();
    return {
      okCount: events.filter((e) => e.status === "OK").length,
      nokCount: events.filter((e) => e.status === "NOK").length,
      duplicateCount: events.filter((e) => e.status === "DUPLICATE").length,
      completedBoxes: Math.max(0, boxNo - 1),
      currentBoxUnique: uniqueInCurrentBox.size,
    };
  },
}));

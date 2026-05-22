import Dexie, { type Table } from "dexie";
import type { ScanEvent } from "@/types/domain";

class ScanDatabase extends Dexie {
  events!: Table<ScanEvent, string>;

  constructor() {
    super("datamatrix-scanner-db");
    this.version(1).stores({
      events: "id, boxNo, code, status, timestamp",
    });
  }
}

export const db = new ScanDatabase();

export async function saveEvent(event: ScanEvent): Promise<void> {
  await db.events.put(event);
}

export async function loadAllEvents(): Promise<ScanEvent[]> {
  return db.events.orderBy("timestamp").toArray();
}

export async function clearSessionData(): Promise<void> {
  await db.events.clear();
}

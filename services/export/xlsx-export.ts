import * as XLSX from "xlsx";
import type { ScanEvent } from "@/types/domain";

export function exportEventsToExcel(events: ScanEvent[], fileName = "scan-results.xlsx"): void {
  const rows = events.map((event) => {
    const date = new Date(event.timestamp);
    return {
      "Koli No": event.boxNo,
      "DataMatrix Kodu": event.code,
      Status: event.status,
      Tarih: date.toLocaleDateString("tr-TR"),
      Saat: date.toLocaleTimeString("tr-TR"),
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sonuclar");
  XLSX.writeFile(wb, fileName, { compression: true });
}

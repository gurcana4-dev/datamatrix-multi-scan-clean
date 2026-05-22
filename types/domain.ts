export type CodeStatus = "OK" | "NOK" | "DUPLICATE";

export interface ScanWizardInput {
  expectedCount: number;
  operator: string;
  workOrder: string;
  referenceCodes: Set<string>;
}

export interface ScanEvent {
  id: string;
  boxNo: number;
  code: string;
  status: CodeStatus;
  timestamp: number;
}

export interface SessionSummary {
  okCount: number;
  nokCount: number;
  duplicateCount: number;
  completedBoxes: number;
  currentBoxUnique: number;
}

export interface DecodedItem {
  text: string;
  corners?: Array<{ x: number; y: number }>;
}

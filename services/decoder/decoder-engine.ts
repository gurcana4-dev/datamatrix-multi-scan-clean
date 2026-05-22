import type { DecodedItem } from "@/types/domain";

export interface DecodeResponse {
  ok: boolean;
  results: DecodedItem[];
  decodeMs: number;
}

export class DecoderEngine {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(new URL("../../workers/decode.worker.ts", import.meta.url));
  }

  decode(imageData: ImageData): Promise<DecodeResponse> {
    return new Promise((resolve) => {
      this.worker.onmessage = (event: MessageEvent<DecodeResponse>) => resolve(event.data);
      this.worker.postMessage({ imageData });
    });
  }

  dispose(): void {
    this.worker.terminate();
  }
}

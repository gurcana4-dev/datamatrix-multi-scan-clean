/// <reference lib="webworker" />

import { prepareZXingModule, readBarcodes, ZXING_WASM_SHA256 } from "@sec-ant/zxing-wasm";
import { BarcodeFormat, DecodeHintType, MultiFormatReader, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } from "@zxing/library";
import jsQR from "jsqr";
import type { DecodedItem } from "@/types/domain";

let initialized = false;
const jsReader = new MultiFormatReader();

async function init() {
  if (initialized) return;
  await prepareZXingModule({
    overrides: {
      locateFile: (path, prefix) => `${prefix}${path}`,
    },
    fireImmediately: true,
    integrity: {
      "zxing_reader.wasm": ZXING_WASM_SHA256,
    },
  });
  initialized = true;
  jsReader.setHints(
    new Map([
      [DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX]],
      [DecodeHintType.TRY_HARDER, true],
    ]),
  );
}

function decodeWithJsLibrary(imageData: ImageData): DecodedItem[] {
  const source = new RGBLuminanceSource(imageData.data, imageData.width, imageData.height);
  const bitmap = new BinaryBitmap(new HybridBinarizer(source));
  try {
    const result = jsReader.decode(bitmap);
    return result ? [{ text: result.getText() }] : [];
  } catch {
    return [];
  }
}

self.onmessage = async (evt: MessageEvent<{ imageData: ImageData }>) => {
  const t0 = performance.now();
  try {
    await init();
    const { imageData } = evt.data;
    const found = await readBarcodes(imageData, {
      formats: ["DataMatrix"],
      tryHarder: true,
      maxNumberOfSymbols: 64,
    });

    const results: DecodedItem[] = found.map((item) => ({
      text: item.text,
      corners: item.position?.map((p) => ({ x: p.x, y: p.y })),
    }));

    (self as DedicatedWorkerGlobalScope).postMessage({
      ok: true,
      results,
      decodeMs: performance.now() - t0,
    });
  } catch {
    const fallback = decodeWithJsLibrary(evt.data.imageData);
    if (fallback.length > 0) {
      (self as DedicatedWorkerGlobalScope).postMessage({ ok: true, results: fallback, decodeMs: performance.now() - t0 });
      return;
    }

    const qr = jsQR(evt.data.imageData.data, evt.data.imageData.width, evt.data.imageData.height);
    const jsQrResult = qr?.data ? [{ text: qr.data }] : [];
    (self as DedicatedWorkerGlobalScope).postMessage({ ok: jsQrResult.length > 0, results: jsQrResult, decodeMs: performance.now() - t0 });
  }
};

/// <reference lib="webworker" />

import {
  BarcodeFormat,
  DecodeHintType,
  MultiFormatReader,
  RGBLuminanceSource,
  BinaryBitmap,
  HybridBinarizer,
} from "@zxing/library";
import jsQR from "jsqr";
import type { DecodedItem } from "@/types/domain";

const jsReader = new MultiFormatReader();
jsReader.setHints(
  new Map([
    [DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX]],
    [DecodeHintType.TRY_HARDER, true],
  ]),
);

function decodeWithZxingJs(imageData: ImageData): DecodedItem[] {
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

  const zxingResults = decodeWithZxingJs(evt.data.imageData);
  if (zxingResults.length > 0) {
    (self as DedicatedWorkerGlobalScope).postMessage({
      ok: true,
      results: zxingResults,
      decodeMs: performance.now() - t0,
    });
    return;
  }

  const qr = jsQR(
    evt.data.imageData.data,
    evt.data.imageData.width,
    evt.data.imageData.height,
  );
  const jsQrResult = qr?.data ? [{ text: qr.data }] : [];
  (self as DedicatedWorkerGlobalScope).postMessage({
    ok: jsQrResult.length > 0,
    results: jsQrResult,
    decodeMs: performance.now() - t0,
  });
};

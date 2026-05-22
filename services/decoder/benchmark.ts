export interface EngineBenchmarkResult {
  engine: "ZXING_WASM" | "ZXING_JS" | "JSQR";
  avgDecodeMs: number;
}

export function chooseBestEngine(results: EngineBenchmarkResult[]): EngineBenchmarkResult | undefined {
  return [...results].sort((a, b) => a.avgDecodeMs - b.avgDecodeMs)[0];
}

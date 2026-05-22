"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DecoderEngine } from "@/services/decoder/decoder-engine";
import { startOptimizedCamera, type CameraControl } from "@/services/camera/camera-engine";
import { useScanStore } from "@/hooks/use-scan-store";
export function useCameraScanner(enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [torch, setTorch] = useState(false);
  const [zoom, setZoom] = useState(1);
  const decoder = useMemo(() => new DecoderEngine(), []);
  const setPerf = useScanStore((s) => s.setPerf);
  const ingestCodes = useScanStore((s) => s.ingestCodes);

  useEffect(() => {
    if (!enabled || !videoRef.current || !canvasRef.current) return;

    let camera: CameraControl | undefined;
    let rafId = 0;
    let running = true;
    let frameCount = 0;
    const frameSkip = 1;
    let fpsTick = performance.now();

    const run = async () => {
      camera = await startOptimizedCamera(videoRef.current!);

      const scan = async () => {
        if (!running || !videoRef.current || !canvasRef.current) return;

        frameCount += 1;
        const now = performance.now();

        if (frameCount % (frameSkip + 1) === 0) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const res = await decoder.decode(imageData);
            if (res.results.length > 0) {
              const unique = Array.from(new Set(res.results.map((i) => i.text)));
              await ingestCodes(unique);
            }

            const elapsed = now - fpsTick;
            if (elapsed >= 1000) {
              const fps = Math.round((frameCount * 1000) / elapsed);
              setPerf(fps, Math.round(res.decodeMs), `${canvas.width}x${canvas.height}`);
              frameCount = 0;
              fpsTick = now;
            }
          }
        }

        rafId = requestAnimationFrame(scan);
      };

      rafId = requestAnimationFrame(scan);
    };

    run();

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      camera?.stop();
      decoder.dispose();
    };
  }, [decoder, enabled, ingestCodes, setPerf]);

  return {
    videoRef,
    canvasRef,
    torch,
    zoom,
    setTorch,
    setZoom,
  };
}

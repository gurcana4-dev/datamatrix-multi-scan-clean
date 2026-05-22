export interface CameraControl {
  stop: () => void;
  setZoom: (value: number) => Promise<void>;
  setTorch: (enabled: boolean) => Promise<void>;
  stream: MediaStream;
}

export async function startOptimizedCamera(video: HTMLVideoElement): Promise<CameraControl> {
  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 3840 },
      height: { ideal: 2160 },
      frameRate: { ideal: 60, max: 60 },
      focusMode: "continuous" as ConstrainDOMString,
    },
    audio: false,
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
  await video.play();

  const [track] = stream.getVideoTracks();

  return {
    stream,
    stop: () => stream.getTracks().forEach((t) => t.stop()),
    setZoom: async (value) => {
      const capabilities = track.getCapabilities() as MediaTrackCapabilities & { zoom?: { min: number; max: number } };
      if (!capabilities.zoom) return;
      await track.applyConstraints({ advanced: [{ zoom: Math.min(capabilities.zoom.max, Math.max(capabilities.zoom.min, value)) }] });
    },
    setTorch: async (enabled) => {
      const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
      if (!capabilities.torch) return;
      await track.applyConstraints({ advanced: [{ torch: enabled }] });
    },
  };
}

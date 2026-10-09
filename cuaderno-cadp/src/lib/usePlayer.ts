import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./theme";

/** Cada simulador genera una lista de pasos ("frames"); este hook los reproduce. */
export interface BaseFrame {
  line: number;
  msg: string;
  kind?: "ok" | "err";
}

export function usePlayer<F extends BaseFrame>(initial: F[]) {
  const [frames, setFrames] = useState<F[]>(initial);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const len = useRef(initial.length);
  len.current = frames.length;

  const go = useCallback((n: number) => setI(Math.max(0, Math.min(len.current - 1, n))), []);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setI((x) => {
        if (x >= len.current - 1) {
          setPlaying(false);
          return x;
        }
        return x + 1;
      });
    }, speed);
    return () => clearInterval(t);
  }, [playing, speed]);

  const load = useCallback((f: F[], autoplay = false) => {
    setFrames(f);
    setI(0);
    setPlaying(autoplay && f.length > 1 && !prefersReducedMotion());
  }, []);

  const toggle = () => {
    if (playing) return setPlaying(false);
    if (i >= frames.length - 1) setI(0);
    setPlaying(true);
  };

  return {
    frame: frames[Math.min(i, frames.length - 1)],
    i,
    total: frames.length,
    playing,
    speed,
    setSpeed,
    load,
    toggle,
    first: () => { setPlaying(false); go(0); },
    prev: () => { setPlaying(false); go(i - 1); },
    next: () => { setPlaying(false); go(i + 1); },
  };
}
export type PlayerApi = ReturnType<typeof usePlayer>;

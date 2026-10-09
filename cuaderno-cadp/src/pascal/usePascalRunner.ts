import { useCallback, useEffect, useRef, useState } from "react";
import type { Request, Response, Segment } from "./run";

export type RunStatus = "idle" | "running" | "input" | "done" | "error" | "compile" | "stopped";
export interface RunState {
  status: RunStatus;
  segments: Segment[];
  error?: { line: number; col?: number; msg: string };
  ms?: number;
  heap?: { bytes: number; blocks: number };
}

const TIMEOUT_MS = 10_000;

/**
 * Ejecuta programas en un Web Worker para no congelar la página.
 * Cuando el programa pide datos, se vuelve a ejecutar desde el principio con
 * todas las líneas ingresadas hasta el momento (los programas son deterministas).
 */
export function usePascalRunner() {
  const [state, setState] = useState<RunState>({ status: "idle", segments: [] });
  const worker = useRef<Worker | null>(null);
  const req = useRef<Request | null>(null);
  const seq = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const spawn = useCallback(() => {
    worker.current?.terminate();
    const w = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    w.onmessage = (ev: MessageEvent<Response>) => {
      const r = ev.data;
      if (r.id !== seq.current) return;
      clearTimeout(timer.current);
      if (r.kind === "compile") setState({ status: "compile", segments: [], error: r.error });
      else setState({ status: r.status, segments: r.segments, error: r.error, ms: r.ms, heap: r.heap });
    };
    worker.current = w;
    return w;
  }, []);

  useEffect(() => {
    spawn();
    return () => { worker.current?.terminate(); clearTimeout(timer.current); };
  }, [spawn]);

  const send = useCallback((r: Request) => {
    req.current = r;
    setState((s) => ({ ...s, status: "running" }));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      spawn();
      setState((s) => ({ ...s, status: "error", error: { line: 0, msg: "El programa tardó demasiado y se detuvo. ¿Hay un bucle infinito?" } }));
    }, TIMEOUT_MS);
    (worker.current ?? spawn()).postMessage(r);
  }, [spawn]);

  const run = useCallback((code: string) => {
    send({ id: ++seq.current, code, inputs: [], seed: (Math.random() * 2 ** 31) | 0 });
  }, [send]);

  const input = useCallback((line: string) => {
    const r = req.current;
    if (!r) return;
    send({ ...r, id: ++seq.current, inputs: [...r.inputs, line] });
  }, [send]);

  const stop = useCallback(() => {
    clearTimeout(timer.current);
    seq.current++;
    spawn();
    setState((s) => ({ ...s, status: "stopped" }));
  }, [spawn]);

  return { state, run, input, stop };
}

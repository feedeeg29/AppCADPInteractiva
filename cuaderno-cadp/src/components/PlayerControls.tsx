import { useEffect } from "react";
import type { BaseFrame } from "../lib/usePlayer";

interface Api {
  i: number;
  total: number;
  playing: boolean;
  speed: number;
  setSpeed: (n: number) => void;
  toggle: () => void;
  first: () => void;
  prev: () => void;
  next: () => void;
  frame: BaseFrame;
}

/** Botones del reproductor + atajos: ← → para moverse, espacio para reproducir. */
export function PlayerControls({ p }: { p: Api }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, select, textarea, summary")) return;
      // Sobre un botón, el espacio lo activa: no lo interceptamos
      if (e.key === " " && t.closest("button, a")) return;
      if (e.key === "ArrowRight") { e.preventDefault(); p.next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); p.prev(); }
      else if (e.key === " ") { e.preventDefault(); p.toggle(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [p]);

  return (
    <div className="player">
      <div className="player-bar" aria-hidden="true">
        <i style={{ width: `${p.total > 1 ? (p.i / (p.total - 1)) * 100 : 100}%` }} />
      </div>
      <div className="player-row">
        <button className="btn icon" type="button" onClick={p.first} aria-label="Volver al principio">⏮</button>
        <button className="btn" type="button" onClick={p.prev} disabled={p.i === 0}>◀ Anterior</button>
        <button className="btn pri" type="button" onClick={p.toggle}>{p.playing ? "❚❚ Pausa" : "▶ Reproducir"}</button>
        <button className="btn" type="button" onClick={p.next} disabled={p.i >= p.total - 1}>Siguiente ▶</button>
        <select aria-label="Velocidad" value={p.speed} onChange={(e) => p.setSpeed(+e.target.value)}>
          <option value={1500}>Lenta</option>
          <option value={900}>Normal</option>
          <option value={400}>Rápida</option>
        </select>
        <span className="pos">paso {p.i + 1} de {p.total}</span>
      </div>
      <p className="kbd-hint">Atajos: <kbd>←</kbd> <kbd>→</kbd> para moverte, <kbd>espacio</kbd> para reproducir.</p>
    </div>
  );
}

export function Msg({ frame }: { frame: BaseFrame }) {
  return (
    <div className={"msg" + (frame.kind === "err" ? " err" : frame.kind === "ok" ? " good" : "")} role="status">
      {frame.msg}
    </div>
  );
}

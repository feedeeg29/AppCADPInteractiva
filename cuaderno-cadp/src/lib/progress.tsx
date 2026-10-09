import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Tema } from "../data/types";

/** Progreso de un tema, guardado en el navegador de cada persona. */
export interface ProgresoTema {
  teoria: boolean;
  best: number;
  tries: number;
  ej: Record<string, boolean>;
}
export interface Progreso {
  t: Record<string, ProgresoTema>;
  last: string | null;
  mix: number;
}

const KEY = "cadp-progreso-v1";
const vacio = (): Progreso => ({ t: {}, last: null, mix: 0 });
const temaVacio = (): ProgresoTema => ({ teoria: false, best: 0, tries: 0, ej: {} });

function cargar(): Progreso {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...vacio(), ...JSON.parse(raw) };
  } catch {
    /* almacenamiento bloqueado: se arranca de cero */
  }
  return vacio();
}

interface ProgressValue {
  progreso: Progreso;
  de: (id: string) => ProgresoTema;
  toggleTeoria: (id: string) => void;
  registrarQuiz: (id: string, correctas: number) => void;
  toggleEjercicio: (id: string, i: number) => void;
  registrarMix: (correctas: number) => void;
  visitar: (id: string) => void;
  reiniciar: () => void;
}
const Ctx = createContext<ProgressValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progreso, setProgreso] = useState<Progreso>(cargar);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progreso));
    } catch {
      /* sin almacenamiento: el progreso vive solo en esta pestaña */
    }
  }, [progreso]);

  // Mantener sincronizadas varias pestañas abiertas
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setProgreso(cargar());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const de = useCallback((id: string) => progreso.t[id] ?? temaVacio(), [progreso]);

  const update = (id: string, fn: (t: ProgresoTema) => ProgresoTema) =>
    setProgreso((p) => ({ ...p, t: { ...p.t, [id]: fn(p.t[id] ?? temaVacio()) } }));

  const value: ProgressValue = {
    progreso,
    de,
    toggleTeoria: (id) => update(id, (t) => ({ ...t, teoria: !t.teoria })),
    registrarQuiz: (id, n) => update(id, (t) => ({ ...t, tries: t.tries + 1, best: Math.max(t.best, n) })),
    toggleEjercicio: (id, i) =>
      update(id, (t) => {
        const ej = { ...t.ej };
        if (ej[i]) delete ej[i];
        else ej[i] = true;
        return { ...t, ej };
      }),
    registrarMix: (n) => setProgreso((p) => ({ ...p, mix: Math.max(p.mix, n) })),
    visitar: (id) => setProgreso((p) => (p.last === id ? p : { ...p, last: id })),
    reiniciar: () => setProgreso(vacio()),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useProgress fuera de ProgressProvider");
  return v;
}

export function ejerciciosHechos(t: Tema, p: ProgresoTema) {
  return t.ejercicios.filter((_, i) => p.ej[i]).length;
}

/** Porcentaje del tema: teoría, quiz y ejercicios pesan lo mismo. */
export function porcentaje(t: Tema, p: ProgresoTema) {
  const parts = (p.teoria ? 1 : 0) + p.best / t.quiz.length + ejerciciosHechos(t, p) / t.ejercicios.length;
  return Math.round((parts / 3) * 100);
}

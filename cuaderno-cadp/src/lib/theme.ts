import { useEffect, useState } from "react";

export type Modo = "system" | "light" | "dark";
const KEY = "cadp-tema";

export function useTheme() {
  const [modo, setModo] = useState<Modo>(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === "light" || v === "dark") return v;
    } catch {
      /* ignorar */
    }
    return "system";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (modo === "system") delete root.dataset.theme;
    else root.dataset.theme = modo;
    try {
      if (modo === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, modo);
    } catch {
      /* ignorar */
    }
  }, [modo]);

  const siguiente = () => setModo((m) => (m === "system" ? "light" : m === "light" ? "dark" : "system"));
  return { modo, siguiente };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

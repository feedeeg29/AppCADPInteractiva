import { useEffect, useState, type ReactNode } from "react";
import { TEMAS } from "../data/temas";
import { porcentaje, useProgress } from "../lib/progress";
import { Link, useSegments } from "../lib/router";
import { useTheme } from "../lib/theme";

function useGlobalPct() {
  const { de } = useProgress();
  return Math.round(TEMAS.reduce((a, t) => a + porcentaje(t, de(t.id)), 0) / TEMAS.length);
}

const svg = (d: JSX.Element) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const ICONO_TEMA = {
  system: svg(<><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" /></>),
  light: svg(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>),
  dark: svg(<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />),
};
const NOMBRE_TEMA = { system: "Tema: automático", light: "Tema: claro", dark: "Tema: oscuro" } as const;

export function Layout({ children }: { children: ReactNode }) {
  const seg = useSegments();
  const [abierto, setAbierto] = useState(false);
  const pct = useGlobalPct();
  const { modo, siguiente } = useTheme();

  // Cerrar el menú al navegar
  useEffect(() => setAbierto(false), [seg.join("/")]);
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto]);

  return (
    <>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <header className="top">
        <div className="top-in">
          <button className="menu-btn" type="button" aria-expanded={abierto} aria-controls="side" onClick={() => setAbierto((v) => !v)}>
            <span aria-hidden="true">☰</span><span className="sr">Prácticas</span>
          </button>
          <Link to="/" className="brand" aria-label="Cuaderno CADP, inicio">
            <b>Cuaderno CADP<span className="cursor" aria-hidden="true" /></b>
            <span className="brand-sub">Conceptos de Algoritmos, Datos y Programas</span>
          </Link>
          <div className="gbar" title="Progreso total">
            <span>{pct}%</span>
            <div className="meter" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
          </div>
          <button className="btn icon theme" type="button" onClick={siguiente} aria-label={NOMBRE_TEMA[modo]} title={NOMBRE_TEMA[modo]}>
            {ICONO_TEMA[modo]}
          </button>
        </div>
      </header>
      <div className="wrap">
        <Sidebar abierto={abierto} actual={seg[0]} />
        {abierto && <div className="scrim" onClick={() => setAbierto(false)} aria-hidden="true" />}
        <main id="contenido" tabIndex={-1}>{children}</main>
      </div>
      <Footer />
    </>
  );
}

function Sidebar({ abierto, actual }: { abierto: boolean; actual?: string }) {
  const { de } = useProgress();
  return (
    <nav id="side" className={"side" + (abierto ? " open" : "")} aria-label="Prácticas">
      <Link to="/" className={"nav home" + (!actual ? " cur" : "")} aria-current={!actual ? "page" : undefined}>
        <span className="n">⌂</span><span className="t">Inicio</span>
      </Link>
      <div className="lbl">Prácticas</div>
      {TEMAS.map((t) => {
        const pct = porcentaje(t, de(t.id));
        const cur = actual === t.id;
        return (
          <Link key={t.id} to={`/${t.id}`} className={"nav" + (cur ? " cur" : "")} aria-current={cur ? "page" : undefined}>
            <span className="n">{t.num}</span>
            <span className="t">{t.titulo}</span>
            <span className="p" aria-label={`${pct}% completado`}><i style={{ width: `${pct}%` }} /></span>
          </Link>
        );
      })}
      <div className="lbl">Para el parcial</div>
      <Link to="/parciales" className={"nav" + (actual === "parciales" ? " cur" : "")} aria-current={actual === "parciales" ? "page" : undefined}>
        <span className="n">✎</span><span className="t">Parciales resueltos</span>
      </Link>
      <div className="lbl">Herramientas</div>
      <Link to="/compilador" className={"nav" + (actual === "compilador" ? " cur" : "")} aria-current={actual === "compilador" ? "page" : undefined}>
        <span className="n">▶</span><span className="t">Compilador</span>
      </Link>
      <Link to="/mezcla" className={"nav" + (actual === "mezcla" ? " cur" : "")} aria-current={actual === "mezcla" ? "page" : undefined}>
        <span className="n">?</span><span className="t">Quiz mezclado</span>
      </Link>
    </nav>
  );
}

function Footer() {
  const { reiniciar } = useProgress();
  const [confirmar, setConfirmar] = useState(false);
  return (
    <footer className="foot">
      <div className="foot-in">
        <p>Hecho para estudiar CADP con las prácticas de la cursada 2026 de la Facultad de Informática (UNLP). Tu progreso se guarda solo en este navegador.</p>
        {confirmar ? (
          <div className="row">
            <span>¿Borrar todo tu progreso?</span>
            <button className="btn danger" type="button" onClick={() => { reiniciar(); setConfirmar(false); }}>Sí, borrar</button>
            <button className="btn" type="button" onClick={() => setConfirmar(false)}>Cancelar</button>
          </div>
        ) : (
          <button className="btn ghost" type="button" onClick={() => setConfirmar(true)}>Reiniciar progreso</button>
        )}
      </div>
    </footer>
  );
}

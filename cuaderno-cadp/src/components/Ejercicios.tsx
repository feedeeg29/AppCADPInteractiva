import { useMemo, useState } from "react";
import type { Tema } from "../data/types";
import { useProgress } from "../lib/progress";
import { CodeBlock } from "./CodeBlock";

export function Ejercicios({ tema }: { tema: Pick<Tema, "id" | "ejercicios"> }) {
  const { de, toggleEjercicio } = useProgress();
  const p = de(tema.id);
  const [pendientes, setPendientes] = useState(false);

  // Agrupar por parte de la práctica, respetando el orden
  const grupos = useMemo(() => {
    const g: { nombre: string; items: Tema["ejercicios"] }[] = [];
    for (const e of tema.ejercicios) {
      const nombre = e.grupo ?? "";
      const ult = g[g.length - 1];
      if (ult && ult.nombre === nombre) ult.items.push(e);
      else g.push({ nombre, items: [e] });
    }
    return g;
  }, [tema]);

  const hechos = tema.ejercicios.filter((e) => p.ej[e.ref]).length;

  return (
    <div className="elist">
      <p className="lead-s">Intentá resolver cada uno en papel antes de abrir la solución. Las soluciones son una forma posible: si la tuya es distinta, puede estar igual de bien. Con <b>▶ Probar</b> abrís la solución en el compilador.</p>
      <div className="ej-bar">
        <span>{hechos} de {tema.ejercicios.length} resueltos</span>
        <label className="chk">
          <input id={`pend-${tema.id}`} type="checkbox" checked={pendientes} onChange={(e) => setPendientes(e.target.checked)} />
          Mostrar solo los pendientes
        </label>
      </div>
      {grupos.length > 1 && (
        <nav className="ej-index" aria-label="Partes de la práctica">
          {grupos.map((g, i) => (
            <a key={i} href={`#grupo-${tema.id}-${i}`}>
              {g.nombre} <span>{g.items.filter((e) => p.ej[e.ref]).length}/{g.items.length}</span>
            </a>
          ))}
        </nav>
      )}
      {grupos.map((g, gi) => (
        <section key={gi} className="ej-grupo" id={`grupo-${tema.id}-${gi}`}>
          {g.nombre && <h2 className="ej-grupo-h">{g.nombre}</h2>}
          {g.items.filter((e) => !pendientes || !p.ej[e.ref]).map((e) => {
            const hecho = !!p.ej[e.ref];
            const id = e.ref.replace(/[^A-Za-z0-9]+/g, "-");
            return (
              <article key={e.ref} className={"ex" + (hecho ? " done" : "")}>
                <div className="eh">
                  <span className="ref">{e.ref}</span>
                  <h3>{e.titulo}</h3>
                  <label className="chk">
                    <input id={`ej-${tema.id}-${id}`} type="checkbox" checked={hecho} onChange={() => toggleEjercicio(tema.id, e.ref)} />
                    Lo resolví
                  </label>
                </div>
                <p className="enun">{e.enunciado}</p>
                <details>
                  <summary>Ver pista</summary>
                  <div className="pista">{e.pista}</div>
                </details>
                <details>
                  <summary>Ver solución</summary>
                  <CodeBlock code={e.sol} title="solución" />
                  {e.entrada && (
                    <div className="entrada">
                      <b>Datos para probar en el compilador</b> (escribí cada renglón y apretá Enter):
                      <pre>{e.entrada}</pre>
                    </div>
                  )}
                </details>
              </article>
            );
          })}
        </section>
      ))}
    </div>
  );
}

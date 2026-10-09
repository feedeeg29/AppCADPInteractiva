import type { Tema } from "../data/types";
import { useProgress } from "../lib/progress";
import { CodeBlock } from "./CodeBlock";

export function Ejercicios({ tema }: { tema: Tema }) {
  const { de, toggleEjercicio } = useProgress();
  const p = de(tema.id);
  return (
    <div className="elist">
      <p className="lead-s">Intentá resolver cada uno en papel antes de abrir la solución. Las soluciones son una forma posible: si la tuya es distinta, puede estar igual de bien.</p>
      {tema.ejercicios.map((e, i) => {
        const hecho = !!p.ej[i];
        return (
          <article key={i} className={"ex" + (hecho ? " done" : "")}>
            <div className="eh">
              <span className="ref">{e.ref}</span>
              <h3>{e.titulo}</h3>
              <label className="chk">
                <input id={`ej-${tema.id}-${i}`} type="checkbox" checked={hecho} onChange={() => toggleEjercicio(tema.id, i)} />
                Lo resolví
              </label>
            </div>
            <p>{e.enunciado}</p>
            <details>
              <summary>Ver pista</summary>
              <div className="pista">{e.pista}</div>
            </details>
            <details>
              <summary>Ver solución</summary>
              <CodeBlock code={e.sol} title="solución" />
            </details>
          </article>
        );
      })}
    </div>
  );
}

import { useState } from "react";
import type { Pregunta } from "../data/types";
import { CodeBlock } from "./CodeBlock";

const LETRAS = "ABCD";

interface Props {
  preguntas: (Pregunta & { tema?: string })[];
  onTerminar: (correctas: number) => void;
  onReiniciar?: () => void;
}

export function Quiz({ preguntas, onTerminar, onReiniciar }: Props) {
  const [resp, setResp] = useState<(number | null)[]>(() => preguntas.map(() => null));
  const respondidas = resp.filter((r) => r !== null).length;
  const correctas = resp.filter((r, k) => r === preguntas[k].ok).length;
  const fin = respondidas === preguntas.length;

  const elegir = (i: number, j: number) => {
    if (resp[i] !== null) return;
    const nuevo = resp.slice();
    nuevo[i] = j;
    setResp(nuevo);
    if (nuevo.every((r) => r !== null)) onTerminar(nuevo.filter((r, k) => r === preguntas[k].ok).length);
  };
  const reiniciar = () => {
    setResp(preguntas.map(() => null));
    onReiniciar?.();
  };

  return (
    <div className="quiz">
      <div className="quiz-head">
        <div className="quiz-meter" aria-hidden="true"><i style={{ width: `${(respondidas / preguntas.length) * 100}%` }} /></div>
        <span>{respondidas} de {preguntas.length} respondidas · {correctas} correctas</span>
      </div>
      {preguntas.map((q, i) => {
        const r = resp[i];
        return (
          <section className="q" key={i} aria-labelledby={`q${i}-t`}>
            <div className="qh">
              <span className="qn">{String(i + 1).padStart(2, "0")}</span>
              <div className="qt" id={`q${i}-t`}>
                <span dangerouslySetInnerHTML={{ __html: q.q }} />
                {q.tema && <span className="ref inline">{q.tema}</span>}
              </div>
            </div>
            {q.code && <CodeBlock code={q.code} copy={false} />}
            <div className="opts">
              {q.ops.map((o, j) => {
                const cls = r === null ? "" : j === q.ok ? " right" : j === r ? " wrong" : " dim";
                return (
                  <button key={j} type="button" className={"opt" + cls} disabled={r !== null} onClick={() => elegir(i, j)}>
                    <span className="l">{LETRAS[j]}</span>
                    <span dangerouslySetInnerHTML={{ __html: o }} />
                  </button>
                );
              })}
            </div>
            {r !== null && (
              <div className={"exp" + (r === q.ok ? "" : " no")}>
                <b>{r === q.ok ? "Correcto." : "No es esa."}</b> {q.exp}
              </div>
            )}
          </section>
        );
      })}
      <div className="score">
        <div className="big">{correctas}/{preguntas.length}</div>
        <div>
          {fin
            ? correctas === preguntas.length ? "Perfecto. Este tema está dominado."
              : correctas >= preguntas.length * 0.7 ? "Bien. Repasá las que fallaste."
              : "Conviene volver a la teoría y reintentar."
            : `Respondé todas las preguntas para ver tu resultado.`}
        </div>
        <button className="btn" type="button" onClick={reiniciar}>Reiniciar quiz</button>
      </div>
    </div>
  );
}

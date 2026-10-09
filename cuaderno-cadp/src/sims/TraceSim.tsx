import { useEffect, useState } from "react";
import { CodeBlock } from "../components/CodeBlock";
import { Msg, PlayerControls } from "../components/PlayerControls";
import { usePlayer } from "../lib/usePlayer";
import type { Programa, TraceFrame } from "./traces";

export function TraceSim({ programas }: { programas: Programa[] }) {
  const [sel, setSel] = useState(programas[0]);
  const [input, setInput] = useState(sel.def);
  const [n, setN] = useState(() => sel.gen(sel.def).n);
  const player = usePlayer<TraceFrame>(sel.gen(sel.def).frames);
  const f = player.frame;

  const ejecutar = (p: Programa, txt: string, auto: boolean) => {
    const r = p.gen(txt);
    setN(r.n);
    player.load(r.frames, auto);
  };
  // Al cambiar de programa se carga su ejemplo
  useEffect(() => {
    setInput(sel.def);
    ejecutar(sel, sel.def, false);
  }, [sel]);

  return (
    <>
      <p className="lead-s">Una prueba de escritorio automática. Elegí un programa, cambiá los datos de entrada y avanzá línea por línea mirando cómo cambian las variables.</p>
      {programas.length > 1 && <div className="seg" role="group" aria-label="Programa">
        {programas.map((p) => (
          <button key={p.id} type="button" className="btn" aria-pressed={p.id === sel.id} onClick={() => setSel(p)}>
            {p.nombre}
          </button>
        ))}
      </div>}
      <div className="sim">
        <div className="stage">
          <form className="controls" onSubmit={(e) => { e.preventDefault(); ejecutar(sel, input, true); }}>
            <label className="field grow">
              <span>{sel.label}</span>
              <input id={`trace-in-${sel.id}`} type="text" value={input} onChange={(e) => setInput(e.target.value)} />
            </label>
            <button className="btn pri" type="submit">Ejecutar</button>
          </form>
          <div className="tokens" aria-label="Datos de entrada">
            {f.tokens.map((t, k) => (
              <span key={k} className={k === f.pos ? "cur" : k < f.pos ? "done" : ""}>{t}</span>
            ))}
          </div>
          <div className="frames">
            {f.fr.map((m) => (
              <div className="frame" key={m.name}>
                <h4>{m.name}</h4>
                <table>
                  <tbody>
                    {Object.entries(m.vars).map(([k, v]) => (
                      <tr key={k}>
                        <td>{k}</td>
                        <td className={f.ch.includes(m.name + "." + k) ? "chg" : ""}>{String(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <div className="out"><span>Salida</span>{f.out}</div>
          <Msg frame={f} />
          <PlayerControls p={player} />
        </div>
        <CodeBlock code={sel.code(n)} title={sel.nombre} numbers active={f.line} />
      </div>
    </>
  );
}

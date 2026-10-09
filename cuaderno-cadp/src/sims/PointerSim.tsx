import { useState } from "react";
import { CodeBlock } from "../components/CodeBlock";
import { pAplicar, pInicial, programa, type PAccion, type PState, type PVar } from "./pointerModel";

const ACCIONES: [PAccion, (x: PVar, o: PVar, v: string) => string][] = [
  ["new", (x) => `new(${x})`],
  ["asig", (x, _o, v) => `${x}^ := ${v || 0}`],
  ["write", (x) => `writeln(${x}^)`],
  ["dispose", (x) => `dispose(${x})`],
  ["nil", (x) => `${x} := nil`],
  ["alias", (x, o) => `${x} := ${o}`],
];

export function PointerSim() {
  const [S, setS] = useState<PState>(pInicial);
  const [x, setX] = useState<PVar>("p");
  const [val, setVal] = useState("7");
  const o: PVar = x === "p" ? "q" : "p";

  const color = (a: string) => "c" + (S.heap.findIndex((b) => b.addr === a) % 6);
  const blk = (a: string) => S.heap.find((b) => b.addr === a);
  const usados = S.heap.filter((b) => !b.freed).length * 2;

  const Var = ({ nm }: { nm: PVar }) => {
    const a = S.vars[nm];
    return (
      <div className="var">
        <span className="nm">{nm}</span>
        {a === "?" ? <span className="addr">? basura</span>
          : a === "nil" ? <span className="addr">nil</span>
          : <><span className={"addr cx " + color(a)}>{a}</span>{blk(a)?.freed && <span className="note">liberada</span>}</>}
        <span className="note right">4 bytes</span>
      </div>
    );
  };

  return (
    <>
      <p className="lead-s">Ejecutá sentencias sobre dos punteros a integer y mirá qué pasa en la memoria estática y en el heap. Cada botón agrega una línea al programa. Probá los errores clásicos: usar p^ sin new, o después de dispose.</p>
      <div className="sim">
        <div className="stage">
          <div className="controls">
            <label className="field"><span>Puntero</span>
              <select id="ptr-var" value={x} onChange={(e) => setX(e.target.value as PVar)}>
                <option value="p">p</option>
                <option value="q">q</option>
              </select>
            </label>
            <label className="field"><span>Valor</span><input id="ptr-val" type="number" value={val} onChange={(e) => setVal(e.target.value)} /></label>
          </div>
          <div className="row">
            {ACCIONES.map(([k, label]) => (
              <button key={k} type="button" className={"btn mono" + (k === "new" ? " pri" : "")}
                onClick={() => setS((s) => pAplicar(s, k, x, parseInt(val, 10) || 0))}>
                {label(x, o, val)}
              </button>
            ))}
          </div>
          <div className="mem">
            <div className="col">
              <h4><span>Memoria estática</span><span>8 bytes</span></h4>
              <Var nm="p" />
              <Var nm="q" />
            </div>
            <div className="col">
              <h4><span>Heap</span><span>{usados} bytes en uso</span></h4>
              {S.heap.length === 0 ? <div className="note">Vacío. Hacé new para reservar memoria.</div>
                : S.heap.slice(-8).map((b) => {
                  const who = (["p", "q"] as PVar[]).filter((v) => S.vars[v] === b.addr).join(", ");
                  return (
                    <div key={b.addr} className={`blk cx ${color(b.addr)}${b.freed ? " freed" : ""}${b.lost ? " lost" : ""}`}>
                      <span className="a">{b.addr}</span>
                      <span>{b.freed ? "liberado" : b.lost ? "perdido" : who ? "← " + who : ""}</span>
                      <span className="v">{b.freed ? "" : b.val}</span>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="out"><span>Salida</span>{S.out}</div>
          <div className={"msg" + (S.kind === "err" ? " err" : S.kind === "ok" ? " good" : "")} role="status">{S.msg}</div>
          <div className="row"><button className="btn ghost" type="button" onClick={() => setS(pInicial())}>Empezar de nuevo</button></div>
        </div>
        <CodeBlock code={programa(S)} title="tu programa" numbers active={S.log.length ? 6 + S.log.length : 0} />
      </div>
    </>
  );
}

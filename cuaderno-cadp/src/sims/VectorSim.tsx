import { useRef, useState } from "react";
import { CodeBlock } from "../components/CodeBlock";
import { Msg, PlayerControls } from "../components/PlayerControls";
import { usePlayer } from "../lib/usePlayer";
import { DIMF, VCODE, vecDesde, vectorFrames, type VecFrame, type VecOp, type VecState } from "./vectorOps";

const OPS: [VecOp, string][] = [
  ["agregar", "Agregar al final"],
  ["insertar", "Insertar en posición"],
  ["eliminar", "Eliminar posición"],
  ["buscar", "Buscar valor"],
  ["dico", "Búsqueda dicotómica"],
];
const azar = (n: number, max: number) => Array.from({ length: n }, () => 1 + Math.floor(Math.random() * max));

export function VectorSim() {
  const estado = useRef<VecState>(vecDesde([4, 9, 2, 7, 5]));
  const [op, setOp] = useState<VecOp>("agregar");
  const [val, setVal] = useState("6");
  const [pos, setPos] = useState("2");
  const [aviso, setAviso] = useState("");
  const player = usePlayer<VecFrame>([{ line: 0, msg: "Elegí una operación. Valor y posición se toman de los campos de arriba.", st: estado.current }]);
  const f = player.frame;

  const run = (k: VecOp) => {
    const v = parseInt(val, 10), p = parseInt(pos, 10);
    if (Number.isNaN(v) && k !== "eliminar") return setAviso("Ingresá un valor numérico.");
    if (Number.isNaN(p) && (k === "insertar" || k === "eliminar")) return setAviso("Ingresá una posición.");
    setAviso("");
    const frames = vectorFrames(estado.current, k, v, p);
    estado.current = frames[frames.length - 1].st;
    setOp(k);
    player.load(frames, true);
  };
  const cargar = (vals: number[], msg: string) => {
    estado.current = vecDesde(vals);
    player.load([{ line: 0, msg, st: estado.current }]);
  };

  return (
    <>
      <p className="lead-s">Un vector de dimensión física {DIMF}. Las celdas punteadas están fuera de la dimensión lógica: pueden tener valores viejos, pero no forman parte del vector. Probá insertar o eliminar y mirá el corrimiento.</p>
      <div className="sim">
        <div className="stage">
          <div className="controls">
            <label className="field"><span>Valor</span><input id="vec-val" type="number" value={val} onChange={(e) => setVal(e.target.value)} /></label>
            <label className="field"><span>Posición</span><input id="vec-pos" type="number" min={1} max={DIMF + 1} value={pos} onChange={(e) => setPos(e.target.value)} /></label>
            {aviso && <span className="aviso">{aviso}</span>}
          </div>
          <div className="row">
            {OPS.map(([k, l]) => (
              <button key={k} type="button" className={"btn" + (k === op ? " pri" : "")} onClick={() => run(k)}>{l}</button>
            ))}
          </div>
          <div className="row subtle">
            <button className="btn ghost" type="button" onClick={() => cargar(azar(6, 40), "Se cargaron 6 valores al azar.")}>Cargar desordenado</button>
            <button className="btn ghost" type="button" onClick={() => cargar(azar(7, 60).sort((a, b) => a - b), "Se cargaron 7 valores ordenados de forma ascendente. Ya podés usar la búsqueda dicotómica.")}>Cargar ordenado</button>
            <button className="btn ghost" type="button" onClick={() => {
              estado.current = { v: estado.current.v.slice(), dimL: 0 };
              player.load([{ line: 0, msg: "dimL := 0. Los valores siguen en memoria, pero el vector se considera vacío.", st: estado.current }]);
            }}>Vaciar (dimL := 0)</button>
          </div>
          <div className="vec">
            {f.st.v.map((x, k) => {
              const i = k + 1;
              let cls = i <= f.st.dimL ? "used" : x !== null ? "stale" : "";
              if (f.mk?.[i]) cls += " " + f.mk[i];
              const tag = f.tg?.[i] ?? (i === f.st.dimL ? "dimL" : "");
              return (
                <div key={i} className={"cell " + cls}>
                  {f.tt?.[i] && <span className="tagt">{f.tt[i]}</span>}
                  <div className="box">{x ?? ""}</div>
                  <span className="idx">{i}</span>
                  {tag && <span className="tag">{tag}</span>}
                </div>
              );
            })}
          </div>
          <Msg frame={f} />
          <PlayerControls p={player} />
        </div>
        <CodeBlock code={VCODE[op]} title={op === "dico" ? "buscarDico" : op} numbers active={f.line} />
      </div>
    </>
  );
}

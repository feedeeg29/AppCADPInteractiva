import { useEffect, useRef, useState } from "react";
import { CodeBlock } from "../components/CodeBlock";
import { Msg, PlayerControls } from "../components/PlayerControls";
import { usePlayer } from "../lib/usePlayer";
import { LCODE, MAX_NODOS, listFrames, type ListFrame, type ListOp } from "./listOps";

const OPS: [ListOp, string][] = [
  ["adelante", "Agregar adelante"],
  ["atras", "Agregar atrás"],
  ["ordenado", "Insertar ordenado"],
  ["eliminar", "Eliminar valor"],
  ["recorrer", "Recorrer e imprimir"],
];
const TITULO: Record<ListOp, string> = { adelante: "agregarAdelante", atras: "agregarAtras", ordenado: "insertarOrdenado", eliminar: "eliminar", recorrer: "imprimir" };

export function ListSim() {
  const lista = useRef<number[]>([10, 21, 35]);
  const [op, setOp] = useState<ListOp>("adelante");
  const [val, setVal] = useState("18");
  const [aviso, setAviso] = useState("");
  const player = usePlayer<ListFrame>([{ line: 0, msg: "Elegí una operación. El valor se toma del campo de arriba.", list: lista.current }]);
  const f = player.frame;
  const boxRef = useRef<HTMLDivElement>(null);

  // Llevar a la vista el nodo que se está mirando
  useEffect(() => {
    const box = boxRef.current;
    const foc = box?.querySelector<HTMLElement>(".node.nw, .node.del, .node.hl");
    if (box && foc) box.scrollLeft = Math.max(0, foc.offsetLeft - box.clientWidth / 2);
  }, [f]);

  const run = (k: ListOp) => {
    const v = parseInt(val, 10);
    if (Number.isNaN(v) && k !== "recorrer") return setAviso("Ingresá un valor numérico.");
    if ((k === "adelante" || k === "atras" || k === "ordenado") && lista.current.length >= MAX_NODOS)
      return setAviso(`El simulador admite hasta ${MAX_NODOS} nodos. Eliminá alguno o empezá una lista nueva.`);
    setAviso("");
    const frames = listFrames(lista.current, k, v);
    lista.current = frames[frames.length - 1].list;
    setOp(k);
    player.load(frames, true);
  };
  const cargar = (l: number[], msg: string) => {
    lista.current = l;
    player.load([{ line: 0, msg, list: l }]);
  };

  const n = f.list.length;
  const etiquetas = (i: number) => {
    const a: string[] = [];
    if (f.ult && i === n - 1) a.push("ult");
    (f.lb?.[i] ?? []).forEach((x) => a.push(x));
    return a.join(" · ");
  };

  return (
    <>
      <p className="lead-s">Cada caja es un nodo: el dato y el puntero sig. Las etiquetas muestran a dónde apuntan pri, ult, ant, act y nue en cada paso del código.</p>
      <div className="sim">
        <div className="stage">
          <div className="controls">
            <label className="field"><span>Valor</span><input id="list-val" type="number" value={val} onChange={(e) => setVal(e.target.value)} /></label>
            {aviso && <span className="aviso">{aviso}</span>}
          </div>
          <div className="row">
            {OPS.map(([k, l]) => (
              <button key={k} type="button" className={"btn" + (k === op ? " pri" : "")} onClick={() => run(k)}>{l}</button>
            ))}
          </div>
          <div className="row subtle">
            <button className="btn ghost" type="button" onClick={() => cargar([5, 12, 18, 30, 44], "Lista ordenada de forma ascendente. Probá insertar ordenado un 20 o un 2.")}>Lista de ejemplo ordenada</button>
            <button className="btn ghost" type="button" onClick={() => cargar([], "Lista vacía: pri = nil.")}>Lista vacía (pri := nil)</button>
          </div>
          <div className="nuebox">
            {f.nue && (
              <>
                <span className="ptr">nue →</span>
                <div className="node nw"><span className="d">{f.nue.d}</span><span className="sg">sig</span></div>
                <span>{f.nue.s ? "sig → " + f.nue.s : "sig: sin asignar"}</span>
              </>
            )}
          </div>
          <div className="lst" ref={boxRef}>
            <span className="ptr">{n ? "pri →" : "pri = nil"}</span>
            {f.list.map((d, i) => {
              const l = etiquetas(i);
              return (
                <div className="node-wrap" key={i}>
                  <div className={"node " + (f.cls?.[i] ?? "")}>
                    {l && <span className="lb">{l}</span>}
                    <span className="d">{d}</span>
                    <span className="sg">sig</span>
                  </div>
                  <span className="arrow" aria-hidden="true" />
                </div>
              );
            })}
            {n > 0 && (
              <span className="nil">
                {(f.lb?.[n] ?? []).length > 0 && <span className="lb">{f.lb![n].join(" · ")}</span>}
                nil
              </span>
            )}
          </div>
          {f.out !== undefined && <div className="out"><span>Salida</span>{f.out}</div>}
          <Msg frame={f} />
          <PlayerControls p={player} />
        </div>
        <CodeBlock code={LCODE[op]} title={TITULO[op]} numbers active={f.line} />
      </div>
    </>
  );
}

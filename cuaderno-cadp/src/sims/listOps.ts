import type { BaseFrame } from "../lib/usePlayer";

export type ListOp = "adelante" | "atras" | "ordenado" | "eliminar" | "recorrer";
export interface ListFrame extends BaseFrame {
  list: number[];
  /** etiquetas arriba de cada nodo; el índice list.length es nil */
  lb?: Record<number, string[]>;
  cls?: Record<number, "hl" | "nw" | "del">;
  nue?: { d: number | "?"; s?: string };
  ult?: boolean;
  out?: string;
}
export const MAX_NODOS = 9;

export const LCODE: Record<ListOp, string> = {
  adelante: `procedure agregarAdelante(var L : lista; n : integer);
var nue : lista;
begin
  new(nue);
  nue^.dato := n;
  nue^.sig := L;
  L := nue;
end;`,
  atras: `procedure agregarAtras(var pri, ult : lista; n : integer);
var nue : lista;
begin
  new(nue);
  nue^.dato := n;
  nue^.sig := nil;
  if (pri = nil) then pri := nue
  else ult^.sig := nue;
  ult := nue;
end;`,
  ordenado: `procedure insertarOrdenado(var pri : lista; n : integer);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := n;
  act := pri; ant := pri;
  while (act <> nil) and (act^.dato < n) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = pri) then pri := nue
  else ant^.sig := nue;
  nue^.sig := act;
end;`,
  eliminar: `procedure eliminar(var pri : lista; n : integer; var ok : boolean);
var ant, act : lista;
begin
  act := pri; ant := pri;
  while (act <> nil) and (act^.dato <> n) do begin
    ant := act;
    act := act^.sig;
  end;
  ok := (act <> nil);
  if ok then begin
    if (act = pri) then pri := act^.sig
    else ant^.sig := act^.sig;
    dispose(act);
  end;
end;`,
  recorrer: `procedure imprimir(L : lista);
begin
  while (L <> nil) do begin
    writeln(L^.dato);
    L := L^.sig;
  end;
end;`,
};

export function listFrames(start: number[], k: ListOp, v: number): ListFrame[] {
  const F: ListFrame[] = [];
  const L = start.slice();
  const fr = (line: number, msg: string, o: Partial<ListFrame> = {}) => F.push({ line, msg, list: L.slice(), ...o });
  const desc = (i: number) => (i < L.length ? `el nodo ${L[i]}` : "nil");

  if (k === "adelante") {
    fr(4, "new(nue): se reserva memoria para un nodo nuevo.", { nue: { d: "?" } });
    fr(5, `nue^.dato := ${v}.`, { nue: { d: v } });
    fr(6, `nue^.sig := L. El nuevo nodo apunta a lo que hoy es el primero: ${L.length ? "el nodo " + L[0] : "nil"}.`, { nue: { d: v, s: L.length ? "nodo " + L[0] : "nil" }, cls: { 0: "hl" } });
    L.unshift(v);
    fr(7, `L := nue. Ahora el primero es ${v}. Por eso la lista queda en orden inverso al de lectura.`, { cls: { 0: "nw" }, kind: "ok" });
  }
  if (k === "atras") {
    fr(4, "new(nue).", { nue: { d: "?" }, ult: true });
    fr(5, `nue^.dato := ${v}.`, { nue: { d: v }, ult: true });
    fr(6, "nue^.sig := nil: va a ser el último.", { nue: { d: v, s: "nil" }, ult: true });
    if (!L.length) fr(7, "pri = nil: la lista estaba vacía, así que pri := nue.", { nue: { d: v, s: "nil" }, ult: true });
    else fr(8, `ult^.sig := nue: el último actual (${L[L.length - 1]}) se engancha con el nuevo. No hizo falta recorrer.`, { nue: { d: v, s: "nil" }, ult: true, cls: { [L.length - 1]: "hl" } });
    L.push(v);
    fr(9, "ult := nue.", { ult: true, cls: { [L.length - 1]: "nw" }, kind: "ok" });
  }
  if (k === "ordenado") {
    const sorted = L.every((x, i) => i === 0 || L[i - 1] <= x);
    fr(4, "new(nue).", { nue: { d: "?" } });
    fr(5, `nue^.dato := ${v}.`, { nue: { d: v } });
    let act = 0, ant = 0;
    const lab = () => { const o: Record<number, string[]> = {}; (o[ant] ||= []).push("ant"); (o[act] ||= []).push("act"); return o; };
    fr(6, "act := pri; ant := pri.", { nue: { d: v }, lb: lab() });
    if (!sorted) fr(6, "Ojo: la lista no está ordenada, así que el resultado tampoco lo va a estar. Usá \"Lista de ejemplo ordenada\".", { nue: { d: v }, lb: lab(), kind: "err" });
    while (act < L.length && L[act] < v) {
      fr(7, `${L[act]} < ${v}: hay que seguir avanzando.`, { nue: { d: v }, lb: lab(), cls: { [act]: "hl" } });
      ant = act; fr(8, "ant := act.", { nue: { d: v }, lb: lab() });
      act++; fr(9, `act := act^.sig (${desc(act)}).`, { nue: { d: v }, lb: lab() });
    }
    fr(7, act < L.length ? `${L[act]} ≥ ${v}: el nuevo va antes de act.` : "act = nil: el nuevo va al final.", { nue: { d: v }, lb: lab(), cls: act < L.length ? { [act]: "hl" } : {} });
    if (act === 0) fr(11, "act = pri: el nuevo va primero, así que pri := nue.", { nue: { d: v, s: desc(0) }, lb: lab() });
    else fr(12, `ant^.sig := nue: el nodo ${L[ant]} ahora apunta al nuevo.`, { nue: { d: v }, lb: lab(), cls: { [ant]: "hl" } });
    const pos = act;
    L.splice(pos, 0, v);
    fr(13, `nue^.sig := act. El ${v} quedó enganchado entre ${pos ? L[pos - 1] : "pri"} y ${pos + 1 < L.length ? L[pos + 1] : "nil"}.`, { cls: { [pos]: "nw" }, kind: "ok" });
  }
  if (k === "eliminar") {
    let act = 0, ant = 0;
    const lab = () => { const o: Record<number, string[]> = {}; (o[ant] ||= []).push("ant"); (o[act] ||= []).push("act"); return o; };
    fr(4, "act := pri; ant := pri.", { lb: lab() });
    while (act < L.length && L[act] !== v) {
      fr(5, `${L[act]} ≠ ${v}: sigo buscando.`, { lb: lab(), cls: { [act]: "hl" } });
      ant = act; fr(6, "ant := act.", { lb: lab() });
      act++; fr(7, `act := act^.sig (${desc(act)}).`, { lb: lab() });
    }
    if (act >= L.length) fr(9, `act = nil: ${v} no está en la lista. ok := false.`, { lb: lab(), kind: "err" });
    else {
      fr(9, "Encontrado: ok := true.", { lb: lab(), cls: { [act]: "del" } });
      if (act === 0) fr(11, `Es el primero: pri := act^.sig (${desc(1)}).`, { lb: lab(), cls: { 0: "del" } });
      else fr(12, `ant^.sig := act^.sig: el ${L[ant]} saltea al ${v} y apunta a ${desc(act + 1)}.`, { lb: lab(), cls: { [act]: "del", [ant]: "hl" } });
      L.splice(act, 1);
      fr(13, "dispose(act): se libera la memoria del nodo.", { kind: "ok" });
    }
  }
  if (k === "recorrer") {
    let out = "";
    for (let i = 0; i < L.length; i++) {
      fr(3, `L <> nil: L apunta al ${L[i]}.`, { lb: { [i]: ["L"] }, out });
      out += L[i] + "\n";
      fr(4, `Se imprime ${L[i]}.`, { lb: { [i]: ["L"] }, cls: { [i]: "hl" }, out });
      fr(5, "L := L^.sig.", { lb: { [i + 1]: ["L"] }, out });
    }
    fr(3, "L = nil: fin del recorrido. Como L se pasó por valor, el pri del programa no se movió.", { lb: { [L.length]: ["L"] }, out, kind: "ok" });
  }
  return F;
}

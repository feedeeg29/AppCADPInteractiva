/** Modelo del simulador de punteros: dos punteros a integer (p y q) y un heap. */
export type PVar = "p" | "q";
export type PAccion = "new" | "asig" | "write" | "dispose" | "nil" | "alias";

export interface Bloque {
  addr: string;
  val: number | "?";
  freed: boolean;
  lost: boolean;
}
export interface PState {
  vars: Record<PVar, string>; // "?" basura, "nil", o una dirección
  heap: Bloque[];
  next: number;
  log: string[];
  out: string;
  msg: string;
  kind: "" | "ok" | "err";
}

export const pInicial = (): PState => ({
  vars: { p: "?", q: "?" },
  heap: [],
  next: 0x1a0,
  log: [],
  out: "",
  msg: "Las variables p y q son punteros a integer. Todavía no se les asignó nada: tienen basura.",
  kind: "",
});

const hex = (n: number) => "@" + n.toString(16).toUpperCase();

export function pAplicar(prev: PState, k: PAccion, x: PVar, val: number): PState {
  const S: PState = { ...prev, vars: { ...prev.vars }, heap: prev.heap.map((b) => ({ ...b })), log: prev.log.slice() };
  const o: PVar = x === "p" ? "q" : "p";
  const blk = (a: string) => S.heap.find((b) => b.addr === a)!;
  const check = (): string | null => {
    const a = S.vars[x];
    if (a === "?") return `Error: ${x} nunca recibió una dirección (falta new(${x})). ${x}^ apunta a cualquier lugar de la memoria.`;
    if (a === "nil") return `Error: ${x} vale nil, no apunta a nada. No se puede acceder a ${x}^.`;
    if (blk(a).freed) return `Error: la memoria a la que apunta ${x} ya fue liberada con dispose. ${x} quedó "colgando".`;
    return null;
  };
  const markLost = () => {
    const lost: string[] = [];
    S.heap.forEach((b) => {
      if (!b.freed && !b.lost && b.addr !== S.vars.p && b.addr !== S.vars.q) {
        b.lost = true;
        lost.push(b.addr);
      }
    });
    return lost.length
      ? ` Atención: el bloque ${lost.join(", ")} quedó sin ningún puntero que lo apunte. Esa memoria está perdida: ya no se puede usar ni liberar.`
      : "";
  };
  let line = "", msg = "", kind: PState["kind"] = "ok";

  if (k === "new") {
    const a = hex(S.next);
    S.next += 0x10;
    S.heap.push({ addr: a, val: "?", freed: false, lost: false });
    S.vars[x] = a;
    line = `new(${x});`;
    const l = markLost();
    msg = `Se reservaron 2 bytes en el heap (lo que ocupa un integer) en ${a}. ${x} guarda esa dirección. El contenido todavía es basura.` + l;
    if (l) kind = "err";
  } else if (k === "asig") {
    line = `${x}^ := ${val};`;
    const e = check();
    if (e) { msg = e; kind = "err"; }
    else {
      blk(S.vars[x]).val = val;
      msg = `Se escribe ${val} en la dirección ${S.vars[x]}.` + (S.vars[o] === S.vars[x] ? ` Como ${o} apunta al mismo lugar, ${o}^ también vale ${val}.` : "");
    }
  } else if (k === "write") {
    line = `writeln(${x}^);`;
    const e = check();
    if (e) { msg = e; kind = "err"; }
    else {
      const v = blk(S.vars[x]).val;
      S.out += v + "\n";
      msg = v === "?" ? `${x}^ nunca se inicializó: imprime basura.` : `Imprime ${v}.`;
      if (v === "?") kind = "err";
    }
  } else if (k === "dispose") {
    line = `dispose(${x});`;
    const e = check();
    if (e) { msg = e; kind = "err"; }
    else {
      blk(S.vars[x]).freed = true;
      msg = `Se liberan los 2 bytes de ${S.vars[x]}. Ojo: ${x} sigue guardando esa dirección, pero ya no es válida.` +
        (S.vars[o] === S.vars[x] ? ` ${o} también queda colgando.` : "") + ` Conviene hacer ${x} := nil.`;
    }
  } else if (k === "nil") {
    line = `${x} := nil;`;
    S.vars[x] = "nil";
    const l = markLost();
    msg = `${x} ya no apunta a nada.` + l;
    if (l) kind = "err";
  } else {
    line = `${x} := ${o};`;
    S.vars[x] = S.vars[o];
    const l = markLost();
    if (S.vars[o] === "?") { msg = `${o} tenía basura y ahora ${x} también.` + l; kind = "err"; }
    else {
      msg = `${x} copia la dirección de ${o}: ahora los dos apuntan al mismo lugar. No se copió el contenido.` + l;
      if (l) kind = "err";
    }
  }
  S.log.push(line);
  S.msg = msg;
  S.kind = kind;
  return S;
}

export const programa = (S: PState) =>
  "program punteros;\ntype\n  pNum = ^integer;\nvar\n  p, q : pNum;\nbegin\n" +
  S.log.map((l) => "  " + l).join("\n") + (S.log.length ? "\n" : "") + "end.";

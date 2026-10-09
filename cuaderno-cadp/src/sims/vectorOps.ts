import type { BaseFrame } from "../lib/usePlayer";

export const DIMF = 10;
export interface VecState {
  v: (number | null)[];
  dimL: number;
}
export type CellMark = "cmp" | "mov" | "new" | "found";
export interface VecFrame extends BaseFrame {
  st: VecState;
  mk?: Record<number, CellMark>;
  /** etiqueta debajo de la celda (i, pos, ini, fin) */
  tg?: Record<number, string>;
  /** etiqueta arriba de la celda (medio) */
  tt?: Record<number, string>;
}
export type VecOp = "agregar" | "insertar" | "eliminar" | "buscar" | "dico";

export const VCODE: Record<VecOp, string> = {
  agregar: `procedure agregar(var v : vector; var dimL : integer;
                  valor : integer; var ok : boolean);
begin
  ok := (dimL < DIMF);
  if ok then begin
    dimL := dimL + 1;
    v[dimL] := valor;
  end;
end;`,
  insertar: `procedure insertar(var v : vector; var dimL : integer;
                   valor, pos : integer; var ok : boolean);
var i : integer;
begin
  ok := (dimL < DIMF) and (pos >= 1) and (pos <= dimL + 1);
  if ok then begin
    for i := dimL downto pos do
      v[i + 1] := v[i];
    v[pos] := valor;
    dimL := dimL + 1;
  end;
end;`,
  eliminar: `procedure eliminar(var v : vector; var dimL : integer;
                   pos : integer; var ok : boolean);
var i : integer;
begin
  ok := (pos >= 1) and (pos <= dimL);
  if ok then begin
    for i := pos to dimL - 1 do
      v[i] := v[i + 1];
    dimL := dimL - 1;
  end;
end;`,
  buscar: `function buscar(v : vector; dimL, n : integer) : integer;
var pos : integer;
begin
  pos := 1;
  while (pos <= dimL) and (v[pos] <> n) do
    pos := pos + 1;
  if (pos <= dimL) then buscar := pos
  else buscar := -1;
end;`,
  dico: `function buscarDico(v : vector; dimL, n : integer) : boolean;
var ini, fin, medio : integer;
begin
  ini := 1; fin := dimL;
  medio := (ini + fin) div 2;
  while (ini <= fin) and (v[medio] <> n) do begin
    if (n < v[medio]) then fin := medio - 1
    else ini := medio + 1;
    medio := (ini + fin) div 2;
  end;
  buscarDico := (ini <= fin);
end;`,
};

const cp = (s: VecState): VecState => ({ v: s.v.slice(), dimL: s.dimL });

/** Ejecuta la operación y devuelve todos los pasos; el último tiene el estado final. */
export function vectorFrames(start: VecState, k: VecOp, val: number, pos: number): VecFrame[] {
  const F: VecFrame[] = [];
  const s = cp(start);
  const fr = (line: number, msg: string, extra: Partial<VecFrame> = {}) => F.push({ line, msg, st: cp(s), ...extra });
  const at = (i: number) => s.v[i - 1] as number;

  if (k === "agregar") {
    const ok = s.dimL < DIMF;
    fr(4, ok ? `dimL (${s.dimL}) < DIMF (${DIMF}): hay lugar.` : `dimL = DIMF = ${DIMF}: el vector está lleno. ok := false.`, ok ? {} : { kind: "err" });
    if (ok) {
      s.dimL++; fr(6, `dimL pasa a ${s.dimL}.`);
      s.v[s.dimL - 1] = val; fr(7, `v[${s.dimL}] := ${val}.`, { mk: { [s.dimL]: "new" }, kind: "ok" });
    }
  }
  if (k === "insertar") {
    const ok = s.dimL < DIMF && pos >= 1 && pos <= s.dimL + 1;
    fr(5, ok ? `Hay lugar y la posición ${pos} está entre 1 y dimL + 1 (${s.dimL + 1}).`
      : s.dimL >= DIMF ? "El vector está lleno: no se puede insertar." : `La posición ${pos} no es válida: tiene que estar entre 1 y ${s.dimL + 1}.`,
      ok ? {} : { kind: "err" });
    if (ok) {
      if (pos > s.dimL) fr(7, "pos = dimL + 1: no hay nada que correr.");
      for (let i = s.dimL; i >= pos; i--) {
        fr(7, `i = ${i}: hay que mover v[${i}] una posición a la derecha.`, { mk: { [i]: "cmp" }, tg: { [i]: "i" } });
        s.v[i] = s.v[i - 1];
        fr(8, `v[${i + 1}] := v[${i}]. Ahora el ${s.v[i]} está repetido; el de la izquierda se va a pisar.`, { mk: { [i + 1]: "mov" }, tg: { [i]: "i" } });
      }
      s.v[pos - 1] = val; fr(9, `v[${pos}] := ${val}.`, { mk: { [pos]: "new" } });
      s.dimL++; fr(10, `dimL pasa a ${s.dimL}. Inserción terminada.`, { mk: { [pos]: "new" }, kind: "ok" });
    }
  }
  if (k === "eliminar") {
    const ok = pos >= 1 && pos <= s.dimL;
    fr(5, ok ? `La posición ${pos} está entre 1 y dimL (${s.dimL}).` : `La posición ${pos} no es válida: tiene que estar entre 1 y ${s.dimL}.`,
      ok ? { mk: { [pos]: "cmp" } } : { kind: "err" });
    if (ok) {
      for (let i = pos; i <= s.dimL - 1; i++) {
        fr(7, `i = ${i}: se trae el valor de la derecha.`, { mk: { [i + 1]: "cmp" }, tg: { [i]: "i" } });
        s.v[i - 1] = s.v[i];
        fr(8, `v[${i}] := v[${i + 1}].`, { mk: { [i]: "mov" }, tg: { [i]: "i" } });
      }
      s.dimL--;
      fr(9, `dimL pasa a ${s.dimL}. El valor de la posición ${s.dimL + 1} queda ahí, pero ya no es parte del vector.`, { kind: "ok" });
    }
  }
  if (k === "buscar") {
    let p = 1;
    fr(4, "pos := 1.", { tg: { 1: "pos" } });
    while (p <= s.dimL && at(p) !== val) {
      fr(5, `v[${p}] = ${at(p)} ≠ ${val}: sigo.`, { mk: { [p]: "cmp" }, tg: { [p]: "pos" } });
      p++; fr(6, `pos := ${p}.`, { tg: { [p]: "pos" } });
    }
    if (p <= s.dimL) fr(7, `v[${p}] = ${val}: encontrado en la posición ${p}. Se revisaron ${p} elementos.`, { mk: { [p]: "found" }, tg: { [p]: "pos" }, kind: "ok" });
    else fr(8, `pos = ${p} > dimL: ${val} no está. Hubo que recorrer los ${s.dimL} elementos.`, { kind: "err" });
  }
  if (k === "dico") {
    const arr = s.v.slice(0, s.dimL) as number[];
    const sorted = arr.every((x, i) => i === 0 || arr[i - 1] <= x);
    if (!sorted) {
      fr(1, "El vector no está ordenado. La búsqueda dicotómica solo funciona sobre un vector ordenado: probá con \"Cargar ordenado\".", { kind: "err" });
    } else {
      let ini = 1, fin = s.dimL, m = Math.floor((ini + fin) / 2), vueltas = 0;
      const tags = () => {
        const t: Record<number, string> = {};
        if (ini <= DIMF) t[ini] = "ini";
        if (fin >= 1) t[fin] = (t[fin] ? t[fin] + "/" : "") + "fin";
        return t;
      };
      fr(4, `ini := 1; fin := ${fin}.`, { tg: tags() });
      fr(5, `medio := (${ini} + ${fin}) div 2 = ${m}.`, { tg: tags(), tt: { [m]: "medio" }, mk: { [m]: "cmp" } });
      while (ini <= fin && at(m) !== val) {
        vueltas++;
        if (val < at(m)) { fin = m - 1; fr(7, `${val} < v[${m}] = ${at(m)}: descarto la mitad derecha. fin := ${fin}.`, { tg: tags() }); }
        else { ini = m + 1; fr(8, `${val} > v[${m}] = ${at(m)}: descarto la mitad izquierda. ini := ${ini}.`, { tg: tags() }); }
        m = Math.floor((ini + fin) / 2);
        fr(9, `medio := ${m}.`, { tg: tags(), tt: m >= 1 && m <= DIMF ? { [m]: "medio" } : {}, mk: ini <= fin ? { [m]: "cmp" } : {} });
      }
      if (ini <= fin) fr(11, `v[${m}] = ${val}: encontrado tras ${vueltas + 1} comparaciones (la lineal podría haber necesitado hasta ${s.dimL}).`, { mk: { [m]: "found" }, tt: { [m]: "medio" }, kind: "ok" });
      else fr(11, `ini (${ini}) > fin (${fin}): ${val} no está.`, { kind: "err" });
    }
  }
  return F;
}

export const vecDesde = (vals: number[]): VecState => ({
  v: vals.concat(Array(DIMF - vals.length).fill(null)),
  dimL: vals.length,
});

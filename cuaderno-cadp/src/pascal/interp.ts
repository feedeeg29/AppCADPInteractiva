/** Intérprete del árbol: ejecuta el programa de forma síncrona. Si un read necesita datos
 *  que todavía no se ingresaron, corta con NeedInput; el host vuelve a ejecutar desde el
 *  principio con más entrada (los programas son deterministas, así que el resultado es el mismo). */
import { base, sizeOf, typeName, type Expr, type Program, type PType, type Routine, type Stmt } from "./ast";
import { binop, clone, fromOrd, makeDefault, ord, RuntimeError, unop } from "./ops";

export class NeedInput extends Error {}
class BreakSig {}
class ContinueSig {}
class ExitSig {}
class HaltSig {}
const BREAK = new BreakSig(), CONTINUE = new ContinueSig(), EXIT = new ExitSig(), HALT = new HaltSig();

export type SegKind = "out" | "in" | "warn";
export interface Segment { k: SegKind; s: string }

interface Ref { get(): unknown; set(v: unknown): void }
class Box implements Ref {
  constructor(public v: unknown) {}
  get() { return this.v; }
  set(v: unknown) { this.v = v; }
}
export class Cell {
  freed = false;
  constructor(public v: unknown, public size: number, public id: number) {}
}
interface Frame { slots: Ref[]; parent: Frame | null; level: number }

export interface RunOptions {
  inputs: string[];
  seed: number;
  maxSteps?: number;
  maxOutput?: number;
}
export interface RunResult {
  status: "done" | "input" | "error";
  segments: Segment[];
  error?: { line: number; msg: string };
  heap: { bytes: number; blocks: number };
  steps: number;
}

export function run(prog: Program, opts: RunOptions): RunResult {
  const it = new Interp(opts);
  let status: RunResult["status"] = "done";
  let error: RunResult["error"];
  try {
    it.callRoutine(prog.main, [], null, 0);
  } catch (e) {
    if (e instanceof NeedInput) status = "input";
    else if (e === HALT) status = "done";
    else if (e instanceof RuntimeError) { status = "error"; error = { line: e.line, msg: e.message }; }
    else if (e instanceof RangeError) { status = "error"; error = { line: it.line, msg: "Se llenó la pila de llamadas: probablemente hay una recursión que nunca termina." }; }
    else { status = "error"; error = { line: it.line, msg: "Error interno del intérprete: " + (e as Error).message }; }
  }
  const live = it.cells.filter((c) => !c.freed);
  return { status, segments: it.segs, error, heap: { bytes: live.reduce((a, c) => a + c.size, 0), blocks: live.length }, steps: it.steps };
}

class Interp {
  segs: Segment[] = [];
  outLen = 0;
  steps = 0;
  depth = 0;
  line = 0;
  cells: Cell[] = [];
  warned = new Set<string>();
  // entrada
  buf: string;
  pos = 0;
  lineStarts: number[] = [];
  echoed = 0;
  rnd: number;
  maxSteps: number;
  maxOutput: number;

  constructor(o: RunOptions) {
    this.buf = "";
    for (const l of o.inputs) { this.lineStarts.push(this.buf.length); this.buf += l + "\n"; }
    this.rnd = o.seed >>> 0 || 1;
    this.maxSteps = o.maxSteps ?? 20_000_000;
    this.maxOutput = o.maxOutput ?? 1_000_000;
  }

  // ---------- salida ----------
  emit(k: SegKind, s: string) {
    if (!s) return;
    this.outLen += s.length;
    if (this.outLen > this.maxOutput) throw new RuntimeError(this.line, "El programa escribió demasiado texto (más de un millón de caracteres). ¿Hay un bucle que no termina?");
    const last = this.segs[this.segs.length - 1];
    if (last && last.k === k) last.s += s;
    else this.segs.push({ k, s });
  }
  warn(key: string, msg: string) {
    if (this.warned.has(key)) return;
    this.warned.add(key);
    const last = this.segs[this.segs.length - 1];
    if (last && !last.s.endsWith("\n")) this.emit(last.k, "\n");
    this.emit("warn", `Aviso (línea ${this.line}): ${msg}\n`);
  }

  // ---------- entrada ----------
  /** Asegura que haya un carácter disponible en pos; si no, pide más entrada. */
  avail() {
    if (this.pos >= this.buf.length) throw new NeedInput();
    // eco: la línea que se empieza a leer aparece en la consola como la tipeó el usuario
    while (this.echoed < this.lineStarts.length && this.lineStarts[this.echoed] <= this.pos) {
      const st = this.lineStarts[this.echoed];
      const en = this.buf.indexOf("\n", st);
      this.emit("in", this.buf.slice(st, en + 1));
      this.echoed++;
    }
  }
  readToken(): string {
    for (;;) {
      this.avail();
      const c = this.buf[this.pos];
      if (c === " " || c === "\t" || c === "\n") this.pos++;
      else break;
    }
    const st = this.pos;
    while (this.pos < this.buf.length && !" \t\n".includes(this.buf[this.pos])) this.pos++;
    return this.buf.slice(st, this.pos);
  }
  readInto(e: Expr, f: Frame) {
    const ref = this.lref(e, f);
    const t = base(e.t);
    if (t.k === "int" || t.k === "real") {
      const s = this.readToken();
      const ok = t.k === "int" ? /^[+-]?\d+$/.test(s) : /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s);
      if (!ok) {
        const hint = /^[+-]?\d+,\d+$/.test(s) ? " Los decimales se escriben con punto, no con coma." : t.k === "int" && /^[+-]?\d*\.\d+$/.test(s) ? ` ${e.src} es entera y no acepta decimales.` : "";
        throw new RuntimeError(this.line, `Error de lectura: se esperaba un número ${t.k === "int" ? "entero" : "real"} para ${e.src} y se ingresó '${s}'.${hint}`);
      }
      this.store(ref, Number(s), e.t, e.src);
    } else if (t.k === "char") {
      this.avail();
      this.store(ref, this.buf[this.pos++], e.t, e.src);
    } else {
      // string: lee hasta el fin de la línea (sin consumir el salto)
      this.avail();
      const en = this.buf.indexOf("\n", this.pos);
      const s = this.buf.slice(this.pos, en);
      this.pos = en;
      this.store(ref, s, e.t, e.src);
    }
  }
  skipLine() {
    for (;;) {
      this.avail();
      if (this.buf[this.pos++] === "\n") return;
    }
  }

  // ---------- frames ----------
  frameAt(f: Frame, level: number): Frame {
    let x: Frame | null = f;
    while (x && x.level !== level) x = x.parent;
    return x!;
  }
  callRoutine(r: Routine, args: Ref[], caller: Frame | null, staticLevel: number): unknown {
    if (++this.depth > 4000) throw new RuntimeError(this.line, `Demasiadas llamadas anidadas a '${r.raw}': ¿una recursión que nunca llega al caso base?`);
    const parent = caller ? this.frameAt(caller, staticLevel) : null;
    const slots: Ref[] = new Array(r.nslots);
    const frame: Frame = { slots, parent, level: r.level };
    for (const l of r.locals) slots[l.slot] = new Box(makeDefault(l.type));
    const first = r.isFunc ? 1 : 0;
    r.params.forEach((_, i) => { slots[first + i] = args[i]; });
    try {
      if (r.body) this.exec(r.body, frame);
    } catch (e) {
      if (e !== EXIT) throw e;
    } finally {
      this.depth--;
    }
    if (r.isFunc) {
      const v = slots[r.resultSlot].get();
      if (v === undefined) throw new RuntimeError(this.line, `La función '${r.raw}' terminó sin asignar un valor a su nombre. Falta una línea como ${r.raw} := resultado;`);
      return v;
    }
    return undefined;
  }

  // ---------- instrucciones ----------
  step(line: number) {
    this.line = line;
    if (++this.steps > this.maxSteps) throw new RuntimeError(line, "El programa ejecutó demasiados pasos: probablemente hay un bucle infinito (revisá que la condición del while o repeat cambie en algún momento).");
  }

  exec(s: Stmt, f: Frame): void {
    this.step(s.line);
    switch (s.k) {
      case "block":
        for (const x of s.body) this.exec(x, f);
        return;
      case "assign": {
        const v = this.eval(s.e, f);
        this.store(this.lref(s.target, f), clone(v), s.target.t, s.target.src);
        return;
      }
      case "call":
        this.invoke(s.r, s.args, f);
        return;
      case "if":
        if (this.eval(s.cond, f)) { if (s.then) this.exec(s.then, f); }
        else if (s.else) this.exec(s.else, f);
        return;
      case "while":
        while (this.eval(s.cond, f)) {
          this.step(s.line);
          try { if (s.body) this.exec(s.body, f); }
          catch (e) { if (e === BREAK) break; if (e !== CONTINUE) throw e; }
        }
        return;
      case "repeat":
        for (;;) {
          try { for (const x of s.body) this.exec(x, f); }
          catch (e) { if (e === BREAK) break; if (e !== CONTINUE) throw e; }
          this.line = s.line;
          if (this.eval(s.cond, f)) break;
          this.step(s.line);
        }
        return;
      case "for": {
        const ref = this.lref(s.v, f);
        const a = ord(this.eval(s.from, f)), b = ord(this.eval(s.to, f));
        if (s.down ? a < b : a > b) return;
        for (let i = a; ; i += s.down ? -1 : 1) {
          this.store(ref, fromOrd(i, s.v.t), s.v.t, s.v.src);
          this.step(s.line);
          try { if (s.body) this.exec(s.body, f); }
          catch (e) { if (e === BREAK) break; if (e !== CONTINUE) throw e; }
          if (i === b) break;
        }
        return;
      }
      case "case": {
        const v = ord(this.eval(s.e, f));
        for (const arm of s.arms)
          if (arm.labels.some((l) => v >= ord(l.lo) && v <= ord(l.hi))) { if (arm.body) this.exec(arm.body, f); return; }
        if (s.else) for (const x of s.else) this.exec(x, f);
        return;
      }
      case "builtin":
        this.builtinProc(s, f);
        return;
      case "empty":
        return;
    }
  }

  invoke(r: Routine, argExprs: Expr[], f: Frame): unknown {
    const refs: Ref[] = r.params.map((p, i) => {
      const a = argExprs[i];
      if (p.byRef) return this.lref(a, f);
      const b = new Box(undefined);
      const v = this.eval(a, f);
      this.store(b, clone(v), p.type, p.raw);
      return b;
    });
    return this.callRoutine(r, refs, f, r.level - 1);
  }

  builtinProc(s: Extract<Stmt, { k: "builtin" }>, f: Frame) {
    switch (s.name) {
      case "write": case "writeln": {
        let out = "";
        for (const w of s.wargs ?? []) {
          const v = this.eval(w.e, f);
          const width = w.w ? Number(this.eval(w.w, f)) : undefined;
          const dec = w.d ? Number(this.eval(w.d, f)) : undefined;
          out += fmt(v, w.e.t, width, dec);
        }
        if (s.name === "writeln") out += "\n";
        this.emit("out", out);
        return;
      }
      case "read": case "readln":
        for (const a of s.args) this.readInto(a, f);
        if (s.name === "readln") this.skipLine();
        return;
      case "new": {
        const ref = this.lref(s.args[0], f);
        const pt = base(s.args[0].t) as Extract<PType, { k: "pointer" }>;
        const cell = new Cell(makeDefault(pt.to!), sizeOf(pt.to!), this.cells.length + 1);
        this.cells.push(cell);
        ref.set(cell);
        return;
      }
      case "dispose": {
        const p = this.pointer(s.args[0], f, "dispose");
        p.freed = true;
        return;
      }
      case "inc": case "dec": {
        const ref = this.lref(s.args[0], f);
        const cur = ref.get();
        if (cur === undefined) throw new RuntimeError(this.line, `${s.args[0].src} no tiene valor: no se puede hacer ${s.name} de una variable sin inicializar.`);
        const n = s.args[1] ? Number(this.eval(s.args[1], f)) : 1;
        this.store(ref, fromOrd(ord(cur) + (s.name === "inc" ? n : -n), s.args[0].t), s.args[0].t, s.args[0].src);
        return;
      }
      case "break": throw BREAK;
      case "continue": throw CONTINUE;
      case "exit": throw EXIT;
      case "halt": throw HALT;
      case "randomize": return;
    }
  }

  // ---------- almacenamiento ----------
  store(ref: Ref, v: unknown, t: PType, name: string) {
    const b = base(t);
    if (b.k === "int" && typeof v === "number") {
      if (t.k === "sub" && (v < t.lo || v > t.hi))
        throw new RuntimeError(this.line, `El valor ${v} está fuera del rango ${t.lo}..${t.hi} permitido para ${name}.`);
      if (v < b.min || v > b.max) {
        const span = b.max - b.min + 1;
        const w = ((((v - b.min) % span) + span) % span) + b.min;
        this.warn("ovf" + name, `el valor ${v} no entra en ${name} (${b.name}: de ${b.min} a ${b.max}) y quedó guardado como ${w}. Si necesitás números más grandes usá longint.`);
        v = w;
      }
    } else if (b.k === "char" && t.k === "sub" && typeof v === "string") {
      const c = v.charCodeAt(0);
      if (c < t.lo || c > t.hi) throw new RuntimeError(this.line, `El carácter '${v}' está fuera del rango permitido para ${name}.`);
    } else if (b.k === "string" && typeof v === "string" && v.length > b.max) {
      v = v.slice(0, b.max);
    }
    ref.set(v);
  }

  lref(e: Expr, fr: Frame): Ref {
    switch (e.k) {
      case "var": return this.frameAt(fr, e.sym.level).slots[e.sym.slot];
      case "result": return this.frameAt(fr, e.level).slots[e.slot];
      case "index": {
        const bt = base(e.base.t);
        const baseRef = this.lref(e.base, fr);
        const i = ord(this.eval(e.idx, fr));
        if (bt.k === "string") {
          const s = baseRef.get();
          if (s === undefined) throw new RuntimeError(this.line, `${e.base.src} no tiene valor.`);
          const str = s as string;
          if (i < 1 || i > str.length) throw new RuntimeError(this.line, `Índice ${i} fuera del string ${e.base.src} (tiene ${str.length} caracteres).`);
          return { get: () => (baseRef.get() as string)[i - 1], set: (c) => { const x = baseRef.get() as string; baseRef.set(x.slice(0, i - 1) + c + x.slice(i)); } };
        }
        const at = bt as Extract<PType, { k: "array" }>;
        if (i < at.lo || i > at.hi) {
          const shown = base(at.idx).k === "char" ? `'${String.fromCharCode(i)}'` : String(i);
          throw new RuntimeError(this.line, `Índice fuera de rango: ${e.src.replace(/\[[^\]]*\]$/, "")}[${shown}], pero el arreglo va de ${fmtOrd(at.lo, at.idx)} a ${fmtOrd(at.hi, at.idx)}.`);
        }
        const arr = baseRef.get() as unknown[];
        const k = i - at.lo;
        return { get: () => arr[k], set: (v) => { arr[k] = v; } };
      }
      case "field": {
        const rec = this.lref(e.base, fr).get() as Record<string, unknown>;
        const name = e.field;
        return { get: () => rec[name], set: (v) => { rec[name] = v; } };
      }
      case "deref": {
        const cell = this.pointer(e.base, fr, "^");
        return { get: () => cell.v, set: (v) => { cell.v = v; } };
      }
    }
    throw new RuntimeError(this.line, "No se puede asignar a esta expresión.");
  }

  pointer(e: Expr, f: Frame, op: string): Cell {
    const p = this.lref(e, f).get();
    if (p === undefined) throw new RuntimeError(this.line, `El puntero ${e.src} nunca recibió una dirección: falta new(${e.src}) o asignarle otro puntero.${op === "^" ? "" : " No se puede hacer dispose."}`);
    if (p === null) throw new RuntimeError(this.line, op === "^" ? `${e.src} vale nil: no apunta a ningún dato, así que no se puede usar ${e.src}^.` : `No se puede hacer dispose(${e.src}) porque vale nil.`);
    const cell = p as Cell;
    if (cell.freed) throw new RuntimeError(this.line, op === "^" ? `La memoria a la que apunta ${e.src} ya fue liberada con dispose: no se puede usar ${e.src}^.` : `La memoria de ${e.src} ya había sido liberada: dispose dos veces sobre lo mismo es un error.`);
    return cell;
  }

  // ---------- expresiones ----------
  eval(e: Expr, f: Frame): unknown {
    switch (e.k) {
      case "lit": return e.v;
      case "var": case "index": case "field": case "deref": case "result": {
        const v = this.lref(e, f).get();
        if (v === undefined) {
          const k = base(e.t).k;
          if (k === "pointer") throw new RuntimeError(this.line, `El puntero ${e.src} se usó sin haberle asignado un valor (ni new, ni nil, ni otro puntero). ¿Falta inicializarlo en nil?`);
          throw new RuntimeError(this.line, `${e.src} se usó sin haberle asignado un valor antes. Inicializala (por ejemplo ${e.src} := 0) o leela.`);
        }
        return v;
      }
      case "bin": {
        if (e.op === "and" && base(e.t).k === "bool") return this.eval(e.l, f) && this.eval(e.r, f);
        if (e.op === "or" && base(e.t).k === "bool") return this.eval(e.l, f) || this.eval(e.r, f);
        return binop(e.op, this.eval(e.l, f), this.eval(e.r, f), e.l.t, this.line);
      }
      case "un": return unop(e.op, this.eval(e.e, f), e.e.t);
      case "call": return this.invoke(e.r, e.args, f);
      case "conv": return this.eval(e.e, f);
      case "set": {
        const s = new Set<number>();
        for (const it of e.items) {
          const lo = ord(this.eval(it.lo, f));
          const hi = it.hi ? ord(this.eval(it.hi, f)) : lo;
          for (let i = lo; i <= hi; i++) s.add(i);
        }
        return s;
      }
      case "builtin": return this.builtinFunc(e, f);
    }
  }

  builtinFunc(e: Extract<Expr, { k: "builtin" }>, f: Frame): unknown {
    const a = e.args.map((x) => this.eval(x, f));
    const n = a[0] as number;
    switch (e.name) {
      case "abs": return Math.abs(n);
      case "sqr": return n * n;
      case "sqrt":
        if (n < 0) throw new RuntimeError(this.line, `No se puede calcular sqrt de un número negativo (${n}).`);
        return Math.sqrt(n);
      case "sin": return Math.sin(n);
      case "cos": return Math.cos(n);
      case "arctan": return Math.atan(n);
      case "exp": return Math.exp(n);
      case "ln":
        if (n <= 0) throw new RuntimeError(this.line, "ln recibe un número mayor que 0.");
        return Math.log(n);
      case "int": return Math.trunc(n);
      case "frac": return n - Math.trunc(n);
      case "trunc": return Math.trunc(n);
      case "round": {
        // como Free Pascal: los .5 van al par más cercano (round(2.5) = 2, round(3.5) = 4)
        const r = Math.round(n), diff = Math.abs(n - Math.trunc(n));
        return diff === 0.5 ? 2 * Math.round(n / 2) : r;
      }
      case "ord": return ord(a[0]);
      case "chr": return String.fromCharCode(n);
      case "succ": return fromOrd(ord(a[0]) + 1, e.args[0].t);
      case "pred": return fromOrd(ord(a[0]) - 1, e.args[0].t);
      case "odd": return Math.abs(n % 2) === 1;
      case "length": return (a[0] as string).length;
      case "upcase": return (a[0] as string).toUpperCase();
      case "lowercase": return (a[0] as string).toLowerCase();
      case "copy": {
        const s = a[0] as string, i = a[1] as number, c = a[2] as number;
        return i < 1 ? s.slice(0, Math.max(0, c + i - 1)) : s.substr(i - 1, Math.max(0, c));
      }
      case "pos": return (a[1] as string).indexOf(a[0] as string) + 1;
      case "concat": return a.join("");
      case "random": {
        this.rnd = (Math.imul(this.rnd, 1103515245) + 12345) >>> 0;
        const r = this.rnd / 4294967296;
        if (!e.args.length) return r;
        return Math.floor(r * n);
      }
      case "sizeof": return sizeOf(e.targ!);
    }
    throw new RuntimeError(this.line, `Función ${e.name} no implementada.`);
  }
}

function fmtOrd(n: number, t: PType) {
  const b = base(t);
  if (b.k === "char") return `'${String.fromCharCode(n)}'`;
  if (b.k === "enum") return b.values[n];
  return String(n);
}

/** Formato de write/writeln como Free Pascal. */
export function fmt(v: unknown, t: PType, width?: number, dec?: number): string {
  const b = base(t);
  let s: string;
  if (b.k === "real") {
    const x = v as number;
    if (dec !== undefined) s = x.toFixed(Math.max(0, dec));
    else {
      const digits = width !== undefined ? Math.max(1, width - 7) : 16;
      const [m, ex] = Math.abs(x).toExponential(Math.min(digits, 20)).split("e");
      const en = Number(ex);
      s = (x < 0 ? "-" : " ") + m + "E" + (en < 0 ? "-" : "+") + String(Math.abs(en)).padStart(3, "0");
    }
  } else if (b.k === "bool") s = v ? "TRUE" : "FALSE";
  else if (b.k === "enum") s = b.values[v as number];
  else s = String(v);
  if (width !== undefined && s.length < width) s = s.padStart(width);
  return s;
}

export { typeName };

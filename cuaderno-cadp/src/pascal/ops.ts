/** Operaciones sobre valores, compartidas por el parser (plegado de constantes) y el intérprete. */
import { base, type PType } from "./ast";

export class RuntimeError extends Error {
  constructor(public line: number, msg: string) {
    super(msg);
  }
}

/** Valor ordinal (número) de un valor de tipo ordinal */
export function ord(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "string") return v.charCodeAt(0);
  return NaN;
}

/** Convierte un ordinal a un valor del tipo dado */
export function fromOrd(n: number, t: PType): unknown {
  const b = base(t);
  if (b.k === "char") return String.fromCharCode(n);
  if (b.k === "bool") return n !== 0;
  return n;
}

export function binop(op: string, a: unknown, b: unknown, lt: PType, line: number): unknown {
  const L = base(lt);
  switch (op) {
    case "+":
      if (typeof a === "string" || typeof b === "string") return String(a) + String(b);
      if (a instanceof Set && b instanceof Set) return new Set([...a, ...b]);
      return (a as number) + (b as number);
    case "-":
      if (a instanceof Set && b instanceof Set) return new Set([...a].filter((x) => !b.has(x)));
      return (a as number) - (b as number);
    case "*":
      if (a instanceof Set && b instanceof Set) return new Set([...a].filter((x) => b.has(x)));
      return (a as number) * (b as number);
    case "/":
      if (b === 0) throw new RuntimeError(line, "División por cero.");
      return (a as number) / (b as number);
    case "div":
      if (b === 0) throw new RuntimeError(line, "División por cero en 'div'.");
      return Math.trunc((a as number) / (b as number));
    case "mod":
      if (b === 0) throw new RuntimeError(line, "División por cero en 'mod'.");
      return (a as number) % (b as number);
    case "and":
      return L.k === "bool" ? (a as boolean) && (b as boolean) : (a as number) & (b as number);
    case "or":
      return L.k === "bool" ? (a as boolean) || (b as boolean) : (a as number) | (b as number);
    case "xor":
      return L.k === "bool" ? a !== b : (a as number) ^ (b as number);
    case "=": return eq(a, b);
    case "<>": return !eq(a, b);
    case "<": return cmp(a, b) < 0;
    case "<=": return cmp(a, b) <= 0;
    case ">": return cmp(a, b) > 0;
    case ">=": return cmp(a, b) >= 0;
    case "in": return (b as Set<number>).has(ord(a));
  }
  throw new RuntimeError(line, `Operador desconocido ${op}`);
}

function eq(a: unknown, b: unknown): boolean {
  if (a instanceof Set && b instanceof Set) return a.size === b.size && [...a].every((x) => b.has(x));
  return a === b;
}
function cmp(a: unknown, b: unknown): number {
  if (typeof a === "boolean") a = a ? 1 : 0;
  if (typeof b === "boolean") b = b ? 1 : 0;
  if ((a as number | string) < (b as number | string)) return -1;
  if ((a as number | string) > (b as number | string)) return 1;
  return 0;
}

export function unop(op: string, v: unknown, t: PType): unknown {
  if (op === "-") return -(v as number);
  if (op === "+") return v;
  // not
  return base(t).k === "bool" ? !v : ~(v as number);
}

/** Copia profunda de valores estructurados (arreglos, registros, conjuntos). Los punteros no se siguen. */
export function clone(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(clone);
  if (v instanceof Set) return new Set(v);
  if (v && typeof v === "object" && (v as { __rec?: true }).__rec) {
    const o: Record<string, unknown> = { __rec: true };
    for (const k in v as Record<string, unknown>) if (k !== "__rec") o[k] = clone((v as Record<string, unknown>)[k]);
    return o;
  }
  return v;
}

export function makeDefault(t: PType): unknown {
  switch (t.k) {
    case "array": {
      const n = t.hi - t.lo + 1;
      const a = new Array(n);
      for (let i = 0; i < n; i++) a[i] = makeDefault(t.elem);
      return a;
    }
    case "record": {
      const o: Record<string, unknown> = { __rec: true };
      for (const f of t.fields) o[f.name] = makeDefault(f.type);
      return o;
    }
    case "set":
      return new Set<number>();
    default:
      return undefined;
  }
}

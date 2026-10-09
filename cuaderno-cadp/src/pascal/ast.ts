/** Tipos y árbol sintáctico del intérprete. */

export type PType =
  | { k: "int"; name: string; min: number; max: number; size: number }
  | { k: "real"; name: string }
  | { k: "bool"; name: string }
  | { k: "char"; name: string }
  | { k: "string"; name: string; max: number }
  | { k: "sub"; name: string; base: PType; lo: number; hi: number }
  | { k: "enum"; name: string; values: string[] }
  | { k: "array"; name: string; idx: PType; lo: number; hi: number; elem: PType }
  | { k: "record"; name: string; fields: { name: string; raw: string; type: PType }[] }
  | { k: "pointer"; name: string; to: PType | null; toName?: string }
  | { k: "set"; name: string; base: PType }
  | { k: "nil"; name: string }
  | { k: "void"; name: string };

export const T = {
  integer: { k: "int", name: "integer", min: -32768, max: 32767, size: 2 } as PType,
  longint: { k: "int", name: "longint", min: -2147483648, max: 2147483647, size: 4 } as PType,
  byte: { k: "int", name: "byte", min: 0, max: 255, size: 1 } as PType,
  word: { k: "int", name: "word", min: 0, max: 65535, size: 2 } as PType,
  shortint: { k: "int", name: "shortint", min: -128, max: 127, size: 1 } as PType,
  /** tipo de los literales y resultados intermedios enteros (sin desborde) */
  intlit: { k: "int", name: "integer", min: -Infinity, max: Infinity, size: 4 } as PType,
  real: { k: "real", name: "real" } as PType,
  boolean: { k: "bool", name: "boolean" } as PType,
  char: { k: "char", name: "char" } as PType,
  string: { k: "string", name: "string", max: 255 } as PType,
  nil: { k: "nil", name: "nil" } as PType,
  void: { k: "void", name: "" } as PType,
};

/** Tipo base de un subrango */
export const base = (t: PType): PType => (t.k === "sub" ? base(t.base) : t);
export const isOrdinal = (t: PType) => ["int", "bool", "char", "enum"].includes(base(t).k);
export const isNumeric = (t: PType) => ["int", "real"].includes(base(t).k);
export const isStringy = (t: PType) => ["string", "char"].includes(base(t).k);

export function typeName(t: PType): string {
  if (t.name) return t.name;
  switch (t.k) {
    case "array": return `array[${t.lo}..${t.hi}] of ${typeName(t.elem)}`;
    case "record": return "record";
    case "pointer": return "^" + (t.to ? typeName(t.to) : t.toName ?? "?");
    case "sub": return `${t.lo}..${t.hi}`;
    case "set": return "set of " + typeName(t.base);
    case "string": return `string[${t.max}]`;
    default: return t.k;
  }
}

/** Tamaño en bytes según la tabla de la cátedra (Práctica 5). */
export function sizeOf(t: PType): number {
  switch (t.k) {
    case "int": return t.size;
    case "real": return 4;
    case "bool": case "char": return 1;
    case "string": return t.max + 1;
    case "sub": { const b = base(t); return b.k === "int" ? (t.lo >= -128 && t.hi <= 255 ? 1 : 2) : sizeOf(b); }
    case "enum": return 1;
    case "array": return (t.hi - t.lo + 1) * sizeOf(t.elem);
    case "record": return t.fields.reduce((a, f) => a + sizeOf(f.type), 0);
    case "pointer": case "nil": return 4;
    case "set": return 32;
    default: return 0;
  }
}

export interface Sym {
  kind: "var" | "const" | "type" | "proc" | "func" | "enumval";
  name: string; // minúsculas
  raw: string;
  type: PType;
  level: number;
  slot: number;
  byRef?: boolean;
  isParam?: boolean;
  value?: unknown; // constantes
  routine?: Routine;
  loopLocked?: boolean;
}

export interface Param {
  name: string;
  raw: string;
  type: PType;
  byRef: boolean;
}

export interface Routine {
  name: string;
  raw: string;
  isFunc: boolean;
  params: Param[];
  ret: PType;
  level: number; // nivel de sus variables locales
  nslots: number;
  resultSlot: number;
  locals: { slot: number; type: PType; raw: string }[];
  body: Stmt | null;
  line: number;
}

export type Expr = { t: PType; line: number; src: string } & (
  | { k: "lit"; v: unknown }
  | { k: "var"; sym: Sym }
  | { k: "result"; level: number; slot: number }
  | { k: "index"; base: Expr; idx: Expr }
  | { k: "field"; base: Expr; field: string }
  | { k: "deref"; base: Expr }
  | { k: "bin"; op: string; l: Expr; r: Expr }
  | { k: "un"; op: string; e: Expr }
  | { k: "call"; r: Routine; args: Expr[] }
  | { k: "builtin"; name: string; args: Expr[]; targ?: PType }
  | { k: "set"; items: { lo: Expr; hi?: Expr }[] }
  | { k: "conv"; to: "real"; e: Expr }
);

export interface WriteArg {
  e: Expr;
  w?: Expr;
  d?: Expr;
}

export type Stmt = { line: number } & (
  | { k: "assign"; target: Expr; e: Expr }
  | { k: "call"; r: Routine; args: Expr[] }
  | { k: "builtin"; name: string; args: Expr[]; wargs?: WriteArg[] }
  | { k: "block"; body: Stmt[] }
  | { k: "if"; cond: Expr; then: Stmt | null; else: Stmt | null }
  | { k: "while"; cond: Expr; body: Stmt | null }
  | { k: "repeat"; body: Stmt[]; cond: Expr }
  | { k: "for"; v: Expr; from: Expr; to: Expr; down: boolean; body: Stmt | null }
  | { k: "case"; e: Expr; arms: { labels: { lo: unknown; hi: unknown }[]; body: Stmt | null }[]; else: Stmt[] | null }
  | { k: "empty" }
);

export interface Program {
  main: Routine;
}

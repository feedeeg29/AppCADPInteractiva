/** Punto de entrada: compila y ejecuta. Lo usan el Web Worker y las pruebas. */
import { CompileError } from "./lexer";
import { parse } from "./parser";
import { run, type RunResult, type Segment } from "./interp";
import type { Program } from "./ast";

export type { Segment };
export interface Request { id: number; code: string; inputs: string[]; seed: number }
export type Response =
  | ({ id: number; kind: "run"; ms: number } & RunResult)
  | { id: number; kind: "compile"; error: { line: number; col: number; msg: string } };

let cacheSrc = "";
let cacheProg: Program | null = null;

export function execute(req: Request): Response {
  const t0 = performance.now();
  let prog: Program;
  try {
    if (req.code !== cacheSrc || !cacheProg) {
      cacheProg = parse(req.code);
      cacheSrc = req.code;
    }
    prog = cacheProg;
  } catch (e) {
    cacheProg = null;
    if (e instanceof CompileError) return { id: req.id, kind: "compile", error: { line: e.line, col: e.col, msg: e.message } };
    return { id: req.id, kind: "compile", error: { line: 1, col: 1, msg: "Error interno al compilar: " + (e as Error).message } };
  }
  const r = run(prog, { inputs: req.inputs, seed: req.seed });
  return { id: req.id, kind: "run", ms: Math.round(performance.now() - t0), ...r };
}

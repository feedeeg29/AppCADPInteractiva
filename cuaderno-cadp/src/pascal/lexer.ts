/** Analizador léxico de Pascal (subconjunto de la cátedra). */

export class CompileError extends Error {
  constructor(public line: number, public col: number, msg: string) {
    super(msg);
  }
}

export type TokKind = "id" | "kw" | "int" | "real" | "str" | "sym" | "eof";
export interface Token {
  k: TokKind;
  v: string; // en minúsculas para id/kw; texto para str; símbolo para sym
  raw: string; // texto original
  n?: number; // valor numérico
  line: number;
  col: number;
  pos: number; // posición en el código fuente
  end: number;
}

const KEYWORDS = new Set(
  ("and array begin case const div do downto else end for function if in mod nil not of or " +
    "procedure program record repeat then to type until var while xor set otherwise uses packed " +
    "with goto label file forward").split(" ")
);

const SYMS = [":=", "<=", ">=", "<>", "..", "+", "-", "*", "/", "=", "<", ">", "(", ")", "[", "]", ",", ";", ":", ".", "^", "@"];

export function tokenize(src: string): Token[] {
  const toks: Token[] = [];
  let i = 0, line = 1, lineStart = 0;
  const n = src.length;
  const err = (msg: string, at = i): never => {
    throw new CompileError(line, at - lineStart + 1, msg);
  };
  const nl = (at: number) => { line++; lineStart = at + 1; };

  while (i < n) {
    const c = src[i];
    if (c === "\n") { nl(i); i++; continue; }
    if (c === " " || c === "\t" || c === "\r") { i++; continue; }
    // comentarios
    if (c === "{") {
      const startLine = line, startCol = i - lineStart + 1;
      i++;
      while (i < n && src[i] !== "}") { if (src[i] === "\n") nl(i); i++; }
      if (i >= n) throw new CompileError(startLine, startCol, "Comentario sin cerrar: falta la llave '}'.");
      i++;
      continue;
    }
    if (c === "(" && src[i + 1] === "*") {
      const startLine = line, startCol = i - lineStart + 1;
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === ")")) { if (src[i] === "\n") nl(i); i++; }
      if (i >= n) throw new CompileError(startLine, startCol, "Comentario sin cerrar: falta '*)'.");
      i += 2;
      continue;
    }
    if (c === "/" && src[i + 1] === "/") {
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    const start = i, col = i - lineStart + 1;
    // identificadores y palabras reservadas
    if (/[A-Za-z_]/.test(c)) {
      while (i < n && /[A-Za-z0-9_]/.test(src[i])) i++;
      const raw = src.slice(start, i);
      const v = raw.toLowerCase();
      toks.push({ k: KEYWORDS.has(v) ? "kw" : "id", v, raw, line, col, pos: start, end: i });
      continue;
    }
    if (/[áéíóúñÁÉÍÓÚÑ]/.test(c)) err(`El carácter '${c}' no se puede usar en un identificador. Pascal solo acepta letras sin tilde, dígitos y '_'.`);
    // números
    if (/[0-9]/.test(c)) {
      while (i < n && /[0-9]/.test(src[i])) i++;
      let isReal = false;
      if (src[i] === "." && /[0-9]/.test(src[i + 1] ?? "")) {
        isReal = true;
        i++;
        while (i < n && /[0-9]/.test(src[i])) i++;
      }
      if ((src[i] === "e" || src[i] === "E") && /[0-9+-]/.test(src[i + 1] ?? "")) {
        isReal = true;
        i++;
        if (src[i] === "+" || src[i] === "-") i++;
        if (!/[0-9]/.test(src[i] ?? "")) err("Número real mal escrito.");
        while (i < n && /[0-9]/.test(src[i])) i++;
      }
      const raw = src.slice(start, i);
      if (/[A-Za-z_]/.test(src[i] ?? "")) err(`Número mal escrito: '${raw}${src[i]}'.`);
      toks.push({ k: isReal ? "real" : "int", v: raw, raw, n: Number(raw), line, col, pos: start, end: i });
      continue;
    }
    // cadenas: 'texto', con '' para comilla, y #65 para códigos
    if (c === "'" || c === "#") {
      let s = "";
      while (src[i] === "'" || src[i] === "#") {
        if (src[i] === "'") {
          i++;
          for (;;) {
            if (i >= n || src[i] === "\n") err("Cadena sin cerrar: falta la comilla simple de cierre.", start);
            if (src[i] === "'") {
              if (src[i + 1] === "'") { s += "'"; i += 2; continue; }
              i++;
              break;
            }
            s += src[i++];
          }
        } else {
          i++;
          const ds = i;
          while (/[0-9]/.test(src[i] ?? "")) i++;
          if (ds === i) err("Después de '#' va un código de carácter, por ejemplo #10.");
          s += String.fromCharCode(Number(src.slice(ds, i)));
        }
      }
      toks.push({ k: "str", v: s, raw: src.slice(start, i), line, col, pos: start, end: i });
      continue;
    }
    // comillas tipográficas (aparecen al copiar de PDFs o Word)
    if ("‘’“”\"".includes(c)) err(`El carácter ${c} no es válido. En Pascal las cadenas van entre comillas simples rectas: 'texto'.`);
    const sym = SYMS.find((s) => src.startsWith(s, i));
    if (sym) {
      i += sym.length;
      toks.push({ k: "sym", v: sym, raw: sym, line, col, pos: start, end: i });
      continue;
    }
    if (c === "}") err("Hay una '}' que cierra un comentario que nunca se abrió.");
    err(`Carácter no reconocido: '${c}'.`);
  }
  toks.push({ k: "eof", v: "", raw: "fin del archivo", line, col: i - lineStart + 1, pos: n, end: n });
  return toks;
}

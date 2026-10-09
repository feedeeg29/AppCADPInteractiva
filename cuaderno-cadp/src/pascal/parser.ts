/**
 * Parser de una pasada con chequeo de tipos (como los compiladores Pascal clásicos):
 * resuelve identificadores y tipos mientras lee, y da errores en español.
 */
import { base, isNumeric, isOrdinal, isStringy, T, typeName, type Expr, type Param, type PType, type Program, type Routine, type Stmt, type Sym, type WriteArg } from "./ast";
import { CompileError, tokenize, type Token } from "./lexer";
import { binop, fromOrd, ord, unop } from "./ops";

class Scope {
  syms = new Map<string, Sym>();
  constructor(public parent: Scope | null, public level: number, public routine: Routine | null) {}
  find(name: string): Sym | undefined {
    for (let s: Scope | null = this; s; s = s.parent) {
      const x = s.syms.get(name);
      if (x) return x;
    }
    return undefined;
  }
}

const BUILTIN_PROCS = new Set(["write", "writeln", "read", "readln", "new", "dispose", "inc", "dec", "exit", "break", "continue", "halt", "randomize"]);
const BUILTIN_FUNCS = new Set(["abs", "sqr", "sqrt", "trunc", "round", "ord", "chr", "succ", "pred", "length", "copy", "pos", "upcase", "lowercase", "odd", "random", "concat", "sin", "cos", "arctan", "exp", "ln", "int", "frac", "sizeof", "high", "low"]);

function builtinScope(): Scope {
  const s = new Scope(null, -1, null);
  const ty = (name: string, t: PType) => s.syms.set(name, { kind: "type", name, raw: name, type: t, level: -1, slot: -1 });
  ty("integer", T.integer); ty("longint", T.longint); ty("byte", T.byte); ty("word", T.word); ty("shortint", T.shortint);
  ty("smallint", T.integer); ty("cardinal", { k: "int", name: "cardinal", min: 0, max: 4294967295, size: 4 });
  ty("real", T.real); ty("double", { k: "real", name: "double" }); ty("single", { k: "real", name: "single" });
  ty("boolean", T.boolean); ty("char", T.char); ty("string", T.string);
  const cst = (name: string, t: PType, value: unknown) => s.syms.set(name, { kind: "const", name, raw: name, type: t, level: -1, slot: -1, value });
  cst("true", T.boolean, true); cst("false", T.boolean, false); cst("maxint", T.intlit, 32767); cst("pi", T.real, Math.PI);
  return s;
}

export function parse(src: string): Program {
  return new Parser(src).program();
}

class Parser {
  toks: Token[];
  p = 0;
  scope: Scope;
  routine: Routine;
  loopDepth = 0;
  pendingPtrs: { t: Extract<PType, { k: "pointer" }>; tok: Token }[] = [];

  constructor(private src: string) {
    this.toks = tokenize(src);
    this.routine = { name: "programa", raw: "programa", isFunc: false, params: [], ret: T.void, level: 0, nslots: 0, resultSlot: -1, locals: [], body: null, line: 1 };
    this.scope = new Scope(builtinScope(), 0, this.routine);
  }

  // ---------- utilidades ----------
  get t() { return this.toks[this.p]; }
  get prev() { return this.toks[this.p - 1] ?? this.toks[0]; }
  peek(o = 1) { return this.toks[Math.min(this.p + o, this.toks.length - 1)]; }
  next() { return this.toks[this.p++]; }
  is(v: string, tok = this.t) { return (tok.k === "kw" || tok.k === "sym") && tok.v === v; }
  accept(v: string) { if (this.is(v)) { this.p++; return true; } return false; }
  err(msg: string, tok: Token = this.t): never { throw new CompileError(tok.line, tok.col, msg); }
  show(tok: Token = this.t) { return tok.k === "eof" ? "el fin del archivo" : `'${tok.raw}'`; }
  expect(v: string, msg?: string) {
    if (this.accept(v)) return;
    if (v === ";") {
      const pv = this.prev;
      throw new CompileError(pv.line, pv.col + pv.raw.length, msg ?? `Falta ';' después de ${this.show(pv)} (línea ${pv.line}).`);
    }
    this.err(msg ?? `Se esperaba '${v}' y apareció ${this.show()}.`);
  }
  expectId(what = "un identificador"): Token {
    if (this.t.k === "id") return this.next();
    if (this.t.k === "kw") this.err(`'${this.t.raw}' es una palabra reservada de Pascal y no se puede usar como nombre.`);
    return this.err(`Se esperaba ${what} y apareció ${this.show()}.`);
  }
  srcOf(fromTok: Token) { return this.src.slice(fromTok.pos, this.prev.end); }

  declare(sym: Sym, tok: Token) {
    if (this.scope.syms.has(sym.name)) this.err(`'${tok.raw}' ya está declarado en este bloque.`, tok);
    this.scope.syms.set(sym.name, sym);
  }
  newSlot(type: PType, raw: string) {
    const slot = this.routine.nslots++;
    this.routine.locals.push({ slot, type, raw });
    return slot;
  }

  // ---------- programa y declaraciones ----------
  program(): Program {
    if (this.accept("program")) {
      this.expectId("el nombre del programa");
      if (this.accept("(")) { while (!this.accept(")")) this.next(); }
      this.expect(";");
    }
    if (this.accept("uses")) {
      do this.expectId("el nombre de una unidad"); while (this.accept(","));
      this.expect(";");
    }
    this.decls();
    if (!this.is("begin")) this.err(`Se esperaba 'begin' (el cuerpo del programa principal) y apareció ${this.show()}.`);
    this.routine.body = this.compound();
    if (!this.accept(".")) {
      if (this.t.k === "eof") this.err("Falta el punto final: el programa termina con 'end.'", this.prev);
      if (this.is(";")) this.err("El programa principal termina con 'end.' (con punto, no con punto y coma).");
      this.err(`Se esperaba el punto final de 'end.' y apareció ${this.show()}.`);
    }
    if (this.t.k !== "eof") this.err("Hay código después de 'end.': todo lo que va después del punto final se ignora en Pascal y probablemente sobra.");
    return { main: this.routine };
  }

  decls() {
    for (;;) {
      if (this.accept("const")) this.consts();
      else if (this.accept("type")) this.types();
      else if (this.accept("var")) this.vars();
      else if (this.is("procedure") || this.is("function")) this.routineDecl();
      else if (this.is("label") || this.is("with") || this.is("goto")) this.err(`'${this.t.raw}' no está soportado en este intérprete (y no se usa en CADP).`);
      else return;
    }
  }

  consts() {
    while (this.t.k === "id") {
      const tok = this.next();
      if (this.is(":")) this.err("Las constantes con tipo no están soportadas: declaralas como 'nombre = valor;' o usá una variable.");
      this.expect("=", `En una constante se usa '=': ${tok.raw} = valor;`);
      const e = this.expr();
      if (e.k !== "lit") this.err("El valor de una constante tiene que poder calcularse antes de ejecutar (solo números, caracteres, cadenas u otras constantes).", tok);
      this.declare({ kind: "const", name: tok.v, raw: tok.raw, type: e.t, level: this.scope.level, slot: -1, value: e.v }, tok);
      this.expect(";");
    }
  }

  types() {
    while (this.t.k === "id") {
      const tok = this.next();
      this.expect("=", `En una declaración de tipo se usa '=': ${tok.raw} = ...;`);
      const ty = this.type(tok.raw);
      this.declare({ kind: "type", name: tok.v, raw: tok.raw, type: ty, level: this.scope.level, slot: -1 }, tok);
      this.expect(";");
    }
    // resolver punteros a tipos declarados más abajo (lista = ^nodo; nodo = record ...)
    for (const { t, tok } of this.pendingPtrs) {
      const s = this.scope.find(t.toName!.toLowerCase());
      if (!s || s.kind !== "type") this.err(`El tipo '${t.toName}' no está declarado.`, tok);
      t.to = s.type;
    }
    this.pendingPtrs = [];
  }

  vars() {
    while (this.t.k === "id") {
      const names: Token[] = [this.next()];
      while (this.accept(",")) names.push(this.expectId());
      this.expect(":", `Falta ':' y el tipo de ${names.map((n) => n.raw).join(", ")}.`);
      const ty = this.type();
      if (this.is("=")) this.err("Las variables no se pueden inicializar en la declaración: asignales el valor en el cuerpo con ':='.");
      for (const n of names) this.declare({ kind: "var", name: n.v, raw: n.raw, type: ty, level: this.scope.level, slot: this.newSlot(ty, n.raw) }, n);
      this.expect(";");
    }
  }

  type(name = ""): PType {
    const tok = this.t;
    if (this.accept("packed")) return this.type(name);
    if (this.accept("^")) {
      const id = this.expectId("el nombre del tipo apuntado");
      const s = this.scope.find(id.v);
      const t: Extract<PType, { k: "pointer" }> = { k: "pointer", name, to: null, toName: id.raw };
      if (s && s.kind === "type") t.to = s.type;
      else if (s) this.err(`'${id.raw}' no es un tipo.`, id);
      else this.pendingPtrs.push({ t, tok: id });
      return t;
    }
    if (this.accept("array")) {
      this.expect("[", "Después de 'array' va el rango de índices entre corchetes: array[1..10] of ...");
      const idxs: { idx: PType; lo: number; hi: number }[] = [this.indexType()];
      while (this.accept(",")) idxs.push(this.indexType());
      this.expect("]");
      this.expect("of", "Falta 'of' y el tipo de los elementos: array[1..10] of integer");
      let elem = this.type();
      for (let i = idxs.length - 1; i >= 0; i--) elem = { k: "array", name: i === 0 ? name : "", ...idxs[i], elem };
      return elem;
    }
    if (this.accept("record")) {
      const fields: { name: string; raw: string; type: PType }[] = [];
      while (!this.is("end")) {
        if (this.is("case")) this.err("Los registros variantes (case dentro de record) no están soportados.");
        const ns: Token[] = [this.expectId("el nombre de un campo")];
        while (this.accept(",")) ns.push(this.expectId("el nombre de un campo"));
        this.expect(":");
        const ft = this.type();
        for (const n of ns) {
          if (fields.some((f) => f.name === n.v)) this.err(`El campo '${n.raw}' está repetido.`, n);
          fields.push({ name: n.v, raw: n.raw, type: ft });
        }
        if (!this.accept(";")) break;
      }
      this.expect("end", `Falta 'end' para cerrar el record que empieza en la línea ${tok.line}.`);
      return { k: "record", name, fields };
    }
    if (this.accept("set")) {
      this.expect("of");
      const bt = this.type();
      if (!isOrdinal(bt)) this.err("Un conjunto tiene que ser de un tipo ordinal: set of char, set of 1..100, etc.");
      return { k: "set", name, base: bt };
    }
    if (this.accept("(")) {
      const values: string[] = [];
      const t: PType = { k: "enum", name, values };
      do {
        const id = this.expectId("un valor del tipo enumerado");
        this.declare({ kind: "enumval", name: id.v, raw: id.raw, type: t, level: this.scope.level, slot: -1, value: values.length }, id);
        values.push(id.raw);
      } while (this.accept(","));
      this.expect(")");
      return t;
    }
    if (this.is("file")) this.err("Los archivos no están soportados en este intérprete.");
    if (this.t.k === "id") {
      const s = this.scope.find(this.t.v);
      if (s && s.kind === "type") {
        this.next();
        if (s.name === "string" && this.accept("[")) {
          const n = this.constExpr();
          if (typeof n.v !== "number" || n.v < 1 || n.v > 255) this.err("El largo de un string tiene que estar entre 1 y 255.");
          this.expect("]");
          return { k: "string", name: name || `string[${n.v}]`, max: n.v as number };
        }
        return name && s.type.k === "string" ? { ...s.type, name } : s.type;
      }
      if (!s && !this.is("..", this.peek())) this.err(`El tipo '${this.t.raw}' no está declarado.`);
      if (s && s.kind !== "const" && s.kind !== "enumval") this.err(`'${this.t.raw}' no es un tipo.`);
    }
    // subrango: constante .. constante
    const lo = this.constExpr();
    this.expect("..", "Se esperaba un tipo o un subrango como 1..10.");
    const hi = this.constExpr();
    if (!isOrdinal(lo.t) || !isOrdinal(hi.t)) this.err("Los límites de un subrango tienen que ser ordinales (enteros, caracteres o enumerados).", tok);
    if (base(lo.t).k !== base(hi.t).k) this.err("Los dos límites del subrango tienen que ser del mismo tipo.", tok);
    const l = ord(lo.v), h = ord(hi.v);
    if (l > h) this.err(`El subrango ${l}..${h} está al revés: el primer valor tiene que ser el menor.`, tok);
    const bt = base(lo.t).k === "int" ? T.integer : base(lo.t);
    return { k: "sub", name: name || this.srcOf(tok), base: bt, lo: l, hi: h };
  }

  indexType(): { idx: PType; lo: number; hi: number } {
    const tok = this.t;
    const t = this.type();
    if (t.k === "sub") return { idx: t, lo: t.lo, hi: t.hi };
    const b = base(t);
    if (b.k === "char") return { idx: t, lo: 0, hi: 255 };
    if (b.k === "bool") return { idx: t, lo: 0, hi: 1 };
    if (b.k === "enum") return { idx: t, lo: 0, hi: b.values.length - 1 };
    if (b.k === "int") this.err(`El índice de un arreglo tiene que ser un rango acotado, por ejemplo [1..100], no '${typeName(t)}'.`, tok);
    return this.err("El índice de un arreglo tiene que ser un subrango o un tipo ordinal.", tok);
  }

  constExpr(): Expr & { k: "lit" } {
    const tok = this.t;
    const e = this.simple();
    if (e.k !== "lit") this.err("Se esperaba un valor constante.", tok);
    return e as Expr & { k: "lit" };
  }

  routineDecl() {
    const isFunc = this.next().v === "function";
    const id = this.expectId(isFunc ? "el nombre de la función" : "el nombre del procedimiento");
    let sym = this.scope.syms.get(id.v);
    let r: Routine;
    const fwd = sym && (sym.kind === "proc" || sym.kind === "func") && sym.routine && !sym.routine.body;
    if (fwd) r = sym!.routine!;
    else {
      r = { name: id.v, raw: id.raw, isFunc, params: [], ret: T.void, level: this.scope.level + 1, nslots: 0, resultSlot: -1, locals: [], body: null, line: id.line };
      sym = { kind: isFunc ? "func" : "proc", name: id.v, raw: id.raw, type: T.void, level: this.scope.level, slot: -1, routine: r };
      this.declare(sym, id);
    }
    const outer = this.scope, outerRoutine = this.routine;
    const inner = new Scope(outer, r.level, r);
    this.scope = inner;
    this.routine = r;
    if (!fwd) {
      if (isFunc) r.resultSlot = this.newSlot(T.void, id.raw);
      if (this.accept("(")) {
        do {
          const byRef = this.accept("var");
          if (!byRef) this.accept("const");
          const ns: Token[] = [this.expectId("el nombre de un parámetro")];
          while (this.accept(",")) ns.push(this.expectId("el nombre de un parámetro"));
          this.expect(":", `Falta ':' y el tipo del parámetro ${ns.map((n) => n.raw).join(", ")}.`);
          if (this.is("array")) this.err("En los parámetros el tipo tiene que ser un nombre de tipo: declarálo en 'type' (por ejemplo vector = array[1..10] of integer) y usá ese nombre.");
          const pt = this.type();
          for (const n of ns) {
            const p: Param = { name: n.v, raw: n.raw, type: pt, byRef };
            r.params.push(p);
            this.declare({ kind: "var", name: n.v, raw: n.raw, type: pt, level: r.level, slot: this.newSlot(pt, n.raw), byRef, isParam: true }, n);
          }
        } while (this.accept(";"));
        this.expect(")");
      }
      if (isFunc) {
        this.expect(":", `Falta el tipo que devuelve la función: function ${id.raw}(...) : tipo;`);
        r.ret = this.type();
        if (r.ret.k === "array" || r.ret.k === "record" || r.ret.k === "set") this.err("Una función no puede devolver un arreglo ni un registro: usá un procedimiento con un parámetro var.");
        sym!.type = r.ret;
        r.locals[0].type = r.ret;
      } else if (this.is(":")) this.err("Un procedimiento no devuelve valor. Si tiene que devolver uno, declaralo como function.");
    } else {
      // repetición del encabezado de un forward: se ignora
      if (this.accept("(")) { let d = 1; while (d) { if (this.is("(")) d++; if (this.is(")")) d--; this.next(); } }
      if (this.accept(":")) this.type();
      for (const p of r.params) inner.syms.set(p.name, this.findParamSym(r, p));
    }
    this.expect(";");
    if (this.t.k === "id" && this.t.v === "forward") {
      this.next();
      this.expect(";");
      this.scope = outer; this.routine = outerRoutine;
      return;
    }
    this.decls();
    if (!this.is("begin")) this.err(`Se esperaba 'begin' (el cuerpo de ${id.raw}) y apareció ${this.show()}.`);
    r.body = this.compound();
    this.expect(";", `Falta ';' después del 'end' que cierra ${id.raw}.`);
    this.scope = outer;
    this.routine = outerRoutine;
  }
  private paramSyms = new Map<Routine, Map<string, Sym>>();
  findParamSym(r: Routine, p: Param): Sym {
    // reconstruye el símbolo del parámetro (mismo slot que en la declaración forward)
    const i = r.params.indexOf(p);
    const slot = r.locals[(r.isFunc ? 1 : 0) + i].slot;
    let m = this.paramSyms.get(r);
    if (!m) this.paramSyms.set(r, (m = new Map()));
    let s = m.get(p.name);
    if (!s) m.set(p.name, (s = { kind: "var", name: p.name, raw: p.raw, type: p.type, level: r.level, slot, byRef: p.byRef, isParam: true }));
    return s;
  }

  // ---------- instrucciones ----------
  compound(): Stmt {
    const b = this.next(); // begin
    const body = this.stmtList(["end"], b);
    this.expect("end", `Falta 'end' para cerrar el 'begin' de la línea ${b.line}.`);
    return { k: "block", line: b.line, body };
  }

  stmtList(terms: string[], opener: Token): Stmt[] {
    const list: Stmt[] = [];
    for (;;) {
      const s = this.stmt();
      if (s) list.push(s);
      if (this.accept(";")) {
        if (this.is("else")) this.err("Antes de 'else' no va punto y coma: el ';' termina el if y el else queda suelto.", this.prev);
        continue;
      }
      if (terms.some((x) => this.is(x))) return list;
      if (this.t.k === "eof") this.err(`Falta '${terms[0]}' para cerrar el '${opener.raw}' de la línea ${opener.line}.`);
      if (this.is("else")) this.err("Este 'else' no corresponde a ningún if. ¿Hay un ';' de más antes, o falta un begin/end?");
      if (this.is("end") || this.is("until")) this.err(`Apareció '${this.t.raw}' pero se esperaba '${terms[0]}' para cerrar el '${opener.raw}' de la línea ${opener.line}.`);
      const pv = this.prev;
      throw new CompileError(pv.line, pv.col + pv.raw.length, `Falta ';' entre instrucciones (después de ${this.show(pv)}).`);
    }
  }

  stmt(): Stmt | null {
    const tok = this.t;
    if (tok.k === "kw") {
      switch (tok.v) {
        case "begin": return this.compound();
        case "if": return this.ifStmt();
        case "while": return this.whileStmt();
        case "repeat": return this.repeatStmt();
        case "for": return this.forStmt();
        case "case": return this.caseStmt();
        case "end": case "until": case "else": return null;
        case "with": case "goto": this.err(`'${tok.raw}' no está soportado en este intérprete.`);
      }
      this.err(`Se esperaba una instrucción y apareció la palabra reservada '${tok.raw}'.`);
    }
    if (tok.k === "id") return this.idStmt();
    if (this.is(";")) return null;
    if (tok.k === "eof") return null;
    return this.err(`Se esperaba una instrucción y apareció ${this.show()}.`);
  }

  cond(what: string): Expr {
    const tok = this.t;
    const e = this.expr();
    if (base(e.t).k !== "bool") this.err(`La condición del ${what} tiene que ser verdadera o falsa (boolean), pero es ${typeName(e.t)}.`, tok);
    return e;
  }

  ifStmt(): Stmt {
    const line = this.next().line;
    const c = this.cond("if");
    if (this.is(":=")) this.err("Para comparar se usa '=' ; ':=' es para asignar.");
    this.expect("then", `Falta 'then' después de la condición del if.`);
    const th = this.stmt();
    let el: Stmt | null = null;
    if (this.accept("else")) el = this.stmt();
    return { k: "if", line, cond: c, then: th, else: el };
  }

  whileStmt(): Stmt {
    const line = this.next().line;
    const c = this.cond("while");
    if (this.is(":=")) this.err("Para comparar se usa '=' ; ':=' es para asignar.");
    this.expect("do", "Falta 'do' después de la condición del while.");
    this.loopDepth++;
    const body = this.stmt();
    this.loopDepth--;
    return { k: "while", line, cond: c, body };
  }

  repeatStmt(): Stmt {
    const op = this.next();
    this.loopDepth++;
    const body = this.stmtList(["until"], op);
    this.loopDepth--;
    this.expect("until", `Falta 'until' para cerrar el repeat de la línea ${op.line}.`);
    const c = this.cond("until");
    return { k: "repeat", line: op.line, body, cond: c };
  }

  forStmt(): Stmt {
    const line = this.next().line;
    const vt = this.expectId("la variable de control del for");
    const sym = this.scope.find(vt.v);
    if (!sym) this.err(`La variable '${vt.raw}' no está declarada.`, vt);
    if (sym.kind !== "var") this.err(`'${vt.raw}' no es una variable.`, vt);
    if (!isOrdinal(sym.type)) this.err(`La variable de control del for tiene que ser de un tipo ordinal (integer, char...), no ${typeName(sym.type)}.`, vt);
    if (sym.loopLocked) this.err(`'${vt.raw}' ya es la variable de control de otro for que la contiene.`, vt);
    const v: Expr = { k: "var", sym, t: sym.type, line, src: vt.raw };
    this.expect(":=", "En el for se asigna el valor inicial con ':='.");
    const from = this.expr();
    let down = false;
    if (this.accept("downto")) down = true;
    else this.expect("to", "Falta 'to' (o 'downto') en el for.");
    const to = this.expr();
    if (!this.compatible(sym.type, from.t) || !this.compatible(sym.type, to.t)) this.err("Los límites del for tienen que ser del mismo tipo que la variable de control.");
    this.expect("do", "Falta 'do' en el for.");
    sym.loopLocked = true;
    this.loopDepth++;
    const body = this.stmt();
    this.loopDepth--;
    sym.loopLocked = false;
    return { k: "for", line, v, from, to, down, body };
  }

  caseStmt(): Stmt {
    const op = this.next();
    const e = this.expr();
    if (!isOrdinal(e.t)) this.err("El selector del case tiene que ser ordinal (integer, char, boolean o enumerado). Para strings o reales usá if.", op);
    this.expect("of", "Falta 'of' después del selector del case.");
    const arms: { labels: { lo: unknown; hi: unknown }[]; body: Stmt | null }[] = [];
    let els: Stmt[] | null = null;
    while (!this.is("end")) {
      if (this.is("else") || (this.t.k === "id" && this.t.v === "otherwise")) {
        const o = this.next();
        els = this.stmtList(["end"], o);
        break;
      }
      const labels: { lo: unknown; hi: unknown }[] = [];
      do {
        const lt = this.t;
        const lo = this.constExpr();
        let hi = lo;
        if (this.accept("..")) hi = this.constExpr();
        if (!this.compatible(e.t, lo.t)) this.err(`La etiqueta ${lt.raw} no es del mismo tipo que el selector del case.`, lt);
        labels.push({ lo: lo.v, hi: hi.v });
      } while (this.accept(","));
      this.expect(":", "Después de los valores de un caso va ':'.");
      const body = this.stmt();
      arms.push({ labels, body });
      if (!this.accept(";")) break;
    }
    this.expect("end", `Falta 'end' para cerrar el case de la línea ${op.line}.`);
    return { k: "case", line: op.line, e, arms, else: els };
  }

  idStmt(): Stmt {
    const tok = this.t;
    const sym = this.scope.find(tok.v);
    if (!sym && BUILTIN_PROCS.has(tok.v)) return this.builtinProc();
    if (!sym) {
      if (BUILTIN_FUNCS.has(tok.v)) this.err(`'${tok.raw}' es una función: devuelve un valor que hay que usar, por ejemplo x := ${tok.raw}(...);`);
      this.err(`'${tok.raw}' no está declarado.`);
    }
    if (sym.kind === "proc") {
      this.next();
      return { k: "call", line: tok.line, r: sym.routine!, args: this.callArgs(sym.routine!, tok) };
    }
    if (sym.kind === "func") {
      // asignación al nombre de la función = valor de retorno
      if (this.is(":=", this.peek())) {
        let s: Scope | null = this.scope;
        while (s && s.routine !== sym.routine) s = s.parent;
        if (!s) this.err(`Solo se puede asignar a '${tok.raw}' dentro de la propia función.`);
        this.next(); this.next();
        const e = this.expr();
        this.checkAssign(sym.routine!.ret, e, tok);
        const target: Expr = { k: "result", level: sym.routine!.level, slot: sym.routine!.resultSlot, t: sym.routine!.ret, line: tok.line, src: tok.raw };
        return { k: "assign", line: tok.line, target, e };
      }
      this.err(`'${tok.raw}' es una función y devuelve un valor: hay que usarlo, por ejemplo x := ${tok.raw}${sym.routine!.params.length ? "(...)" : ""}; o dentro de un if o un writeln.`);
    }
    if (sym.kind === "const" || sym.kind === "enumval") this.err(`'${tok.raw}' es una constante: no se le puede asignar un valor.`);
    if (sym.kind === "type") this.err(`'${tok.raw}' es un tipo, no una variable.`);
    const target = this.designator();
    if (target.k === "var" && target.sym.loopLocked) this.err(`No se puede modificar '${target.sym.raw}' dentro del for: es la variable de control del bucle.`, tok);
    if (this.is("=")) this.err("Para asignar se usa ':=' (dos puntos e igual). El '=' solo compara.");
    if (this.is("(")) this.err(`'${tok.raw}' es una variable, no un procedimiento.`);
    this.expect(":=", `Se esperaba ':=' para asignar un valor a ${target.src}.`);
    const e = this.expr();
    this.checkAssign(target.t, e, tok);
    return { k: "assign", line: tok.line, target, e };
  }

  callArgs(r: Routine, tok: Token): Expr[] {
    const args: Expr[] = [];
    if (this.accept("(")) {
      if (!this.is(")")) {
        do {
          const at = this.t;
          const i = args.length;
          const p = r.params[i];
          if (!p) this.err(`Sobran argumentos: '${r.raw}' recibe ${r.params.length}.`, at);
          const e = this.expr();
          if (p.byRef) {
            if (!["var", "index", "field", "deref", "result"].includes(e.k)) this.err(`El parámetro '${p.raw}' de ${r.raw} es var: hay que pasarle una variable, no un valor o una expresión.`, at);
            if (e.k === "var" && e.sym.loopLocked) this.err(`No se puede pasar la variable de control del for '${e.sym.raw}' como parámetro var.`, at);
            if (!this.sameType(p.type, e.t)) this.err(`El parámetro var '${p.raw}' es ${typeName(p.type)} y se le pasa ${typeName(e.t)}: en los parámetros var el tipo tiene que ser exactamente el mismo.`, at);
          } else this.checkAssign(p.type, e, at, `el parámetro '${p.raw}'`);
          args.push(e);
        } while (this.accept(","));
      }
      this.expect(")");
    }
    if (args.length < r.params.length) this.err(`Faltan argumentos: '${r.raw}' recibe ${r.params.length} (${r.params.map((p) => p.raw).join(", ")}) y se pasaron ${args.length}.`, tok);
    return args;
  }

  builtinProc(): Stmt {
    const tok = this.next();
    const name = tok.v, line = tok.line;
    const args: Expr[] = [];
    if (name === "write" || name === "writeln") {
      const wargs: WriteArg[] = [];
      if (this.accept("(")) {
        if (!this.is(")")) {
          do {
            const at = this.t;
            const e = this.expr();
            const k = base(e.t).k;
            if (k === "record") { const rt = base(e.t) as Extract<PType, { k: "record" }>; this.err(`No se puede escribir un registro completo: escribí campo por campo, por ejemplo writeln(${e.src}.${rt.fields[0]?.raw ?? "campo"}).`, at); }
            if (k === "array") this.err("No se puede escribir un arreglo completo: recorrelo con un for y escribí cada elemento.", at);
            if (k === "pointer" || k === "nil") this.err("No se puede escribir un puntero. Para ver el dato apuntado usá p^ (o p^.campo).", at);
            if (k === "set") this.err("No se puede escribir un conjunto.", at);
            const wa: WriteArg = { e };
            if (this.accept(":")) {
              wa.w = this.expr();
              if (this.accept(":")) {
                if (base(e.t).k !== "real") this.err("El formato :ancho:decimales solo se usa con números reales.", at);
                wa.d = this.expr();
              }
            }
            wargs.push(wa);
          } while (this.accept(","));
        }
        this.expect(")");
      }
      return { k: "builtin", line, name, args, wargs };
    }
    if (name === "read" || name === "readln") {
      if (this.accept("(")) {
        if (!this.is(")")) {
          do {
            const at = this.t;
            const e = this.expr();
            if (!["var", "index", "field", "deref"].includes(e.k)) this.err("read solo puede guardar en variables.", at);
            if (e.k === "var" && e.sym.loopLocked) this.err(`No se puede leer en '${e.sym.raw}': es la variable de control del for.`, at);
            const k = base(e.t).k;
            if (k === "record") { const rt = base(e.t) as Extract<PType, { k: "record" }>; this.err(`No se puede leer un registro completo: leé campo por campo, por ejemplo read(${e.src}.${rt.fields[0]?.raw ?? "campo"}).`, at); }
            if (k === "array") this.err("No se puede leer un arreglo completo: leé cada elemento con un for.", at);
            if (k === "bool") this.err("No se puede leer un boolean desde el teclado.", at);
            if (!["int", "real", "char", "string"].includes(k)) this.err(`No se puede leer un valor de tipo ${typeName(e.t)}.`, at);
            args.push(e);
          } while (this.accept(","));
        }
        this.expect(")");
      }
      return { k: "builtin", line, name, args };
    }
    if (name === "new" || name === "dispose") {
      this.expect("(", `${name} recibe un puntero: ${name}(p);`);
      const at = this.t;
      const e = this.expr();
      if (base(e.t).k !== "pointer") this.err(`${name} recibe una variable de tipo puntero.`, at);
      if (name === "new" && !["var", "index", "field", "deref"].includes(e.k)) this.err("new necesita una variable puntero.", at);
      this.expect(")");
      return { k: "builtin", line, name, args: [e] };
    }
    if (name === "inc" || name === "dec") {
      this.expect("(");
      const at = this.t;
      const e = this.expr();
      if (!["var", "index", "field", "deref"].includes(e.k) || !isOrdinal(e.t)) this.err(`${name} recibe una variable ordinal.`, at);
      if (e.k === "var" && e.sym.loopLocked) this.err(`No se puede modificar '${e.sym.raw}' dentro del for.`, at);
      args.push(e);
      if (this.accept(",")) { const n = this.expr(); if (base(n.t).k !== "int") this.err("El segundo argumento de inc/dec es un entero."); args.push(n); }
      this.expect(")");
      return { k: "builtin", line, name, args };
    }
    if (name === "break" || name === "continue") {
      if (!this.loopDepth) this.err(`'${name}' solo se puede usar dentro de un bucle.`, tok);
      return { k: "builtin", line, name, args };
    }
    if (name === "halt" || name === "exit") {
      if (this.accept("(")) { if (!this.is(")")) args.push(this.expr()); this.expect(")"); }
      return { k: "builtin", line, name, args };
    }
    // randomize
    if (this.accept("(")) this.expect(")");
    return { k: "builtin", line, name, args };
  }

  // ---------- expresiones ----------
  designator(): Expr {
    const tok = this.next();
    const sym = this.scope.find(tok.v)!;
    let e: Expr = { k: "var", sym, t: sym.type, line: tok.line, src: tok.raw };
    for (;;) {
      if (this.is("[")) {
        this.next();
        do {
          const at = this.t;
          const idx = this.expr();
          const bt = base(e.t);
          if (bt.k === "array") {
            if (!this.compatible(bt.idx, idx.t)) this.err(`El índice de ${e.src} tiene que ser ${typeName(bt.idx)} y es ${typeName(idx.t)}.`, at);
            if (idx.k === "lit" && (ord(idx.v) < bt.lo || ord(idx.v) > bt.hi)) this.err(`El índice ${at.raw} está fuera del rango ${bt.lo}..${bt.hi} de ${e.src}.`, at);
            e = { k: "index", base: e, idx, t: bt.elem, line: tok.line, src: "" };
          } else if (bt.k === "string") {
            if (base(idx.t).k !== "int") this.err("El índice de un string es un entero.", at);
            e = { k: "index", base: e, idx, t: T.char, line: tok.line, src: "" };
          } else this.err(`${e.src} no es un arreglo ni un string: no se le pueden poner corchetes.`, at);
          e.src = this.srcOf(tok) + "]";
        } while (this.accept(","));
        this.expect("]");
        e.src = this.srcOf(tok);
      } else if (this.is(".") && this.peek().k === "id") {
        this.next();
        const f = this.next();
        const bt = base(e.t);
        if (bt.k !== "record") {
          if (bt.k === "pointer") this.err(`${e.src} es un puntero: para acceder al campo del dato apuntado escribí ${e.src}^.${f.raw}`, f);
          this.err(`${e.src} no es un registro: no tiene campos.`, f);
        }
        const fd = bt.fields.find((x) => x.name === f.v);
        if (!fd) this.err(`El registro ${e.src} no tiene un campo '${f.raw}'. Sus campos son: ${bt.fields.map((x) => x.raw).join(", ")}.`, f);
        e = { k: "field", base: e, field: f.v, t: fd.type, line: tok.line, src: this.srcOf(tok) };
      } else if (this.is("^")) {
        const at = this.next();
        const bt = base(e.t);
        if (bt.k !== "pointer") this.err(`${e.src} no es un puntero: no se le puede aplicar '^'.`, at);
        if (!bt.to) this.err("Puntero a un tipo no resuelto.", at);
        e = { k: "deref", base: e, t: bt.to, line: tok.line, src: this.srcOf(tok) };
      } else return e;
    }
  }

  expr(): Expr {
    const tok = this.t;
    let l = this.simple();
    const rel = ["=", "<>", "<", "<=", ">", ">=", "in"];
    if (rel.some((o) => this.is(o))) {
      const op = this.next().v;
      const r = this.simple();
      l = this.bin(op, l, r, tok);
      if (rel.some((o) => this.is(o)))
        this.err("Faltan paréntesis: en Pascal 'and' y 'or' se evalúan antes que las comparaciones. Escribí cada comparación entre paréntesis, por ejemplo (x > 5) and (x < 10).");
    }
    return l;
  }

  simple(): Expr {
    const tok = this.t;
    let l: Expr;
    if (this.is("-") || this.is("+")) {
      const op = this.next().v;
      const e = this.term();
      if (!isNumeric(e.t)) this.err(`El signo '${op}' solo se aplica a números.`, tok);
      l = this.fold({ k: "un", op, e, t: base(e.t).k === "int" ? T.intlit : e.t, line: tok.line, src: "" }, tok);
    } else l = this.term();
    while (this.is("+") || this.is("-") || this.is("or") || this.is("xor")) {
      const op = this.next().v;
      const r = this.term();
      l = this.bin(op, l, r, tok);
    }
    return l;
  }

  term(): Expr {
    const tok = this.t;
    let l = this.factor();
    while (this.is("*") || this.is("/") || this.is("div") || this.is("mod") || this.is("and")) {
      const op = this.next().v;
      const r = this.factor();
      l = this.bin(op, l, r, tok);
    }
    return l;
  }

  factor(): Expr {
    const tok = this.t;
    const line = tok.line;
    if (tok.k === "int") { this.next(); return { k: "lit", v: tok.n, t: T.intlit, line, src: tok.raw }; }
    if (tok.k === "real") { this.next(); return { k: "lit", v: tok.n, t: T.real, line, src: tok.raw }; }
    if (tok.k === "str") { this.next(); return { k: "lit", v: tok.v, t: tok.v.length === 1 ? T.char : T.string, line, src: tok.raw }; }
    if (this.accept("nil")) return { k: "lit", v: null, t: T.nil, line, src: "nil" };
    if (this.accept("(")) {
      const e = this.expr();
      this.expect(")", "Falta cerrar el paréntesis ')'.");
      return { ...e, src: this.srcOf(tok) };
    }
    if (this.accept("not")) {
      const e = this.factor();
      const k = base(e.t).k;
      if (k !== "bool" && k !== "int") this.err("'not' se aplica a valores boolean.", tok);
      return this.fold({ k: "un", op: "not", e, t: k === "bool" ? T.boolean : T.intlit, line, src: this.srcOf(tok) }, tok);
    }
    if (this.is("-") || this.is("+")) {
      const op = this.next().v;
      const e = this.factor();
      if (!isNumeric(e.t)) this.err(`El signo '${op}' solo se aplica a números.`, tok);
      return this.fold({ k: "un", op, e, t: base(e.t).k === "int" ? T.intlit : e.t, line, src: this.srcOf(tok) }, tok);
    }
    if (this.accept("[")) {
      const items: { lo: Expr; hi?: Expr }[] = [];
      let bt: PType | null = null;
      if (!this.is("]")) {
        do {
          const at = this.t;
          const lo = this.expr();
          if (!isOrdinal(lo.t)) this.err("Los elementos de un conjunto tienen que ser ordinales (caracteres, enteros chicos...).", at);
          if (bt && !this.compatible(bt, lo.t)) this.err("Todos los elementos del conjunto tienen que ser del mismo tipo.", at);
          bt = bt ?? lo.t;
          const it: { lo: Expr; hi?: Expr } = { lo };
          if (this.accept("..")) it.hi = this.expr();
          items.push(it);
        } while (this.accept(","));
      }
      this.expect("]");
      return { k: "set", items, t: { k: "set", name: "", base: bt ?? T.integer }, line, src: this.srcOf(tok) };
    }
    if (tok.k === "id") {
      const sym = this.scope.find(tok.v);
      if (!sym) {
        if (BUILTIN_FUNCS.has(tok.v)) return this.builtinFunc();
        if (BUILTIN_PROCS.has(tok.v)) this.err(`'${tok.raw}' es un procedimiento: no devuelve un valor y no se puede usar dentro de una expresión.`);
        this.err(`'${tok.raw}' no está declarado.`);
      }
      if (sym.kind === "const" || sym.kind === "enumval") { this.next(); return { k: "lit", v: sym.value, t: sym.type, line, src: tok.raw }; }
      if (sym.kind === "var") return this.designator();
      if (sym.kind === "func") {
        this.next();
        const args = this.callArgs(sym.routine!, tok);
        return { k: "call", r: sym.routine!, args, t: sym.routine!.ret, line, src: this.srcOf(tok) };
      }
      if (sym.kind === "proc") this.err(`'${tok.raw}' es un procedimiento: no devuelve un valor. Si necesitás un resultado, usá una función o un parámetro var.`);
      this.err(`'${tok.raw}' es un tipo y no se puede usar como valor.`);
    }
    if (tok.k === "eof") this.err("El programa terminó en medio de una expresión.");
    return this.err(`Se esperaba un valor o una expresión y apareció ${this.show()}.`);
  }

  builtinFunc(): Expr {
    const tok = this.next();
    const name = tok.v, line = tok.line;
    const mk = (t: PType, args: Expr[], targ?: PType): Expr => ({ k: "builtin", name, args, t, targ, line, src: this.srcOf(tok) });
    if (name === "random" && !this.is("(")) return mk(T.real, []);
    if (name === "pi") return mk(T.real, []);
    this.expect("(", `${tok.raw} recibe argumentos entre paréntesis.`);
    if (name === "sizeof" || name === "high" || name === "low") {
      const at = this.t;
      let targ: PType;
      const s = at.k === "id" ? this.scope.find(at.v) : undefined;
      if (s && s.kind === "type") { this.next(); targ = s.type; }
      else targ = this.expr().t;
      this.expect(")");
      if (name === "sizeof") return mk(T.intlit, [], targ);
      const b = base(targ);
      if (b.k === "array") return { k: "lit", v: name === "high" ? b.hi : b.lo, t: T.intlit, line, src: this.srcOf(tok) };
      if (targ.k === "sub") return { k: "lit", v: fromOrd(name === "high" ? targ.hi : targ.lo, targ), t: targ.base, line, src: this.srcOf(tok) };
      if (b.k === "int") return { k: "lit", v: name === "high" ? b.max : b.min, t: T.intlit, line, src: this.srcOf(tok) };
      this.err(`${name} recibe un arreglo o un tipo ordinal.`, at);
    }
    const args: Expr[] = [];
    if (!this.is(")")) { do args.push(this.expr()); while (this.accept(",")); }
    this.expect(")");
    const need = (n: number) => { if (args.length !== n) this.err(`${tok.raw} recibe ${n} argumento${n > 1 ? "s" : ""}.`, tok); };
    const a0 = args[0]?.t;
    const num = () => { need(1); if (!isNumeric(a0)) this.err(`${tok.raw} recibe un número.`, tok); };
    switch (name) {
      case "abs": case "sqr": num(); return mk(base(a0).k === "int" ? T.intlit : T.real, args);
      case "sqrt": case "sin": case "cos": case "arctan": case "exp": case "ln": case "int": case "frac": num(); return mk(T.real, args);
      case "trunc": case "round": num(); return mk(T.intlit, args);
      case "ord": need(1); if (!isOrdinal(a0)) this.err("ord recibe un valor ordinal (char, boolean, entero o enumerado).", tok); return mk(T.intlit, args);
      case "chr": need(1); if (base(a0).k !== "int") this.err("chr recibe un entero (el código del carácter).", tok); return mk(T.char, args);
      case "succ": case "pred": need(1); if (!isOrdinal(a0)) this.err(`${name} recibe un valor ordinal.`, tok); return mk(base(a0).k === "int" ? T.intlit : a0, args);
      case "odd": need(1); if (base(a0).k !== "int") this.err("odd recibe un entero.", tok); return mk(T.boolean, args);
      case "length": need(1); if (!isStringy(a0)) this.err("length recibe un string.", tok); return mk(T.intlit, args);
      case "upcase": case "lowercase": need(1); if (!isStringy(a0)) this.err(`${name} recibe un char o un string.`, tok); return mk(base(a0).k === "char" ? T.char : T.string, args);
      case "copy": need(3); if (!isStringy(a0)) this.err("copy(cadena, desde, cantidad) recibe un string primero.", tok); return mk(T.string, args);
      case "pos": need(2); if (!isStringy(a0) || !isStringy(args[1].t)) this.err("pos(buscado, cadena) recibe dos strings.", tok); return mk(T.intlit, args);
      case "concat": if (!args.length || args.some((a) => !isStringy(a.t))) this.err("concat recibe strings.", tok); return mk(T.string, args);
      case "random": need(1); if (base(a0).k !== "int") this.err("random(n) recibe un entero.", tok); return mk(T.intlit, args);
    }
    return this.err(`Función desconocida ${tok.raw}.`, tok);
  }

  // ---------- tipos ----------
  sameType(a: PType, b: PType): boolean {
    if (a === b) return true;
    const A = base(a), B = base(b);
    if (A.k === "string" && B.k === "string") return true;
    if (A.k === "int" && B.k === "int") return A.name === B.name || (a.k === "sub" && b.k === "sub" && a.lo === b.lo && a.hi === b.hi);
    if (A.k !== B.k) return false;
    if (A.k === "real" || A.k === "bool" || A.k === "char") return true;
    if (A.k === "pointer" && B.k === "pointer") return A.to === B.to;
    return A === B;
  }

  compatible(a: PType, b: PType): boolean {
    const A = base(a), B = base(b);
    if (A.k === "int" && B.k === "int") return true;
    if (A.k === "char" && B.k === "char") return true;
    if (A.k === "bool" && B.k === "bool") return true;
    if (A.k === "enum" && B.k === "enum") return A === B;
    return false;
  }

  assignable(dst: PType, src: PType): boolean {
    const D = base(dst), S = base(src);
    if (dst === src) return true;
    if (D.k === "int" && S.k === "int") return true;
    if (D.k === "real" && (S.k === "int" || S.k === "real")) return true;
    if (D.k === "string" && (S.k === "string" || S.k === "char")) return true;
    if (D.k === "char" && S.k === "char") return true;
    if (D.k === "bool" && S.k === "bool") return true;
    if (D.k === "enum") return D === S;
    if (D.k === "pointer" && S.k === "nil") return true;
    if (D.k === "pointer" && S.k === "pointer") return D.to === S.to || !D.to || !S.to;
    if (D.k === "set" && S.k === "set") return S.base === T.integer || this.compatible(D.base, S.base);
    return D === S;
  }

  checkAssign(dst: PType, e: Expr, tok: Token, what?: string) {
    if (this.assignable(dst, e.t)) {
      // constantes fuera de rango en subrangos
      if (dst.k === "sub" && e.k === "lit" && (ord(e.v) < dst.lo || ord(e.v) > dst.hi))
        this.err(`El valor ${e.src} está fuera del rango ${typeName(dst)}.`, tok);
      return;
    }
    const D = base(dst), S = base(e.t);
    const destino = what ?? (tok.k === "id" ? `'${tok.raw}'` : "la variable");
    if (D.k === "int" && S.k === "real") this.err(`No se puede guardar un real en ${destino}, que es ${typeName(dst)}. Usá trunc(...) o round(...) para convertirlo a entero.`, tok);
    if (D.k === "char" && S.k === "string") this.err(`${destino} es char (un solo carácter) y se le asigna un string.`, tok);
    if ((D.k === "int" || D.k === "real") && (S.k === "string" || S.k === "char")) this.err(`No se puede guardar texto en ${destino}, que es numérica.`, tok);
    if (D.k === "pointer" && S.k === "pointer") this.err(`Los punteros apuntan a tipos distintos (${typeName(dst)} y ${typeName(e.t)}).`, tok);
    if ((D.k === "record" || D.k === "array") && D.k === S.k) this.err(`Tipos incompatibles: ${typeName(dst)} y ${typeName(e.t)}. Para asignar registros o arreglos completos tienen que estar declarados con el mismo nombre de tipo.`, tok);
    this.err(`Tipos incompatibles: no se puede asignar ${typeName(e.t)} a ${destino} (${typeName(dst)}).`, tok);
  }

  bin(op: string, l: Expr, r: Expr, tok: Token): Expr {
    const L = base(l.t), R = base(r.t);
    const line = tok.line;
    const src = this.srcOf(tok);
    const bad = (why?: string): never => this.err(why ?? `No se puede usar '${op}' entre ${typeName(l.t)} y ${typeName(r.t)}.`, tok);
    let t: PType;
    const nums = isNumeric(L) && isNumeric(R);
    switch (op) {
      case "+":
        if (nums) t = L.k === "int" && R.k === "int" ? T.intlit : T.real;
        else if (isStringy(L) && isStringy(R)) t = T.string;
        else if (L.k === "set" && R.k === "set") t = l.t;
        else t = bad();
        break;
      case "-": case "*":
        if (nums) t = L.k === "int" && R.k === "int" ? T.intlit : T.real;
        else if (L.k === "set" && R.k === "set") t = l.t;
        else t = bad();
        break;
      case "/":
        if (!nums) bad();
        t = T.real;
        break;
      case "div": case "mod":
        if (L.k !== "int" || R.k !== "int") bad(nums ? `'${op}' es solo para enteros. Para dividir números reales usá '/'.` : undefined);
        t = T.intlit;
        break;
      case "and": case "or": case "xor":
        if (L.k === "bool" && R.k === "bool") t = T.boolean;
        else if (L.k === "int" && R.k === "int") t = T.intlit;
        else t = bad(`'${op}' une condiciones boolean. Si estás comparando, poné cada comparación entre paréntesis: (a > b) ${op} (c < d).`);
        break;
      case "in":
        if (R.k !== "set" || !isOrdinal(L)) bad("'in' se usa así: valor in [conjunto], por ejemplo c in ['a', 'e', 'i', 'o', 'u'].");
        t = T.boolean;
        break;
      default: {
        const ok = nums || (isStringy(L) && isStringy(R)) || (L.k === "bool" && R.k === "bool") || (L.k === "enum" && L === R) ||
          ((op === "=" || op === "<>") && (L.k === "pointer" || L.k === "nil") && (R.k === "pointer" || R.k === "nil")) ||
          ((op === "=" || op === "<>") && L.k === "set" && R.k === "set");
        if (!ok) {
          if ((L.k === "record" || R.k === "record")) bad("Los registros no se pueden comparar completos: compará campo por campo.");
          if ((L.k === "pointer" || R.k === "pointer")) bad("Los punteros solo se comparan con '=' o '<>' (por ejemplo p <> nil).");
          bad(`No se puede comparar ${typeName(l.t)} con ${typeName(r.t)}.`);
        }
        t = T.boolean;
      }
    }
    return this.fold({ k: "bin", op, l, r, t, line, src }, tok);
  }

  /** Plegado de constantes: si los operandos son literales, se calcula ya. */
  fold(e: Expr, tok: Token): Expr {
    try {
      if (e.k === "bin" && e.l.k === "lit" && e.r.k === "lit" && e.op !== "in")
        return { k: "lit", v: binop(e.op, e.l.v, e.r.v, e.l.t, e.line), t: e.t, line: e.line, src: e.src };
      if (e.k === "un" && e.e.k === "lit") return { k: "lit", v: unop(e.op, e.e.v, e.e.t), t: e.t, line: e.line, src: e.src };
    } catch (x) {
      this.err((x as Error).message, tok);
    }
    return e;
  }
}

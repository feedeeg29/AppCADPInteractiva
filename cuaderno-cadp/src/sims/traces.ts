import type { BaseFrame } from "../lib/usePlayer";

/** Pruebas de escritorio automáticas: cada programa genera los pasos de su ejecución. */
export interface Marco {
  name: string;
  vars: Record<string, string | number>;
}
export interface TraceFrame extends BaseFrame {
  fr: Marco[];
  ch: string[];
  out: string;
  pos: number;
  tokens: string[];
}
export interface Programa {
  id: string;
  nombre: string;
  label: string;
  def: string;
  code: (n: number) => string;
  gen: (input: string) => { frames: TraceFrame[]; n: number };
}

function tracer(tokens: string[]) {
  const frames: TraceFrame[] = [];
  let out = "";
  let pos = -1;
  let prev: Record<string, string> = {};
  return {
    frames,
    read() {
      pos++;
      return tokens[pos];
    },
    print(s: string) {
      out += s;
    },
    step(line: number, msg: string, fr: Marco[], kind?: "ok" | "err") {
      const flat: Record<string, string> = {};
      fr.forEach((f) => Object.entries(f.vars).forEach(([k, v]) => (flat[f.name + "." + k] = String(v))));
      const ch = Object.keys(flat).filter((k) => prev[k] !== flat[k] && prev[k] !== undefined);
      prev = flat;
      frames.push({ line, msg, kind, fr: JSON.parse(JSON.stringify(fr)), ch, out, pos, tokens });
    },
  };
}
const nums = (s: string) => (s.match(/-?\d+/g) || []).map(Number);
type V = Record<string, string | number>;

const dosMinimos: Programa = {
  id: "min", nombre: "Dos mínimos", label: "Números a leer (hasta 8)", def: "8 3 12 1 5",
  code: (n) => `program dosMinimos;
var i, num, min1, min2 : integer;
begin
  min1 := 32767; min2 := 32767;
  for i := 1 to ${n} do begin
    read(num);
    if (num < min1) then begin
      min2 := min1;
      min1 := num;
    end
    else if (num < min2) then
      min2 := num;
  end;
  writeln(min1, ' ', min2);
end.`,
  gen(input) {
    let a = nums(input).slice(0, 8);
    if (!a.length) a = [8, 3, 12, 1, 5];
    const T = tracer(a.map(String));
    const v: V = { i: "?", num: "?", min1: "?", min2: "?" };
    const F = () => [{ name: "Programa principal", vars: v }];
    T.step(2, "Se declaran las variables. Todavía no tienen valor: contienen basura.", F());
    v.min1 = 32767; v.min2 = 32767;
    T.step(4, "Ambos mínimos arrancan en 32767, el mayor integer. Así cualquier número leído es menor.", F());
    for (let i = 1; i <= a.length; i++) {
      v.i = i; T.step(5, `Vuelta ${i} del for.`, F());
      const num = Number(T.read()); v.num = num; T.step(6, `Se lee ${num}.`, F());
      if (num < (v.min1 as number)) {
        T.step(7, `${num} < ${v.min1}: es el nuevo mínimo.`, F());
        v.min2 = v.min1; T.step(8, "El mínimo anterior pasa a ser el segundo.", F());
        v.min1 = num; T.step(9, "Se guarda el nuevo mínimo.", F());
      } else {
        T.step(7, `${num} no es menor que ${v.min1}.`, F());
        if (num < (v.min2 as number)) {
          T.step(11, `Pero ${num} < ${v.min2}: es el nuevo segundo mínimo.`, F());
          v.min2 = num; T.step(12, "Se actualiza min2.", F());
        } else T.step(11, `Tampoco es menor que ${v.min2}: no cambia nada.`, F());
      }
    }
    T.print(`${v.min1} ${v.min2}`);
    T.step(14, "Fin del for. Se informan los dos mínimos.", F(), "ok");
    return { frames: T.frames, n: a.length };
  },
};

const digitosPares: Programa = {
  id: "dig", nombre: "Contar dígitos pares", label: "Número (hasta 32767)", def: "2504",
  code: () => `program contarPares;
var num, dig, cant : integer;
begin
  read(num);
  cant := 0;
  while (num <> 0) do begin
    dig := num mod 10;
    if (dig mod 2 = 0) then
      cant := cant + 1;
    num := num div 10;
  end;
  writeln(cant);
end.`,
  gen(input) {
    const a = nums(input);
    const n0 = Math.min(a.length ? Math.abs(a[0]) : 2504, 32767);
    const T = tracer([String(n0)]);
    const v: V = { num: "?", dig: "?", cant: "?" };
    const F = () => [{ name: "Programa principal", vars: v }];
    let num = Number(T.read()); v.num = num; T.step(4, `Se lee ${num}.`, F());
    let cant = 0; v.cant = 0; T.step(5, "El contador empieza en 0.", F());
    while (num !== 0) {
      T.step(6, `${num} <> 0: entra al while.`, F());
      const dig = num % 10; v.dig = dig; T.step(7, `${num} mod 10 = ${dig}: es el último dígito.`, F());
      if (dig % 2 === 0) { T.step(8, `${dig} es par.`, F()); cant++; v.cant = cant; T.step(9, "Se cuenta.", F()); }
      else T.step(8, `${dig} es impar: no se cuenta.`, F());
      const old = num; num = Math.trunc(num / 10); v.num = num;
      T.step(10, `${old} div 10 = ${num}: se descarta el último dígito.`, F());
    }
    T.step(6, "num vale 0: termina el while.", F());
    T.print(String(cant));
    T.step(12, `Hay ${cant} dígitos pares.`, F(), "ok");
    return { frames: T.frames, n: 1 };
  },
};

function suma(ref: boolean): Programa {
  return {
    id: ref ? "ref" : "val",
    nombre: ref ? "suma con var num2" : "suma con num2 por valor",
    label: "Valor inicial de x",
    def: "10",
    code: () => `program Ejercicio3;
procedure suma(num1 : integer; ${ref ? "var " : ""}num2 : integer);
begin
  num2 := num1 + num2;
  num1 := 0;
end;
var
  i, x : integer;
begin
  read(x);
  for i := 1 to 5 do
    suma(i, x);
  write(x);
end.`,
    gen(input) {
      const a = nums(input);
      const T = tracer([String(a.length ? a[0] : 10)]);
      const m: V = { i: "?", x: "?" };
      let s: V | null = null;
      const F = () => (s ? [{ name: "Programa principal", vars: m }, { name: "suma", vars: s }] : [{ name: "Programa principal", vars: m }]);
      let x = Number(T.read()); m.x = x; T.step(10, `Se lee x = ${x}.`, F());
      for (let i = 1; i <= 5; i++) {
        m.i = i; T.step(11, `Vuelta ${i} del for.`, F());
        s = { num1: i, num2: ref ? "→ x = " + x : x };
        T.step(2, ref ? `num1 recibe una copia de i (${i}). num2 es un alias de x: misma memoria.` : `num1 recibe una copia de i (${i}) y num2 una copia de x (${x}).`, F());
        if (ref) { x = i + x; m.x = x; s.num2 = "→ x = " + x; T.step(4, `num2 := ${i} + ... = ${x}. Como es var, x cambia en el principal.`, F()); }
        else { s.num2 = i + x; T.step(4, `num2 := ${i} + ... = ${s.num2}. Solo cambia la copia: x sigue en ${x}.`, F()); }
        s.num1 = 0; T.step(5, "num1 := 0 modifica la copia. i no cambia.", F());
        s = null; T.step(12, "Termina suma: sus parámetros por valor desaparecen.", F());
      }
      T.print(String(x));
      T.step(13, ref ? `Se imprime ${x}.` : `Se imprime ${x}: el procedimiento nunca tocó x.`, F(), "ok");
      return { frames: T.frames, n: 1 };
    },
  };
}

const digParesImpares: Programa = {
  id: "dpi", nombre: "digParesImpares", label: "Secuencia (termina en 100)", def: "250 35 100",
  code: () => `procedure digParesImpares(num : integer; var par, impar : integer);
var dig : integer;
begin
  while (num <> 0) do begin
    dig := num mod 10;
    if ((dig mod 2) = 0) then
      par := par + 1
    else
      impar := impar + 1;
    num := num DIV 10;
  end;
end;
var dato, par, impar : integer;
begin
  par := 0; impar := 0;
  repeat
    read(dato);
    digParesImpares(dato, par, impar);
  until (dato = 100);
  writeln('Pares: ', par, ' Impares: ', impar);
end.`,
  gen(input) {
    let a = nums(input).filter((x) => x >= 0 && x <= 32767).slice(0, 5);
    if (!a.includes(100)) a.push(100);
    a = a.slice(0, a.indexOf(100) + 1);
    const T = tracer(a.map(String));
    const m: V = { dato: "?", par: "?", impar: "?" };
    let s: V | null = null;
    const F = () => (s ? [{ name: "Programa principal", vars: m }, { name: "digParesImpares", vars: s }] : [{ name: "Programa principal", vars: m }]);
    let par = 0, impar = 0, dato = 0;
    m.par = 0; m.impar = 0; T.step(15, "Se inicializan los contadores en el programa principal.", F());
    do {
      dato = Number(T.read()); m.dato = dato; T.step(17, `Se lee ${dato}.`, F());
      let num = dato;
      s = { num, dig: "?", par: "→ par = " + par, impar: "→ impar = " + impar };
      T.step(1, `Se invoca el módulo. num recibe una copia de ${dato}; par e impar son la misma memoria que las del principal.`, F());
      while (num !== 0) {
        const dig = num % 10; s.dig = dig; T.step(5, `dig = ${dig}.`, F());
        if (dig % 2 === 0) { par++; m.par = par; s.par = "→ par = " + par; T.step(7, `${dig} es par: se incrementa par (y cambia en el principal).`, F()); }
        else { impar++; m.impar = impar; s.impar = "→ impar = " + impar; T.step(9, `${dig} es impar: se incrementa impar.`, F()); }
        num = Math.trunc(num / 10); s.num = num; T.step(10, `num = ${num}. Es la copia: dato no cambia.`, F());
      }
      s = null; T.step(18, "Termina el módulo. Su copia de num y dig desaparecen.", F());
      T.step(19, dato === 100 ? "dato = 100: termina el repeat." : `${dato} <> 100: otra vuelta.`, F());
    } while (dato !== 100);
    T.print(`Pares: ${par} Impares: ${impar}`);
    T.step(20, "Se informan los totales acumulados.", F(), "ok");
    return { frames: T.frames, n: 1 };
  },
};

const corteAutos: Programa = {
  id: "autos", nombre: "Promedio por marca", label: "Autos marca:precio (ordenados por marca)",
  def: "Fiat:12000 Fiat:9000 Ford:8000 Ford:30000 Ford:15000 Toyota:11000",
  code: () => `leerAuto(a);
while (a.marca <> 'ZZZ') do begin
  actual := a.marca;
  cant := 0; suma := 0;
  while (a.marca = actual) do begin
    cant := cant + 1;
    suma := suma + a.precio;
    leerAuto(a);
  end;
  writeln(actual, ': ', suma / cant :0:2);
end;`,
  gen(input) {
    let a = input.split(/[\s,]+/).filter(Boolean)
      .map((x) => { const [m, p] = x.split(":"); return { m: (m || "").slice(0, 12), p: Number(p) || 0 }; })
      .filter((x) => x.m && x.m !== "ZZZ").slice(0, 9);
    if (!a.length) a = [{ m: "Fiat", p: 12000 }];
    a.push({ m: "ZZZ", p: 0 });
    const T = tracer(a.map((x) => (x.m === "ZZZ" ? "ZZZ" : `${x.m} $${x.p}`)));
    const v: V = { "a.marca": "?", "a.precio": "?", actual: "?", cant: "?", suma: "?" };
    const F = () => [{ name: "Programa principal", vars: v }];
    let k = -1;
    const leer = () => { k++; T.read(); v["a.marca"] = a[k].m; v["a.precio"] = a[k].m === "ZZZ" ? "?" : a[k].p; };
    leer(); T.step(1, `Lectura previa: ${v["a.marca"]}.`, F());
    const vistos = new Set<string>();
    while (v["a.marca"] !== "ZZZ") {
      T.step(2, "No es el fin: empieza un grupo nuevo.", F());
      const actual = String(v["a.marca"]); v.actual = actual;
      const rep = vistos.has(actual); vistos.add(actual);
      T.step(3, `Se guarda la marca del grupo: ${actual}.` + (rep ? " Ojo: esta marca ya tuvo un grupo antes. Si los datos no vienen ordenados, el corte de control da resultados partidos." : ""), F(), rep ? "err" : undefined);
      let cant = 0, sum = 0; v.cant = 0; v.suma = 0; T.step(4, "Los totales del grupo arrancan en 0.", F());
      while (v["a.marca"] === actual) {
        T.step(5, `${actual} = ${actual}: sigue el mismo grupo.`, F());
        cant++; v.cant = cant; T.step(6, "Se cuenta el auto.", F());
        sum += Number(v["a.precio"]); v.suma = sum; T.step(7, "Se acumula el precio.", F());
        leer(); T.step(8, `Se lee el siguiente: ${v["a.marca"]}.`, F());
      }
      T.step(5, `${v["a.marca"]} ≠ ${actual}: terminó el grupo.`, F());
      T.print(`${actual}: ${(sum / cant).toFixed(2)}\n`);
      T.step(10, `Se informa el promedio de ${actual}.`, F(), "ok");
    }
    T.step(2, "Llegó ZZZ: termina el procesamiento.", F(), "ok");
    return { frames: T.frames, n: 1 };
  },
};

export const TRAZAS: Record<"traza" | "parametros" | "corte", Programa[]> = {
  traza: [dosMinimos, digitosPares],
  parametros: [suma(true), suma(false), digParesImpares],
  corte: [corteAutos],
};

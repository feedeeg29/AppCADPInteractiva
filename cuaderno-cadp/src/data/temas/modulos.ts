import type { Tema } from "../types";

const tema: Tema = {
  id: "modulos",
  num: "P2·1",
  titulo: "Funciones y procedimientos",
  fuente: "Práctica 2 (parte 1)",
  resumen: "Cómo partir un programa en módulos, la diferencia entre función y procedimiento, y las reglas de alcance de las variables.",
  sim: null,
  teoria: [
    { h: "¿Por qué modularizar?" },
    {
      p: "Un módulo resuelve una parte del problema con una tarea bien definida. Se gana legibilidad, reuso (lo invocás muchas veces) y es más fácil encontrar errores, porque cada módulo se prueba por separado."
    },
    { h: "Procedimiento o función" },
    {
      table: [
        ["", "Procedimiento", "Función"],
        ["Devuelve", "0, 1 o más valores (por parámetros var)", "Exactamente un valor de tipo simple"],
        [
          "Se invoca",
          "Como una sentencia: <code>leer(a);</code>",
          "Dentro de una expresión: <code>x := doble(a);</code>"
        ],
        ["Retorno", "No tiene", "Se asigna al nombre: <code>doble := n * 2;</code>"]
      ]
    },
    {
      code: `function esPar(n : integer) : boolean;
begin
  esPar := (n mod 2 = 0);
end;

procedure informar(n : integer);
begin
  if esPar(n) then
    writeln(n, ' es par')
  else
    writeln(n, ' es impar');
end;`
    },
    {
      tip: "Una función tiene que asignar su nombre en <b>todos</b> los caminos posibles. Si un if no cubre un caso, la función devuelve basura."
    },
    { h: "Alcance: global, local y parámetro" },
    {
      list: [
        "<b>Local</b>: declarada dentro del módulo. Existe solo mientras el módulo se ejecuta.",
        "<b>Global</b>: declarada en el programa <i>antes</i> de los módulos. La ve todo el código que está debajo.",
        "Las variables del programa principal se declaran <b>después</b> de los módulos, así los módulos no pueden verlas. Es lo correcto.",
        "Si una local se llama igual que una global, dentro del módulo gana la local (la global queda oculta)."
      ]
    },
    {
      code: `program alcance1;
var a, b : integer;          { globales }
procedure uno;
var b : integer;             { local: oculta a la global b }
begin
  b := 3;
  writeln(b);                { 3 }
end;
begin
  a := 1; b := 2;
  uno;
  writeln(b, a);             { 21: la b global no cambió }
end.`
    },
    {
      tip: "A partir de la práctica 3 no se usan variables globales. Todo lo que un módulo necesita entra y sale por parámetros."
    },
    { h: "Módulos anidados" },
    {
      p: "Un módulo declarado dentro de otro solo puede invocarse desde ese módulo. Si el programa principal lo necesita, hay que declararlo afuera, en el nivel del programa."
    }
  ],
  quiz: [
    {
      q: "¿Qué imprime <code>alcance2</code>?",
      code: `program alcance2;
var a, b : integer;
procedure uno;
begin
  b := 3;
  writeln(b);
end;
begin
  a := 1; b := 2;
  uno;
  writeln(b, a);
end.`,
      ops: ["3 y luego 21", "3 y luego 31", "2 y luego 21", "Error de compilación"],
      ok: 1,
      exp: "uno no declara b, así que modifica la global. Al volver, b vale 3."
    },
    {
      q: "En <code>alcance3</code>, el programa principal hace <code>writeln(a, b)</code> pero <code>b</code> está declarada solo dentro de <code>uno</code>. ¿Qué pasa?",
      ops: [
        "Imprime 1 y 2",
        "Imprime 1 y basura",
        "Error de compilación: b no está declarada en ese alcance",
        "Imprime 1 y 0"
      ],
      ok: 2,
      exp: "b es local a uno. Fuera del procedimiento no existe y el compilador la rechaza."
    },
    {
      q: "¿Qué está mal en este programa?",
      code: `function cuatro : integer;
begin
  cuatro := 4;
end;
var a : integer;
begin
  cuatro;
  writeln(a);
end.`,
      ops: [
        "La función no tiene parámetros",
        "Una función se usa en una expresión: falta a := cuatro;",
        "cuatro debería ser real",
        "Nada, imprime 4"
      ],
      ok: 1,
      exp: "El valor que devuelve la función se pierde y a nunca se inicializa. Lo correcto es a := cuatro;."
    },
    {
      q: "Una función calcula <code>prom</code> pero nunca hace <code>calcularPromedio := prom</code>. ¿Qué devuelve?",
      ops: ["prom", "0", "Un valor indefinido (basura)", "Error al compilar siempre"],
      ok: 2,
      exp: "El nombre de la función nunca recibió valor. Hay que agregar calcularPromedio := prom al final."
    },
    {
      q: "¿Cuál de estas tareas <b>no</b> puede resolverse con una función?",
      ops: [
        "Devolver si un número es par",
        "Devolver el mayor de dos números",
        "Devolver la cantidad de dígitos y su suma",
        "Devolver el promedio de dos reales"
      ],
      ok: 2,
      exp: "Son dos resultados. Una función devuelve uno solo; para dos hace falta un procedimiento con dos parámetros var."
    },
    {
      q: "La función <code>analizarLetra</code> está declarada dentro del procedimiento <code>leer</code>. ¿Puede invocarla el programa principal?",
      ops: [
        "Sí, siempre",
        "No: solo es visible dentro de leer",
        "Sí, si se pasa por parámetro",
        "Solo si es boolean"
      ],
      ok: 1,
      exp: "Un módulo anidado es local al módulo que lo contiene. Para usarla desde el principal hay que declararla afuera."
    },
    {
      q: "Si <code>analizarLetra</code> solo contempla minúsculas y mayúsculas, ¿qué pasa al ingresar '5'?",
      ops: ["Devuelve false", "Devuelve true", "Devuelve un valor indefinido", "El programa termina"],
      ok: 2,
      exp: "Ningún if asigna el nombre de la función. Se arregla agregando un else final que asigne un valor."
    }
  ],
  ejercicios: [
    {
      ref: "P2·1 Ej 4",
      titulo: "alcance4a vs alcance4b",
      enunciado: "En 4a las variables a y b se declaran antes del procedimiento uno; en 4b se declaran después. Explicar la diferencia.",
      pista: "¿Qué variables ve uno en cada caso?",
      sol: `{ 4a: a y b son globales y uno las ve.
       uno asigna a := 1 sobre la global.
       Imprime: 1 y luego 21. }

{ 4b: uno se declara antes que a y b,
       así que dentro de uno 'a' no existe.
       Error de compilación: identificador no declarado. }`
    },
    {
      ref: "P2·1 Ej 6",
      titulo: "El par más alto",
      enunciado: "(a) Módulo que lea enteros hasta un negativo e imprima el número par más alto. (b) Programa que lo invoque.",
      pista: "Un procedimiento sin parámetros alcanza, porque lee e imprime solo. Inicializá el máximo en un valor que ningún dato válido pueda tener.",
      sol: `program parMasAlto;
procedure procesar;
var
  num, max : integer;
begin
  max := -1;
  read(num);
  while (num >= 0) do begin
    if (num mod 2 = 0) and (num > max) then
      max := num;
    read(num);
  end;
  if (max = -1) then
    writeln('No se leyeron pares')
  else
    writeln('El par más alto es ', max);
end;
begin
  procesar;
end.`
    },
    {
      ref: "P2·1 Ej 7",
      titulo: "calcularPromedio",
      enunciado: "Corregir la función calcularPromedio (globales suma y cant), invocarla una sola vez y decir qué imprime con suma = 48 y cant = 6 en cada versión.",
      pista: "Falta asignar el nombre de la función. Para invocarla una sola vez, guardá el resultado en una variable. En el original, además, se hace cant := 0 antes de la segunda llamada.",
      sol: `{ a) Agregar al final de la función:
       calcularPromedio := prom;
  b) var p : real;
     p := calcularPromedio;
     if (p <> -1) then writeln('El promedio es: ', p)
     else writeln('Dividir por cero no parece ser una buena idea');
  c) i)   Original: el resultado es indefinido (la función no asigna su nombre).
     ii)  Con (a): la primera llamada da 8, pero antes de la segunda
          se pone cant := 0, así que imprime -1.
     iii) Con (a) y (b): imprime 8. }`
    }
  ]
};

export default tema;

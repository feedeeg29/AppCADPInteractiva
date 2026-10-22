import type { Ejercicio } from "../types";

const G = "Práctica 2 · Parte 1 · Funciones y procedimientos";

export const guiaP21: Ejercicio[] = [
  {
    grupo: G, ref: "P2·1 Ej 1", titulo: "alcance1: ¿qué imprime?",
    enunciado: "Dado el programa alcance1 (variables globales a y b; el procedimiento uno declara su propia variable local b, le asigna 3 y la imprime; el programa principal hace a := 1, b := 2, llama a uno e imprime b y a), indicar qué imprime.",
    pista: "Dentro de uno hay una b local que oculta a la global. Lo que pase con esa b no afecta a la b del programa principal.",
    sol: `program alcance1;
var a, b : integer;
procedure uno;
var b : integer;        { b local: oculta a la b global }
begin
  b := 3;
  writeln(b);           { imprime 3 }
end;
begin
  a := 1;
  b := 2;
  uno;
  writeln(b, a);        { imprime 21: la b global sigue valiendo 2 }
end.

{ Salida:
  3
  21
  (writeln(b, a) no deja espacio entre los valores) }`,
    entrada: "",
  },
  {
    grupo: G, ref: "P2·1 Ej 2", titulo: "alcance2: ¿qué imprime?",
    enunciado: "Igual que alcance1, pero el procedimiento uno no declara ninguna variable local: asigna b := 3 directamente. Indicar qué imprime.",
    pista: "Sin una b local, la b que modifica uno es la global.",
    sol: `program alcance2;
var a, b : integer;
procedure uno;
begin
  b := 3;               { modifica la b global }
  writeln(b);           { imprime 3 }
end;
begin
  a := 1;
  b := 2;
  uno;
  writeln(b, a);        { imprime 31 }
end.

{ Salida:
  3
  31
  Este es el problema de usar variables globales: un módulo cambia
  datos del programa sin que se vea en su encabezado. }`,
    entrada: "",
  },
  {
    grupo: G, ref: "P2·1 Ej 3", titulo: "alcance3: ¿cuál es el error?",
    enunciado: "El procedimiento uno declara una variable local b y la imprime. El programa principal, después de llamar a uno, hace writeln(a, b). Indicar cuál es el error y su causa.",
    pista: "¿Dónde existe la variable b? ¿Desde dónde se la quiere usar?",
    sol: `{ Error de compilación en writeln(a, b): 'b' no está declarada.
  b es local del procedimiento uno: solo existe mientras uno se
  ejecuta y no se puede usar desde el programa principal.

  Una forma de arreglarlo es que uno devuelva el valor por parámetro: }
program alcance3;
procedure uno(var b : integer);
begin
  b := 2;
  writeln(b);
end;
var
  a, b : integer;
begin
  a := 1;
  uno(b);
  writeln(a, b);    { imprime 12 }
end.`,
    entrada: "",
  },
  {
    grupo: G, ref: "P2·1 Ej 4", titulo: "alcance4a vs alcance4b",
    enunciado: "Los dos programas son iguales (el procedimiento uno asigna a := 1 y lo imprime), salvo que en alcance4a las variables a y b se declaran antes del procedimiento y en alcance4b después. Explicar la diferencia.",
    pista: "Un módulo solo ve lo que está declarado antes que él (o dentro de él).",
    sol: `{ alcance4a: a y b se declaran antes de uno, así que son globales y uno
  las ve. uno asigna a := 1 en la global e imprime 1. Después el principal
  imprime 21. Compila y funciona (aunque usa una variable global).

  alcance4b: a y b se declaran después de uno, así que son variables del
  programa principal y uno no las ve. Dentro de uno, 'a' no existe:
  error de compilación "a no está declarado".

  4b es la forma correcta de declarar las variables del programa
  principal: así ningún módulo puede tocarlas sin recibirlas por parámetro. }
program alcance4a;
var a, b : integer;
procedure uno;
begin
  a := 1;
  writeln(a);
end;
begin
  a := 1;
  b := 2;
  uno;
  writeln(b, a);
end.`,
    entrada: "",
  },
  {
    grupo: G, ref: "P2·1 Ej 5", titulo: "La función cuatro",
    enunciado: "Un programa que debería imprimir 4 declara function cuatro: integer (que asigna cuatro := 4) y en el cuerpo principal hace cuatro; writeln(a);. Indicar cuál es el error.",
    pista: "¿Qué pasa con el valor que devuelve una función si nadie lo usa? ¿Qué valor tiene a?",
    sol: `{ Errores:
  1. Una función devuelve un valor y se invoca dentro de una expresión.
     La sentencia 'cuatro;' descarta el resultado.
  2. La variable a nunca recibe un valor, así que writeln(a) imprime basura.
  Corrección: guardar el resultado de la función en a. }
program alcance5;
function cuatro : integer;
begin
  cuatro := 4;
end;
var
  a : integer;
begin
  a := cuatro;
  writeln(a);       { imprime 4 }
end.`,
    entrada: "",
  },
  {
    grupo: G, ref: "P2·1 Ej 6", titulo: "El par más alto",
    enunciado: "(a) Realizar un módulo que lea enteros hasta que llegue un valor negativo e imprima el número par más alto. (b) Implementar un programa que invoque al módulo.",
    pista: "Un procedimiento sin parámetros alcanza, porque lee e imprime solo. Inicializá el máximo con un valor que ningún dato válido pueda tener (-1).",
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
    writeln('No se leyeron números pares')
  else
    writeln('El número par más alto es ', max);
end;

begin
  procesar;
end.`,
    entrada: "7 12 3 40 9 22 -1",
  },
  {
    grupo: G, ref: "P2·1 Ej 7", titulo: "calcularPromedio",
    enunciado: "La función calcularPromedio calcula el promedio entre las globales suma y cant (o -1 si cant es 0). (a) ¿Qué le falta para funcionar? (b) El principal la invoca dos veces: ¿cómo invocarla una sola vez? (c) ¿Qué imprime con suma = 48 y cant = 6 en el original, con (a), y con (a) y (b)?",
    pista: "Una función tiene que asignar su nombre. Mirá también qué hace el programa principal con cant entre las dos invocaciones, y si hay algún ';' fuera de lugar.",
    sol: `{ a) Falta asignar el resultado: calcularPromedio := prom;
     (además, en el original hay un ';' antes del else en el programa
     principal: así como está, ni siquiera compila)
  b) Guardar el resultado en una variable y usar esa variable.
  c) i)   Original: no compila por el ';' antes del else. Si se lo saca,
          el resultado es indefinido porque la función nunca asigna su nombre.
     ii)  Con (a): la primera invocación da 8, pero antes de la segunda
          se hace cant := 0, así que imprime 'El promedio es: -1'.
     iii) Con (a) y (b): imprime 'El promedio es: 8.00'. }
program alcanceYFunciones;
var
  suma, cant : integer;

function calcularPromedio : real;
var
  prom : real;
begin
  if (cant = 0) then
    prom := -1
  else
    prom := suma / cant;
  calcularPromedio := prom;
end;

var
  p : real;
begin
  readln(suma);
  readln(cant);
  p := calcularPromedio;
  if (p <> -1) then
    writeln('El promedio es: ', p:0:2)
  else
    writeln('Dividir por cero no parece ser una buena idea');
end.`,
    entrada: "48\n6",
  },
  {
    grupo: G, ref: "P2·1 Ej 8", titulo: "analizarLetra anidada",
    enunciado: "La función analizarLetra está declarada dentro del procedimiento leer y usa la variable letra de leer. (a) El programa principal también la invoca: ¿qué problema hay y cómo se resuelve? (b) La función no cubre algunos valores de letra: ¿cuáles?, ¿qué pasa si se ingresan?, ¿cómo se resuelve?",
    pista: "Un módulo anidado solo es visible dentro del módulo que lo contiene. Y una función que no asigna su nombre en todos los caminos devuelve basura.",
    sol: `{ a) i)  analizarLetra es local de leer: el programa principal no la ve y
          no compila ("analizarLetra no está declarado").
     ii) Se declara a nivel del programa y recibe la letra por parámetro
         (en vez de usar la variable de leer). leer devuelve la letra leída
         con un parámetro var.
  b) i)  Los caracteres que no son letras: dígitos, espacios, signos ('5', '?').
     ii) Ningún if asigna el nombre de la función: devuelve un valor
         indefinido y el programa puede decir cualquier cosa.
     iii) Agregar un else final que asigne un valor, y que el programa
          distinga los tres casos.
  Además, en el original hay un ';' antes del else dentro de la función. }
program anidamientos;

function esMinuscula(letra : char) : boolean;
begin
  esMinuscula := (letra >= 'a') and (letra <= 'z');
end;

function esMayuscula(letra : char) : boolean;
begin
  esMayuscula := (letra >= 'A') and (letra <= 'Z');
end;

procedure leer(var letra : char);
begin
  readln(letra);
  if esMinuscula(letra) then
    writeln('Se trata de una minúscula')
  else if esMayuscula(letra) then
    writeln('Se trata de una mayúscula')
  else
    writeln('No es una letra');
end;

var
  letra : char;
begin
  leer(letra);
  if esMinuscula(letra) then
    writeln('Gracias, vuelva prontosss');
end.`,
    entrada: "q",
  },
];

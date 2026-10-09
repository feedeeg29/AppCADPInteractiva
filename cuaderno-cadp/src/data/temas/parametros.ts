import type { Tema } from "../types";

const tema: Tema = {
  id: "parametros",
  num: "P2·2",
  titulo: "Parámetros",
  fuente: "Práctica 2 (parte 2)",
  resumen: "Pasaje por valor y por referencia, cómo devolver varios resultados y cómo hacer pruebas de escritorio con módulos.",
  sim: "parametros",
  teoria: [
    { h: "Por valor y por referencia" },
    {
      table: [
        ["", "Por valor", "Por referencia (var)"],
        ["Qué recibe el módulo", "Una copia del dato", "La variable original (un alias)"],
        ["Si el módulo la modifica", "El cambio se pierde al salir", "El cambio queda en la variable"],
        ["Qué se puede pasar", "Variable, constante o expresión", "Solo una variable"],
        ["Uso típico", "Datos de entrada", "Resultados que el módulo devuelve"]
      ]
    },
    {
      code: `procedure suma(num1 : integer; var num2 : integer);
begin
  num2 := num1 + num2;   { cambia la variable original }
  num1 := 0;             { cambia solo la copia }
end;`
    },
    { h: "Reglas de correspondencia" },
    {
      p: "Los parámetros reales (en la invocación) y los formales (en el encabezado) se emparejan por <b>posición</b>. Tienen que coincidir en cantidad, orden y tipo. Los nombres no importan."
    },
    {
      code: `procedure leerDatos(var legajo : integer; var salario : real);
...
leerDatos(leg, sal);       { bien }
leerDatos(sal, leg);       { mal: tipos invertidos }`
    },
    { h: "Devolver varios resultados" },
    {
      p: "Cuando un módulo tiene que devolver más de un valor, se usa un procedimiento con varios parámetros por referencia."
    },
    {
      code: `procedure analizar(num : integer; var cantDig, suma : integer);
begin
  cantDig := 0; suma := 0;
  repeat
    cantDig := cantDig + 1;
    suma := suma + num mod 10;
    num := num div 10;
  until (num = 0);
end;`
    },
    {
      tip: "num se pasa por valor: el módulo lo destruye dividiéndolo por 10, pero en el programa principal el número sigue intacto."
    },
    { h: "Cuándo usar cada uno" },
    {
      list: [
        "Un solo resultado simple → función.",
        "Varios resultados, o un registro, vector o lista que se modifica → procedimiento con <code>var</code>.",
        "Datos que el módulo solo consulta → por valor. (Las estructuras grandes a veces se pasan por referencia para no copiarlas, aunque no se modifiquen.)"
      ]
    }
  ],
  quiz: [
    {
      q: "Con <code>procedure suma(num1 : integer; var num2 : integer)</code>, leés x = 10 y hacés <code>for i := 1 to 5 do suma(i, x)</code>. ¿Qué imprime <code>write(x)</code>?",
      ops: ["10", "15", "25", "0"],
      ok: 2,
      exp: "x es la variable original: 10 + 1 + 2 + 3 + 4 + 5 = 25."
    },
    {
      q: "Mismo programa, pero ahora <code>num2</code> es por valor. ¿Qué imprime?",
      ops: ["10", "25", "15", "Error"],
      ok: 0,
      exp: "suma trabaja sobre una copia de x. El valor original nunca cambia."
    },
    {
      q: "¿Se puede invocar <code>sumar(a, b, 0)</code> si el tercer parámetro es <code>var c : integer</code>?",
      ops: ["Sí", "No: por referencia solo se pasan variables", "Solo si c es real", "Sí, pero c vale 0 siempre"],
      ok: 1,
      exp: "Un parámetro var necesita una variable donde dejar el resultado. Un literal no sirve."
    },
    {
      q: "¿Qué imprime <code>digParesImpares</code> con la secuencia 250, 35, 100?",
      ops: ["Pares: 4  Ímpares: 4", "Pares: 2  Ímpares: 3", "Pares: 3  Ímpares: 4", "Pares: 4  Ímpares: 3"],
      ok: 0,
      exp: "250 → pares 0 y 2, impar 5. 35 → dos impares. 100 → pares 0 y 0, impar 1. Total: 4 pares y 4 impares (par e impar se acumulan entre llamadas porque son var)."
    },
    {
      q: "¿Qué pasa si un procedimiento declara <code>var salario : real</code> y lo invocás con una variable integer?",
      ops: [
        "Convierte automáticamente",
        "Error: el tipo tiene que coincidir exactamente",
        "Funciona pero redondea",
        "Solo da error en ejecución"
      ],
      ok: 1,
      exp: "En el pasaje por referencia los tipos deben ser idénticos."
    },
    {
      q: "Un módulo debe recibir un número y devolver la cantidad de dígitos y su suma. ¿Qué encabezado es correcto?",
      ops: [
        "function digitos(n : integer) : integer;",
        "procedure digitos(n : integer; cant, suma : integer);",
        "procedure digitos(n : integer; var cant, suma : integer);",
        "procedure digitos(var n, cant, suma : integer);"
      ],
      ok: 2,
      exp: "Dos resultados: procedimiento con dos var. n va por valor porque el módulo lo modifica y no hay que romper el original."
    }
  ],
  ejercicios: [
    {
      ref: "P2·2 Ej 3",
      titulo: "Los 6 errores de sumar",
      enunciado: "El programa ejercicio5 debe sumar los números entre a y b y devolver el resultado en c, e informar si quedó entre 10 y 30. Encontrar los 6 errores.",
      pista: "Revisá: encabezado, variables no declaradas, variables sin inicializar, pasaje por referencia y la condición lógica.",
      sol: `{ 1. Línea 3: falta ';' al final y c debe ser 'var c : integer'
     para devolver el resultado.
  2. Línea 8: i no está declarada (debe ser local de sumar).
  3. Línea 9: suma no está inicializada en 0.
  4. Línea 16: a y b no están declaradas en el programa principal.
  5. Línea 17: se pasa el literal 0; hay que pasar result.
  6. Línea 20: debe ser 'and' (con 'or' siempre da true)
     y ok no está declarada (boolean). }`
    },
    {
      ref: "P2·2 Ej 4",
      titulo: "Errores en programadores",
      enunciado: "Leer 130 programadores (legajo y salario) e imprimir el total de salarios y el salario del de mayor legajo. El código tiene 5 errores.",
      pista: "Mirá qué parámetros deberían ser var, el orden de los parámetros en la línea 23 y qué variables se usan sin inicializar o sin declarar.",
      sol: `{ 1. Línea 2: salario debe ser var (si no, el valor leído se pierde).
  2. Línea 4: la cadena abre con ' y cierra con ".
  3. Línea 8-10: maxSalario es local; debe ser un parámetro var
     para que llegue al programa principal.
  4. Línea 21: sumaSalarios no está declarada, y maxLegajo
     no se inicializa (debería empezar en -1).
  5. Línea 23: los parámetros están invertidos:
     leerDatos(legajo, salario). }`
    },
    {
      ref: "P2·2 Ej 7",
      titulo: "Cantidad y suma de dígitos",
      enunciado: "(a) Módulo que reciba un entero y devuelva la cantidad de dígitos y su suma. (b) Leer números hasta uno cuyos dígitos sumen 10 (se procesa) e imprimir el total de dígitos leídos.",
      pista: "El corte se procesa: repeat-until. Usá el módulo del inciso a dentro del bucle.",
      sol: `program digitos;
procedure analizar(num : integer; var cant, suma : integer);
begin
  cant := 0; suma := 0;
  repeat
    cant := cant + 1;
    suma := suma + num mod 10;
    num := num div 10;
  until (num = 0);
end;
var
  num, cant, suma, total : integer;
begin
  total := 0;
  repeat
    read(num);
    analizar(num, cant, suma);
    total := total + cant;
  until (suma = 10);
  writeln('Dígitos leídos: ', total);
end.`
    },
    {
      ref: "P2·2 Ej 10",
      titulo: "Patrón A$B#",
      enunciado: "Leer caracteres y verificar el patrón A$B#: A solo vocales, B solo letras no vocales. $ y # seguro existen. Si falla, informar qué parte.",
      pista: "Un módulo por parte del patrón, cada uno devuelve si se cumplió. Si A falla, no tiene sentido seguir con B.",
      sol: `program patron;
function esVocal(c : char) : boolean;
begin
  esVocal := (c = 'a') or (c = 'e') or (c = 'i') or (c = 'o') or (c = 'u')
          or (c = 'A') or (c = 'E') or (c = 'I') or (c = 'O') or (c = 'U');
end;
function esLetra(c : char) : boolean;
begin
  esLetra := ((c >= 'a') and (c <= 'z')) or ((c >= 'A') and (c <= 'Z'));
end;
procedure parteA(var ok : boolean);
var c : char;
begin
  ok := true;
  read(c);
  while (c <> '$') and ok do begin
    if not esVocal(c) then ok := false
    else read(c);
  end;
end;
procedure parteB(var ok : boolean);
var c : char;
begin
  ok := true;
  read(c);
  while (c <> '#') and ok do begin
    if not esLetra(c) or esVocal(c) then ok := false
    else read(c);
  end;
end;
var ok : boolean;
begin
  parteA(ok);
  if not ok then
    writeln('No se cumple la parte A')
  else begin
    parteB(ok);
    if not ok then writeln('No se cumple la parte B')
    else writeln('La secuencia cumple el patrón');
  end;
end.`
    },
    {
      ref: "P2·2 Ej 12",
      titulo: "Rendimiento de la soja",
      enunciado: "(a) Módulo que reciba hectáreas, tipo de zona (1: 6 tn/ha, 2: 2,6 tn/ha, 3: 1,4 tn/ha) y precio por tonelada, y devuelva el rendimiento. (b) Leer campos (localidad, ha, zona) hasta uno de 900 ha en Saladillo (se procesa); precio U$S 320. Informar: campos de Tres de Febrero con rendimiento > 10000, localidad de mayor y de menor rendimiento, y el promedio.",
      pista: "Un solo valor → función. El corte se procesa y depende de dos campos: repeat-until con (ha = 900) and (localidad = 'Saladillo').",
      sol: `program soja;
const PRECIO = 320;
function rendimiento(ha : real; zona : integer; precio : real) : real;
var tnHa : real;
begin
  case zona of
    1: tnHa := 6;
    2: tnHa := 2.6;
  else
    tnHa := 1.4;
  end;
  rendimiento := ha * tnHa * precio;
end;
var
  loc, locMax, locMin : string;
  ha, r, max, min, suma : real;
  zona, cant, cantTdF : integer;
begin
  max := -1; min := 1e30; suma := 0; cant := 0; cantTdF := 0;
  repeat
    readln(loc); readln(ha); readln(zona);
    r := rendimiento(ha, zona, PRECIO);
    cant := cant + 1;
    suma := suma + r;
    if (loc = 'Tres de Febrero') and (r > 10000) then
      cantTdF := cantTdF + 1;
    if (r > max) then begin max := r; locMax := loc; end;
    if (r < min) then begin min := r; locMin := loc; end;
  until (ha = 900) and (loc = 'Saladillo');
  writeln('Tres de Febrero con más de U$S 10000: ', cantTdF);
  writeln('Mayor rendimiento: ', locMax);
  writeln('Menor rendimiento: ', locMin);
  writeln('Promedio: ', suma / cant :0:2);
end.`
    }
  ]
};

export default tema;

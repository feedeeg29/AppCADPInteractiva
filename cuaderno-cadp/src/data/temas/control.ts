import type { Tema } from "../types";

const tema: Tema = {
  id: "control",
  num: "P1",
  titulo: "Estructuras de control",
  fuente: "Práctica 1 (partes 1, 2 y adicionales)",
  resumen: "If, case, while, repeat-until y for. Los patrones que se repiten en todo el resto de la materia: contadores, acumuladores, máximos y mínimos.",
  sim: "traza",
  teoria: [
    { h: "Esqueleto de un programa" },
    {
      p: "Todo programa Pascal tiene el mismo orden: encabezado, constantes, tipos, módulos, variables del programa principal y el cuerpo entre <code>begin</code> y <code>end.</code> (con punto)."
    },
    {
      code: `program ejemplo;
const
  FIN = -1;
type
  str20 = string[20];
var
  num, cant : integer;
begin
  cant := 0;
  read(num);
  while (num <> FIN) do begin
    cant := cant + 1;
    read(num);
  end;
  writeln('Leí ', cant, ' números');
end.`
    },
    { h: "Operadores que más se usan" },
    {
      list: [
        "<code>div</code> división entera (17 div 5 = 3) y <code>mod</code> resto (17 mod 5 = 2). Solo para enteros.",
        "<code>/</code> siempre da un <code>real</code>, aunque divida dos enteros.",
        "<code>and</code>, <code>or</code> y <code>not</code> tienen <b>más prioridad</b> que <code>&lt;</code>, <code>=</code>, <code>&gt;</code>. Por eso cada comparación va entre paréntesis: <code>(x &gt; 5) and (x &lt; 10)</code>.",
        "Para descomponer un número en dígitos: <code>dig := num mod 10</code> te da el último y <code>num := num div 10</code> lo saca."
      ]
    },
    { h: "Selección: if y case" },
    {
      p: "Antes de un <code>else</code> nunca va punto y coma: el <code>;</code> cierra la sentencia if y el <code>else</code> queda huérfano."
    },
    {
      code: `if (a > b) then
  writeln('El mayor es ', a)
else if (b > a) then
  writeln('El mayor es ', b)
else
  writeln('Los números leídos son iguales');

case opcion of
  1: writeln('drama');
  2, 3: writeln('romántico o acción');
else
  writeln('otro');
end;`
    },
    { h: "Las tres repeticiones" },
    {
      table: [
        ["Estructura", "Se ejecuta", "Cuándo usarla"],
        [
          "<code>for</code>",
          "Una cantidad conocida de veces",
          "\"Leer 200 productos\", \"recorrer el vector de 1 a dimL\""
        ],
        ["<code>while</code>", "0 o más veces (evalúa antes)", "Fin por un valor que <b>no</b> se procesa"],
        [
          "<code>repeat … until</code>",
          "1 o más veces (evalúa después)",
          "Fin por un valor que <b>sí</b> se procesa"
        ]
      ]
    },
    {
      tip: "La variable de control del <code>for</code> no se modifica dentro del bucle y su valor al terminar no está definido. Si necesitás cortar antes, el problema pide un <code>while</code>."
    },
    { h: "Lectura con valor de corte" },
    {
      p: "Esta distinción aparece en casi todos los enunciados. Fijate siempre si el último dato \"debe procesarse\" o no."
    },
    {
      code: `{ El valor de corte NO se procesa: lectura previa + while }
read(num);
while (num <> 0) do begin
  procesar(num);
  read(num);
end;

{ El valor de corte SÍ se procesa: repeat }
repeat
  read(num);
  procesar(num);
until (num = 0);`
    },
    { h: "Patrones: contador, acumulador, máximo" },
    {
      code: `cant := 0;  suma := 0;  max := -32768;
for i := 1 to 10 do begin
  read(num);
  cant := cant + 1;          { contador }
  suma := suma + num;        { acumulador }
  if (num > max) then begin  { máximo }
    max := num;
    posMax := i;
  end;
end;`
    },
    {
      p: "Para los <b>dos mínimos</b> (o dos máximos) el orden importa: si el nuevo valor supera al primero, el primero baja a segundo lugar."
    },
    {
      code: `min1 := 32767;  min2 := 32767;
...
if (num < min1) then begin
  min2 := min1;
  min1 := num;
end
else if (num < min2) then
  min2 := num;`
    }
  ],
  quiz: [
    {
      q: "¿Cuántas veces como mínimo se ejecuta el cuerpo de un <code>repeat … until</code>?",
      ops: ["0", "1", "Depende de la condición", "2"],
      ok: 1,
      exp: "La condición se evalúa al final, así que el cuerpo siempre corre al menos una vez."
    },
    {
      q: "El enunciado dice: \"La lectura finaliza al ingresar el legajo -1, que no debe procesarse\". ¿Qué estructura conviene?",
      ops: ["for", "repeat-until", "Lectura previa + while", "case"],
      ok: 2,
      exp: "Leés antes de entrar; si es -1 el while ni arranca. Dentro del bucle procesás y volvés a leer al final."
    },
    {
      q: "¿Cuánto valen <code>17 div 5</code> y <code>17 mod 5</code>?",
      ops: ["3 y 2", "3,4 y 2", "2 y 3", "3 y 0"],
      ok: 0,
      exp: "div es el cociente entero (3) y mod el resto (17 − 15 = 2)."
    },
    {
      q: "¿Por qué no compila este código?",
      code: `if (a > b) then
  writeln(a);
else
  writeln(b);`,
      ops: [
        "Falta begin/end",
        "Hay un ; antes del else",
        "writeln no acepta enteros",
        "Falta el paréntesis del else"
      ],
      ok: 1,
      exp: "El ; termina el if. El else queda suelto y el compilador lo rechaza."
    },
    {
      q: "¿Qué pasa si escribís <code>if x > 5 and x < 10 then</code> sin paréntesis?",
      ops: [
        "Funciona igual",
        "Error: and se evalúa primero (5 and x)",
        "Se evalúa de derecha a izquierda",
        "Solo falla con reales"
      ],
      ok: 1,
      exp: "and tiene más prioridad que los relacionales, así que Pascal intenta calcular 5 and x primero. Cada comparación va entre paréntesis."
    },
    {
      q: "Leés 1000 números y querés los dos mínimos. Llega un número menor que <code>min1</code>. ¿Qué hacés?",
      ops: ["min1 := num", "min2 := num", "min2 := min1; min1 := num", "min1 := num; min2 := min1"],
      ok: 2,
      exp: "Primero el viejo mínimo pasa a ser el segundo, después guardás el nuevo. Al revés perdés el valor anterior."
    },
    {
      q: "Para leer exactamente 200 productos, ¿qué estructura es la adecuada?",
      ops: ["while", "repeat-until", "for", "case"],
      ok: 2,
      exp: "Cantidad conocida de antemano: for."
    },
    {
      q: "Con <code>num := 2504</code>, ¿qué imprime este fragmento?",
      code: `cant := 0;
while (num <> 0) do begin
  if (num mod 10) mod 2 = 0 then
    cant := cant + 1;
  num := num div 10;
end;
writeln(cant);`,
      ops: ["2", "3", "4", "1"],
      ok: 1,
      exp: "Dígitos 4, 0, 5, 2: son pares el 4, el 0 y el 2. El 0 cuenta como par."
    }
  ],
  ejercicios: [
    {
      ref: "P1·1 Ej 5",
      titulo: "Legajos y promedios",
      enunciado: "Leer legajo y promedio de cada alumno hasta el legajo -1 (no se procesa). Informar: cantidad de alumnos, cantidad con promedio mayor a 6.5 y porcentaje de destacados (promedio > 8.5) con legajo menor a 2500.",
      pista: "Lectura previa del legajo + while. El promedio se lee adentro del bucle, solo si el legajo no es -1. Ojo con dividir por cero al calcular el porcentaje.",
      sol: `program legajos;
var
  legajo, cant, cantMas65, cantDest : integer;
  prom : real;
begin
  cant := 0; cantMas65 := 0; cantDest := 0;
  read(legajo);
  while (legajo <> -1) do begin
    read(prom);
    cant := cant + 1;
    if (prom > 6.5) then
      cantMas65 := cantMas65 + 1;
    if (prom > 8.5) and (legajo < 2500) then
      cantDest := cantDest + 1;
    read(legajo);
  end;
  writeln('Alumnos leídos: ', cant);
  writeln('Promedio mayor a 6.5: ', cantMas65);
  if (cant > 0) then
    writeln('Destacados con legajo < 2500: ', cantDest / cant * 100 :0:2, '%');
end.`
    },
    {
      ref: "P1·1 Ej 8",
      titulo: "Suma o resta de una secuencia",
      enunciado: "Leer un carácter '+' o '-' (si es otro, informar error y terminar). Después leer enteros hasta el 0 y aplicar la operación. Ej: '-' con 4 3 5 -6 0 imprime 2.",
      pista: "El primer número es el valor inicial; la operación se aplica a partir del segundo. Para leer un char y después números conviene readln en el carácter.",
      sol: `program operacion;
var
  op : char;
  num, res : integer;
begin
  readln(op);
  if (op <> '+') and (op <> '-') then
    writeln('Error: operación inválida')
  else begin
    read(num);
    res := num;               { el primero es el valor inicial }
    if (num <> 0) then
      read(num);
    while (num <> 0) do begin
      if (op = '+') then
        res := res + num
      else
        res := res - num;
      read(num);
    end;
    writeln(res);
  end;
end.`
    },
    {
      ref: "P1·2 Ej 4",
      titulo: "Los dos mínimos",
      enunciado: "Leer 1000 enteros e informar los dos números mínimos. (a) La lectura termina con 0, que se procesa. (b) Termina con 0, que no se procesa.",
      pista: "Para 1000 números: for. Variante (a): repeat-until. Variante (b): lectura previa + while. La actualización de min1/min2 es igual en las tres.",
      sol: `program dosMinimos;
var
  i, num, min1, min2 : integer;
begin
  min1 := 32767; min2 := 32767;
  for i := 1 to 1000 do begin
    read(num);
    if (num < min1) then begin
      min2 := min1;
      min1 := num;
    end
    else if (num < min2) then
      min2 := num;
  end;
  writeln('Mínimos: ', min1, ' y ', min2);
end.
{ (a) repeat read(num); actualizar; until (num = 0);
  (b) read(num); while (num <> 0) do begin actualizar; read(num); end; }`
    },
    {
      ref: "P1·2 Ej 8",
      titulo: "Ventas del mes",
      enunciado: "Para cada uno de los 31 días se leen montos de venta hasta el monto 0. Informar la cantidad de ventas por día y el monto total del mes. (a) Además, el día con más ventas.",
      pista: "Un for de 1 a 31 por fuera y un while por dentro. El contador de ventas se reinicia en cada día; el total del mes no.",
      sol: `program ventasMes;
var
  dia, cantDia, maxCant, diaMax : integer;
  monto, total : real;
begin
  total := 0; maxCant := -1; diaMax := 0;
  for dia := 1 to 31 do begin
    cantDia := 0;
    read(monto);
    while (monto <> 0) do begin
      cantDia := cantDia + 1;
      total := total + monto;
      read(monto);
    end;
    writeln('Día ', dia, ': ', cantDia, ' ventas');
    if (cantDia > maxCant) then begin
      maxCant := cantDia;
      diaMax := dia;
    end;
  end;
  writeln('Total del mes: ', total:0:2);
  writeln('Día con más ventas: ', diaMax);
end.`
    },
    {
      ref: "P1·3 Act 1",
      titulo: "Revisando inversiones",
      enunciado: "Por cada empresa se lee código, cantidad de inversiones y el monto de cada una. Termina con la empresa 100, que se procesa. Informar el promedio de cada empresa, el código de la de mayor monto total y cuántas tienen inversiones de más de $50000.",
      pista: "repeat-until por fuera (la 100 se procesa) y un for por dentro para los montos. \"Inversiones de más de $50000\" se interpreta como el total de la empresa.",
      sol: `program inversiones;
var
  codigo, cantInv, i, codMax, cantMas50 : integer;
  monto, total, maxTotal : real;
begin
  maxTotal := -1; cantMas50 := 0; codMax := 0;
  repeat
    read(codigo);
    read(cantInv);
    total := 0;
    for i := 1 to cantInv do begin
      read(monto);
      total := total + monto;
    end;
    if (cantInv > 0) then
      writeln('Empresa ', codigo, ' monto promedio ', total / cantInv :0:2);
    if (total > maxTotal) then begin
      maxTotal := total;
      codMax := codigo;
    end;
    if (total > 50000) then
      cantMas50 := cantMas50 + 1;
  until (codigo = 100);
  writeln('Mayor monto invertido: empresa ', codMax);
  writeln('Empresas con más de $50000: ', cantMas50);
end.`
    }
  ]
};

export default tema;

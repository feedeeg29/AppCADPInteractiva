import type { Tema } from "../types";
import { guiaP41 } from "../guia/p41";
import { guiaP42 } from "../guia/p42";

const tema: Tema = {
  id: "vectores",
  num: "P4",
  titulo: "Vectores",
  fuente: "Práctica 4 (partes 1 y 2)",
  resumen: "Dimensión física y lógica, carga, recorridos, vectores contadores, búsqueda, inserción y eliminación con corrimientos.",
  sim: "vector",
  teoria: [
    { h: "Declaración" },
    {
      p: "Un vector es una estructura estática, homogénea e indexada: todos los elementos son del mismo tipo y se accede a cada uno por su posición."
    },
    {
      code: `const
  DIMF = 300;                         { dimensión física }
type
  vSalarios = array [1..DIMF] of real;
var
  v : vSalarios;
  dimL : integer;                     { dimensión lógica } `
    },
    { h: "Dimensión física y lógica" },
    {
      list: [
        "<b>dimF</b>: la cantidad de lugares reservados. Es fija y se decide al declarar.",
        "<b>dimL</b>: cuántos lugares están ocupados de verdad. Empieza en 0 y cambia al cargar, insertar o eliminar.",
        "Si el enunciado dice \"exactamente 400 alumnos\", dimL = dimF y no hace falta llevarla. Si dice \"a lo sumo 400\", sí."
      ]
    },
    { h: "Cargar con dos condiciones de corte" },
    {
      code: `procedure cargar(var v : vSalarios; var dimL : integer);
var sal : real;
begin
  dimL := 0;
  read(sal);
  while (sal <> 0) and (dimL < DIMF) do begin
    dimL := dimL + 1;
    v[dimL] := sal;
    read(sal);
  end;
end;`
    },
    { h: "Vector contador" },
    {
      p: "Cuando hay que contar \"por cada categoría\" y las categorías son un rango chico (dígitos 0..9, géneros 1..5, meses 1..12), se usa un vector indexado por la categoría. Hay que inicializarlo en 0 antes de usarlo."
    },
    {
      code: `type vContador = array [0..9] of integer;
var cont : vContador;  i, num : integer;
...
for i := 0 to 9 do cont[i] := 0;
...
while (num <> 0) do begin
  cont[num mod 10] := cont[num mod 10] + 1;
  num := num div 10;
end;`
    },
    { h: "Buscar un elemento" },
    {
      p: "En un vector <b>desordenado</b> hay que mirar hasta encontrarlo o llegar a dimL. Si está <b>ordenado</b> se puede cortar antes (cuando pasaste el valor) o usar búsqueda dicotómica."
    },
    {
      code: `{ Desordenado: búsqueda lineal }
function buscar(v : vNum; dimL, n : integer) : boolean;
var pos : integer;
begin
  pos := 1;
  while (pos <= dimL) and (v[pos] <> n) do
    pos := pos + 1;
  buscar := (pos <= dimL);
end;

{ Ordenado ascendente: búsqueda dicotómica }
function buscarDico(v : vNum; dimL, n : integer) : boolean;
var ini, fin, medio : integer;
begin
  ini := 1; fin := dimL; medio := (ini + fin) div 2;
  while (ini <= fin) and (v[medio] <> n) do begin
    if (n < v[medio]) then fin := medio - 1
    else ini := medio + 1;
    medio := (ini + fin) div 2;
  end;
  buscarDico := (ini <= fin);
end;`
    },
    {
      tip: "El orden de las condiciones importa: <code>(pos &lt;= dimL) and (v[pos] &lt;&gt; n)</code>. Si las invertís, con el elemento ausente terminás leyendo v[dimL + 1]."
    },
    { h: "Insertar y eliminar" },
    {
      p: "Para insertar en una posición hay que correr los elementos hacia la derecha empezando <b>desde el final</b>. Para eliminar se corren hacia la izquierda empezando desde la posición. Probalo en el simulador."
    },
    {
      code: `procedure insertar(var v : vNum; var dimL : integer;
                   valor, pos : integer; var ok : boolean);
var i : integer;
begin
  ok := (dimL < DIMF) and (pos >= 1) and (pos <= dimL + 1);
  if ok then begin
    for i := dimL downto pos do
      v[i + 1] := v[i];
    v[pos] := valor;
    dimL := dimL + 1;
  end;
end;

procedure eliminar(var v : vNum; var dimL : integer;
                   pos : integer; var ok : boolean);
var i : integer;
begin
  ok := (pos >= 1) and (pos <= dimL);
  if ok then begin
    for i := pos to dimL - 1 do
      v[i] := v[i + 1];
    dimL := dimL - 1;
  end;
end;`
    },
    {
      tip: "\"Realizar todas las validaciones necesarias\": que haya lugar (dimL &lt; dimF) y que la posición sea válida (entre 1 y dimL, o dimL + 1 al insertar)."
    }
  ],
  quiz: [
    {
      q: "El enunciado dice \"a lo sumo 300 empleados\" y la carga termina con salario 0. ¿Cuál es la condición del while?",
      ops: ["(sal <> 0)", "(dimL < DIMF)", "(sal <> 0) and (dimL < DIMF)", "(sal <> 0) or (dimL < DIMF)"],
      ok: 2,
      exp: "Hay que cortar por cualquiera de los dos motivos, así que ambas condiciones tienen que seguir siendo verdaderas para continuar."
    },
    {
      q: "Para insertar en la posición 3 de un vector con dimL = 6, ¿desde dónde empezás a correr?",
      ops: [
        "Desde la posición 3 hacia la derecha",
        "Desde la posición 6 (dimL) hacia la 3",
        "Desde la 1",
        "No hace falta correr nada"
      ],
      ok: 1,
      exp: "Si empezás por la 3, pisás el valor de la 4 antes de moverlo. Hay que ir de dimL hacia pos, con downto."
    },
    {
      q: "¿Qué valores tiene <code>numeros</code> al terminar <code>sumador</code>?",
      code: `for i := 1 to 10 do
  numeros[i] := i;
for i := 2 to 10 do
  numeros[i] := numeros[i] + numeros[i-1];`,
      ops: [
        "1 2 3 4 5 6 7 8 9 10",
        "1 3 5 7 9 11 13 15 17 19",
        "1 3 6 10 15 21 28 36 45 55",
        "2 4 6 8 10 12 14 16 18 20"
      ],
      ok: 2,
      exp: "Cada posición acumula la suma de las anteriores (sumas parciales)."
    },
    {
      q: "¿Y si el segundo for fuera <code>for i := 1 to 9 do numeros[i+1] := numeros[i];</code>?",
      ops: ["Todos valen 1", "1 1 2 3 4 5 6 7 8 9", "Todos valen 10", "Queda igual"],
      ok: 0,
      exp: "El 1 de la primera posición se va copiando hacia adelante una y otra vez."
    },
    {
      q: "Para contar ocurrencias de cada dígito, ¿qué estructura conviene?",
      ops: [
        "array [1..10] of integer, indexado por dig + 1",
        "array [0..9] of integer, indexado por el dígito",
        "Una lista",
        "Diez variables contador"
      ],
      ok: 1,
      exp: "El índice es el propio dígito. El vector debe inicializarse en 0."
    },
    {
      q: "¿Qué precondición necesita la búsqueda dicotómica?",
      ops: ["Que no haya repetidos", "Que el vector esté ordenado", "Que dimL sea par", "Que dimL = dimF"],
      ok: 1,
      exp: "Descarta la mitad en cada paso suponiendo que los menores están a la izquierda y los mayores a la derecha."
    },
    {
      q: "Eliminás el elemento de la posición <code>pos</code>. ¿Qué es lo último que hacés?",
      ops: ["v[dimL] := 0", "dimL := dimL - 1", "pos := pos - 1", "dimF := dimF - 1"],
      ok: 1,
      exp: "Después de correr los elementos a la izquierda, el vector tiene un elemento menos. dimF nunca cambia."
    }
  ],
  ejercicios: [...guiaP41, ...guiaP42],
};

export default tema;

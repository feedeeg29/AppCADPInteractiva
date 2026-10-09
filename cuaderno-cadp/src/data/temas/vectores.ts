import type { Tema } from "../types";

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
  ejercicios: [
    {
      ref: "P4·1 Ej 6",
      titulo: "Máximo y mínimo en un recorrido",
      enunciado: "Implementar un único módulo que recorra el vector una sola vez y devuelva la posición del máximo y la del mínimo.",
      pista: "Dos resultados → procedimiento con dos var. Arrancá ambas posiciones en 1 y recorré desde la 2.",
      sol: `procedure maxYMin(v : vNum; dimL : integer; var posMax, posMin : integer);
var i : integer;
begin
  posMax := 1; posMin := 1;
  for i := 2 to dimL do begin
    if (v[i] > v[posMax]) then posMax := i;
    if (v[i] < v[posMin]) then posMin := i;
  end;
end;`
    },
    {
      ref: "P4·1 Ej 7",
      titulo: "Ocurrencias de cada dígito",
      enunciado: "Leer enteros hasta -1 (no se procesa) e informar cuántas veces aparece cada dígito, el dígito más leído y los que no aparecieron. Ej: 63 34 99 94 96 → 9 aparece 4 veces.",
      pista: "No se pide guardar los números. Solo hace falta un vector contador de 0..9. Ojo: el número 0 tiene un dígito 0, usá repeat al descomponer.",
      sol: `program digitos;
type vCont = array [0..9] of integer;
procedure inicializar(var c : vCont);
var i : integer;
begin
  for i := 0 to 9 do c[i] := 0;
end;
procedure descomponer(num : integer; var c : vCont);
begin
  repeat
    c[num mod 10] := c[num mod 10] + 1;
    num := num div 10;
  until (num = 0);
end;
procedure informar(c : vCont);
var i, max, digMax : integer;
begin
  max := -1; digMax := 0;
  for i := 0 to 9 do begin
    if (c[i] > 0) then writeln('Número ', i, ': ', c[i], ' veces');
    if (c[i] > max) then begin max := c[i]; digMax := i; end;
  end;
  writeln('El dígito más leído fue el ', digMax);
  write('Sin ocurrencias:');
  for i := 0 to 9 do
    if (c[i] = 0) then write(' ', i);
  writeln;
end;
var
  c : vCont;
  num : integer;
begin
  inicializar(c);
  read(num);
  while (num <> -1) do begin
    descomponer(num, c);
    read(num);
  end;
  informar(c);
end.`
    },
    {
      ref: "P4·2 Ej 2",
      titulo: "Nombres: eliminar, insertar, agregar",
      enunciado: "Cargar nombres (a lo sumo 500) hasta 'ZZZ'. Luego: eliminar la primera ocurrencia de un nombre leído, insertar un nombre en la posición 4 y agregar uno al final. Validar todo.",
      pista: "Reusá buscar + eliminar(pos), insertar(pos) y agregar. Cada uno devuelve un boolean ok para informar si se pudo.",
      sol: `const DIMF = 500;
type
  str20 = string[20];
  vNombres = array [1..DIMF] of str20;

function posicion(v : vNombres; dimL : integer; n : str20) : integer;
var i : integer;
begin
  i := 1;
  while (i <= dimL) and (v[i] <> n) do i := i + 1;
  if (i <= dimL) then posicion := i else posicion := -1;
end;

procedure eliminarNombre(var v : vNombres; var dimL : integer;
                         n : str20; var ok : boolean);
var pos, i : integer;
begin
  pos := posicion(v, dimL, n);
  ok := (pos <> -1);
  if ok then begin
    for i := pos to dimL - 1 do v[i] := v[i + 1];
    dimL := dimL - 1;
  end;
end;

procedure insertarEn(var v : vNombres; var dimL : integer;
                     n : str20; pos : integer; var ok : boolean);
var i : integer;
begin
  ok := (dimL < DIMF) and (pos >= 1) and (pos <= dimL + 1);
  if ok then begin
    for i := dimL downto pos do v[i + 1] := v[i];
    v[pos] := n;
    dimL := dimL + 1;
  end;
end;

procedure agregar(var v : vNombres; var dimL : integer;
                  n : str20; var ok : boolean);
begin
  ok := (dimL < DIMF);
  if ok then begin
    dimL := dimL + 1;
    v[dimL] := n;
  end;
end;`
    },
    {
      ref: "P4·2 Ej 1",
      titulo: "¿Está n en el vector?",
      enunciado: "(a) Módulo que reciba un vector de enteros (a lo sumo 500) y un valor n y devuelva si n está. (b) Lo mismo, con el vector ordenado de forma ascendente.",
      pista: "En (b) podés cortar apenas encontrás un valor mayor o igual a n, sin llegar al final.",
      sol: `{ a) desordenado }
function esta(v : vNum; dimL, n : integer) : boolean;
var i : integer;
begin
  i := 1;
  while (i <= dimL) and (v[i] <> n) do i := i + 1;
  esta := (i <= dimL);
end;

{ b) ordenado ascendente }
function estaOrd(v : vNum; dimL, n : integer) : boolean;
var i : integer;
begin
  i := 1;
  while (i <= dimL) and (v[i] < n) do i := i + 1;
  estaOrd := (i <= dimL) and (v[i] = n);
end;`
    }
  ]
};

export default tema;

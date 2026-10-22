import type { Ejercicio } from "../types";

const G = "Práctica 4 · Parte 1 · Vectores";

export const guiaP41: Ejercicio[] = [
  {
    grupo: G, ref: "P4·1 Ej 1", titulo: "sumador: ¿qué valores toma el vector?",
    enunciado: "numeros es un array[1..10] of integer. Primer for: numeros[i] := i. Segundo for (i de 2 a 10): numeros[i] := numeros[i] + numeros[i-1]. (a) ¿Qué valores tiene al terminar el primer for? (b) ¿Y al terminar el programa? (c) Si la línea 11 pasa a ser for i := 1 to 9 do, ¿cómo hay que cambiar el código para obtener lo mismo que en (b)? (d) ¿Qué valores quedan si las líneas 11 y 12 se reemplazan por for i := 1 to 9 do numeros[i+1] := numeros[i]?",
    pista: "Hacé una tabla con las 10 posiciones. En el segundo for cada posición usa el valor ya modificado de la anterior.",
    sol: `{ a) 1 2 3 4 5 6 7 8 9 10
  b) 1 3 6 10 15 21 28 36 45 55   (sumas parciales)
  c) for i := 1 to 9 do
       numeros[i + 1] := numeros[i + 1] + numeros[i];
  d) 1 1 1 1 1 1 1 1 1 1   (el 1 de la primera posición se va copiando)
  Este programa muestra las cuatro situaciones: }
program sumador;
type
  vnums = array [1..10] of integer;

procedure imprimir(v : vnums);
var i : integer;
begin
  for i := 1 to 10 do
    write(v[i], ' ');
  writeln;
end;

var
  numeros : vnums;
  i : integer;
begin
  for i := 1 to 10 do        { primer bloque for }
    numeros[i] := i;
  write('a) '); imprimir(numeros);

  for i := 2 to 10 do        { segundo bloque for }
    numeros[i] := numeros[i] + numeros[i - 1];
  write('b) '); imprimir(numeros);

  for i := 1 to 10 do numeros[i] := i;
  for i := 1 to 9 do
    numeros[i + 1] := numeros[i + 1] + numeros[i];
  write('c) '); imprimir(numeros);

  for i := 1 to 10 do numeros[i] := i;
  for i := 1 to 9 do
    numeros[i + 1] := numeros[i];
  write('d) '); imprimir(numeros);
end.`,
    entrada: "",
  },
  {
    grupo: G, ref: "P4·1 Ej 2", titulo: "Completar cargarVector y modificarVectorySumar",
    enunciado: "Completar el programa: (a) cargarVector lee reales y los guarda en el vector; termina con el 0 (que no se procesa) o cuando el vector está completo, y devuelve el vector y su dimensión lógica. (b) modificarVectorySumar suma n a todos los elementos y devuelve también la suma de todos los elementos.",
    pista: "La carga corta por dos motivos: el 0 o que no haya más lugar. Si el vector se llena, no hay que leer un número de más.",
    sol: `program Vectores;
const
  cant_datos = 150;
type
  vdatos = array [1..cant_datos] of real;

procedure cargarVector(var v : vdatos; var dimL : integer);
var
  num : real;
begin
  dimL := 0;
  read(num);
  while (num <> 0) and (dimL < cant_datos) do begin
    dimL := dimL + 1;
    v[dimL] := num;
    if (dimL < cant_datos) then
      read(num);
  end;
end;

procedure modificarVectorySumar(var v : vdatos; dimL : integer; n : real; var suma : real);
var
  i : integer;
begin
  suma := 0;
  for i := 1 to dimL do begin
    v[i] := v[i] + n;
    suma := suma + v[i];
  end;
end;

var
  datos : vdatos;
  dim : integer;
  num, suma : real;
begin
  cargarVector(datos, dim);
  writeln('Ingrese un valor a sumar');
  readln;
  readln(num);
  modificarVectorySumar(datos, dim, num, suma);
  writeln('La suma de los valores es: ', suma:0:2);
  writeln('Se procesaron: ', dim, ' números');
end.`,
    entrada: "2.5 4 1.5 0\n10",
  },
  {
    grupo: G, ref: "P4·1 Ej 3", titulo: "Imprimir el vector de distintas formas",
    enunciado: "Se dispone de un vector de enteros con dimensión física dimF y dimensión lógica dimL. Módulos para imprimirlo: (a) de la primera a la última posición; (b) de la última a la primera; (c) desde la mitad (dimL div 2) hacia la primera, y desde la mitad más uno hacia la última; (d) desde una posición X hasta una posición Y (hacia adelante o hacia atrás según corresponda). (e) Rehacer a, b y c usando el módulo de d.",
    pista: "Para (d), si X ≤ Y se usa for ... to y si no, for ... downto. Con ese módulo, (a) es imprimir de 1 a dimL, (b) de dimL a 1 y (c) son dos llamadas.",
    sol: `program imprimirVector;
const
  DIMF = 100;
type
  vector = array [1..DIMF] of integer;

{ El vector "se dispone": este módulo lo carga para poder probar (hasta el 0) }
procedure cargarVector(var v : vector; var dimL : integer);
var num : integer;
begin
  dimL := 0;
  read(num);
  while (num <> 0) and (dimL < DIMF) do begin
    dimL := dimL + 1;
    v[dimL] := num;
    read(num);
  end;
end;

procedure imprimirAdelante(v : vector; dimL : integer);       { a }
var i : integer;
begin
  for i := 1 to dimL do write(v[i], ' ');
  writeln;
end;

procedure imprimirAtras(v : vector; dimL : integer);          { b }
var i : integer;
begin
  for i := dimL downto 1 do write(v[i], ' ');
  writeln;
end;

procedure imprimirDesdeMitad(v : vector; dimL : integer);     { c }
var i : integer;
begin
  for i := dimL div 2 downto 1 do write(v[i], ' ');
  for i := dimL div 2 + 1 to dimL do write(v[i], ' ');
  writeln;
end;

procedure imprimirRango(v : vector; x, y : integer);          { d }
var i : integer;
begin
  if (x <= y) then
    for i := x to y do write(v[i], ' ')
  else
    for i := x downto y do write(v[i], ' ');
end;

var
  v : vector;
  dimL : integer;
begin
  cargarVector(v, dimL);
  write('a) '); imprimirAdelante(v, dimL);
  write('b) '); imprimirAtras(v, dimL);
  write('c) '); imprimirDesdeMitad(v, dimL);
  write('d) de 2 a 5: '); imprimirRango(v, 2, 5); writeln;
  { e) usando imprimirRango }
  write('e-a) '); imprimirRango(v, 1, dimL); writeln;
  write('e-b) '); imprimirRango(v, dimL, 1); writeln;
  write('e-c) '); imprimirRango(v, dimL div 2, 1);
  imprimirRango(v, dimL div 2 + 1, dimL); writeln;
end.`,
    entrada: "10 20 30 40 50 60 70 0",
  },
  {
    grupo: G, ref: "P4·1 Ej 4", titulo: "Módulos sobre un vector de 100 enteros",
    enunciado: "Para un vector de 100 enteros implementar: (a) posicion: dado X devuelve su posición o -1; (b) intercambio: intercambia los valores de las posiciones x e y; (c) sumaVector; (d) promedio; (e) elementoMaximo: posición del mayor; (f) elementoMinimo: posición del menor.",
    pista: "Escribí los módulos con un parámetro dimL: así sirven también para el ejercicio 5, donde el vector tiene a lo sumo 100 elementos. posicion es una búsqueda que corta al encontrar.",
    sol: `program modulosVector;
const
  DIMF = 100;
type
  vector = array [1..DIMF] of integer;

function posicion(x : integer; v : vector; dimL : integer) : integer;   { a }
var i : integer;
begin
  i := 1;
  while (i <= dimL) and (v[i] <> x) do
    i := i + 1;
  if (i <= dimL) then posicion := i
  else posicion := -1;
end;

procedure intercambio(x, y : integer; var v : vector);                 { b }
var aux : integer;
begin
  aux := v[x];
  v[x] := v[y];
  v[y] := aux;
end;

function sumaVector(v : vector; dimL : integer) : longint;             { c }
var i : integer; suma : longint;
begin
  suma := 0;
  for i := 1 to dimL do suma := suma + v[i];
  sumaVector := suma;
end;

function promedio(v : vector; dimL : integer) : real;                  { d }
begin
  promedio := sumaVector(v, dimL) / dimL;
end;

function elementoMaximo(v : vector; dimL : integer) : integer;         { e }
var i, pos : integer;
begin
  pos := 1;
  for i := 2 to dimL do
    if (v[i] > v[pos]) then pos := i;
  elementoMaximo := pos;
end;

function elementoMinimo(v : vector; dimL : integer) : integer;         { f }
var i, pos : integer;
begin
  pos := 1;
  for i := 2 to dimL do
    if (v[i] < v[pos]) then pos := i;
  elementoMinimo := pos;
end;

var
  v : vector;
  i : integer;
begin
  for i := 1 to DIMF do
    read(v[i]);
  writeln('Posición del 50: ', posicion(50, v, DIMF));
  writeln('Suma: ', sumaVector(v, DIMF));
  writeln('Promedio: ', promedio(v, DIMF):0:2);
  writeln('Máximo en la posición ', elementoMaximo(v, DIMF));
  writeln('Mínimo en la posición ', elementoMinimo(v, DIMF));
  intercambio(1, 2, v);
  writeln('Después de intercambiar 1 y 2: ', v[1], ' ', v[2]);
end.`,
    entrada: Array.from({ length: 100 }, (_, i) => ((i * 37) % 101) + 1).join(" "),
  },
  {
    grupo: G, ref: "P4·1 Ej 5", titulo: "Intercambiar el máximo con el mínimo",
    enunciado: "Usando los módulos del ejercicio 4, leer enteros (a lo sumo 100) hasta el 0 (que no se procesa) y guardarlos en un vector. Después intercambiar el mayor elemento con el menor e informar: El elemento máximo ... que se encontraba en la posición ... fue intercambiado con el elemento mínimo ... que se encontraba en la posición ...",
    pista: "Buscá las dos posiciones antes de intercambiar y guardá los valores para el mensaje, porque después del intercambio cambian de lugar.",
    sol: `program maxPorMin;
const
  DIMF = 100;
type
  vector = array [1..DIMF] of integer;

procedure cargar(var v : vector; var dimL : integer);
var num : integer;
begin
  dimL := 0;
  read(num);
  while (num <> 0) and (dimL < DIMF) do begin
    dimL := dimL + 1;
    v[dimL] := num;
    if (dimL < DIMF) then read(num);
  end;
end;

procedure intercambio(x, y : integer; var v : vector);
var aux : integer;
begin
  aux := v[x]; v[x] := v[y]; v[y] := aux;
end;

function elementoMaximo(v : vector; dimL : integer) : integer;
var i, pos : integer;
begin
  pos := 1;
  for i := 2 to dimL do
    if (v[i] > v[pos]) then pos := i;
  elementoMaximo := pos;
end;

function elementoMinimo(v : vector; dimL : integer) : integer;
var i, pos : integer;
begin
  pos := 1;
  for i := 2 to dimL do
    if (v[i] < v[pos]) then pos := i;
  elementoMinimo := pos;
end;

var
  v : vector;
  dimL, posMax, posMin, max, min : integer;
begin
  cargar(v, dimL);
  if (dimL > 0) then begin
    posMax := elementoMaximo(v, dimL);
    posMin := elementoMinimo(v, dimL);
    max := v[posMax];
    min := v[posMin];
    intercambio(posMax, posMin, v);
    writeln('El elemento máximo ', max, ' que se encontraba en la posición ', posMax,
            ' fue intercambiado con el elemento mínimo ', min,
            ' que se encontraba en la posición ', posMin);
  end;
end.`,
    entrada: "12 5 99 -3 40 0",
  },
  {
    grupo: G, ref: "P4·1 Ej 6", titulo: "Máximo y mínimo en un solo recorrido",
    enunciado: "La solución anterior recorre el vector dos veces. Implementar un único módulo que lo recorra una vez y devuelva las dos posiciones.",
    pista: "Dos resultados: procedimiento con dos var. Arrancá las dos posiciones en 1 y recorré desde la 2.",
    sol: `program maxYMinUnRecorrido;
const
  DIMF = 100;
type
  vector = array [1..DIMF] of integer;

procedure cargar(var v : vector; var dimL : integer);
var num : integer;
begin
  dimL := 0;
  read(num);
  while (num <> 0) and (dimL < DIMF) do begin
    dimL := dimL + 1;
    v[dimL] := num;
    if (dimL < DIMF) then read(num);
  end;
end;

procedure maxYMin(v : vector; dimL : integer; var posMax, posMin : integer);
var i : integer;
begin
  posMax := 1;
  posMin := 1;
  for i := 2 to dimL do begin
    if (v[i] > v[posMax]) then posMax := i;
    if (v[i] < v[posMin]) then posMin := i;
  end;
end;

var
  v : vector;
  dimL, posMax, posMin, aux : integer;
begin
  cargar(v, dimL);
  if (dimL > 0) then begin
    maxYMin(v, dimL, posMax, posMin);
    writeln('El elemento máximo ', v[posMax], ' que se encontraba en la posición ', posMax,
            ' fue intercambiado con el elemento mínimo ', v[posMin],
            ' que se encontraba en la posición ', posMin);
    aux := v[posMax]; v[posMax] := v[posMin]; v[posMin] := aux;
  end;
end.`,
    entrada: "12 5 99 -3 40 0",
  },
  {
    grupo: G, ref: "P4·1 Ej 7", titulo: "Ocurrencias de cada dígito",
    enunciado: "Leer enteros hasta el -1 (que no se procesa) e informar: (a) la cantidad de ocurrencias de cada dígito; (b) el dígito más leído; (c) los dígitos que no aparecieron. Ej: 63 34 99 94 96 -1 → el 9 aparece 4 veces y no aparecieron 0, 1, 2, 5, 7 y 8.",
    pista: "No se pide guardar los números: alcanza con un vector contador de 0 a 9. Descomponé con repeat para que el número 0 cuente su dígito.",
    sol: `program digitos;
type
  vCont = array [0..9] of integer;

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
  max := -1;
  digMax := 0;
  for i := 0 to 9 do begin
    if (c[i] > 0) then
      writeln('Número ', i, ': ', c[i], ' veces');
    if (c[i] > max) then begin
      max := c[i];
      digMax := i;
    end;
  end;
  writeln('El dígito más leído fue el ', digMax);
  write('Los dígitos que no tuvieron ocurrencias son:');
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
end.`,
    entrada: "63 34 99 94 96 -1",
  },
  {
    grupo: G, ref: "P4·1 Ej 8", titulo: "400 ingresantes 2020",
    enunciado: "Leer y almacenar nro de inscripción, DNI, apellido, nombre y año de nacimiento de 400 alumnos ingresantes. Una vez almacenado todo, informar: (a) el porcentaje de alumnos con DNI compuesto solo por dígitos pares; (b) apellido y nombre de los dos alumnos de mayor edad.",
    pista: "Primero se carga (sin calcular nada) y después se recorre una vez. Mayor edad = menor año de nacimiento: dos mínimos.",
    sol: `program ingresantes2020;
const
  DIMF = 400;
type
  alumno = record
    inscripcion : integer;
    dni : longint;
    apellido, nombre : string;
    nacimiento : integer;
  end;
  vAlumnos = array [1..DIMF] of alumno;

procedure leerAlumno(var a : alumno);
begin
  readln(a.inscripcion);
  readln(a.dni);
  readln(a.apellido);
  readln(a.nombre);
  readln(a.nacimiento);
end;

procedure cargar(var v : vAlumnos);
var i : integer;
begin
  for i := 1 to DIMF do
    leerAlumno(v[i]);
end;

function soloPares(dni : longint) : boolean;
var ok : boolean;
begin
  ok := true;
  while (dni <> 0) and ok do begin
    if ((dni mod 10) mod 2 <> 0) then ok := false;
    dni := dni div 10;
  end;
  soloPares := ok;
end;

procedure procesar(v : vAlumnos);
var
  i, cantPares, min1, min2 : integer;
  nom1, nom2 : string;
begin
  cantPares := 0;
  min1 := 32767; min2 := 32767; nom1 := ''; nom2 := '';
  for i := 1 to DIMF do begin
    if soloPares(v[i].dni) then cantPares := cantPares + 1;
    if (v[i].nacimiento < min1) then begin
      min2 := min1; nom2 := nom1;
      min1 := v[i].nacimiento; nom1 := v[i].apellido + ' ' + v[i].nombre;
    end
    else if (v[i].nacimiento < min2) then begin
      min2 := v[i].nacimiento; nom2 := v[i].apellido + ' ' + v[i].nombre;
    end;
  end;
  writeln('Porcentaje con DNI de dígitos pares: ', cantPares / DIMF * 100:0:2, '%');
  writeln('Los dos de mayor edad: ', nom1, ' y ', nom2);
end;

var
  v : vAlumnos;
begin
  cargar(v);
  procesar(v);
end.
{ Para probarlo rápido, cambiá DIMF a 3. }`,
  },
  {
    grupo: G, ref: "P4·1 Ej 9", titulo: "A lo sumo 400 ingresantes",
    enunciado: "Modificar el ejercicio anterior para leer y almacenar a lo sumo 400 alumnos. La lectura termina con el DNI -1 (que no se procesa).",
    pista: "Ahora hace falta dimensión lógica. El módulo de lectura lee el nro de inscripción y el DNI, y el resto solo si el DNI no es -1.",
    sol: `program ingresantesALoSumo;
const
  DIMF = 400;
type
  alumno = record
    inscripcion : integer;
    dni : longint;
    apellido, nombre : string;
    nacimiento : integer;
  end;
  vAlumnos = array [1..DIMF] of alumno;

procedure leerAlumno(var a : alumno);
begin
  readln(a.inscripcion);
  readln(a.dni);
  if (a.dni <> -1) then begin
    readln(a.apellido);
    readln(a.nombre);
    readln(a.nacimiento);
  end;
end;

procedure cargar(var v : vAlumnos; var dimL : integer);
var a : alumno;
begin
  dimL := 0;
  leerAlumno(a);
  while (a.dni <> -1) and (dimL < DIMF) do begin
    dimL := dimL + 1;
    v[dimL] := a;
    if (dimL < DIMF) then leerAlumno(a);
  end;
end;

function soloPares(dni : longint) : boolean;
var ok : boolean;
begin
  ok := true;
  while (dni <> 0) and ok do begin
    if ((dni mod 10) mod 2 <> 0) then ok := false;
    dni := dni div 10;
  end;
  soloPares := ok;
end;

procedure procesar(v : vAlumnos; dimL : integer);
var
  i, cantPares, min1, min2 : integer;
  nom1, nom2 : string;
begin
  cantPares := 0;
  min1 := 32767; min2 := 32767; nom1 := ''; nom2 := '';
  for i := 1 to dimL do begin
    if soloPares(v[i].dni) then cantPares := cantPares + 1;
    if (v[i].nacimiento < min1) then begin
      min2 := min1; nom2 := nom1;
      min1 := v[i].nacimiento; nom1 := v[i].apellido + ' ' + v[i].nombre;
    end
    else if (v[i].nacimiento < min2) then begin
      min2 := v[i].nacimiento; nom2 := v[i].apellido + ' ' + v[i].nombre;
    end;
  end;
  if (dimL > 0) then
    writeln('Porcentaje con DNI de dígitos pares: ', cantPares / dimL * 100:0:2, '%');
  writeln('Los dos de mayor edad: ', nom1, ' y ', nom2);
end;

var
  v : vAlumnos;
  dimL : integer;
begin
  cargar(v, dimL);
  procesar(v, dimL);
end.`,
    entrada: "101\n24682468\nGomez\nAna\n2001\n102\n33445566\nPerez\nLuis\n1999\n103\n40222444\nDiaz\nSol\n2002\n0\n-1",
  },
  {
    grupo: G, ref: "P4·1 Ej 10", titulo: "Salarios de una empresa de turismo",
    enunciado: "Leer y almacenar el salario de los empleados (a lo sumo 300); la carga termina con el salario 0 (que no se procesa) o cuando se llena el vector. Después: (a) incrementar cada salario un 15%, con un módulo que reciba un real X, el vector y su dimensión lógica y multiplique cada elemento por X; (b) mostrar el sueldo promedio.",
    pista: "El módulo de (a) es general: se lo invoca con X = 1.15.",
    sol: `program salarios;
const
  DIMF = 300;
type
  vSalarios = array [1..DIMF] of real;

procedure cargar(var v : vSalarios; var dimL : integer);
var sal : real;
begin
  dimL := 0;
  read(sal);
  while (sal <> 0) and (dimL < DIMF) do begin
    dimL := dimL + 1;
    v[dimL] := sal;
    if (dimL < DIMF) then read(sal);
  end;
end;

procedure multiplicar(x : real; var v : vSalarios; dimL : integer);
var i : integer;
begin
  for i := 1 to dimL do
    v[i] := v[i] * x;
end;

procedure informarPromedio(v : vSalarios; dimL : integer);
var
  i : integer;
  suma : real;
begin
  suma := 0;
  for i := 1 to dimL do suma := suma + v[i];
  if (dimL > 0) then
    writeln('Sueldo promedio: ', suma / dimL:0:2)
  else
    writeln('No hay empleados');
end;

var
  v : vSalarios;
  dimL : integer;
begin
  cargar(v, dimL);
  multiplicar(1.15, v, dimL);
  informarPromedio(v, dimL);
end.`,
    entrada: "100000 150000 200000 0",
  },
  {
    grupo: G, ref: "P4·1 Ej 11", titulo: "ArgenPics",
    enunciado: "De cada una de las 200 fotos publicadas se conoce título, autor, cantidad de Me gusta, de clics y de comentarios. Leer y almacenar la información y después informar: (a) el título de la foto más vista (más clics); (b) el total de Me gusta de las fotos de 'Art Vandelay'; (c) la cantidad de comentarios de cada foto.",
    pista: "Un registro foto y un vector de 200. Los tres incisos salen en un solo recorrido.",
    sol: `program argenPics;
const
  DIMF = 200;
type
  foto = record
    titulo, autor : string;
    meGusta, clics, comentarios : longint;
  end;
  vFotos = array [1..DIMF] of foto;

procedure leerFoto(var f : foto);
begin
  readln(f.titulo);
  readln(f.autor);
  readln(f.meGusta);
  readln(f.clics);
  readln(f.comentarios);
end;

procedure cargar(var v : vFotos);
var i : integer;
begin
  for i := 1 to DIMF do leerFoto(v[i]);
end;

procedure procesar(v : vFotos);
var
  i : integer;
  maxClics, likesArt : longint;
  tituloMax : string;
begin
  maxClics := -1; tituloMax := '';
  likesArt := 0;
  for i := 1 to DIMF do begin
    if (v[i].clics > maxClics) then begin
      maxClics := v[i].clics;
      tituloMax := v[i].titulo;
    end;
    if (v[i].autor = 'Art Vandelay') then
      likesArt := likesArt + v[i].meGusta;
    writeln(v[i].titulo, ': ', v[i].comentarios, ' comentarios');
  end;
  writeln('Foto más vista: ', tituloMax);
  writeln('Me gusta de Art Vandelay: ', likesArt);
end;

var
  v : vFotos;
begin
  cargar(v);
  procesar(v);
end.
{ Para probarlo rápido, cambiá DIMF a 3. }`,
  },
  {
    grupo: G, ref: "P4·1 Ej 12", titulo: "Galaxias del Grupo Local",
    enunciado: "De cada una de las 53 galaxias del Grupo Local se conoce nombre, tipo (1: elíptica, 2: espiral, 3: lenticular, 4: irregular), masa (kg) y distancia (pc). Leer y almacenar los datos e informar: (a) la cantidad de galaxias de cada tipo; (b) la masa total de las 3 principales (Vía Láctea, Andrómeda y Triángulo) y qué porcentaje representa del total; (c) la cantidad de galaxias no irregulares a menos de 1000 pc; (d) el nombre de las dos con mayor masa y de las dos con menor masa.",
    pista: "Vector contador para los tipos. Las masas son enormes (del orden de 10^42 kg): usá real. Todo sale en un recorrido; el porcentaje se calcula al final.",
    sol: `program galaxias;
const
  DIMF = 53;
type
  rangoTipo = 1..4;
  galaxia = record
    nombre : string;
    tipo : rangoTipo;
    masa, distancia : real;
  end;
  vGalaxias = array [1..DIMF] of galaxia;
  vTipos = array [rangoTipo] of integer;

procedure leerGalaxia(var g : galaxia);
begin
  readln(g.nombre);
  readln(g.tipo);
  readln(g.masa);
  readln(g.distancia);
end;

procedure cargar(var v : vGalaxias);
var i : integer;
begin
  for i := 1 to DIMF do leerGalaxia(v[i]);
end;

function esPrincipal(nombre : string) : boolean;
begin
  esPrincipal := (nombre = 'Vía Láctea') or (nombre = 'Andrómeda') or (nombre = 'Triángulo');
end;

procedure procesar(v : vGalaxias);
var
  i, cercanas : integer;
  t : rangoTipo;
  tipos : vTipos;
  masaTotal, masaPrinc, max1, max2, min1, min2 : real;
  nMax1, nMax2, nMin1, nMin2 : string;
begin
  for t := 1 to 4 do tipos[t] := 0;
  masaTotal := 0; masaPrinc := 0; cercanas := 0;
  max1 := -1; max2 := -1; min1 := 1e300; min2 := 1e300;
  nMax1 := ''; nMax2 := ''; nMin1 := ''; nMin2 := '';
  for i := 1 to DIMF do begin
    tipos[v[i].tipo] := tipos[v[i].tipo] + 1;
    masaTotal := masaTotal + v[i].masa;
    if esPrincipal(v[i].nombre) then masaPrinc := masaPrinc + v[i].masa;
    if (v[i].tipo <> 4) and (v[i].distancia < 1000) then cercanas := cercanas + 1;
    if (v[i].masa > max1) then begin
      max2 := max1; nMax2 := nMax1; max1 := v[i].masa; nMax1 := v[i].nombre;
    end
    else if (v[i].masa > max2) then begin
      max2 := v[i].masa; nMax2 := v[i].nombre;
    end;
    if (v[i].masa < min1) then begin
      min2 := min1; nMin2 := nMin1; min1 := v[i].masa; nMin1 := v[i].nombre;
    end
    else if (v[i].masa < min2) then begin
      min2 := v[i].masa; nMin2 := v[i].nombre;
    end;
  end;
  for t := 1 to 4 do writeln('Tipo ', t, ': ', tipos[t], ' galaxias');
  writeln('Masa de las 3 principales: ', masaPrinc:12, ' kg (', masaPrinc / masaTotal * 100:0:2, '% del total)');
  writeln('No irregulares a menos de 1000 pc: ', cercanas);
  writeln('Mayor masa: ', nMax1, ' y ', nMax2);
  writeln('Menor masa: ', nMin1, ' y ', nMin2);
end;

var
  v : vGalaxias;
begin
  cargar(v);
  procesar(v);
end.
{ Para probarlo rápido, cambiá DIMF a 4. }`,
  },
  {
    grupo: G, ref: "P4·1 Ej 13", titulo: "Temperaturas del IPCC",
    enunciado: "El IPCC mide todos los años la temperatura promedio en 100 puntos del planeta, y lo hace desde hace 50 años. Leer y almacenar las mediciones de los últimos 50 años (ordenadas por año) y obtener: (a) el año con mayor temperatura promedio a nivel mundial; (b) el año con la mayor temperatura detectada en algún punto del planeta.",
    pista: "Una matriz de 50 años por 100 puntos (array[1..50, 1..100] of real). Para cada año se calcula el promedio de su fila y su máximo.",
    sol: `program ipcc;
const
  ANIOS = 50;
  PUNTOS = 100;
  PRIMER_ANIO = 1976;
type
  matriz = array [1..ANIOS, 1..PUNTOS] of real;

procedure cargar(var m : matriz);
var a, p : integer;
begin
  for a := 1 to ANIOS do
    for p := 1 to PUNTOS do
      read(m[a, p]);
end;

procedure procesar(m : matriz);
var
  a, p, anioProm, anioMax : integer;
  suma, prom, maxProm, maxTemp : real;
begin
  maxProm := -1e30; maxTemp := -1e30;
  anioProm := 0; anioMax := 0;
  for a := 1 to ANIOS do begin
    suma := 0;
    for p := 1 to PUNTOS do begin
      suma := suma + m[a, p];
      if (m[a, p] > maxTemp) then begin
        maxTemp := m[a, p];
        anioMax := a;
      end;
    end;
    prom := suma / PUNTOS;
    if (prom > maxProm) then begin
      maxProm := prom;
      anioProm := a;
    end;
  end;
  writeln('Año con mayor temperatura promedio: ', PRIMER_ANIO + anioProm - 1);
  writeln('Año con la mayor temperatura en algún punto: ', PRIMER_ANIO + anioMax - 1);
end;

var
  m : matriz;
begin
  cargar(m);
  procesar(m);
end.
{ Para probarlo rápido, cambiá ANIOS a 2 y PUNTOS a 3. }`,
  },
  {
    grupo: G, ref: "P4·1 Ej 14", titulo: "Inversión en proyectos de GitHub",
    enunciado: "Se dispone de una tabla con el valor por hora de cada rol (1: analista funcional, 2: programador, 3: administrador de bases de datos, 4: arquitecto de software, 5: administrador de redes). De cada participante de los 1000 proyectos más activos se lee país, código de proyecto (1 a 1000), nombre del proyecto, rol y horas trabajadas, hasta el código de proyecto -1. Informar: (a) el monto total invertido en desarrolladores de Argentina; (b) el total de horas de los administradores de bases de datos; (c) el código del proyecto con menor monto invertido; (d) la cantidad de arquitectos de cada proyecto.",
    pista: "La tabla 'se dispone': un vector de 5 reales. Para (c) y (d) hacen falta vectores indexados por código de proyecto (1..1000) que se van acumulando mientras se lee. No hace falta guardar los participantes.",
    sol: `program github;
const
  PROYECTOS = 1000;
type
  rangoRol = 1..5;
  vValores = array [rangoRol] of real;
  vMontos = array [1..PROYECTOS] of real;
  vCant = array [1..PROYECTOS] of integer;
  participante = record
    pais : string;
    codigo : integer;
    nombre : string;
    rol : rangoRol;
    horas : real;
  end;

{ La tabla se dispone; acá se carga con los valores del enunciado }
procedure cargarValores(var v : vValores);
begin
  v[1] := 35.20; v[2] := 27.45; v[3] := 31.03; v[4] := 44.28; v[5] := 39.87;
end;

procedure leerParticipante(var p : participante);
begin
  readln(p.codigo);
  if (p.codigo <> -1) then begin
    readln(p.pais);
    readln(p.nombre);
    readln(p.rol);
    readln(p.horas);
  end;
end;

var
  valores : vValores;
  montos : vMontos;
  arquitectos : vCant;
  p : participante;
  i, codMin : integer;
  monto, montoArg, horasDBA, min : real;
begin
  cargarValores(valores);
  for i := 1 to PROYECTOS do begin
    montos[i] := 0;
    arquitectos[i] := 0;
  end;
  montoArg := 0;
  horasDBA := 0;
  leerParticipante(p);
  while (p.codigo <> -1) do begin
    monto := p.horas * valores[p.rol];
    montos[p.codigo] := montos[p.codigo] + monto;
    if (p.pais = 'Argentina') then montoArg := montoArg + monto;
    if (p.rol = 3) then horasDBA := horasDBA + p.horas;
    if (p.rol = 4) then arquitectos[p.codigo] := arquitectos[p.codigo] + 1;
    leerParticipante(p);
  end;
  min := 1e30;
  codMin := 0;
  for i := 1 to PROYECTOS do
    if (montos[i] > 0) and (montos[i] < min) then begin
      min := montos[i];
      codMin := i;
    end;
  writeln('Monto invertido en desarrolladores de Argentina: U$S ', montoArg:0:2);
  writeln('Horas de administradores de bases de datos: ', horasDBA:0:1);
  writeln('Proyecto con menor monto invertido: ', codMin);
  for i := 1 to PROYECTOS do
    if (montos[i] > 0) then
      writeln('Proyecto ', i, ': ', arquitectos[i], ' arquitectos');
end.
{ Para (c) solo se consideran proyectos con algún participante; con el
  enunciado (los 1000 más activos) todos tienen participantes. }`,
    entrada: "7\nArgentina\nLinux\n4\n100\n7\nBrasil\nLinux\n3\n50\n12\nArgentina\nReact\n2\n10\n12\nChile\nReact\n4\n20\n-1",
  },
];

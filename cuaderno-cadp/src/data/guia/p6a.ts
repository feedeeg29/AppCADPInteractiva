import type { Ejercicio } from "../types";

const G = "Práctica 6 · Listas";

/** Ejercicios 1 a 9 de la Práctica 6 */
export const guiaP6a: Ejercicio[] = [
  {
    grupo: G, ref: "P6 Ej 1", titulo: "JugamosConListas",
    enunciado: "El programa lee números hasta el 0 y llama a armarNodo, que crea un nodo con el número y lo engancha al principio de la lista. (a) Indicar qué hace el programa. (b) ¿Cómo queda la lista con la secuencia 10 21 13 48 0? (c) Implementar un módulo que imprima la lista. (d) Implementar un módulo que reciba la lista y un valor e incremente cada dato con ese valor.",
    pista: "armarNodo agrega adelante: cada número nuevo pasa a ser el primero. Para recorrer, la lista se pasa por valor y se avanza con L := L^.sig.",
    sol: `{ a) Lee números enteros hasta el 0 y arma una lista agregando cada
     número adelante, así que la lista queda en orden inverso al de lectura.
  b) 48 -> 13 -> 21 -> 10 -> nil }
program JugamosConListas;
type
  lista = ^nodo;
  nodo = record
    num : integer;
    sig : lista;
  end;

procedure armarNodo(var L : lista; v : integer);
var aux : lista;
begin
  new(aux);
  aux^.num := v;
  aux^.sig := L;
  L := aux;
end;

procedure imprimir(L : lista);                       { c }
begin
  while (L <> nil) do begin
    write(L^.num, ' ');
    L := L^.sig;
  end;
  writeln;
end;

procedure incrementar(L : lista; valor : integer);   { d }
begin
  while (L <> nil) do begin
    L^.num := L^.num + valor;
    L := L^.sig;
  end;
end;

var
  pri : lista;
  valor : integer;
begin
  pri := nil;
  writeln('Ingrese un numero');
  read(valor);
  while (valor <> 0) do begin
    armarNodo(pri, valor);
    writeln('Ingrese un numero');
    read(valor);
  end;
  imprimir(pri);
  incrementar(pri, 100);
  imprimir(pri);
end.`,
    entrada: "10 21 13 48 0",
  },
  {
    grupo: G, ref: "P6 Ej 2", titulo: "Los 9 errores",
    enunciado: "El programa lee personas (DNI, nombre, apellido) hasta el DNI 0 (que no se procesa) y después las imprime en orden inverso al de lectura. Identificar los 9 errores.",
    pista: "Revisá los parámetros (cuáles tienen que ser var y cuáles no), el new que falta, el tipo de la variable que se lee, el while que nunca avanza, la inicialización de la lista y cómo se accede a los campos.",
    sol: `{ 1. leerPersona: p tiene que ser var (si no, lo leído se pierde).
  2. agregarAdelante: l tiene que ser var (si no, el nodo nuevo no queda
     enganchado a la lista del llamador).
  3. agregarAdelante: falta new(aux) antes de usar aux^.
  4. generarLista: p tiene que ser de tipo persona, no nodo.
  5. generarLista: dentro del while falta leerPersona(p); sin eso el bucle
     nunca termina.
  6. Programa principal: falta l := nil antes de generarLista.
  7. imprimirInformacion: l^.nombre tiene que ser l^.dato.nombre.
  8. imprimirInformacion: l^.apellido tiene que ser l^.dato.apellido.
  9. imprimirInformacion: l no tiene que ser var; si lo es, al recorrer
     se pierde el comienzo de la lista.
  Programa corregido: }
program ejercicio2;
type
  persona = record
    dni : longint;
    nombre, apellido : string;
  end;
  lista = ^nodo;
  nodo = record
    dato : persona;
    sig : lista;
  end;

procedure leerPersona(var p : persona);
begin
  readln(p.dni);
  if (p.dni <> 0) then begin
    readln(p.nombre);
    readln(p.apellido);
  end;
end;

procedure agregarAdelante(var l : lista; p : persona);
var aux : lista;
begin
  new(aux);
  aux^.dato := p;
  aux^.sig := l;
  l := aux;
end;

procedure generarLista(var l : lista);
var p : persona;
begin
  leerPersona(p);
  while (p.dni <> 0) do begin
    agregarAdelante(l, p);
    leerPersona(p);
  end;
end;

procedure imprimirInformacion(l : lista);
begin
  while (l <> nil) do begin
    writeln('DNI: ', l^.dato.dni, ' Nombre: ', l^.dato.nombre, ' Apellido: ', l^.dato.apellido);
    l := l^.sig;
  end;
end;

var
  l : lista;
begin
  l := nil;
  generarLista(l);
  imprimirInformacion(l);
end.`,
    entrada: "30111222\nAna\nPaz\n28333444\nLuis\nGil\n0",
  },
  {
    grupo: G, ref: "P6 Ej 3a", titulo: "Agregar atrás recorriendo",
    enunciado: "Modificar armarNodo para que los elementos queden en la lista en el mismo orden en que se ingresaron (agregar atrás).",
    pista: "Si la lista está vacía, el nodo nuevo es el primero. Si no, hay que recorrer hasta el último nodo y engancharlo ahí.",
    sol: `program agregarAtrasRecorriendo;
type
  lista = ^nodo;
  nodo = record
    num : integer;
    sig : lista;
  end;

procedure armarNodo(var L : lista; v : integer);
var nue, aux : lista;
begin
  new(nue);
  nue^.num := v;
  nue^.sig := nil;
  if (L = nil) then
    L := nue
  else begin
    aux := L;
    while (aux^.sig <> nil) do
      aux := aux^.sig;
    aux^.sig := nue;
  end;
end;

procedure imprimir(L : lista);
begin
  while (L <> nil) do begin
    write(L^.num, ' ');
    L := L^.sig;
  end;
  writeln;
end;

var
  pri : lista;
  valor : integer;
begin
  pri := nil;
  read(valor);
  while (valor <> 0) do begin
    armarNodo(pri, valor);
    read(valor);
  end;
  imprimir(pri);
end.
{ Cada agregado recorre toda la lista: con muchos datos es lento.
  La versión del inciso b lo evita con un puntero al último. }`,
    entrada: "10 21 13 48 0",
  },
  {
    grupo: G, ref: "P6 Ej 3b", titulo: "Agregar atrás con puntero al último",
    enunciado: "Modificar armarNodo para que los elementos queden en el orden en que se ingresaron, manteniendo un puntero al último nodo.",
    pista: "armarNodo recibe pri y ult por referencia. No hace falta recorrer: el nuevo se engancha en ult^.sig.",
    sol: `program agregarAtrasConUltimo;
type
  lista = ^nodo;
  nodo = record
    num : integer;
    sig : lista;
  end;

procedure armarNodo(var pri, ult : lista; v : integer);
var nue : lista;
begin
  new(nue);
  nue^.num := v;
  nue^.sig := nil;
  if (pri = nil) then
    pri := nue
  else
    ult^.sig := nue;
  ult := nue;
end;

procedure imprimir(L : lista);
begin
  while (L <> nil) do begin
    write(L^.num, ' ');
    L := L^.sig;
  end;
  writeln;
end;

var
  pri, ult : lista;
  valor : integer;
begin
  pri := nil;
  ult := nil;
  read(valor);
  while (valor <> 0) do begin
    armarNodo(pri, ult, valor);
    read(valor);
  end;
  imprimir(pri);
end.`,
    entrada: "10 21 13 48 0",
  },
  {
    grupo: G, ref: "P6 Ej 4", titulo: "Máximo, mínimo y múltiplos",
    enunciado: "Usando el programa del ejercicio 1, realizar: (a) Máximo: recibe la lista y devuelve el mayor elemento; (b) Mínimo: devuelve el menor; (c) Múltiplos: recibe la lista y un entero A y devuelve cuántos elementos son múltiplos de A.",
    pista: "Tres funciones que recorren la lista recibida por valor.",
    sol: `program maxMinMultiplos;
type
  lista = ^nodo;
  nodo = record
    num : integer;
    sig : lista;
  end;

procedure armarNodo(var L : lista; v : integer);
var aux : lista;
begin
  new(aux);
  aux^.num := v;
  aux^.sig := L;
  L := aux;
end;

function maximo(L : lista) : integer;
var max : integer;
begin
  max := -32768;
  while (L <> nil) do begin
    if (L^.num > max) then max := L^.num;
    L := L^.sig;
  end;
  maximo := max;
end;

function minimo(L : lista) : integer;
var min : integer;
begin
  min := 32767;
  while (L <> nil) do begin
    if (L^.num < min) then min := L^.num;
    L := L^.sig;
  end;
  minimo := min;
end;

function multiplos(L : lista; A : integer) : integer;
var cant : integer;
begin
  cant := 0;
  while (L <> nil) do begin
    if (L^.num mod A = 0) then cant := cant + 1;
    L := L^.sig;
  end;
  multiplos := cant;
end;

var
  pri : lista;
  valor, A : integer;
begin
  pri := nil;
  read(valor);
  while (valor <> 0) do begin
    armarNodo(pri, valor);
    read(valor);
  end;
  read(A);
  writeln('Máximo: ', maximo(pri));
  writeln('Mínimo: ', minimo(pri));
  writeln('Múltiplos de ', A, ': ', multiplos(pri, A));
end.`,
    entrada: "10 21 13 48 0\n3",
  },
  {
    grupo: G, ref: "P6 Ej 5", titulo: "Productos del supermercado",
    enunciado: "Leer y almacenar productos (código, descripción, stock actual, stock mínimo y precio) hasta el código -1, que no se procesa. Después informar: (a) el porcentaje de productos con stock actual por debajo del mínimo; (b) la descripción de los productos cuyo código tiene al menos tres dígitos pares; (c) el código de los dos productos más económicos.",
    pista: "Cantidad desconocida: lista (agregar adelante alcanza, no se pide orden). Los tres incisos salen en un recorrido.",
    sol: `program supermercado;
type
  producto = record
    codigo : integer;
    descripcion : string;
    stockActual, stockMinimo : integer;
    precio : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : producto;
    sig : lista;
  end;

procedure leerProducto(var p : producto);
begin
  readln(p.codigo);
  if (p.codigo <> -1) then begin
    readln(p.descripcion);
    readln(p.stockActual);
    readln(p.stockMinimo);
    readln(p.precio);
  end;
end;

procedure agregarAdelante(var L : lista; p : producto);
var nue : lista;
begin
  new(nue);
  nue^.dato := p;
  nue^.sig := L;
  L := nue;
end;

procedure cargar(var L : lista);
var p : producto;
begin
  L := nil;
  leerProducto(p);
  while (p.codigo <> -1) do begin
    agregarAdelante(L, p);
    leerProducto(p);
  end;
end;

function tresPares(cod : integer) : boolean;
var pares : integer;
begin
  pares := 0;
  repeat
    if ((cod mod 10) mod 2 = 0) then pares := pares + 1;
    cod := cod div 10;
  until (cod = 0);
  tresPares := (pares >= 3);
end;

procedure procesar(L : lista);
var
  cant, bajos, cod1, cod2 : integer;
  min1, min2 : real;
begin
  cant := 0; bajos := 0;
  min1 := 1e30; min2 := 1e30; cod1 := 0; cod2 := 0;
  while (L <> nil) do begin
    cant := cant + 1;
    if (L^.dato.stockActual < L^.dato.stockMinimo) then bajos := bajos + 1;
    if tresPares(L^.dato.codigo) then
      writeln('Código con al menos tres dígitos pares: ', L^.dato.descripcion);
    if (L^.dato.precio < min1) then begin
      min2 := min1; cod2 := cod1;
      min1 := L^.dato.precio; cod1 := L^.dato.codigo;
    end
    else if (L^.dato.precio < min2) then begin
      min2 := L^.dato.precio; cod2 := L^.dato.codigo;
    end;
    L := L^.sig;
  end;
  if (cant > 0) then
    writeln('Porcentaje por debajo del stock mínimo: ', bajos / cant * 100:0:2, '%');
  writeln('Los dos más económicos: ', cod1, ' y ', cod2);
end;

var
  L : lista;
begin
  cargar(L);
  procesar(L);
end.`,
    entrada: "2468\nYerba\n5\n10\n2500\n135\nAzúcar\n40\n20\n1200\n204\nArroz\n3\n8\n900\n-1",
  },
  {
    grupo: G, ref: "P6 Ej 6", titulo: "Sondas espaciales de la ESA",
    enunciado: "De cada sonda se conoce nombre, duración de la misión (meses), costo de construcción, costo de mantenimiento mensual y rango del espectro que estudia (1: radio … 7: rayos gamma). Leer y almacenar todas las sondas hasta la llamada 'GAIA', que se procesa. Informar: (a) el nombre de la sonda más costosa (construcción más mantenimiento); (b) la cantidad de sondas de cada rango; (c) la cantidad de sondas con duración mayor al promedio; (d) el nombre de las sondas con costo de construcción mayor al promedio. Recorrer la lista la menor cantidad de veces posible.",
    pista: "Costo total = construcción + mantenimiento mensual × duración. (c) y (d) necesitan los promedios: primer recorrido para (a), (b) y las sumas; segundo recorrido para (c) y (d). Dos recorridos es el mínimo.",
    sol: `program sondas;
type
  rangoEspectro = 1..7;
  sonda = record
    nombre : string;
    duracion : integer;
    construccion, mantenimiento : real;
    rango : rangoEspectro;
  end;
  lista = ^nodo;
  nodo = record
    dato : sonda;
    sig : lista;
  end;
  vRangos = array [rangoEspectro] of integer;

procedure leerSonda(var s : sonda);
begin
  readln(s.nombre);
  readln(s.duracion);
  readln(s.construccion);
  readln(s.mantenimiento);
  readln(s.rango);
end;

procedure agregarAdelante(var L : lista; s : sonda);
var nue : lista;
begin
  new(nue);
  nue^.dato := s;
  nue^.sig := L;
  L := nue;
end;

procedure cargar(var L : lista);
var s : sonda;
begin
  L := nil;
  repeat
    leerSonda(s);
    agregarAdelante(L, s);
  until (s.nombre = 'GAIA');
end;

function costoTotal(s : sonda) : real;
begin
  costoTotal := s.construccion + s.mantenimiento * s.duracion;
end;

procedure procesar(L : lista);
var
  aux : lista;
  r : rangoEspectro;
  rangos : vRangos;
  cant, largas : integer;
  sumaDur, sumaCons, max, promDur, promCons : real;
  nomMax : string;
begin
  for r := 1 to 7 do rangos[r] := 0;
  cant := 0; sumaDur := 0; sumaCons := 0;
  max := -1; nomMax := '';
  { primer recorrido: a), b) y sumas para los promedios }
  aux := L;
  while (aux <> nil) do begin
    cant := cant + 1;
    sumaDur := sumaDur + aux^.dato.duracion;
    sumaCons := sumaCons + aux^.dato.construccion;
    rangos[aux^.dato.rango] := rangos[aux^.dato.rango] + 1;
    if (costoTotal(aux^.dato) > max) then begin
      max := costoTotal(aux^.dato);
      nomMax := aux^.dato.nombre;
    end;
    aux := aux^.sig;
  end;
  writeln('Sonda más costosa: ', nomMax);
  for r := 1 to 7 do writeln('Rango ', r, ': ', rangos[r], ' sondas');
  { segundo recorrido: c) y d) }
  promDur := sumaDur / cant;
  promCons := sumaCons / cant;
  largas := 0;
  aux := L;
  while (aux <> nil) do begin
    if (aux^.dato.duracion > promDur) then largas := largas + 1;
    if (aux^.dato.construccion > promCons) then
      writeln('Construcción mayor al promedio: ', aux^.dato.nombre);
    aux := aux^.sig;
  end;
  writeln('Sondas con duración mayor al promedio: ', largas);
end;

var
  L : lista;
begin
  cargar(L);
  procesar(L);
end.`,
    entrada: "Voyager\n480\n900\n2\n1\nHubble\n360\n1500\n5\n4\nJuno\n70\n1100\n3\n3\nGAIA\n120\n800\n4\n4",
  },
  {
    grupo: G, ref: "P6 Ej 7", titulo: "Criterios Horizonte 2020",
    enunciado: "Para las sondas del ejercicio 6, H2020 solo financia proyectos cuyo costo de mantenimiento no supere el de construcción, y no financia los que estudian ondas de radio. (a) Módulo que reciba una sonda y devuelva si cumple los criterios. (b) Usándolo, un módulo que procese la lista de la ESA y devuelva dos listas: las que cumplen y las que no. (c) Módulo que reciba una lista de sondas e informe la cantidad y el costo total (construcción y mantenimiento) de los proyectos que no serán financiados, usando el módulo de (b).",
    pista: "El costo de mantenimiento total es mensual × duración. En (b) cada sonda va a una de las dos listas: agregar adelante en la que corresponda.",
    sol: `program h2020;
type
  rangoEspectro = 1..7;
  sonda = record
    nombre : string;
    duracion : integer;
    construccion, mantenimiento : real;
    rango : rangoEspectro;
  end;
  lista = ^nodo;
  nodo = record
    dato : sonda;
    sig : lista;
  end;

procedure leerSonda(var s : sonda);
begin
  readln(s.nombre);
  readln(s.duracion);
  readln(s.construccion);
  readln(s.mantenimiento);
  readln(s.rango);
end;

procedure agregarAdelante(var L : lista; s : sonda);
var nue : lista;
begin
  new(nue);
  nue^.dato := s;
  nue^.sig := L;
  L := nue;
end;

{ La lista de la ESA se dispone (ejercicio 6); acá se carga para probar }
procedure cargar(var L : lista);
var s : sonda;
begin
  L := nil;
  repeat
    leerSonda(s);
    agregarAdelante(L, s);
  until (s.nombre = 'GAIA');
end;

{ a) }
function cumple(s : sonda) : boolean;
begin
  cumple := (s.mantenimiento * s.duracion <= s.construccion) and (s.rango <> 1);
end;

{ b) }
procedure separar(L : lista; var si, no : lista);
begin
  si := nil;
  no := nil;
  while (L <> nil) do begin
    if cumple(L^.dato) then agregarAdelante(si, L^.dato)
    else agregarAdelante(no, L^.dato);
    L := L^.sig;
  end;
end;

{ c) }
procedure informarNoFinanciados(L : lista);
var
  si, no : lista;
  cant : integer;
  total : real;
begin
  separar(L, si, no);
  cant := 0;
  total := 0;
  while (no <> nil) do begin
    cant := cant + 1;
    total := total + no^.dato.construccion + no^.dato.mantenimiento * no^.dato.duracion;
    no := no^.sig;
  end;
  writeln('Proyectos no financiados: ', cant);
  writeln('Costo total de los no financiados: ', total:0:2);
end;

var
  L : lista;
begin
  cargar(L);
  informarNoFinanciados(L);
end.`,
    entrada: "Voyager\n480\n900\n2\n1\nHubble\n360\n1500\n5\n4\nJuno\n70\n1100\n3\n3\nGAIA\n120\n800\n4\n4",
  },
  {
    grupo: G, ref: "P6 Ej 8", titulo: "Insertar ordenado",
    enunciado: "Usando el programa del ejercicio 1, modificar armarNodo para que la lista quede ordenada de forma ascendente.",
    pista: "Se avanza con dos punteros (ant y act) hasta encontrar el primer nodo mayor o igual al nuevo. Si act sigue siendo el primero, el nuevo va al principio.",
    sol: `program listaOrdenada;
type
  lista = ^nodo;
  nodo = record
    num : integer;
    sig : lista;
  end;

procedure armarNodo(var L : lista; v : integer);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.num := v;
  act := L;
  ant := L;
  while (act <> nil) and (act^.num < v) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then
    L := nue
  else
    ant^.sig := nue;
  nue^.sig := act;
end;

procedure imprimir(L : lista);
begin
  while (L <> nil) do begin
    write(L^.num, ' ');
    L := L^.sig;
  end;
  writeln;
end;

var
  pri : lista;
  valor : integer;
begin
  pri := nil;
  read(valor);
  while (valor <> 0) do begin
    armarNodo(pri, valor);
    read(valor);
  end;
  imprimir(pri);
end.`,
    entrada: "10 21 13 48 5 30 0",
  },
  {
    grupo: G, ref: "P6 Ej 9", titulo: "EstáOrdenada, Eliminar y Sublista",
    enunciado: "Usando el programa del ejercicio 1: (a) EstáOrdenada: devuelve si la lista está ordenada; (b) Eliminar: recibe la lista y un valor y lo elimina si existe (la lista puede no estar ordenada); (c) Sublista: recibe la lista y dos valores A y B y devuelve una lista nueva con los elementos mayores que A y menores que B; (d) Sublista suponiendo que la lista está ordenada de forma ascendente; (e) Sublista suponiendo que está ordenada de forma descendente.",
    pista: "(b) usa ant y act y contempla el caso del primero. Para (c), (d) y (e) la sublista se arma agregando atrás para conservar el orden. Con la lista ordenada se puede cortar el recorrido antes.",
    sol: `program operacionesLista;
type
  lista = ^nodo;
  nodo = record
    num : integer;
    sig : lista;
  end;

procedure agregarAtras(var pri, ult : lista; v : integer);
var nue : lista;
begin
  new(nue);
  nue^.num := v;
  nue^.sig := nil;
  if (pri = nil) then pri := nue else ult^.sig := nue;
  ult := nue;
end;

{ a) }
function estaOrdenada(L : lista) : boolean;
var ok : boolean;
begin
  ok := true;
  if (L <> nil) then
    while (L^.sig <> nil) and ok do begin
      if (L^.num > L^.sig^.num) then ok := false;
      L := L^.sig;
    end;
  estaOrdenada := ok;
end;

{ b) elimina la primera aparición de v }
procedure eliminar(var L : lista; v : integer);
var ant, act : lista;
begin
  act := L;
  ant := L;
  while (act <> nil) and (act^.num <> v) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act <> nil) then begin
    if (act = L) then L := act^.sig
    else ant^.sig := act^.sig;
    dispose(act);
  end;
end;

{ c) lista sin orden: hay que recorrerla toda }
procedure sublista(L : lista; A, B : integer; var nueva : lista);
var ult : lista;
begin
  nueva := nil;
  ult := nil;
  while (L <> nil) do begin
    if (L^.num > A) and (L^.num < B) then agregarAtras(nueva, ult, L^.num);
    L := L^.sig;
  end;
end;

{ d) ordenada ascendente: se saltean los <= A y se corta al llegar a B }
procedure sublistaAsc(L : lista; A, B : integer; var nueva : lista);
var ult : lista;
begin
  nueva := nil;
  ult := nil;
  while (L <> nil) and (L^.num <= A) do L := L^.sig;
  while (L <> nil) and (L^.num < B) do begin
    agregarAtras(nueva, ult, L^.num);
    L := L^.sig;
  end;
end;

{ e) ordenada descendente: se saltean los >= B y se corta al llegar a A }
procedure sublistaDesc(L : lista; A, B : integer; var nueva : lista);
var ult : lista;
begin
  nueva := nil;
  ult := nil;
  while (L <> nil) and (L^.num >= B) do L := L^.sig;
  while (L <> nil) and (L^.num > A) do begin
    agregarAtras(nueva, ult, L^.num);
    L := L^.sig;
  end;
end;

procedure imprimir(L : lista);
begin
  while (L <> nil) do begin
    write(L^.num, ' ');
    L := L^.sig;
  end;
  writeln;
end;

var
  pri, ult, sub, desc, ultD : lista;
  valor : integer;
begin
  pri := nil; ult := nil;
  read(valor);                        { cargar ordenado para probar d) }
  while (valor <> 0) do begin
    agregarAtras(pri, ult, valor);
    read(valor);
  end;
  writeln('¿Está ordenada? ', estaOrdenada(pri));
  sublista(pri, 10, 40, sub);    write('c) '); imprimir(sub);
  sublistaAsc(pri, 10, 40, sub); write('d) '); imprimir(sub);
  { la misma lista al revés, para probar e) }
  desc := nil; ultD := nil;
  sub := pri;
  while (sub <> nil) do begin
    new(ultD); ultD^.num := sub^.num; ultD^.sig := desc; desc := ultD;
    sub := sub^.sig;
  end;
  sublistaDesc(desc, 10, 40, sub); write('e) '); imprimir(sub);
  eliminar(pri, 25);
  write('Sin el 25: '); imprimir(pri);
end.`,
    entrada: "5 10 15 25 40 50 0",
  },
];

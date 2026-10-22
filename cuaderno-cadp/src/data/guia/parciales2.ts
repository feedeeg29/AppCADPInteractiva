import type { Ejercicio } from "../types";

/** Parciales 2023, 2022 y 2018 */
export const parciales2: Ejercicio[] = [
  {
    grupo: "Parciales 2023", ref: "2023 · 2ª fecha · T1", titulo: "Bizarrap: sesiones en YouTube",
    enunciado: `El productor musical Bizarrap organiza sesiones musicales con diferentes artistas. Implementar un programa que lea y almacene información de dichas sesiones. De cada sesión se lee: título de sesión, nombre del artista, género musical (1: Trap Latino, 2: Reggaeton, 3: Urban, 4: Electrónica, 5: Pop Rap) y cantidad de visualizaciones en YouTube. La lectura finaliza cuando se lee la sesión del artista con nombre "Peso Pluma", la cual debe procesarse. La información debe quedar almacenada en una estructura de datos ordenada por título de sesión de forma ascendente.
Una vez leída y almacenada la información, se pide:
a) Informar los dos códigos de género musical con mayor cantidad de visualizaciones en YouTube.
b) Informar la cantidad de sesiones del género "Reggaeton" cuya cantidad de visualizaciones contiene la misma cantidad de dígitos pares que impares.
c) COMPLETO: Realizar un módulo que reciba un título de sesión y elimine dicha sesión de la estructura. El título puede no existir. Invocar el módulo desarrollado en el programa principal con un título leído por teclado.`,
    pista: "repeat ... until artista = 'Peso Pluma' (se procesa), insertando ordenado por título (los strings se comparan con < como en el diccionario). (a) y (b) en un recorrido con un vector de sumas por género. Las sumas de visualizaciones pueden pasar el máximo de longint: acumulalas en real.",
    sol: `program Bizarrap;
type
  str60 = string[60];
  rangoGenero = 1..5;
  sesion = record
    titulo, artista : str60;
    genero : rangoGenero;
    vistas : longint;
  end;
  lista = ^nodo;
  nodo = record
    dato : sesion;
    sig : lista;
  end;
  vGeneros = array [rangoGenero] of real;

procedure leerSesion(var s : sesion);
begin
  readln(s.titulo);
  readln(s.artista);
  readln(s.genero);
  readln(s.vistas);
end;

procedure insertarPorTitulo(var L : lista; s : sesion);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := s;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.titulo < s.titulo) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

procedure cargarLista(var L : lista);
var s : sesion;
begin
  L := nil;
  repeat
    leerSesion(s);
    insertarPorTitulo(L, s);
  until (s.artista = 'Peso Pluma');
end;

function mismaCantidad(n : longint) : boolean;
var pares, impares : integer;
begin
  pares := 0;
  impares := 0;
  while (n <> 0) do begin
    if ((n mod 10) mod 2 = 0) then pares := pares + 1
    else impares := impares + 1;
    n := n div 10;
  end;
  mismaCantidad := pares = impares;
end;

procedure informar(L : lista);
var
  generos : vGeneros;
  g, g1, g2 : integer;
  max1, max2 : real;
  cantB : integer;
begin
  for g := 1 to 5 do generos[g] := 0;
  cantB := 0;
  while (L <> nil) do begin
    generos[L^.dato.genero] := generos[L^.dato.genero] + L^.dato.vistas;
    if (L^.dato.genero = 2) and mismaCantidad(L^.dato.vistas) then
      cantB := cantB + 1;
    L := L^.sig;
  end;
  max1 := -1; max2 := -1; g1 := 0; g2 := 0;
  for g := 1 to 5 do
    if (generos[g] > max1) then begin
      max2 := max1; g2 := g1;
      max1 := generos[g]; g1 := g;
    end
    else if (generos[g] > max2) then begin
      max2 := generos[g]; g2 := g;
    end;
  writeln('a) Géneros con más visualizaciones: ', g1, ' y ', g2);
  writeln('b) Sesiones de Reggaeton con igual cantidad de dígitos pares e impares: ', cantB);
end;

{ c) }
procedure eliminar(var L : lista; titulo : str60; var ok : boolean);
var ant, act : lista;
begin
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.titulo < titulo) do begin   { está ordenada }
    ant := act;
    act := act^.sig;
  end;
  ok := (act <> nil) and (act^.dato.titulo = titulo);
  if ok then begin
    if (act = L) then L := L^.sig
    else ant^.sig := act^.sig;
    dispose(act);
  end;
end;

procedure imprimir(L : lista);
begin
  while (L <> nil) do begin
    writeln('   ', L^.dato.titulo, ' (', L^.dato.artista, ')');
    L := L^.sig;
  end;
end;

var
  L : lista;
  titulo : str60;
  ok : boolean;
begin
  cargarLista(L);
  informar(L);
  write('Título a eliminar: ');
  readln(titulo);
  eliminar(L, titulo, ok);
  if ok then writeln('c) Sesión eliminada') else writeln('c) No existe esa sesión');
  imprimir(L);
end.`,
    entrada: "Session 53\nShakira\n5\n650000000\nSession 52\nQuevedo\n2\n1234\nSession 49\nMilo J\n1\n90000000\nSession 51\nNathy Peluso\n3\n120000000\nSession 55\nPeso Pluma\n2\n56781234\nSession 52",
  },
  {
    grupo: "Parciales 2023", ref: "2023 · 2ª fecha · T2", titulo: "Bizarrap: sesiones en Spotify",
    enunciado: `El productor musical Bizarrap organiza sesiones musicales con diferentes artistas. Se dispone de una estructura de datos con la información de las sesiones de Bizarrap. De cada sesión se conoce: título, nombre del artista, género musical (1: Trap Latino, 2: Reggaeton, 3: Urban, 4: Electrónica, 5: Pop Rap), año de estreno y cantidad de reproducciones en Spotify. La información no posee un orden específico.
Procesar la información anterior, para:
a) Informar los dos códigos de género musical con menor cantidad de reproducciones en Spotify.
b) Generar una lista ordenada por año que contenga las sesiones del género "Trap Latino" y "Urban" cuya suma de los dígitos de la cantidad de reproducciones sea múltiplo de 5.
c) COMPLETO: Realizar un módulo que reciba la lista generada en el punto anterior e informe para cada año, la cantidad de sesiones realizadas junto al total de reproducciones de Spotify de esas sesiones.`,
    pista: "Un recorrido de la lista que se dispone: sumás reproducciones por género (vector de 5) y, si es género 1 o 3 y la suma de dígitos es múltiplo de 5, insertás ordenado por año en la lista nueva. Como la nueva queda ordenada por año, (c) es un corte de control.",
    sol: `program BizarrapSpotify;
type
  str60 = string[60];
  rangoGenero = 1..5;
  sesion = record
    titulo, artista : str60;
    genero : rangoGenero;
    anio : integer;
    repros : longint;
  end;
  lista = ^nodo;
  nodo = record
    dato : sesion;
    sig : lista;
  end;
  vGeneros = array [rangoGenero] of real;

{ ---- se dispone: las sesiones sin orden. Lee título, artista y
       "género año reproducciones"; termina con el título 'fin' ---- }
procedure cargarLista(var L : lista);
var
  s : sesion;
  nue : lista;
begin
  L := nil;
  readln(s.titulo);
  while (s.titulo <> 'fin') do begin
    readln(s.artista);
    readln(s.genero, s.anio, s.repros);
    new(nue);
    nue^.dato := s;
    nue^.sig := L;
    L := nue;
    readln(s.titulo);
  end;
end;

function sumaDigitos(n : longint) : integer;
var suma : integer;
begin
  suma := 0;
  while (n <> 0) do begin
    suma := suma + n mod 10;
    n := n div 10;
  end;
  sumaDigitos := suma;
end;

procedure insertarPorAnio(var L : lista; s : sesion);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := s;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.anio <= s.anio) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

{ a) y b) en un solo recorrido }
procedure procesar(L : lista; var nueva : lista);
var
  generos : vGeneros;
  g, g1, g2 : integer;
  min1, min2 : real;
begin
  for g := 1 to 5 do generos[g] := 0;
  nueva := nil;
  while (L <> nil) do begin
    generos[L^.dato.genero] := generos[L^.dato.genero] + L^.dato.repros;
    if ((L^.dato.genero = 1) or (L^.dato.genero = 3)) and (sumaDigitos(L^.dato.repros) mod 5 = 0) then
      insertarPorAnio(nueva, L^.dato);
    L := L^.sig;
  end;
  min1 := 1e30; min2 := 1e30; g1 := 0; g2 := 0;
  for g := 1 to 5 do
    if (generos[g] < min1) then begin
      min2 := min1; g2 := g1;
      min1 := generos[g]; g1 := g;
    end
    else if (generos[g] < min2) then begin
      min2 := generos[g]; g2 := g;
    end;
  writeln('a) Géneros con menos reproducciones: ', g1, ' y ', g2);
end;

{ c) }
procedure informarPorAnio(L : lista);
var
  anioAct, cant : integer;
  total : real;
begin
  writeln('c) Sesiones de la lista nueva por año:');
  while (L <> nil) do begin
    anioAct := L^.dato.anio;
    cant := 0;
    total := 0;
    while (L <> nil) and (L^.dato.anio = anioAct) do begin
      cant := cant + 1;
      total := total + L^.dato.repros;
      L := L^.sig;
    end;
    writeln('   ', anioAct, ': ', cant, ' sesiones, ', total:0:0, ' reproducciones');
  end;
end;

var
  L, nueva : lista;
begin
  cargarLista(L);
  procesar(L, nueva);
  informarPorAnio(nueva);
end.`,
    entrada: "Session 49\nMilo J\n1 2022 1000040\nSession 51\nNathy Peluso\n3 2022 230000\nSession 53\nShakira\n5 2023 900000000\nSession 46\nParanoid\n1 2021 5000000\nSession 52\nQuevedo\n2 2022 800000000\nSession 54\nEladio\n3 2023 140\nSession 50\nSnow Tha\n4 2022 2000000\nfin",
  },
  {
    grupo: "Parciales 2023", ref: "2023 · Redictado · T2", titulo: "Salón de eventos: reservas de diciembre",
    enunciado: `Un salón de eventos necesita un programa para administrar la información de las reservas de diciembre de 2023. Se dispone de una estructura con la información de las reservas. De cada reserva se conoce: número de reserva, DNI del cliente, día del evento (1..31), hora de inicio, hora de fin y categoría de servicio (1..4). Además, se dispone de una tabla con el precio por hora de reserva de acuerdo a cada categoría de servicio.
Se pide:
a) Generar una nueva estructura con número y precio total de cada reserva. Esta estructura debe generarse ordenada por el precio total de cada reserva.
b) Informar los dos días del mes con menor cantidad de reservas de clientes con DNI impar.
c) Informar el porcentaje de reservas de eventos que inicien después de las 12hs y se produzcan en la segunda quincena.`,
    pista: "Precio total = (fin - inicio) * tabla[categoría]. La lista nueva tiene registros más chicos (número y precio) y se inserta ordenada por precio. Para (b), un vector [1..31] que cuenta solo las reservas con DNI impar; después buscás los dos mínimos.",
    sol: `{ Las horas se toman como números enteros (de 0 a 24). La segunda
  quincena son los días 16 a 31. }
program SalonEventos;
type
  rangoDia = 1..31;
  rangoCat = 1..4;
  reserva = record
    numero : integer;
    dni : longint;
    dia : rangoDia;
    inicio, fin : integer;
    categoria : rangoCat;
  end;
  lista = ^nodo;
  nodo = record
    dato : reserva;
    sig : lista;
  end;
  resumen = record
    numero : integer;
    precio : real;
  end;
  listaRes = ^nodoRes;
  nodoRes = record
    dato : resumen;
    sig : listaRes;
  end;
  vTabla = array [rangoCat] of real;
  vDias = array [rangoDia] of integer;

{ ---- se dispone: la tabla de precios por hora (4 valores) ---- }
procedure cargarTabla(var t : vTabla);
var c : rangoCat;
begin
  for c := 1 to 4 do read(t[c]);
  readln;
end;

{ ---- se dispone: las reservas. Lee "número dni día inicio fin
       categoría" por línea, hasta el número -1 ---- }
procedure cargarReservas(var L : lista);
var
  r : reserva;
  nue : lista;
begin
  L := nil;
  read(r.numero);
  while (r.numero <> -1) do begin
    readln(r.dni, r.dia, r.inicio, r.fin, r.categoria);
    new(nue);
    nue^.dato := r;
    nue^.sig := L;
    L := nue;
    read(r.numero);
  end;
end;

procedure insertarPorPrecio(var L : listaRes; r : resumen);
var nue, ant, act : listaRes;
begin
  new(nue);
  nue^.dato := r;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.precio < r.precio) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

procedure procesar(L : lista; tabla : vTabla; var nueva : listaRes);
var
  dias : vDias;
  d, d1, d2 : integer;
  min1, min2, total, cantC : integer;
  r : resumen;
begin
  for d := 1 to 31 do dias[d] := 0;
  nueva := nil;
  total := 0; cantC := 0;
  while (L <> nil) do begin
    r.numero := L^.dato.numero;                                       { a }
    r.precio := (L^.dato.fin - L^.dato.inicio) * tabla[L^.dato.categoria];
    insertarPorPrecio(nueva, r);
    if (L^.dato.dni mod 2 = 1) then dias[L^.dato.dia] := dias[L^.dato.dia] + 1;   { b }
    total := total + 1;
    if (L^.dato.inicio > 12) and (L^.dato.dia > 15) then cantC := cantC + 1;     { c }
    L := L^.sig;
  end;
  min1 := maxint; min2 := maxint; d1 := 0; d2 := 0;
  for d := 1 to 31 do
    if (dias[d] < min1) then begin
      min2 := min1; d2 := d1;
      min1 := dias[d]; d1 := d;
    end
    else if (dias[d] < min2) then begin
      min2 := dias[d]; d2 := d;
    end;
  writeln('b) Días con menos reservas de DNI impar: ', d1, ' y ', d2);
  if (total > 0) then
    writeln('c) Después de las 12 y en la segunda quincena: ', cantC / total * 100:0:2, '%');
end;

procedure imprimir(L : listaRes);
begin
  writeln('a) Reservas ordenadas por precio:');
  while (L <> nil) do begin
    writeln('   Reserva ', L^.dato.numero, ': $', L^.dato.precio:0:2);
    L := L^.sig;
  end;
end;

var
  tabla : vTabla;
  L : lista;
  nueva : listaRes;
begin
  cargarTabla(tabla);
  cargarReservas(L);
  procesar(L, tabla, nueva);
  imprimir(nueva);
end.`,
    entrada: "10000 15000 22000 30000\n1 30111223 5 20 24 2\n2 28444556 20 13 17 4\n3 33555777 31 21 23 1\n4 25999001 18 10 14 3\n-1",
  },
  {
    grupo: "Parciales 2022", ref: "2022 · 2ª fecha · T1", titulo: "Panadería: 26 categorías (completo)",
    enunciado: `Una panadería artesanal de La Plata vende productos de elaboración propia. La panadería agrupa a sus productos en 26 categorías (por ej.: 1. Pan; 2. Medialunas; 3. Masas finas; etc.). Para cada categoría se conoce su nombre y el precio por kilo del producto.
La panadería dispone de la información de todas las compras realizadas en el último año. De cada compra se conoce el DNI del cliente, la categoría del producto (entre 1 y 26) y la cantidad de kilos comprados. La información se encuentra ordenada por DNI del cliente.
a) Realizar un módulo que retorne la información de las categorías en una estructura de datos adecuada. La información se lee por teclado y sin ningún orden en particular. De cada categoría se lee el nombre, el código (1 a 26) y el precio por kilo.
b) Realizar un módulo que reciba la información de todas las compras, la información de las categorías, y retorne:
1. DNI del cliente que más compras ha realizado.
2. Monto total recaudado por cada categoría.
3. Cantidad total de compras de clientes con DNI compuesto por, al menos, 3 dígitos pares.
NOTA: Implementar el programa principal.`,
    pista: "Categorías: vector [1..26] de registros. Como vienen sin orden, se guardan en la posición de su código: v[codigo]. Las compras (lista que se dispone) están ordenadas por DNI: corte de control para contar compras por cliente. El monto por categoría es otro vector [1..26] que el módulo devuelve por parámetro.",
    sol: `{ Para probar a mano, bajá CANT_CATEGORIAS (por ejemplo a 3). }
program Panaderia;
const
  CANT_CATEGORIAS = 26;
type
  str40 = string[40];
  rangoCat = 1..CANT_CATEGORIAS;
  categoria = record
    nombre : str40;
    precio : real;
  end;
  vCategorias = array [rangoCat] of categoria;
  vMontos = array [rangoCat] of real;
  compra = record
    dni : longint;
    cat : rangoCat;
    kilos : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : compra;
    sig : lista;
  end;

{ a) lee nombre y "código precio" de cada categoría }
procedure cargarCategorias(var v : vCategorias);
var
  i, cod : integer;
  nombre : str40;
  precio : real;
begin
  for i := 1 to CANT_CATEGORIAS do begin
    readln(nombre);
    readln(cod, precio);
    v[cod].nombre := nombre;
    v[cod].precio := precio;
  end;
end;

{ ---- se dispone: las compras ordenadas por DNI. Lee "dni categoría
       kilos" por línea, hasta el DNI -1 ---- }
procedure cargarCompras(var L : lista);
var
  c : compra;
  nue, ult : lista;
begin
  L := nil;
  ult := nil;
  read(c.dni);
  while (c.dni <> -1) do begin
    readln(c.cat, c.kilos);
    new(nue);
    nue^.dato := c;
    nue^.sig := nil;
    if (L = nil) then L := nue else ult^.sig := nue;
    ult := nue;
    read(c.dni);
  end;
end;

function cantPares(n : longint) : integer;
var cant : integer;
begin
  cant := 0;
  while (n <> 0) do begin
    if ((n mod 10) mod 2 = 0) then cant := cant + 1;
    n := n div 10;
  end;
  cantPares := cant;
end;

{ b) }
procedure procesar(L : lista; cats : vCategorias; var dniMax : longint;
                   var montos : vMontos; var cantTresPares : integer);
var
  i : rangoCat;
  dniAct : longint;
  cant, max : integer;
begin
  for i := 1 to CANT_CATEGORIAS do montos[i] := 0;
  max := -1;
  dniMax := 0;
  cantTresPares := 0;
  while (L <> nil) do begin
    dniAct := L^.dato.dni;
    cant := 0;
    while (L <> nil) and (L^.dato.dni = dniAct) do begin
      cant := cant + 1;
      montos[L^.dato.cat] := montos[L^.dato.cat] + L^.dato.kilos * cats[L^.dato.cat].precio;
      L := L^.sig;
    end;
    if (cant > max) then begin
      max := cant;
      dniMax := dniAct;
    end;
    if (cantPares(dniAct) >= 3) then cantTresPares := cantTresPares + cant;
  end;
end;

var
  cats : vCategorias;
  L : lista;
  dniMax : longint;
  montos : vMontos;
  cantTresPares : integer;
  i : rangoCat;
begin
  cargarCategorias(cats);
  cargarCompras(L);
  procesar(L, cats, dniMax, montos, cantTresPares);
  writeln('1) Cliente con más compras: ', dniMax);
  writeln('2) Recaudado por categoría:');
  for i := 1 to CANT_CATEGORIAS do
    writeln('   ', i, '. ', cats[i].nombre, ': $', montos[i]:0:2);
  writeln('3) Compras de clientes con al menos 3 dígitos pares: ', cantTresPares);
end.`,
  },
  {
    grupo: "Parciales 2022", ref: "2022 · 2ª fecha · T1 reducido", titulo: "Panadería: 26 categorías (reducido)",
    enunciado: `Una panadería de La Plata vende productos de elaboración propia. La panadería agrupa sus productos en 26 categorías (1. Pan; 2. Medialunas; 3. Masas finas; …). Para cada categoría se conoce nombre y precio por kilo. La panadería dispone de la información de todas las compras realizadas en el último año. De cada compra se conoce: DNI del cliente, categoría del producto (entre 1 y 26) y cantidad de kilos comprados. La información se encuentra ordenada por DNI del cliente.
a) Realizar un módulo que retorne la información de las categorías en una estructura de datos adecuada. La información se lee por teclado sin ningún orden. De cada categoría se lee nombre, código (1 a 26) y precio.
b) Realizar un módulo que reciba la información de todas las compras y de las categorías, y retorne:
1. DNI del cliente que más compras ha realizado.
2. Monto total recaudado por cada categoría.
NOTA: Implementar el programa principal.`,
    pista: "Es el tema completo sin el inciso 3: vector de categorías cargado por código, y un corte de control por DNI sobre la lista de compras.",
    sol: `{ Para probar a mano, bajá CANT_CATEGORIAS (por ejemplo a 3). }
program PanaderiaReducido;
const
  CANT_CATEGORIAS = 26;
type
  str40 = string[40];
  rangoCat = 1..CANT_CATEGORIAS;
  categoria = record
    nombre : str40;
    precio : real;
  end;
  vCategorias = array [rangoCat] of categoria;
  vMontos = array [rangoCat] of real;
  compra = record
    dni : longint;
    cat : rangoCat;
    kilos : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : compra;
    sig : lista;
  end;

{ a) lee nombre y "código precio" de cada categoría }
procedure cargarCategorias(var v : vCategorias);
var
  i, cod : integer;
  nombre : str40;
  precio : real;
begin
  for i := 1 to CANT_CATEGORIAS do begin
    readln(nombre);
    readln(cod, precio);
    v[cod].nombre := nombre;
    v[cod].precio := precio;
  end;
end;

{ ---- se dispone: las compras ordenadas por DNI ("dni categoría kilos"
       por línea, hasta el DNI -1) ---- }
procedure cargarCompras(var L : lista);
var
  c : compra;
  nue, ult : lista;
begin
  L := nil;
  ult := nil;
  read(c.dni);
  while (c.dni <> -1) do begin
    readln(c.cat, c.kilos);
    new(nue);
    nue^.dato := c;
    nue^.sig := nil;
    if (L = nil) then L := nue else ult^.sig := nue;
    ult := nue;
    read(c.dni);
  end;
end;

{ b) }
procedure procesar(L : lista; cats : vCategorias; var dniMax : longint; var montos : vMontos);
var
  i : rangoCat;
  dniAct : longint;
  cant, max : integer;
begin
  for i := 1 to CANT_CATEGORIAS do montos[i] := 0;
  max := -1;
  dniMax := 0;
  while (L <> nil) do begin
    dniAct := L^.dato.dni;
    cant := 0;
    while (L <> nil) and (L^.dato.dni = dniAct) do begin
      cant := cant + 1;
      montos[L^.dato.cat] := montos[L^.dato.cat] + L^.dato.kilos * cats[L^.dato.cat].precio;
      L := L^.sig;
    end;
    if (cant > max) then begin
      max := cant;
      dniMax := dniAct;
    end;
  end;
end;

var
  cats : vCategorias;
  L : lista;
  dniMax : longint;
  montos : vMontos;
  i : rangoCat;
begin
  cargarCategorias(cats);
  cargarCompras(L);
  procesar(L, cats, dniMax, montos);
  writeln('1) Cliente con más compras: ', dniMax);
  writeln('2) Recaudado por categoría:');
  for i := 1 to CANT_CATEGORIAS do
    writeln('   ', i, '. ', cats[i].nombre, ': $', montos[i]:0:2);
end.`,
  },
  {
    grupo: "Parciales 2022", ref: "2022 · 2ª fecha · T2", titulo: "Panadería: 20 categorías",
    enunciado: `Una panadería artesanal del centro de La Plata vende productos de elaboración propia. La panadería agrupa a sus productos en 20 categorías (por ej.: 1. Pan; 2. Medialunas dulces; 3. Medialunas saladas; etc.). De cada categoría se conoce: nombre y precio por kilo del producto.
La panadería dispone de la información de las categorías.
a) Realizar un módulo que retorne en una estructura de datos adecuada, la información de todas las compras efectuadas en el último año. Dicha información se lee desde teclado, ordenada por DNI de cliente. De cada compra se lee: DNI del cliente, categoría del producto (entre 1 y 20) y cantidad de kilos comprados. La lectura finaliza cuando se ingresa el DNI -1 (que no debe procesarse).
b) Realizar un módulo que reciba la información de las categorías y la de todas las compras, y retorne:
1. DNI del cliente que menos dinero ha gastado.
2. Cantidad de compras por categoría.
3. Cantidad total de compras de clientes con DNI compuesto por, a lo sumo, 5 dígitos impares.
NOTA: Implementar el programa principal.`,
    pista: "Acá lo que se dispone son las categorías (vector [1..20]) y lo que se lee son las compras: como ya vienen ordenadas por DNI, agregá atrás para no perder el orden. En (b), corte de control por DNI sumando kilos * precio para el mínimo, y un vector contador por categoría.",
    sol: `{ Para probar a mano, bajá CANT_CATEGORIAS (por ejemplo a 3). }
program Panaderia2;
const
  CANT_CATEGORIAS = 20;
type
  str40 = string[40];
  rangoCat = 1..CANT_CATEGORIAS;
  categoria = record
    nombre : str40;
    precio : real;
  end;
  vCategorias = array [rangoCat] of categoria;
  vCant = array [rangoCat] of integer;
  compra = record
    dni : longint;
    cat : rangoCat;
    kilos : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : compra;
    sig : lista;
  end;

{ ---- se dispone: las categorías (nombre y precio de cada una) ---- }
procedure cargarCategorias(var v : vCategorias);
var i : rangoCat;
begin
  for i := 1 to CANT_CATEGORIAS do begin
    readln(v[i].nombre);
    readln(v[i].precio);
  end;
end;

procedure leerCompra(var c : compra);
begin
  readln(c.dni);
  if (c.dni <> -1) then begin
    readln(c.cat);
    readln(c.kilos);
  end;
end;

{ a) ya vienen ordenadas por DNI: se agregan atrás }
procedure cargarCompras(var L : lista);
var
  c : compra;
  nue, ult : lista;
begin
  L := nil;
  ult := nil;
  leerCompra(c);
  while (c.dni <> -1) do begin
    new(nue);
    nue^.dato := c;
    nue^.sig := nil;
    if (L = nil) then L := nue else ult^.sig := nue;
    ult := nue;
    leerCompra(c);
  end;
end;

function cantImpares(n : longint) : integer;
var cant : integer;
begin
  cant := 0;
  while (n <> 0) do begin
    if ((n mod 10) mod 2 = 1) then cant := cant + 1;
    n := n div 10;
  end;
  cantImpares := cant;
end;

{ b) }
procedure procesar(cats : vCategorias; L : lista; var dniMin : longint;
                   var porCat : vCant; var cantC : integer);
var
  i : rangoCat;
  dniAct : longint;
  gasto, min : real;
  cant : integer;
begin
  for i := 1 to CANT_CATEGORIAS do porCat[i] := 0;
  min := 1e30;
  dniMin := 0;
  cantC := 0;
  while (L <> nil) do begin
    dniAct := L^.dato.dni;
    gasto := 0;
    cant := 0;
    while (L <> nil) and (L^.dato.dni = dniAct) do begin
      gasto := gasto + L^.dato.kilos * cats[L^.dato.cat].precio;
      porCat[L^.dato.cat] := porCat[L^.dato.cat] + 1;
      cant := cant + 1;
      L := L^.sig;
    end;
    if (gasto < min) then begin
      min := gasto;
      dniMin := dniAct;
    end;
    if (cantImpares(dniAct) <= 5) then cantC := cantC + cant;
  end;
end;

var
  cats : vCategorias;
  L : lista;
  dniMin : longint;
  porCat : vCant;
  cantC : integer;
  i : rangoCat;
begin
  cargarCategorias(cats);
  cargarCompras(L);
  procesar(cats, L, dniMin, porCat, cantC);
  writeln('1) Cliente que menos gastó: ', dniMin);
  writeln('2) Compras por categoría:');
  for i := 1 to CANT_CATEGORIAS do
    writeln('   ', i, '. ', cats[i].nombre, ': ', porCat[i]);
  writeln('3) Compras de clientes con a lo sumo 5 dígitos impares: ', cantC);
end.`,
  },
  {
    grupo: "Parciales 2018", ref: "2018 · T2", titulo: "Celulares: bono de fin de año",
    enunciado: `Una empresa de teléfonos celulares desea procesar información de las ventas realizadas durante el año 2017 por sus 20 vendedores.
Al finalizar el año, la empresa paga un bono de fin de año a todos los vendedores que han vendido más de 1000 celulares durante el año.
Implemente un programa que:
a. Lea y almacene la información de todas las ventas. Para cada venta se registra número de factura, el código del vendedor (entre 1 y 20) y la cantidad de celulares vendidos en la operación. La lectura finaliza al ingresar el código de vendedor 0, el cual no debe procesarse. Las ventas deben quedar almacenadas en el mismo orden en el que se ingresó.
b. Informe el código y salario base de aquellos vendedores a los que se pagará el bono de fin de año.
c. Implemente un módulo que reciba los datos generados en el inciso a), y elimine la venta con el número de factura 1234567. El módulo debe retornar si fue posible o no realizar la eliminación.
Nota: Un vendedor puede haber realizado varias ventas durante el año.`,
    pista: "El salario base no se lee con las ventas: se asume que se dispone de un vector [1..20] con el salario de cada vendedor. Las ventas van en una lista con agregar atrás; en (b) acumulás celulares por vendedor en otro vector [1..20]. (c) es una función booleana que busca y elimina.",
    sol: `{ Se asume que se dispone de los salarios base de los 20 vendedores.
  Se lee primero el código de vendedor para poder cortar con 0. }
program BonoCelulares;
const
  CANT_VEND = 20;
  FACTURA_A_ELIMINAR = 1234567;
type
  rangoVend = 1..CANT_VEND;
  venta = record
    factura : longint;
    vendedor : rangoVend;
    cant : integer;
  end;
  lista = ^nodo;
  nodo = record
    dato : venta;
    sig : lista;
  end;
  vSalarios = array [rangoVend] of real;
  vVendidos = array [rangoVend] of longint;

{ ---- se dispone: los 20 salarios base ---- }
procedure cargarSalarios(var s : vSalarios);
var i : rangoVend;
begin
  for i := 1 to CANT_VEND do read(s[i]);
  readln;
end;

procedure agregarAtras(var pri, ult : lista; v : venta);
var nue : lista;
begin
  new(nue);
  nue^.dato := v;
  nue^.sig := nil;
  if (pri = nil) then pri := nue else ult^.sig := nue;
  ult := nue;
end;

procedure cargarVentas(var L : lista);            { a }
var
  v : venta;
  cod : integer;
  ult : lista;
begin
  L := nil;
  ult := nil;
  readln(cod);
  while (cod <> 0) do begin
    v.vendedor := cod;
    readln(v.factura);
    readln(v.cant);
    agregarAtras(L, ult, v);
    readln(cod);
  end;
end;

procedure informarBonos(L : lista; sal : vSalarios);    { b }
var
  vendidos : vVendidos;
  i : rangoVend;
begin
  for i := 1 to CANT_VEND do vendidos[i] := 0;
  while (L <> nil) do begin
    vendidos[L^.dato.vendedor] := vendidos[L^.dato.vendedor] + L^.dato.cant;
    L := L^.sig;
  end;
  writeln('b) Vendedores que cobran el bono:');
  for i := 1 to CANT_VEND do
    if (vendidos[i] > 1000) then
      writeln('   Vendedor ', i, ': salario base $', sal[i]:0:2, ' (', vendidos[i], ' celulares)');
end;

function eliminar(var L : lista; factura : longint) : boolean;    { c }
var ant, act : lista;
begin
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.factura <> factura) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act <> nil) then begin
    if (act = L) then L := L^.sig
    else ant^.sig := act^.sig;
    dispose(act);
    eliminar := true;
  end
  else
    eliminar := false;
end;

var
  sal : vSalarios;
  L : lista;
begin
  cargarSalarios(sal);
  cargarVentas(L);
  informarBonos(L, sal);
  if eliminar(L, FACTURA_A_ELIMINAR) then
    writeln('c) Se eliminó la factura ', FACTURA_A_ELIMINAR)
  else
    writeln('c) No existe la factura ', FACTURA_A_ELIMINAR);
end.`,
    entrada: "500 510 520 530 540 550 560 570 580 590 600 610 620 630 640 650 660 670 680 690\n3\n1000001\n600\n7\n1000002\n200\n3\n1234567\n450\n12\n1000003\n1001\n0",
  },
];

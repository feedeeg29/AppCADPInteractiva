import type { Ejercicio } from "../types";

const G = "Práctica 7 · Repaso";
const GA = "Ejercicios adicionales";

/** Ejercicios 9 a 16 de la Práctica 7 */
export const guiaP7b: Ejercicio[] = [
  {
    grupo: G, ref: "P7 Ej 9", titulo: "Cine: críticas de febrero",
    enunciado: "Un cine tiene la lista (sin orden) de películas de febrero: código, título, código de género (1: acción, 2: aventura, 3: drama, 4: suspenso, 5: comedia, 6: bélica, 7: documental, 8: terror) y puntaje promedio de las críticas. (1) Actualizar en esa lista el puntaje promedio leyendo las críticas: DNI del crítico, apellido y nombre, código de película y puntaje. La lectura termina con el código de película -1 (que no se procesa) y viene ordenada por código de película. (2) Informar el código de género que más puntaje obtuvo entre todas las críticas. (3) Informar apellido y nombre de los críticos con la misma cantidad de dígitos pares que impares en su DNI. (4) Implementar un módulo que elimine de la lista una película cuyo código se recibe por parámetro (puede no existir).",
    pista: "Las críticas vienen ordenadas por película: corte de control para sumar los puntajes de cada una. Al cerrar el grupo, buscás la película en la lista (no está ordenada, hay que recorrer), le actualizás el promedio y sumás el puntaje a su género.",
    sol: `{ Las críticas se leen empezando por el código de película, para poder
  cortar con -1 sin leer el resto de los datos. }
program CineFebrero;
type
  str40 = string[40];
  rangoGenero = 1..8;
  pelicula = record
    codigo : integer;
    titulo : str40;
    genero : rangoGenero;
    puntaje : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : pelicula;
    sig : lista;
  end;
  critica = record
    codPeli : integer;
    dni : longint;
    apeNom : str40;
    puntaje : real;
  end;
  vGeneros = array [rangoGenero] of real;

{ ---- se dispone: la lista de películas. Lee "código género puntaje"
       y el título, hasta el código -1 ---- }
procedure cargarLista(var L : lista);
var
  p : pelicula;
  nue : lista;
begin
  L := nil;
  read(p.codigo);
  while (p.codigo <> -1) do begin
    readln(p.genero, p.puntaje);
    readln(p.titulo);
    new(nue);
    nue^.dato := p;
    nue^.sig := L;
    L := nue;
    read(p.codigo);
  end;
end;

procedure leerCritica(var c : critica);
begin
  readln(c.codPeli);
  if (c.codPeli <> -1) then begin
    readln(c.dni);
    readln(c.apeNom);
    readln(c.puntaje);
  end;
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

function buscar(L : lista; cod : integer) : lista;
begin
  while (L <> nil) and (L^.dato.codigo <> cod) do
    L := L^.sig;
  buscar := L;
end;

{ 1, 2 y 3 }
procedure procesarCriticas(L : lista);
var
  c : critica;
  generos : vGeneros;
  g, gMax : rangoGenero;
  codAct, cant : integer;
  suma : real;
  p : lista;
begin
  for g := 1 to 8 do generos[g] := 0;
  writeln('3) Críticos con igual cantidad de dígitos pares e impares:');
  leerCritica(c);
  while (c.codPeli <> -1) do begin
    codAct := c.codPeli;
    suma := 0;
    cant := 0;
    while (c.codPeli = codAct) do begin
      suma := suma + c.puntaje;
      cant := cant + 1;
      if mismaCantidad(c.dni) then writeln('   ', c.apeNom);
      leerCritica(c);
    end;
    p := buscar(L, codAct);
    if (p <> nil) then begin
      p^.dato.puntaje := suma / cant;
      generos[p^.dato.genero] := generos[p^.dato.genero] + suma;
    end;
  end;
  gMax := 1;
  for g := 2 to 8 do
    if (generos[g] > generos[gMax]) then gMax := g;
  writeln('2) Género con más puntaje entre todas las críticas: ', gMax);
end;

{ 4 }
procedure eliminar(var L : lista; cod : integer; var ok : boolean);
var ant, act : lista;
begin
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.codigo <> cod) do begin
    ant := act;
    act := act^.sig;
  end;
  ok := act <> nil;
  if ok then begin
    if (act = L) then L := L^.sig
    else ant^.sig := act^.sig;
    dispose(act);
  end;
end;

procedure imprimir(L : lista);
begin
  while (L <> nil) do begin
    writeln('   ', L^.dato.codigo, ' ', L^.dato.titulo, ': ', L^.dato.puntaje:0:2);
    L := L^.sig;
  end;
end;

var
  L : lista;
  cod : integer;
  ok : boolean;
begin
  cargarLista(L);
  procesarCriticas(L);
  writeln('1) Puntajes actualizados:');
  imprimir(L);
  write('Código de película a eliminar: ');
  readln(cod);
  eliminar(L, cod, ok);
  if ok then writeln('4) Película ', cod, ' eliminada')
  else writeln('4) No existe la película ', cod);
  imprimir(L);
end.`,
    entrada: "10 1 6.5\nMision imposible\n20 3 7\nLa ballena\n30 5 5.5\nEsperando la carroza\n-1\n10\n12345678\nGomez Luis\n8\n10\n22113344\nDiaz Sofia\n6.5\n30\n13579246\nRuiz Mara\n9\n30\n24681357\nVera Tomas\n9.5\n-1\n20",
  },
  {
    grupo: G, ref: "P7 Ej 10", titulo: "Insumos agrícolas: empresas y cultivos",
    enunciado: "De cada empresa cliente se conoce código, nombre, si es estatal o privada, ciudad y los cultivos que realiza (a lo sumo 20). De cada cultivo: tipo (trigo, maíz, soja, girasol, etc.), hectáreas y meses del ciclo. (a) Leer las empresas hasta el código -1 (que no se procesa); para cada empresa leer sus cultivos hasta uno con 0 hectáreas (que no se procesa). Después informar: (b) los nombres de las empresas de \"San Miguel del Monte\" que cultivan trigo y cuyo código tiene al menos dos ceros; (c) las hectáreas dedicadas a la soja y qué porcentaje representan del total; (d) la empresa que dedica más tiempo al cultivo de maíz. (e) Implementar un módulo que incremente en un mes los cultivos de girasol de menos de 5 hectáreas de todas las empresas que no son estatales.",
    pista: "Lista de empresas, y dentro de cada empresa un vector de cultivos con su dimensión lógica. (b), (c) y (d) se resuelven en un recorrido de la lista con un recorrido del vector adentro. (e) recorre igual pero modifica: como la lista se pasa por valor, el puntero se copia, pero los nodos son los mismos.",
    sol: `{ Los tipos de cultivo se ingresan sin tilde (maiz). En (d) se toma la
  suma de meses de los cultivos de maíz de cada empresa. }
program InsumosAgricolas;
const
  MAX_CULTIVOS = 20;
type
  str40 = string[40];
  cultivo = record
    tipo : str40;
    hectareas, meses : integer;
  end;
  vCultivos = array [1..MAX_CULTIVOS] of cultivo;
  empresa = record
    codigo : longint;
    nombre, ciudad : str40;
    estatal : boolean;
    cultivos : vCultivos;
    dimL : integer;
  end;
  lista = ^nodo;
  nodo = record
    dato : empresa;
    sig : lista;
  end;

procedure leerCultivo(var c : cultivo);
begin
  read(c.hectareas);
  if (c.hectareas <> 0) then begin
    readln(c.meses);
    readln(c.tipo);
  end
  else
    readln;
end;

procedure leerEmpresa(var e : empresa);
var
  c : cultivo;
  tipoEmp : char;
begin
  readln(e.codigo);
  if (e.codigo <> -1) then begin
    readln(e.nombre);
    readln(tipoEmp);                        { 'E' estatal, 'P' privada }
    e.estatal := tipoEmp = 'E';
    readln(e.ciudad);
    e.dimL := 0;
    leerCultivo(c);
    while (c.hectareas <> 0) do begin
      e.dimL := e.dimL + 1;
      e.cultivos[e.dimL] := c;
      if (e.dimL < MAX_CULTIVOS) then leerCultivo(c)
      else c.hectareas := 0;
    end;
  end;
end;

procedure cargarLista(var L : lista);       { a }
var
  e : empresa;
  nue : lista;
begin
  L := nil;
  leerEmpresa(e);
  while (e.codigo <> -1) do begin
    new(nue);
    nue^.dato := e;
    nue^.sig := L;
    L := nue;
    leerEmpresa(e);
  end;
end;

function cantCeros(n : longint) : integer;
var cant : integer;
begin
  cant := 0;
  while (n <> 0) do begin
    if (n mod 10 = 0) then cant := cant + 1;
    n := n div 10;
  end;
  cantCeros := cant;
end;

procedure informar(L : lista);
var
  i, mesesMaiz, maxMaiz : integer;
  haSoja, haTotal : longint;
  cultivaTrigo : boolean;
  empMaiz : str40;
begin
  haSoja := 0;
  haTotal := 0;
  maxMaiz := -1;
  empMaiz := '';
  writeln('b) Empresas de San Miguel del Monte con trigo y al menos dos ceros:');
  while (L <> nil) do begin
    cultivaTrigo := false;
    mesesMaiz := 0;
    for i := 1 to L^.dato.dimL do begin
      haTotal := haTotal + L^.dato.cultivos[i].hectareas;
      if (L^.dato.cultivos[i].tipo = 'trigo') then cultivaTrigo := true;
      if (L^.dato.cultivos[i].tipo = 'soja') then
        haSoja := haSoja + L^.dato.cultivos[i].hectareas;
      if (L^.dato.cultivos[i].tipo = 'maiz') then
        mesesMaiz := mesesMaiz + L^.dato.cultivos[i].meses;
    end;
    if (L^.dato.ciudad = 'San Miguel del Monte') and cultivaTrigo and (cantCeros(L^.dato.codigo) >= 2) then
      writeln('   ', L^.dato.nombre);
    if (mesesMaiz > maxMaiz) then begin
      maxMaiz := mesesMaiz;
      empMaiz := L^.dato.nombre;
    end;
    L := L^.sig;
  end;
  write('c) Hectáreas de soja: ', haSoja);
  if (haTotal > 0) then writeln(' (', haSoja / haTotal * 100:0:2, '% del total)') else writeln;
  writeln('d) Más tiempo dedicado al maíz: ', empMaiz, ' (', maxMaiz, ' meses)');
end;

{ e) }
procedure incrementarGirasol(L : lista);
var i : integer;
begin
  while (L <> nil) do begin
    if not L^.dato.estatal then
      for i := 1 to L^.dato.dimL do
        if (L^.dato.cultivos[i].tipo = 'girasol') and (L^.dato.cultivos[i].hectareas < 5) then
          L^.dato.cultivos[i].meses := L^.dato.cultivos[i].meses + 1;
    L := L^.sig;
  end;
end;

procedure imprimirGirasol(L : lista);
var i : integer;
begin
  while (L <> nil) do begin
    for i := 1 to L^.dato.dimL do
      if (L^.dato.cultivos[i].tipo = 'girasol') then
        writeln('   ', L^.dato.nombre, ': girasol ', L^.dato.cultivos[i].hectareas,
                ' ha, ', L^.dato.cultivos[i].meses, ' meses');
    L := L^.sig;
  end;
end;

var
  L : lista;
begin
  cargarLista(L);
  informar(L);
  incrementarGirasol(L);
  writeln('e) Cultivos de girasol después de incrementar:');
  imprimirGirasol(L);
end.`,
    entrada: "1002\nLa Esperanza\nP\nSan Miguel del Monte\n100 7\ntrigo\n50 5\nsoja\n4 4\ngirasol\n0\n2050\nEl Ombu\nE\nLobos\n30 5\nmaiz\n3 4\ngirasol\n0\n1200\nDon Pedro\nP\nSan Miguel del Monte\n80 6\nmaiz\n20 6\nmaiz\n120 5\nsoja\n0\n-1",
  },
  {
    grupo: G, ref: "P7 Ej 11", titulo: "100 eventos culturales",
    enunciado: "Una productora organiza 100 eventos. De cada evento se dispone: nombre, tipo (1: música, 2: cine, 3: obra de teatro, 4: unipersonal, 5: monólogo), lugar, cantidad máxima de personas y costo de la entrada. (1) Generar una estructura con las ventas de entradas: código de venta, número de evento (1..100), DNI del comprador y cantidad de entradas; la lectura termina con el código de venta -1 (que no se procesa). (2) Informar: (a) nombre y lugar de los dos eventos con menos recaudación; (b) la cantidad de entradas vendidas cuyo comprador tiene más dígitos pares que impares en su DNI y que son para eventos de tipo \"obra de teatro\"; (c) si las entradas vendidas para el evento 50 alcanzaron la cantidad máxima de personas permitidas.",
    pista: "Los eventos van en un vector [1..100] de registros; las ventas, en una lista. Al recorrer las ventas acumulás las entradas de cada evento en un vector [1..100]; la recaudación de un evento es entradas * costo.",
    sol: `program EventosCulturales;
const
  CANT_EVENTOS = 100;
type
  str40 = string[40];
  rangoEvento = 1..CANT_EVENTOS;
  rangoTipo = 1..5;
  evento = record
    nombre, lugar : str40;
    tipo : rangoTipo;
    maxPersonas : integer;
    costo : real;
  end;
  vEventos = array [rangoEvento] of evento;
  vEntradas = array [rangoEvento] of integer;
  venta = record
    codigo : integer;
    nroEvento : rangoEvento;
    dni : longint;
    cant : integer;
  end;
  lista = ^nodo;
  nodo = record
    dato : venta;
    sig : lista;
  end;

{ ---- se dispone: los 100 eventos. Lee el nombre, "tipo máximo costo"
       y el lugar ---- }
procedure cargarEventos(var v : vEventos);
var i : rangoEvento;
begin
  for i := 1 to CANT_EVENTOS do begin
    readln(v[i].nombre);
    readln(v[i].tipo, v[i].maxPersonas, v[i].costo);
    readln(v[i].lugar);
  end;
end;

procedure leerVenta(var v : venta);
begin
  readln(v.codigo);
  if (v.codigo <> -1) then begin
    readln(v.nroEvento);
    readln(v.dni);
    readln(v.cant);
  end;
end;

procedure cargarVentas(var L : lista);           { 1 }
var
  v : venta;
  nue : lista;
begin
  L := nil;
  leerVenta(v);
  while (v.codigo <> -1) do begin
    new(nue);
    nue^.dato := v;
    nue^.sig := L;
    L := nue;
    leerVenta(v);
  end;
end;

function masParesQueImpares(n : longint) : boolean;
var pares, impares : integer;
begin
  pares := 0;
  impares := 0;
  while (n <> 0) do begin
    if ((n mod 10) mod 2 = 0) then pares := pares + 1
    else impares := impares + 1;
    n := n div 10;
  end;
  masParesQueImpares := pares > impares;
end;

procedure informar(L : lista; ev : vEventos);   { 2 }
var
  entradas : vEntradas;
  i, min1, min2 : integer;
  rec, rec1, rec2 : real;
  cantB : integer;
begin
  for i := 1 to CANT_EVENTOS do entradas[i] := 0;
  cantB := 0;
  while (L <> nil) do begin
    i := L^.dato.nroEvento;
    entradas[i] := entradas[i] + L^.dato.cant;
    if (ev[i].tipo = 3) and masParesQueImpares(L^.dato.dni) then
      cantB := cantB + L^.dato.cant;
    L := L^.sig;
  end;
  rec1 := 1e30; rec2 := 1e30; min1 := 1; min2 := 1;
  for i := 1 to CANT_EVENTOS do begin
    rec := entradas[i] * ev[i].costo;
    if (rec < rec1) then begin
      rec2 := rec1; min2 := min1;
      rec1 := rec; min1 := i;
    end
    else if (rec < rec2) then begin
      rec2 := rec; min2 := i;
    end;
  end;
  writeln('a) Menor recaudación: ', ev[min1].nombre, ' (', ev[min1].lugar, ') y ',
          ev[min2].nombre, ' (', ev[min2].lugar, ')');
  writeln('b) Entradas de teatro con DNI de más pares que impares: ', cantB);
  if (entradas[50] >= ev[50].maxPersonas) then
    writeln('c) El evento 50 alcanzó el máximo de personas')
  else
    writeln('c) El evento 50 no alcanzó el máximo (', entradas[50], ' de ', ev[50].maxPersonas, ')');
end;

var
  ev : vEventos;
  L : lista;
begin
  cargarEventos(ev);
  cargarVentas(L);
  informar(L, ev);
end.`,
  },
  {
    grupo: G, ref: "P7 Ej 12", titulo: "Fortaco's: suscripciones",
    enunciado: "El centro de deportes ofrece 4 suscripciones: 1) Musculación, 2) Spinning, 3) Cross Fit, 4) Todas las clases, y dispone de una tabla con el costo mensual de cada una. Leer y almacenar los clientes: nombre, DNI, edad y tipo de suscripción (1..4); cada cliente tiene una sola. La lectura termina con el DNI 0, que no se procesa. Después informar: la ganancia total; las 2 suscripciones con más clientes; y generar una lista con nombre y DNI de los clientes de más de 40 años suscriptos a Cross Fit o a Todas las clases, ordenada por DNI.",
    pista: "Tabla de costos = vector [1..4] de reales. En un recorrido: sumás costo[tipo], contás por tipo y, si corresponde, insertás ordenado por DNI en la lista nueva (que solo guarda nombre y DNI).",
    sol: `program Fortacos;
type
  str40 = string[40];
  rangoSusc = 1..4;
  cliente = record
    nombre : str40;
    dni : longint;
    edad : integer;
    tipo : rangoSusc;
  end;
  lista = ^nodo;
  nodo = record
    dato : cliente;
    sig : lista;
  end;
  resumen = record
    nombre : str40;
    dni : longint;
  end;
  listaRes = ^nodoRes;
  nodoRes = record
    dato : resumen;
    sig : listaRes;
  end;
  vCostos = array [rangoSusc] of real;
  vCant = array [rangoSusc] of integer;

{ ---- se dispone: la tabla de costos (4 montos en una línea) ---- }
procedure cargarCostos(var c : vCostos);
var t : rangoSusc;
begin
  for t := 1 to 4 do read(c[t]);
  readln;
end;

procedure leerCliente(var c : cliente);
begin
  readln(c.dni);
  if (c.dni <> 0) then begin
    readln(c.nombre);
    readln(c.edad);
    readln(c.tipo);
  end;
end;

procedure cargarClientes(var L : lista);
var
  c : cliente;
  nue : lista;
begin
  L := nil;
  leerCliente(c);
  while (c.dni <> 0) do begin
    new(nue);
    nue^.dato := c;
    nue^.sig := L;
    L := nue;
    leerCliente(c);
  end;
end;

procedure insertarPorDni(var L : listaRes; r : resumen);
var nue, ant, act : listaRes;
begin
  new(nue);
  nue^.dato := r;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.dni < r.dni) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

procedure procesar(L : lista; costos : vCostos; var mayores : listaRes);
var
  cant : vCant;
  t, t1, t2 : rangoSusc;
  ganancia : real;
  r : resumen;
begin
  for t := 1 to 4 do cant[t] := 0;
  ganancia := 0;
  mayores := nil;
  while (L <> nil) do begin
    ganancia := ganancia + costos[L^.dato.tipo];
    cant[L^.dato.tipo] := cant[L^.dato.tipo] + 1;
    if (L^.dato.edad > 40) and ((L^.dato.tipo = 3) or (L^.dato.tipo = 4)) then begin
      r.nombre := L^.dato.nombre;
      r.dni := L^.dato.dni;
      insertarPorDni(mayores, r);
    end;
    L := L^.sig;
  end;
  t1 := 1; t2 := 2;
  if (cant[2] > cant[1]) then begin t1 := 2; t2 := 1; end;
  for t := 3 to 4 do
    if (cant[t] > cant[t1]) then begin
      t2 := t1; t1 := t;
    end
    else if (cant[t] > cant[t2]) then
      t2 := t;
  writeln('Ganancia total: $', ganancia:0:2);
  writeln('Suscripciones con más clientes: ', t1, ' y ', t2);
end;

procedure imprimir(L : listaRes);
begin
  while (L <> nil) do begin
    writeln('   ', L^.dato.dni, ' ', L^.dato.nombre);
    L := L^.sig;
  end;
end;

var
  costos : vCostos;
  L : lista;
  mayores : listaRes;
begin
  cargarCostos(costos);
  cargarClientes(L);
  procesar(L, costos, mayores);
  writeln('Mayores de 40 en Cross Fit o Todas las clases:');
  imprimir(mayores);
end.`,
    entrada: "15000 12000 18000 25000\n30111222\nAna Perez\n45\n3\n20999888\nLuis Gomez\n52\n4\n40123123\nSofia Diaz\n23\n1\n25444555\nMara Ruiz\n41\n3\n33000111\nIvan Lopez\n38\n3\n0",
  },
  {
    grupo: G, ref: "P7 Ej 13", titulo: "Amazon Books: Planeta Libros",
    enunciado: "Amazon cuenta con una tabla con las 35 áreas temáticas de los libros. De cada libro se conoce título, editorial, cantidad de páginas, año de edición, cantidad de ventas y código de área (1..35). (A) Invocar a un módulo que lea los libros hasta el título \"Relato de un náufrago\" (que se procesa) y devuelva, para la editorial \"Planeta Libros\": nombre de la editorial, año de edición del libro más antiguo, cantidad de libros editados, total de ventas, y el detalle (título, nombre del área y páginas) de los libros con más de 250 ventas. (B) Invocar a un módulo que reciba esa estructura e imprima el nombre de la editorial y el título de cada libro con más de 250 ventas.",
    pista: "La estructura es un registro con los datos de la editorial y, adentro, una lista con el detalle. Al leer, solo te interesan los libros de Planeta Libros; el nombre del área sale de la tabla: areas[codArea].",
    sol: `program AmazonBooks;
const
  CANT_AREAS = 35;
  TITULO_FIN = 'Relato de un náufrago';
type
  str40 = string[40];
  rangoArea = 1..CANT_AREAS;
  vAreas = array [rangoArea] of str40;
  libro = record
    titulo, editorial : str40;
    paginas, anio : integer;
    ventas : longint;
    area : rangoArea;
  end;
  detalle = record
    titulo, area : str40;
    paginas : integer;
  end;
  lista = ^nodo;
  nodo = record
    dato : detalle;
    sig : lista;
  end;
  infoEditorial = record
    nombre : str40;
    anioMasAntiguo, cantLibros : integer;
    totalVentas : longint;
    masVendidos : lista;
  end;

{ ---- se dispone: la tabla de áreas (un nombre por línea) ---- }
procedure cargarAreas(var a : vAreas);
var i : rangoArea;
begin
  for i := 1 to CANT_AREAS do readln(a[i]);
end;

procedure leerLibro(var l : libro);
begin
  readln(l.titulo);
  readln(l.editorial);
  readln(l.paginas, l.anio, l.ventas, l.area);
end;

procedure agregarAdelante(var L : lista; d : detalle);
var nue : lista;
begin
  new(nue);
  nue^.dato := d;
  nue^.sig := L;
  L := nue;
end;

{ A }
procedure procesarLibros(areas : vAreas; var info : infoEditorial);
var
  l : libro;
  d : detalle;
begin
  info.nombre := 'Planeta Libros';
  info.anioMasAntiguo := 9999;
  info.cantLibros := 0;
  info.totalVentas := 0;
  info.masVendidos := nil;
  repeat
    leerLibro(l);
    if (l.editorial = info.nombre) then begin
      info.cantLibros := info.cantLibros + 1;
      info.totalVentas := info.totalVentas + l.ventas;
      if (l.anio < info.anioMasAntiguo) then info.anioMasAntiguo := l.anio;
      if (l.ventas > 250) then begin
        d.titulo := l.titulo;
        d.area := areas[l.area];
        d.paginas := l.paginas;
        agregarAdelante(info.masVendidos, d);
      end;
    end;
  until (l.titulo = TITULO_FIN);
end;

{ B }
procedure imprimir(info : infoEditorial);
var L : lista;
begin
  writeln('Editorial: ', info.nombre);
  L := info.masVendidos;
  while (L <> nil) do begin
    writeln('   ', L^.dato.titulo);
    L := L^.sig;
  end;
end;

var
  areas : vAreas;
  info : infoEditorial;
begin
  cargarAreas(areas);
  procesarLibros(areas, info);
  imprimir(info);
  writeln('(libros: ', info.cantLibros, ', ventas: ', info.totalVentas,
          ', más antiguo: ', info.anioMasAntiguo, ')');
end.`,
  },
  {
    grupo: G, ref: "P7 Ej 14", titulo: "Biblioteca: préstamos de marzo",
    enunciado: "Leer los préstamos de libros de marzo de 2020. De cada préstamo: número de préstamo, ISBN, número de socio y día (1..31). Los préstamos se leen ordenados por ISBN y la lectura termina con el ISBN -1 (que no se procesa). (A) Generar una estructura con la cantidad de veces que se prestó cada ISBN, ordenada por ISBN. (B) Informar el día del mes con menos préstamos. (C) Informar el porcentaje de préstamos con número de préstamo impar y número de socio par.",
    pista: "No hace falta guardar los préstamos: como vienen ordenados por ISBN, un corte de control al leer arma la lista (ISBN, cantidad) agregando atrás, que ya queda ordenada. Para (B), un vector contador [1..31].",
    sol: `{ Cada préstamo se lee empezando por el ISBN, para poder cortar con -1. }
program Biblioteca;
type
  rangoDia = 1..31;
  prestamo = record
    nro, isbn, socio : longint;
    dia : rangoDia;
  end;
  libro = record
    isbn : longint;
    cant : integer;
  end;
  lista = ^nodo;
  nodo = record
    dato : libro;
    sig : lista;
  end;
  vDias = array [rangoDia] of integer;

procedure leerPrestamo(var p : prestamo);
begin
  readln(p.isbn);
  if (p.isbn <> -1) then begin
    readln(p.nro);
    readln(p.socio);
    readln(p.dia);
  end;
end;

procedure agregarAtras(var pri, ult : lista; l : libro);
var nue : lista;
begin
  new(nue);
  nue^.dato := l;
  nue^.sig := nil;
  if (pri = nil) then pri := nue else ult^.sig := nue;
  ult := nue;
end;

procedure procesar(var L : lista; var dias : vDias; var total, cantC : integer);
var
  p : prestamo;
  lib : libro;
  ult : lista;
  d : rangoDia;
begin
  L := nil;
  ult := nil;
  for d := 1 to 31 do dias[d] := 0;
  total := 0;
  cantC := 0;
  leerPrestamo(p);
  while (p.isbn <> -1) do begin
    lib.isbn := p.isbn;
    lib.cant := 0;
    while (p.isbn = lib.isbn) do begin
      lib.cant := lib.cant + 1;
      dias[p.dia] := dias[p.dia] + 1;
      total := total + 1;
      if (p.nro mod 2 = 1) and (p.socio mod 2 = 0) then cantC := cantC + 1;
      leerPrestamo(p);
    end;
    agregarAtras(L, ult, lib);                      { A }
  end;
end;

function diaMinimo(dias : vDias) : integer;
var d, dMin : rangoDia;
begin
  dMin := 1;
  for d := 2 to 31 do
    if (dias[d] < dias[dMin]) then dMin := d;
  diaMinimo := dMin;
end;

var
  L : lista;
  dias : vDias;
  total, cantC : integer;
begin
  procesar(L, dias, total, cantC);
  writeln('A) Préstamos por ISBN:');
  while (L <> nil) do begin
    writeln('   ', L^.dato.isbn, ': ', L^.dato.cant);
    L := L^.sig;
  end;
  writeln('B) Día con menos préstamos: ', diaMinimo(dias));
  if (total > 0) then
    writeln('C) Préstamo impar y socio par: ', cantC / total * 100:0:2, '%');
end.`,
    entrada: "1111\n1\n20\n1\n1111\n2\n31\n2\n1111\n3\n44\n2\n2222\n5\n10\n3\n3333\n7\n12\n1\n3333\n9\n13\n1\n-1",
  },
  {
    grupo: GA, ref: "P7 Ad 15", titulo: "Villa Olímpica: comidas",
    enunciado: "De cada comida recomendada se conoce: nombre, ingrediente principal (por ejemplo 'Salmón'), calorías por porción y vitamina predominante ('A'..'E'). Se dispone de esta información ordenada por ingrediente principal. Imprimir un reporte con: (A) para cada ingrediente, la cantidad de comidas que lo tienen como principal y la vitamina que más predomina entre ellas; (B) los dos ingredientes menos utilizados; (C) el porcentaje de comidas hipocalóricas (menos de 400 calorías por porción). Los datos de prueba son los 13 del ejemplo del enunciado.",
    pista: "Corte de control por ingrediente. Dentro de cada grupo, un vector contador indexado por vitamina ['A'..'E'] para encontrar la predominante; al cerrar el grupo, actualizás los dos mínimos.",
    sol: `{ Ojo: con los 13 datos del ejemplo hay 7 comidas de menos de 400
  calorías (320, 280, 250, 360, 390, 340 y 290), así que el porcentaje es
  53.85%. El enunciado dice 46,15% (6 de 13): parece un error de cuenta. }
program VillaOlimpica;
type
  str40 = string[40];
  rangoVit = 'A'..'E';
  comida = record
    nombre, ingrediente : str40;
    calorias : integer;
    vitamina : rangoVit;
  end;
  lista = ^nodo;
  nodo = record
    dato : comida;
    sig : lista;
  end;
  vVitaminas = array [rangoVit] of integer;

{ ---- se dispone: la lista ordenada por ingrediente. Lee nombre,
       ingrediente, calorías y vitamina, hasta el nombre 'fin' ---- }
procedure cargarLista(var L : lista);
var
  c : comida;
  nue, ult : lista;
begin
  L := nil;
  ult := nil;
  readln(c.nombre);
  while (c.nombre <> 'fin') do begin
    readln(c.ingrediente);
    readln(c.calorias);
    readln(c.vitamina);
    new(nue);
    nue^.dato := c;
    nue^.sig := nil;
    if (L = nil) then L := nue else ult^.sig := nue;
    ult := nue;
    readln(c.nombre);
  end;
end;

function predominante(v : vVitaminas) : char;
var vit, vMax : rangoVit;
begin
  vMax := 'A';
  for vit := 'B' to 'E' do
    if (v[vit] > v[vMax]) then vMax := vit;
  predominante := vMax;
end;

procedure reporte(L : lista);
var
  vits : vVitaminas;
  vit : rangoVit;
  ingAct, ing1, ing2 : str40;
  cant, min1, min2, total, hipo : integer;
begin
  min1 := maxint; min2 := maxint;
  ing1 := ''; ing2 := '';
  total := 0; hipo := 0;
  while (L <> nil) do begin
    ingAct := L^.dato.ingrediente;
    cant := 0;
    for vit := 'A' to 'E' do vits[vit] := 0;
    while (L <> nil) and (L^.dato.ingrediente = ingAct) do begin
      cant := cant + 1;
      vits[L^.dato.vitamina] := vits[L^.dato.vitamina] + 1;
      if (L^.dato.calorias < 400) then hipo := hipo + 1;
      total := total + 1;
      L := L^.sig;
    end;
    writeln('Ingrediente: ', ingAct);
    writeln('Cantidad: ', cant);
    writeln('Vitamina predominante: ', predominante(vits));
    writeln('--------------------------');
    if (cant < min1) then begin
      min2 := min1; ing2 := ing1;
      min1 := cant; ing1 := ingAct;
    end
    else if (cant < min2) then begin
      min2 := cant; ing2 := ingAct;
    end;
  end;
  writeln('Ingredientes menos utilizados: ', ing1, ' y ', ing2);
  if (total > 0) then
    writeln('Porcentaje de comidas hipocalóricas: ', hipo / total * 100:0:2, '%');
end;

var
  L : lista;
begin
  cargarLista(L);
  reporte(L);
end.`,
    entrada: "Omelette proteico\nHuevos\n320\nA\nHuevos revueltos con espinaca\nHuevos\n280\nA\nTortilla de claras\nHuevos\n250\nB\nHuevos con palta y semillas\nHuevos\n410\nE\nHamburguesa de lentejas\nLentejas\n360\nB\nGuiso de lentejas\nLentejas\n520\nB\nPechuga grillada\nPollo\n390\nB\nPollo con arroz integral\nPollo\n470\nB\nWrap de pollo\nPollo\n430\nC\nSalmón con quinoa\nSalmón\n510\nD\nSalmón ahumado\nSalmón\n340\nD\nSalmón teriyaki\nSalmón\n620\nE\nEnsalada de tofu\nTofu\n290\nC\nfin",
  },
  {
    grupo: GA, ref: "P7 Ad 16", titulo: "Atelier: vestidos de novia (menú)",
    enunciado: "De cada vestido se conoce: código (único), descripción, tela ('Seda', 'Encaje', etc.), talle (38..48) y precio. Mientras no termine, el programa muestra un menú: 1. Cargar vestidos (hasta el código -1, que no se procesa), almacenándolos ordenados por tela. 2. Informar el vestido TOP por tela (el más caro de cada tela). 3. Informar el talle menos requerido. 4. Leer una tela e informar el precio promedio de sus vestidos para cada talle; si no hay, informar \"Ningún vestido fue confeccionado con la tela ingresada\". 5. Leer una descripción e informar si existe algún vestido con esa descripción. 6. Leer un código, eliminar ese vestido e informar si se pudo. 7. Imprimir \"Programa finalizado\" y terminar. Después de cada opción (salvo la 7) se vuelve a mostrar el menú; si la opción está fuera de 1..7 se pide otro valor.",
    pista: "La lista ordenada por tela hace que las opciones 2 y 4 sean cortes de control (en la 4 avanzás hasta la tela buscada y procesás solo ese tramo). El menú es un repeat ... until opcion = 7 con un case adentro.",
    sol: `program Atelier;
type
  str60 = string[60];
  rangoTalle = 38..48;
  vestido = record
    codigo : integer;
    descripcion, tela : str60;
    talle : rangoTalle;
    precio : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : vestido;
    sig : lista;
  end;
  vCant = array [rangoTalle] of integer;
  vSuma = array [rangoTalle] of real;

procedure leerVestido(var v : vestido);
begin
  write('Código: ');
  readln(v.codigo);
  if (v.codigo <> -1) then begin
    write('Descripción: '); readln(v.descripcion);
    write('Tela: '); readln(v.tela);
    write('Talle: '); readln(v.talle);
    write('Precio: '); readln(v.precio);
  end;
end;

procedure insertarPorTela(var L : lista; v : vestido);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := v;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.tela <= v.tela) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

{ 1 }
procedure cargarVestidos(var L : lista);
var v : vestido;
begin
  leerVestido(v);
  while (v.codigo <> -1) do begin
    insertarPorTela(L, v);
    leerVestido(v);
  end;
end;

procedure imprimirVestido(v : vestido);
begin
  writeln('   ', v.codigo, ' "', v.descripcion, '" ', v.tela, ' talle ', v.talle, ' $', v.precio:0:2);
end;

{ 2 }
procedure topPorTela(L : lista);
var
  telaAct : str60;
  top : lista;
begin
  while (L <> nil) do begin
    telaAct := L^.dato.tela;
    top := L;
    while (L <> nil) and (L^.dato.tela = telaAct) do begin
      if (L^.dato.precio > top^.dato.precio) then top := L;
      L := L^.sig;
    end;
    imprimirVestido(top^.dato);
  end;
end;

{ 3 }
procedure talleMenosRequerido(L : lista);
var
  cant : vCant;
  t, tMin : rangoTalle;
begin
  for t := 38 to 48 do cant[t] := 0;
  while (L <> nil) do begin
    cant[L^.dato.talle] := cant[L^.dato.talle] + 1;
    L := L^.sig;
  end;
  tMin := 38;
  for t := 39 to 48 do
    if (cant[t] < cant[tMin]) then tMin := t;
  writeln('   Talle menos requerido: ', tMin, ' (', cant[tMin], ' vestidos)');
end;

{ 4 }
procedure preciosPromedio(L : lista);
var
  tela : str60;
  cant : vCant;
  suma : vSuma;
  t : rangoTalle;
begin
  write('Tela: ');
  readln(tela);
  for t := 38 to 48 do begin
    cant[t] := 0;
    suma[t] := 0;
  end;
  while (L <> nil) and (L^.dato.tela < tela) do      { la lista está ordenada }
    L := L^.sig;
  if (L = nil) or (L^.dato.tela <> tela) then
    writeln('   Ningún vestido fue confeccionado con la tela ingresada')
  else begin
    while (L <> nil) and (L^.dato.tela = tela) do begin
      cant[L^.dato.talle] := cant[L^.dato.talle] + 1;
      suma[L^.dato.talle] := suma[L^.dato.talle] + L^.dato.precio;
      L := L^.sig;
    end;
    for t := 38 to 48 do
      if (cant[t] > 0) then
        writeln('   Talle ', t, ': $', suma[t] / cant[t]:0:2)
      else
        writeln('   Talle ', t, ': sin vestidos');
  end;
end;

{ 5 }
procedure buscarDescripcion(L : lista);
var desc : str60;
begin
  write('Descripción: ');
  readln(desc);
  while (L <> nil) and (L^.dato.descripcion <> desc) do
    L := L^.sig;
  if (L <> nil) then writeln('   Existe un vestido con esa descripción (código ', L^.dato.codigo, ')')
  else writeln('   No existe ningún vestido con esa descripción');
end;

{ 6 }
procedure eliminarVestido(var L : lista);
var
  cod : integer;
  ant, act : lista;
begin
  write('Código: ');
  readln(cod);
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.codigo <> cod) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = nil) then
    writeln('   No se pudo eliminar: no existe el vestido ', cod)
  else begin
    if (act = L) then L := L^.sig
    else ant^.sig := act^.sig;
    dispose(act);
    writeln('   Vestido ', cod, ' eliminado');
  end;
end;

procedure mostrarMenu;
begin
  writeln;
  writeln('1. Cargar vestidos');
  writeln('2. Informar vestido TOP por tela');
  writeln('3. Informar talle menos requerido');
  writeln('4. Informar precios promedio');
  writeln('5. Buscar vestido');
  writeln('6. Eliminar vestido');
  writeln('7. Finalizar');
end;

function leerOpcion : integer;
var op : integer;
begin
  write('Opción: ');
  readln(op);
  while (op < 1) or (op > 7) do begin
    write('Opción inválida, ingrese otro valor: ');
    readln(op);
  end;
  leerOpcion := op;
end;

var
  L : lista;
  opcion : integer;
begin
  L := nil;
  repeat
    mostrarMenu;
    opcion := leerOpcion;
    case opcion of
      1: cargarVestidos(L);
      2: topPorTela(L);
      3: talleMenosRequerido(L);
      4: preciosPromedio(L);
      5: buscarDescripcion(L);
      6: eliminarVestido(L);
      7: writeln('Programa finalizado');
    end;
  until (opcion = 7);
end.`,
    entrada: "1\n102\nVestido sirena de encaje frances\nEncaje\n40\n420000\n215\nVestido minimalista de seda natural\nSeda\n38\n610000\n301\nVestido princesa de encaje\nEncaje\n40\n380000\n410\nVestido recto de seda\nSeda\n44\n700000\n-1\n9\n2\n3\n4\nEncaje\n4\nTul\n5\nVestido recto de seda\n6\n215\n2\n7",
  },
];

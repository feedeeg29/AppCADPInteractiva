import type { Ejercicio } from "../types";

const G = "Práctica 4 · Parte 2 · Búsqueda, inserción y eliminación";
const GA = "Ejercicios adicionales";

export const guiaP42: Ejercicio[] = [
  {
    grupo: G, ref: "P4·2 Ej 1", titulo: "¿Está n en el vector?",
    enunciado: "(a) Dado un vector de a lo sumo 500 enteros, realizar un módulo que reciba el vector y un valor n y devuelva si n está en el vector. (b) Modificarlo considerando que el vector está ordenado de forma ascendente.",
    pista: "En (a) hay que mirar hasta encontrarlo o llegar al final. En (b) se puede cortar apenas aparece un valor mayor o igual a n, o directamente usar búsqueda dicotómica.",
    sol: `program buscar;
const
  DIMF = 500;
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

{ a) vector desordenado: búsqueda lineal }
function esta(v : vector; dimL, n : integer) : boolean;
var i : integer;
begin
  i := 1;
  while (i <= dimL) and (v[i] <> n) do
    i := i + 1;
  esta := (i <= dimL);
end;

{ b) vector ordenado: se corta al pasar el valor buscado }
function estaOrdenado(v : vector; dimL, n : integer) : boolean;
var i : integer;
begin
  i := 1;
  while (i <= dimL) and (v[i] < n) do
    i := i + 1;
  estaOrdenado := (i <= dimL) and (v[i] = n);
end;

{ b) otra opción para el vector ordenado: búsqueda dicotómica }
function estaDicotomica(v : vector; dimL, n : integer) : boolean;
var ini, fin, medio : integer;
begin
  ini := 1;
  fin := dimL;
  medio := (ini + fin) div 2;
  while (ini <= fin) and (v[medio] <> n) do begin
    if (n < v[medio]) then fin := medio - 1
    else ini := medio + 1;
    medio := (ini + fin) div 2;
  end;
  estaDicotomica := (ini <= fin);
end;

var
  v : vector;
  dimL, n : integer;
begin
  cargar(v, dimL);       { para probar (b), cargalo ordenado }
  read(n);
  writeln('Búsqueda lineal: ', esta(v, dimL, n));
  writeln('Búsqueda en vector ordenado: ', estaOrdenado(v, dimL, n));
  writeln('Búsqueda dicotómica: ', estaDicotomica(v, dimL, n));
end.`,
    entrada: "3 8 15 21 40 77 0\n21",
  },
  {
    grupo: G, ref: "P4·2 Ej 2", titulo: "Vector de nombres",
    enunciado: "(a) Leer nombres de alumnos y guardarlos en un vector de a lo sumo 500 elementos; la lectura termina con 'ZZZ', que no se procesa. (b) Leer un nombre y eliminar su primera ocurrencia. (c) Leer un nombre e insertarlo en la posición 4. (d) Leer un nombre y agregarlo al final. Realizar todas las validaciones necesarias.",
    pista: "Validaciones: que el nombre exista antes de eliminar, que haya lugar antes de insertar o agregar, y que la posición 4 sea válida (entre 1 y dimL + 1).",
    sol: `program nombres;
const
  DIMF = 500;
type
  str20 = string[20];
  vNombres = array [1..DIMF] of str20;

procedure cargar(var v : vNombres; var dimL : integer);
var n : str20;
begin
  dimL := 0;
  readln(n);
  while (n <> 'ZZZ') and (dimL < DIMF) do begin
    dimL := dimL + 1;
    v[dimL] := n;
    if (dimL < DIMF) then readln(n);
  end;
end;

function posicion(v : vNombres; dimL : integer; n : str20) : integer;
var i : integer;
begin
  i := 1;
  while (i <= dimL) and (v[i] <> n) do i := i + 1;
  if (i <= dimL) then posicion := i else posicion := -1;
end;

procedure eliminarPos(var v : vNombres; var dimL : integer; pos : integer);
var i : integer;
begin
  for i := pos to dimL - 1 do v[i] := v[i + 1];
  dimL := dimL - 1;
end;

procedure insertar(var v : vNombres; var dimL : integer; n : str20; pos : integer; var ok : boolean);
var i : integer;
begin
  ok := (dimL < DIMF) and (pos >= 1) and (pos <= dimL + 1);
  if ok then begin
    for i := dimL downto pos do v[i + 1] := v[i];
    v[pos] := n;
    dimL := dimL + 1;
  end;
end;

procedure agregar(var v : vNombres; var dimL : integer; n : str20; var ok : boolean);
begin
  ok := (dimL < DIMF);
  if ok then begin
    dimL := dimL + 1;
    v[dimL] := n;
  end;
end;

procedure imprimir(v : vNombres; dimL : integer);
var i : integer;
begin
  for i := 1 to dimL do write(v[i], ' | ');
  writeln;
end;

var
  v : vNombres;
  dimL, pos : integer;
  n : str20;
  ok : boolean;
begin
  cargar(v, dimL);                                     { a }
  readln(n);                                           { b }
  pos := posicion(v, dimL, n);
  if (pos <> -1) then eliminarPos(v, dimL, pos)
  else writeln(n, ' no está en el vector');
  imprimir(v, dimL);
  readln(n);                                           { c }
  insertar(v, dimL, n, 4, ok);
  if not ok then writeln('No se pudo insertar en la posición 4');
  imprimir(v, dimL);
  readln(n);                                           { d }
  agregar(v, dimL, n, ok);
  if not ok then writeln('El vector está lleno');
  imprimir(v, dimL);
end.`,
    entrada: "Ana\nLuis\nSol\nJuan\nEva\nZZZ\nSol\nPedro\nMara",
  },
  {
    grupo: G, ref: "P4·2 Ej 3", titulo: "Transporte de caudales",
    enunciado: "De cada viaje de marzo se conoce día del mes (1 a 31), monto transportado y distancia recorrida (km). (a) Leer y almacenar los viajes (a lo sumo 200) hasta una distancia 0, que no se procesa. (b) Módulo que reciba el vector e informe, en un único recorrido: el monto promedio, la distancia y el día del viaje que transportó menos dinero, y la cantidad de viajes de cada día. (c) Módulo que elimine todos los viajes de exactamente 100 km.",
    pista: "Para (b), un vector contador indexado por día. Para (c), en lugar de llamar a 'eliminar posición' muchas veces (cada una corre todo el vector), se puede compactar en una sola pasada copiando los que se quedan.",
    sol: `program caudales;
const
  DIMF = 200;
type
  rangoDia = 1..31;
  viaje = record
    dia : integer;            { integer y no 1..31: el viaje final (distancia 0) puede traer cualquier día }
    monto, distancia : real;
  end;
  vViajes = array [1..DIMF] of viaje;
  vDias = array [rangoDia] of integer;

procedure leerViaje(var v : viaje);
begin
  read(v.dia, v.monto, v.distancia);
end;

procedure cargar(var v : vViajes; var dimL : integer);
var x : viaje;
begin
  dimL := 0;
  leerViaje(x);
  while (x.distancia <> 0) and (dimL < DIMF) do begin
    dimL := dimL + 1;
    v[dimL] := x;
    if (dimL < DIMF) then leerViaje(x);
  end;
end;

procedure informar(v : vViajes; dimL : integer);
var
  i : integer;
  d : rangoDia;
  dias : vDias;
  suma, min, distMin : real;
  diaMin : integer;
begin
  for d := 1 to 31 do dias[d] := 0;
  suma := 0;
  min := 1e30; distMin := 0; diaMin := 0;
  for i := 1 to dimL do begin
    suma := suma + v[i].monto;
    if (v[i].monto < min) then begin
      min := v[i].monto;
      distMin := v[i].distancia;
      diaMin := v[i].dia;
    end;
    dias[v[i].dia] := dias[v[i].dia] + 1;
  end;
  if (dimL > 0) then begin
    writeln('Monto promedio: ', suma / dimL:0:2);
    writeln('Viaje con menos dinero: día ', diaMin, ', ', distMin:0:1, ' km');
  end;
  for d := 1 to 31 do
    if (dias[d] > 0) then
      writeln('Día ', d, ': ', dias[d], ' viajes');
end;

procedure eliminar100(var v : vViajes; var dimL : integer);
var i, j : integer;
begin
  j := 0;
  for i := 1 to dimL do
    if (v[i].distancia <> 100) then begin
      j := j + 1;
      v[j] := v[i];
    end;
  dimL := j;
end;

var
  v : vViajes;
  dimL : integer;
begin
  cargar(v, dimL);
  informar(v, dimL);
  eliminar100(v, dimL);
  writeln('Quedan ', dimL, ' viajes después de eliminar los de 100 km');
end.`,
    entrada: "1 50000 100\n1 20000 35\n3 90000 100\n15 12000 220\n15 70000 80\n0 0 0",
  },
  {
    grupo: G, ref: "P4·2 Ej 4", titulo: "Alumnos ordenados por número",
    enunciado: "Una cátedra tiene a lo sumo 1000 alumnos (número, apellido y nombre, asistencias), ordenados por número de alumno de forma ascendente. Módulos: (a) devolver la posición de un número de alumno (seguro existe); (b) insertar un alumno; (c) eliminar el alumno de una posición; (d) eliminar el alumno de un número dado; (e) eliminar todos los alumnos con 0 asistencias. Hacer el programa principal que los invoque con datos leídos de teclado.",
    pista: "Como está ordenado, (a) puede ser dicotómica. (b) busca dónde va y corre hacia la derecha para mantener el orden. (d) reutiliza la búsqueda y (c). (e) compacta en una pasada.",
    sol: `program catedra;
const
  DIMF = 1000;
type
  alumno = record
    nro : integer;
    nombre : string;
    asistencias : integer;
  end;
  vAlumnos = array [1..DIMF] of alumno;

procedure leerAlumno(var a : alumno);
begin
  readln(a.nro);
  if (a.nro <> -1) then begin
    readln(a.nombre);
    readln(a.asistencias);
  end;
end;

{ La información se dispone ordenada; acá se carga para poder probar }
procedure cargar(var v : vAlumnos; var dimL : integer);
var a : alumno;
begin
  dimL := 0;
  leerAlumno(a);
  while (a.nro <> -1) and (dimL < DIMF) do begin
    dimL := dimL + 1;
    v[dimL] := a;
    if (dimL < DIMF) then leerAlumno(a);
  end;
end;

{ a) búsqueda dicotómica; el alumno seguro existe }
function posicion(v : vAlumnos; dimL, nro : integer) : integer;
var ini, fin, medio : integer;
begin
  ini := 1;
  fin := dimL;
  medio := (ini + fin) div 2;
  while (v[medio].nro <> nro) do begin
    if (nro < v[medio].nro) then fin := medio - 1
    else ini := medio + 1;
    medio := (ini + fin) div 2;
  end;
  posicion := medio;
end;

{ b) insertar manteniendo el orden }
procedure insertar(var v : vAlumnos; var dimL : integer; a : alumno; var ok : boolean);
var i, pos : integer;
begin
  ok := (dimL < DIMF);
  if ok then begin
    pos := 1;
    while (pos <= dimL) and (v[pos].nro < a.nro) do pos := pos + 1;
    for i := dimL downto pos do v[i + 1] := v[i];
    v[pos] := a;
    dimL := dimL + 1;
  end;
end;

{ c) eliminar la posición pos }
procedure eliminarPos(var v : vAlumnos; var dimL : integer; pos : integer; var ok : boolean);
var i : integer;
begin
  ok := (pos >= 1) and (pos <= dimL);
  if ok then begin
    for i := pos to dimL - 1 do v[i] := v[i + 1];
    dimL := dimL - 1;
  end;
end;

{ d) eliminar por número (puede no existir) }
procedure eliminarNro(var v : vAlumnos; var dimL : integer; nro : integer; var ok : boolean);
var pos : integer;
begin
  pos := 1;
  while (pos <= dimL) and (v[pos].nro < nro) do pos := pos + 1;
  if (pos <= dimL) and (v[pos].nro = nro) then
    eliminarPos(v, dimL, pos, ok)
  else
    ok := false;
end;

{ e) eliminar los que tienen 0 asistencias, en una sola pasada }
procedure eliminarSinAsistencias(var v : vAlumnos; var dimL : integer);
var i, j : integer;
begin
  j := 0;
  for i := 1 to dimL do
    if (v[i].asistencias <> 0) then begin
      j := j + 1;
      v[j] := v[i];
    end;
  dimL := j;
end;

procedure imprimir(v : vAlumnos; dimL : integer);
var i : integer;
begin
  for i := 1 to dimL do write(v[i].nro, ' ');
  writeln;
end;

var
  v : vAlumnos;
  a : alumno;
  dimL, nro, pos : integer;
  ok : boolean;
begin
  cargar(v, dimL);
  readln(nro);
  writeln('El alumno ', nro, ' está en la posición ', posicion(v, dimL, nro));
  leerAlumno(a);
  insertar(v, dimL, a, ok);
  imprimir(v, dimL);
  readln(pos);
  eliminarPos(v, dimL, pos, ok);
  if not ok then writeln('Posición inválida');
  imprimir(v, dimL);
  readln(nro);
  eliminarNro(v, dimL, nro, ok);
  if not ok then writeln('El alumno ', nro, ' no existe');
  imprimir(v, dimL);
  eliminarSinAsistencias(v, dimL);
  imprimir(v, dimL);
end.`,
    entrada: "10\nAna\n5\n20\nLuis\n0\n30\nSol\n8\n40\nJuan\n0\n-1\n30\n25\nEva\n3\n1\n99",
  },
  {
    grupo: G, ref: "P4·2 Ej 5", titulo: "Clientes de AWS",
    enunciado: "De cada uno de los 500 clientes se conoce la fecha de firma del contrato, la categoría del monotributo (A a F), el código de ciudad (1 a 2400) y el monto mensual. Los datos vienen ordenados por fecha. Leer y almacenar la información en un vector y después obtener: (a) la cantidad de contratos por cada mes y cada año, y el año con más contratos; (b) la cantidad de clientes de cada categoría; (c) los códigos de las 10 ciudades con más clientes; (d) la cantidad de clientes que superan el monto promedio.",
    pista: "(a) Como el vector está ordenado por fecha, es un corte de control por año y mes. (b) Vector contador indexado por 'A'..'F'. (c) Vector contador de 2400 ciudades y después elegir 10 veces el máximo. (d) Necesita un segundo recorrido: primero hay que conocer el promedio.",
    sol: `program aws;
const
  DIMF = 500;
  CANT_CIUDADES = 2400;
type
  rangoCat = 'A'..'F';
  fecha = record
    dia, mes, anio : integer;
  end;
  cliente = record
    firma : fecha;
    categoria : rangoCat;
    ciudad : integer;
    monto : real;
  end;
  vClientes = array [1..DIMF] of cliente;
  vCategorias = array [rangoCat] of integer;
  vCiudades = array [1..CANT_CIUDADES] of integer;

procedure leerCliente(var c : cliente);
begin
  read(c.firma.dia, c.firma.mes, c.firma.anio);
  readln;
  readln(c.categoria);
  readln(c.ciudad);
  readln(c.monto);
end;

procedure cargar(var v : vClientes);
var i : integer;
begin
  for i := 1 to DIMF do leerCliente(v[i]);
end;

{ Un recorrido: a), b), conteo de ciudades y suma de montos }
procedure procesar(v : vClientes; var ciudades : vCiudades; var promedio : real);
var
  i, anioActual, mesActual, cantMes, cantAnio, maxAnio, anioMax : integer;
  cat : rangoCat;
  cats : vCategorias;
  suma : real;
begin
  for cat := 'A' to 'F' do cats[cat] := 0;
  for i := 1 to CANT_CIUDADES do ciudades[i] := 0;
  suma := 0;
  maxAnio := -1; anioMax := 0;
  i := 1;
  while (i <= DIMF) do begin
    anioActual := v[i].firma.anio;
    cantAnio := 0;
    while (i <= DIMF) and (v[i].firma.anio = anioActual) do begin
      mesActual := v[i].firma.mes;
      cantMes := 0;
      while (i <= DIMF) and (v[i].firma.anio = anioActual) and (v[i].firma.mes = mesActual) do begin
        cantMes := cantMes + 1;
        cats[v[i].categoria] := cats[v[i].categoria] + 1;
        ciudades[v[i].ciudad] := ciudades[v[i].ciudad] + 1;
        suma := suma + v[i].monto;
        i := i + 1;
      end;
      writeln(mesActual, '/', anioActual, ': ', cantMes, ' contratos');
      cantAnio := cantAnio + cantMes;
    end;
    if (cantAnio > maxAnio) then begin
      maxAnio := cantAnio;
      anioMax := anioActual;
    end;
  end;
  writeln('Año con más contratos: ', anioMax);
  for cat := 'A' to 'F' do
    writeln('Categoría ', cat, ': ', cats[cat], ' clientes');
  promedio := suma / DIMF;
end;

{ c) se elige 10 veces la ciudad con más clientes y se la descarta }
procedure diezCiudades(ciudades : vCiudades);
var k, i, posMax : integer;
begin
  write('Las 10 ciudades con más clientes:');
  for k := 1 to 10 do begin
    posMax := 1;
    for i := 2 to CANT_CIUDADES do
      if (ciudades[i] > ciudades[posMax]) then posMax := i;
    write(' ', posMax);
    ciudades[posMax] := -1;
  end;
  writeln;
end;

{ d) segundo recorrido }
function superanPromedio(v : vClientes; promedio : real) : integer;
var i, cant : integer;
begin
  cant := 0;
  for i := 1 to DIMF do
    if (v[i].monto > promedio) then cant := cant + 1;
  superanPromedio := cant;
end;

var
  v : vClientes;
  ciudades : vCiudades;
  promedio : real;
begin
  cargar(v);
  procesar(v, ciudades, promedio);
  diezCiudades(ciudades);
  writeln('Clientes que superan el monto promedio: ', superanPromedio(v, promedio));
end.
{ Para probarlo rápido, cambiá DIMF a 4. }`,
  },

  // ---------------- Adicionales ----------------
  {
    grupo: GA, ref: "P4·2 Ad 1", titulo: "Computadoras con Ubuntu",
    enunciado: "De cada computadora (a lo sumo 10000) se conoce código, versión de Ubuntu (18.04, 17.10, etc.), cantidad de paquetes instalados y cantidad de cuentas de usuario. La información debe almacenarse ordenada por código de forma ascendente; la lectura termina con el código -1. Después: (a) informar cuántas usan la versión 18.04 o 16.04; (b) el promedio de cuentas por computadora; (c) la versión de la que tiene más paquetes; (d) eliminar las computadoras con código entre 0 y 500.",
    pista: "Los datos no vienen ordenados: cada computadora se inserta en su lugar (insertar ordenado). La versión conviene guardarla como string. (a), (b) y (c) salen en un recorrido; (d) compacta el vector.",
    sol: `program ubuntu;
const
  DIMF = 10000;
type
  str10 = string[10];
  compu = record
    codigo : integer;
    version : str10;
    paquetes, cuentas : integer;
  end;
  vCompus = array [1..DIMF] of compu;

procedure leerCompu(var c : compu);
begin
  readln(c.codigo);
  if (c.codigo <> -1) then begin
    readln(c.version);
    readln(c.paquetes);
    readln(c.cuentas);
  end;
end;

procedure insertarOrdenado(var v : vCompus; var dimL : integer; c : compu);
var i, pos : integer;
begin
  pos := 1;
  while (pos <= dimL) and (v[pos].codigo < c.codigo) do pos := pos + 1;
  for i := dimL downto pos do v[i + 1] := v[i];
  v[pos] := c;
  dimL := dimL + 1;
end;

procedure cargar(var v : vCompus; var dimL : integer);
var c : compu;
begin
  dimL := 0;
  leerCompu(c);
  while (c.codigo <> -1) and (dimL < DIMF) do begin
    insertarOrdenado(v, dimL, c);
    if (dimL < DIMF) then leerCompu(c);
  end;
end;

procedure informar(v : vCompus; dimL : integer);
var
  i, cantVersiones, maxPaq : integer;
  sumaCuentas : longint;
  verMax : str10;
begin
  cantVersiones := 0; sumaCuentas := 0;
  maxPaq := -1; verMax := '';
  for i := 1 to dimL do begin
    if (v[i].version = '18.04') or (v[i].version = '16.04') then
      cantVersiones := cantVersiones + 1;
    sumaCuentas := sumaCuentas + v[i].cuentas;
    if (v[i].paquetes > maxPaq) then begin
      maxPaq := v[i].paquetes;
      verMax := v[i].version;
    end;
  end;
  writeln('Computadoras con 18.04 o 16.04: ', cantVersiones);
  if (dimL > 0) then
    writeln('Promedio de cuentas por computadora: ', sumaCuentas / dimL:0:2);
  writeln('Versión de la que tiene más paquetes: ', verMax);
end;

procedure eliminarRango(var v : vCompus; var dimL : integer; desde, hasta : integer);
var i, j : integer;
begin
  j := 0;
  for i := 1 to dimL do
    if (v[i].codigo < desde) or (v[i].codigo > hasta) then begin
      j := j + 1;
      v[j] := v[i];
    end;
  dimL := j;
end;

var
  v : vCompus;
  dimL, i : integer;
begin
  cargar(v, dimL);
  informar(v, dimL);
  eliminarRango(v, dimL, 0, 500);
  write('Códigos que quedan:');
  for i := 1 to dimL do write(' ', v[i].codigo);
  writeln;
end.`,
    entrada: "900\n18.04\n1500\n3\n120\n16.04\n800\n1\n4500\n17.10\n2200\n5\n500\n18.04\n640\n2\n-1",
  },
  {
    grupo: GA, ref: "P4·2 Ad 2 · Act 1", titulo: "Inversiones, con vectores",
    enunciado: "Volver a resolver la Actividad 1 de la guía adicional de la Práctica 1 (inversiones) guardando primero los datos en un vector (a lo sumo 5000 empresas) y procesándolo después, reutilizando los módulos anteriores. En lo posible, un solo recorrido.",
    pista: "El vector es de registros empresa. La carga solo carga; después un recorrido informa los promedios y calcula el máximo y la cantidad de más de $50000.",
    sol: `program inversionesVector;
const
  DIMF = 5000;
type
  empresa = record
    codigo, cantInv : integer;
    total : real;
  end;
  vEmpresas = array [1..DIMF] of empresa;

procedure leerEmpresa(var e : empresa);
var
  i : integer;
  monto : real;
begin
  read(e.codigo);
  read(e.cantInv);
  e.total := 0;
  for i := 1 to e.cantInv do begin
    read(monto);
    e.total := e.total + monto;
  end;
end;

procedure cargar(var v : vEmpresas; var dimL : integer);
var e : empresa;
begin
  dimL := 0;
  repeat
    leerEmpresa(e);
    dimL := dimL + 1;
    v[dimL] := e;
  until (e.codigo = 100) or (dimL = DIMF);
end;

procedure procesar(v : vEmpresas; dimL : integer);
var
  i, codMax, cantMas50 : integer;
  max : real;
begin
  max := -1; codMax := 0; cantMas50 := 0;
  for i := 1 to dimL do begin
    if (v[i].cantInv > 0) then
      writeln('Empresa ', v[i].codigo, ' monto promedio ', v[i].total / v[i].cantInv:0:2);
    if (v[i].total > max) then begin
      max := v[i].total;
      codMax := v[i].codigo;
    end;
    if (v[i].total > 50000) then cantMas50 := cantMas50 + 1;
  end;
  writeln('La empresa ', codMax, ' es la que más dinero tiene invertido ($', max:0:2, ')');
  writeln('Hay ', cantMas50, ' empresas con inversiones por más de $50000');
end;

var
  v : vEmpresas;
  dimL : integer;
begin
  cargar(v, dimL);
  procesar(v, dimL);
end.`,
    entrada: "33\n4\n33200 56930 24500.85 10000\n41\n3\n102000.22 53000 12000\n100\n1\n84000.34",
  },
  {
    grupo: GA, ref: "P4·2 Ad 2 · Act 2", titulo: "Autoevaluaciones, con vectores",
    enunciado: "Volver a resolver la Actividad 2 (autoevaluaciones) guardando primero los alumnos en un vector (a lo sumo 5000) y procesándolo después en un solo recorrido.",
    pista: "Cada alumno puede guardar sus 5 notas en un vector dentro del registro. El análisis de cada alumno (presentes, dieces, ceros) se hace al recorrer, no al cargar.",
    sol: `program autoevaluacionesVector;
const
  DIMF = 5000;
  NOTA_PRESENTE = 4;
  MIN_PRESENTES = 4;
type
  vNotas = array [1..5] of integer;
  alumno = record
    legajo : longint;
    condicion : char;
    notas : vNotas;
  end;
  vAlumnos = array [1..DIMF] of alumno;

procedure leerAlumno(var a : alumno);
var i : integer;
begin
  readln(a.legajo);
  if (a.legajo <> -1) then begin
    readln(a.condicion);
    for i := 1 to 5 do read(a.notas[i]);
    readln;
  end;
end;

procedure cargar(var v : vAlumnos; var dimL : integer);
var a : alumno;
begin
  dimL := 0;
  leerAlumno(a);
  while (a.legajo <> -1) and (dimL < DIMF) do begin
    dimL := dimL + 1;
    v[dimL] := a;
    if (dimL < DIMF) then leerAlumno(a);
  end;
end;

procedure analizar(n : vNotas; var presentes, dieces, ceros, suma : integer);
var i : integer;
begin
  presentes := 0; dieces := 0; ceros := 0; suma := 0;
  for i := 1 to 5 do begin
    if (n[i] >= NOTA_PRESENTE) then presentes := presentes + 1;
    if (n[i] = 10) then dieces := dieces + 1;
    if (n[i] = 0) then ceros := ceros + 1;
    if (n[i] > 0) then suma := suma + n[i];
  end;
end;

procedure actualizarDosMaximos(valor : integer; legajo : longint;
                               var max1, max2 : integer; var leg1, leg2 : longint);
begin
  if (valor > max1) then begin
    max2 := max1; leg2 := leg1; max1 := valor; leg1 := legajo;
  end
  else if (valor > max2) then begin
    max2 := valor; leg2 := legajo;
  end;
end;

procedure procesar(v : vAlumnos; dimL : integer);
var
  i, presentes, dieces, ceros, suma : integer;
  ingr, ingrOk, recu, recuOk, todas, promAlto, conCero : integer;
  max10a, max10b, max0a, max0b : integer;
  leg10a, leg10b, leg0a, leg0b : longint;
begin
  ingr := 0; ingrOk := 0; recu := 0; recuOk := 0;
  todas := 0; promAlto := 0; conCero := 0;
  max10a := -1; max10b := -1; max0a := -1; max0b := -1;
  leg10a := 0; leg10b := 0; leg0a := 0; leg0b := 0;
  for i := 1 to dimL do begin
    analizar(v[i].notas, presentes, dieces, ceros, suma);
    if (v[i].condicion = 'I') then begin
      ingr := ingr + 1;
      if (presentes >= MIN_PRESENTES) then ingrOk := ingrOk + 1;
    end
    else begin
      recu := recu + 1;
      if (presentes >= MIN_PRESENTES) then recuOk := recuOk + 1;
    end;
    if (presentes = 5) then todas := todas + 1;
    if (suma / 5 > 6.5) then promAlto := promAlto + 1;
    if (ceros > 0) then conCero := conCero + 1;
    actualizarDosMaximos(dieces, v[i].legajo, max10a, max10b, leg10a, leg10b);
    actualizarDosMaximos(ceros, v[i].legajo, max0a, max0b, leg0a, leg0b);
  end;
  write('Ingresantes en condiciones de rendir: ', ingrOk);
  if (ingr > 0) then writeln(' (', ingrOk / ingr * 100:0:2, '%)') else writeln;
  write('Recursantes en condiciones de rendir: ', recuOk);
  if (recu > 0) then writeln(' (', recuOk / recu * 100:0:2, '%)') else writeln;
  writeln('Aprobaron todas las autoevaluaciones: ', todas);
  writeln('Promedio mayor a 6.5: ', promAlto);
  writeln('Con al menos un cero: ', conCero);
  writeln('Más dieces: ', leg10a, ' y ', leg10b);
  writeln('Más ceros: ', leg0a, ' y ', leg0b);
end;

var
  v : vAlumnos;
  dimL : integer;
begin
  cargar(v, dimL);
  procesar(v, dimL);
end.`,
    entrada: "19003\nR\n8 10 6 -1 8\n21020\nI\n4 0 6 10 -1\n22100\nI\n10 10 9 8 10\n-1",
  },
  {
    grupo: GA, ref: "P4·2 Ad 2 · Act 3", titulo: "Tanques de agua, con vectores",
    enunciado: "Volver a resolver la Actividad 3 (tanques de agua) guardando primero los tanques en un vector (a lo sumo 5000) y procesándolo después en un solo recorrido.",
    pista: "Vector de registros tanque, con el volumen calculado al leer. El recorrido reutiliza el módulo de los dos máximos.",
    sol: `program tanquesVector;
const
  DIMF = 5000;
type
  tanque = record
    tipo : char;
    alto, volumen : real;
  end;
  vTanques = array [1..DIMF] of tanque;

procedure leerTanque(var t : tanque);
var a, b, radio : real;
begin
  readln(t.tipo);
  if (t.tipo = 'R') then begin
    readln(a, b, t.alto);
    t.volumen := a * b * t.alto;
  end
  else if (t.tipo = 'C') then begin
    readln(radio, t.alto);
    t.volumen := pi * radio * radio * t.alto;
  end;
end;

procedure cargar(var v : vTanques; var dimL : integer);
var t : tanque;
begin
  dimL := 0;
  leerTanque(t);
  while (t.tipo <> 'Z') and (dimL < DIMF) do begin
    dimL := dimL + 1;
    v[dimL] := t;
    if (dimL < DIMF) then leerTanque(t);
  end;
end;

procedure actualizarMaximos(vol : real; var max1, max2 : real);
begin
  if (vol > max1) then begin
    max2 := max1; max1 := vol;
  end
  else if (vol > max2) then
    max2 := vol;
end;

procedure procesar(v : vTanques; dimL : integer);
var
  i, cantC, cantR, bajos, chicos : integer;
  max1, max2, sumaC, sumaR : real;
begin
  max1 := -1; max2 := -1;
  sumaC := 0; sumaR := 0; cantC := 0; cantR := 0;
  bajos := 0; chicos := 0;
  for i := 1 to dimL do begin
    if (v[i].tipo = 'R') then begin
      sumaR := sumaR + v[i].volumen; cantR := cantR + 1;
    end
    else begin
      sumaC := sumaC + v[i].volumen; cantC := cantC + 1;
    end;
    actualizarMaximos(v[i].volumen, max1, max2);
    if (v[i].alto < 1.40) then bajos := bajos + 1;
    if (v[i].volumen < 800) then chicos := chicos + 1;
  end;
  writeln('Volumen de los dos mayores: ', max1:0:2, ' y ', max2:0:2);
  if (cantC > 0) then writeln('Promedio cilíndricos: ', sumaC / cantC:0:2);
  if (cantR > 0) then writeln('Promedio rectangulares: ', sumaR / cantR:0:2);
  writeln('Tanques de menos de 1.40 m de alto: ', bajos);
  writeln('Tanques de menos de 800 m3: ', chicos);
end;

var
  v : vTanques;
  dimL : integer;
begin
  cargar(v, dimL);
  procesar(v, dimL);
end.`,
    entrada: "R\n2 3 1.5\nC\n1 2\nR\n10 10 9\nZ",
  },
];

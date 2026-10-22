import type { Ejercicio } from "../types";

const G = "Práctica 6 · Listas";
const GA = "Ejercicios adicionales";

/** Ejercicios 10 a 17 de la Práctica 6 */
export const guiaP6b: Ejercicio[] = [
  {
    grupo: G, ref: "P6 Ej 10", titulo: "Lista de espera de clientes",
    enunciado: "Cuando un cliente entra al local se registra su DNI y se le da un número (el siguiente al último entregado). Queda esperando hasta que lo llaman por su número y sale de la lista. (a) Definir una estructura apropiada para la lista de espera. (b) Implementar RecibirCliente: recibe el DNI y la lista, le asigna número al cliente y devuelve la lista actualizada. (c) Implementar AtenderCliente: recibe la lista, devuelve número y DNI del cliente a atender y la lista actualizada (el atendido se elimina). (d) Programa que simule la atención: primero llegan todos los clientes (hasta el DNI 0, que no se procesa) y después se los atiende de a uno.",
    pista: "Es una cola: el que llega se agrega al final y se atiende al primero. Con un puntero al último, agregar es O(1). Guardá el último número entregado junto con la lista para saber cuál sigue.",
    sol: `program ListaDeEspera;
type
  lista = ^nodo;
  nodo = record
    nro : integer;
    dni : longint;
    sig : lista;
  end;
  { a) la lista de espera: primero, último y el último número entregado }
  espera = record
    pri, ult : lista;
    ultNro : integer;
  end;

procedure inicializar(var e : espera);
begin
  e.pri := nil;
  e.ult := nil;
  e.ultNro := 0;
end;

{ b) agrega al final con el número siguiente }
procedure RecibirCliente(dni : longint; var e : espera);
var nue : lista;
begin
  e.ultNro := e.ultNro + 1;
  new(nue);
  nue^.nro := e.ultNro;
  nue^.dni := dni;
  nue^.sig := nil;
  if (e.pri = nil) then
    e.pri := nue
  else
    e.ult^.sig := nue;
  e.ult := nue;
end;

{ c) precondición: la lista no está vacía }
procedure AtenderCliente(var e : espera; var nro : integer; var dni : longint);
var aux : lista;
begin
  aux := e.pri;
  nro := aux^.nro;
  dni := aux^.dni;
  e.pri := e.pri^.sig;
  if (e.pri = nil) then e.ult := nil;
  dispose(aux);
end;

{ d) simulación }
var
  e : espera;
  dni : longint;
  nro : integer;
begin
  inicializar(e);
  write('DNI del cliente (0 para terminar): ');
  readln(dni);
  while (dni <> 0) do begin
    RecibirCliente(dni, e);
    writeln('El cliente ', dni, ' tiene el número ', e.ultNro);
    write('DNI del cliente (0 para terminar): ');
    readln(dni);
  end;
  writeln;
  while (e.pri <> nil) do begin
    AtenderCliente(e, nro, dni);
    writeln('Atendiendo al número ', nro, ' (DNI ', dni, ')');
  end;
end.`,
    entrada: "30111222\n28999000\n41555666\n0",
  },
  {
    grupo: G, ref: "P6 Ej 11", titulo: "Premio Joaquín V. González",
    enunciado: "Hay que elegir los 10 egresados con mejor promedio. De cada egresado se conoce número de alumno, apellido y promedio. (a) Leer los egresados hasta el código 0, que no se procesa. (b) Informar apellido y número de alumno de los que reciben el premio, ordenados por promedio de mayor a menor.",
    pista: "Insertá cada egresado en una lista ordenada de mayor a menor promedio. Después alcanza con recorrer los primeros 10 nodos (o menos, si hay menos egresados).",
    sol: `program PremioJVG;
const
  CANT_PREMIOS = 10;
type
  str20 = string[20];
  egresado = record
    numero : longint;
    apellido : str20;
    promedio : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : egresado;
    sig : lista;
  end;

procedure leerEgresado(var e : egresado);
begin
  write('Número de alumno: ');
  readln(e.numero);
  if (e.numero <> 0) then begin
    write('Apellido: ');
    readln(e.apellido);
    write('Promedio: ');
    readln(e.promedio);
  end;
end;

{ inserta ordenado por promedio, de mayor a menor }
procedure insertarOrdenado(var L : lista; e : egresado);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := e;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.promedio >= e.promedio) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then
    L := nue
  else
    ant^.sig := nue;
  nue^.sig := act;
end;

procedure cargarLista(var L : lista);       { a }
var e : egresado;
begin
  L := nil;
  leerEgresado(e);
  while (e.numero <> 0) do begin
    insertarOrdenado(L, e);
    leerEgresado(e);
  end;
end;

procedure informarPremiados(L : lista);    { b }
var i : integer;
begin
  i := 0;
  while (L <> nil) and (i < CANT_PREMIOS) do begin
    i := i + 1;
    writeln(i, '. ', L^.dato.apellido, ' (alumno ', L^.dato.numero, ') promedio ', L^.dato.promedio:0:2);
    L := L^.sig;
  end;
end;

var
  L : lista;
begin
  cargarLista(L);
  writeln;
  writeln('Reciben el premio:');
  informarPremiados(L);
end.`,
    entrada: "1001\nPerez\n8.5\n1002\nGomez\n9.75\n1003\nDiaz\n7.2\n1004\nSosa\n9.1\n1005\nRuiz\n6.8\n1006\nLopez\n8.9\n1007\nRios\n9.4\n1008\nVera\n7.9\n1009\nPaz\n8.1\n1010\nMolina\n9.9\n1011\nAcosta\n6.5\n1012\nBenitez\n8.7\n0",
  },
  {
    grupo: G, ref: "P6 Ej 12", titulo: "Dispositivos Android",
    enunciado: "Se dispone de la información de todos los dispositivos que tienen instalados los juegos: versión de Android, tamaño de pantalla (pulgadas) y memoria RAM (GB). La información está ordenada por versión de Android. Informar: (a) la cantidad de dispositivos para cada versión de Android; (b) la cantidad de dispositivos con más de 3 GB de memoria y pantalla de a lo sumo 5 pulgadas; (c) el tamaño promedio de las pantallas de todos los dispositivos.",
    pista: "Como la lista está ordenada por versión, el inciso (a) es un corte de control: mientras la versión sea la misma, contás. (b) y (c) se resuelven en el mismo recorrido.",
    sol: `program DispositivosAndroid;
type
  dispositivo = record
    version : integer;
    pantalla : real;
    ram : integer;
  end;
  lista = ^nodo;
  nodo = record
    dato : dispositivo;
    sig : lista;
  end;

{ ---- se dispone: carga la lista en el orden en que llega (ya viene
       ordenada por versión). Lee "versión pantalla ram" por línea,
       hasta la versión -1 ---- }
procedure cargarLista(var L : lista);
var
  d : dispositivo;
  nue, ult : lista;
begin
  L := nil;
  ult := nil;
  read(d.version);
  while (d.version <> -1) do begin
    readln(d.pantalla, d.ram);
    new(nue);
    nue^.dato := d;
    nue^.sig := nil;
    if (L = nil) then L := nue else ult^.sig := nue;
    ult := nue;
    read(d.version);
  end;
end;

procedure procesar(L : lista);
var
  versionAct, cantVersion, cantB, total : integer;
  sumaPantallas : real;
begin
  cantB := 0;
  total := 0;
  sumaPantallas := 0;
  while (L <> nil) do begin
    versionAct := L^.dato.version;
    cantVersion := 0;
    while (L <> nil) and (L^.dato.version = versionAct) do begin
      cantVersion := cantVersion + 1;
      if (L^.dato.ram > 3) and (L^.dato.pantalla <= 5) then     { b }
        cantB := cantB + 1;
      sumaPantallas := sumaPantallas + L^.dato.pantalla;        { c }
      total := total + 1;
      L := L^.sig;
    end;
    writeln('Android ', versionAct, ': ', cantVersion, ' dispositivos');   { a }
  end;
  writeln('Más de 3 GB y pantalla de a lo sumo 5 pulgadas: ', cantB);
  if (total > 0) then
    writeln('Tamaño promedio de pantalla: ', sumaPantallas / total:0:2, ' pulgadas');
end;

var
  L : lista;
begin
  cargarLista(L);
  procesar(L);
end.`,
    entrada: "11 5.0 4\n11 6.1 3\n12 4.7 6\n12 5.5 8\n12 5.0 4\n13 6.7 12\n14 4.9 2\n-1",
  },
  {
    grupo: G, ref: "P6 Ej 13", titulo: "Portal de Revistas",
    enunciado: "Se dispone de la información de los 3600 usuarios del portal: email, rol (1: Editor; 2: Autor; 3: Revisor; 4: Lector), revista en la que participa y cantidad de días desde el último acceso. (a) Imprimir el nombre de usuario y los días desde el último acceso de todos los usuarios de la revista Económica, ordenado por días de forma ascendente. (b) Informar la cantidad de usuarios por cada rol para todas las revistas. (c) Informar los emails de los dos usuarios que hace más tiempo que no ingresan.",
    pista: "Al leer cada usuario: si es de Económica lo insertás ordenado por días en una lista; sumás 1 en un vector contador indexado por rol; y actualizás los dos máximos de días. Así todo se hace en una sola pasada.",
    sol: `program PortalRevistas;
const
  CANT_USUARIOS = 3600;
type
  str40 = string[40];
  rangoRol = 1..4;
  usuario = record
    email : str40;
    rol : rangoRol;
    revista : str40;
    dias : integer;
  end;
  lista = ^nodo;
  nodo = record
    dato : usuario;
    sig : lista;
  end;
  vRoles = array [rangoRol] of integer;

procedure leerUsuario(var u : usuario);
begin
  readln(u.email);
  readln(u.rol);
  readln(u.revista);
  readln(u.dias);
end;

{ inserta ordenado por días, de menor a mayor }
procedure insertarOrdenado(var L : lista; u : usuario);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := u;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.dias < u.dias) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

procedure actualizarMaximos(u : usuario; var max1, max2 : integer; var mail1, mail2 : str40);
begin
  if (u.dias > max1) then begin
    max2 := max1; mail2 := mail1;
    max1 := u.dias; mail1 := u.email;
  end
  else if (u.dias > max2) then begin
    max2 := u.dias; mail2 := u.email;
  end;
end;

procedure imprimir(L : lista);
begin
  while (L <> nil) do begin
    writeln(L^.dato.email, ' - ', L^.dato.dias, ' días');
    L := L^.sig;
  end;
end;

var
  L : lista;
  u : usuario;
  roles : vRoles;
  i : integer;
  r : rangoRol;
  max1, max2 : integer;
  mail1, mail2 : str40;
begin
  L := nil;
  for r := 1 to 4 do roles[r] := 0;
  max1 := -1; max2 := -1;
  mail1 := ''; mail2 := '';
  for i := 1 to CANT_USUARIOS do begin
    leerUsuario(u);
    if (u.revista = 'Economica') then insertarOrdenado(L, u);
    roles[u.rol] := roles[u.rol] + 1;
    actualizarMaximos(u, max1, max2, mail1, mail2);
  end;
  writeln('a) Usuarios de la revista Económica:');
  imprimir(L);
  writeln('b) Editores: ', roles[1], '  Autores: ', roles[2],
          '  Revisores: ', roles[3], '  Lectores: ', roles[4]);
  writeln('c) Hace más tiempo que no ingresan: ', mail1, ' y ', mail2);
end.`,
  },
  {
    grupo: G, ref: "P6 Ej 14", titulo: "Viajes de 1300 alumnos",
    enunciado: "Se registran todos los viajes de 1300 alumnos durante marzo. De cada viaje: código de alumno (1 a 1300), día del mes, Facultad y medio de transporte (1. colectivo urbano; 2. colectivo interurbano; 3. tren universitario; 4. tren Roca; 5. bicicleta). Un alumno puede usar más de un medio en un mismo día. Además se cuenta con una tabla con el precio de cada tipo de viaje. Leer los viajes (hasta el código -1, que no se procesa) y almacenarlos en una estructura apropiada. Después informar: (a) la cantidad de alumnos que realizan más de 6 viajes por día; (b) la cantidad de alumnos que gastan más de $80 por día; (c) los dos medios de transporte más utilizados; (d) la cantidad de alumnos que combinan bicicleta con algún otro medio.",
    pista: "Un vector de 1300 listas (una por alumno) con los viajes insertados ordenados por día. Así, al recorrer la lista de un alumno hacés corte de control por día para contar viajes y sumar el gasto de ese día. La tabla de precios es un vector indexado por medio.",
    sol: `{ (a) y (b) se interpretan como "en algún día del mes" }
program ViajesAlumnos;
const
  CANT_ALU = 1300;
  MAX_VIAJES = 6;
  MAX_GASTO = 80;
type
  str30 = string[30];
  rangoMedio = 1..5;
  viaje = record
    dia : integer;
    facultad : str30;
    medio : rangoMedio;
  end;
  lista = ^nodo;
  nodo = record
    dato : viaje;
    sig : lista;
  end;
  vAlumnos = array [1..CANT_ALU] of lista;
  vPrecios = array [rangoMedio] of real;
  vContador = array [rangoMedio] of integer;

{ ---- se dispone: la tabla de precios (5 precios en una línea) ---- }
procedure cargarPrecios(var p : vPrecios);
var m : rangoMedio;
begin
  for m := 1 to 5 do read(p[m]);
  readln;
end;

procedure leerViaje(var cod : integer; var v : viaje);
begin
  readln(cod);
  if (cod <> -1) then begin
    readln(v.dia);
    readln(v.facultad);
    readln(v.medio);
  end;
end;

procedure insertarPorDia(var L : lista; v : viaje);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := v;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.dia <= v.dia) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

procedure cargarViajes(var alu : vAlumnos);
var
  i, cod : integer;
  v : viaje;
begin
  for i := 1 to CANT_ALU do alu[i] := nil;
  leerViaje(cod, v);
  while (cod <> -1) do begin
    insertarPorDia(alu[cod], v);
    leerViaje(cod, v);
  end;
end;

{ recorre los viajes de un alumno con corte de control por día }
procedure procesarAlumno(L : lista; precios : vPrecios; var usos : vContador;
                         var muchosViajes, muchoGasto, combina : boolean);
var
  diaAct, cantDia : integer;
  gastoDia : real;
  usaBici, usaOtro : boolean;
begin
  muchosViajes := false;
  muchoGasto := false;
  usaBici := false;
  usaOtro := false;
  while (L <> nil) do begin
    diaAct := L^.dato.dia;
    cantDia := 0;
    gastoDia := 0;
    while (L <> nil) and (L^.dato.dia = diaAct) do begin
      cantDia := cantDia + 1;
      gastoDia := gastoDia + precios[L^.dato.medio];
      usos[L^.dato.medio] := usos[L^.dato.medio] + 1;
      if (L^.dato.medio = 5) then usaBici := true else usaOtro := true;
      L := L^.sig;
    end;
    if (cantDia > MAX_VIAJES) then muchosViajes := true;
    if (gastoDia > MAX_GASTO) then muchoGasto := true;
  end;
  combina := usaBici and usaOtro;
end;

procedure dosMasUsados(usos : vContador; var m1, m2 : integer);
var
  m : rangoMedio;
  max1, max2 : integer;
begin
  max1 := -1; max2 := -1; m1 := 0; m2 := 0;
  for m := 1 to 5 do
    if (usos[m] > max1) then begin
      max2 := max1; m2 := m1;
      max1 := usos[m]; m1 := m;
    end
    else if (usos[m] > max2) then begin
      max2 := usos[m]; m2 := m;
    end;
end;

var
  alu : vAlumnos;
  precios : vPrecios;
  usos : vContador;
  i, cantA, cantB, cantD, m1, m2 : integer;
  m : rangoMedio;
  muchosViajes, muchoGasto, combina : boolean;
begin
  cargarPrecios(precios);
  cargarViajes(alu);
  for m := 1 to 5 do usos[m] := 0;
  cantA := 0; cantB := 0; cantD := 0;
  for i := 1 to CANT_ALU do begin
    procesarAlumno(alu[i], precios, usos, muchosViajes, muchoGasto, combina);
    if muchosViajes then cantA := cantA + 1;
    if muchoGasto then cantB := cantB + 1;
    if combina then cantD := cantD + 1;
  end;
  dosMasUsados(usos, m1, m2);
  writeln('a) Alumnos con más de ', MAX_VIAJES, ' viajes en un día: ', cantA);
  writeln('b) Alumnos que gastan más de $', MAX_GASTO, ' en un día: ', cantB);
  writeln('c) Medios más usados: ', m1, ' y ', m2);
  writeln('d) Alumnos que combinan bicicleta con otro medio: ', cantD);
end.`,
    entrada: "15 25 20 30 0\n1\n3\nInformatica\n1\n1\n3\nInformatica\n5\n1\n3\nInformatica\n1\n7\n4\nMedicina\n4\n7\n4\nMedicina\n4\n7\n4\nMedicina\n3\n7\n4\nMedicina\n4\n7\n4\nMedicina\n1\n7\n4\nMedicina\n2\n7\n4\nMedicina\n1\n7\n5\nMedicina\n1\n1300\n10\nIngenieria\n5\n1300\n10\nIngenieria\n5\n-1",
  },
  {
    grupo: GA, ref: "P6 Ad 15", titulo: "Turnos de CADP según la nota de EPA",
    enunciado: "Se dispone de una lista con todos los alumnos que cursaron EPA (DNI, apellido, nombre y nota). Distribuirlos en turnos: los que obtuvieron al menos 8 van a los turnos 1 ó 4; los que obtuvieron entre 5 y 8 van a los turnos 2, 3 ó 5; los que no llegaron a 5 no tienen turno. Al finalizar, imprimir la lista de alumnos de cada turno. La distribución debe ser lo más equitativa posible.",
    pista: "Usá un vector de 5 listas (una por turno). Para que sea equitativo, repartí de forma circular: los de nota alta van alternando 1, 4, 1, 4…; los de nota media 2, 3, 5, 2, 3, 5…",
    sol: `program TurnosCADP;
type
  str20 = string[20];
  alumno = record
    dni : longint;
    apellido, nombre : str20;
    nota : integer;
  end;
  lista = ^nodo;
  nodo = record
    dato : alumno;
    sig : lista;
  end;
  rangoTurno = 1..5;
  vTurnos = array [rangoTurno] of lista;

procedure agregarAdelante(var L : lista; a : alumno);
var nue : lista;
begin
  new(nue);
  nue^.dato := a;
  nue^.sig := L;
  L := nue;
end;

{ ---- se dispone: la lista de alumnos de EPA (lee hasta el DNI 0) ---- }
procedure cargarLista(var L : lista);
var a : alumno;
begin
  L := nil;
  readln(a.dni);
  while (a.dni <> 0) do begin
    readln(a.apellido);
    readln(a.nombre);
    readln(a.nota);
    agregarAdelante(L, a);
    readln(a.dni);
  end;
end;

procedure agregarAtras(var pri, ult : lista; a : alumno);
var nue : lista;
begin
  new(nue);
  nue^.dato := a;
  nue^.sig := nil;
  if (pri = nil) then pri := nue else ult^.sig := nue;
  ult := nue;
end;

procedure distribuir(L : lista; var turnos : vTurnos);
var
  ult : vTurnos;                  { último nodo de cada turno }
  t : rangoTurno;
  iAlto, iMedio : integer;        { a qué turno le toca el próximo }
begin
  for t := 1 to 5 do begin
    turnos[t] := nil;
    ult[t] := nil;
  end;
  iAlto := 0;
  iMedio := 0;
  while (L <> nil) do begin
    if (L^.dato.nota >= 8) then begin
      if (iAlto = 0) then t := 1 else t := 4;
      iAlto := (iAlto + 1) mod 2;
      agregarAtras(turnos[t], ult[t], L^.dato);
    end
    else if (L^.dato.nota >= 5) then begin
      case iMedio of
        0: t := 2;
        1: t := 3;
        2: t := 5;
      end;
      iMedio := (iMedio + 1) mod 3;
      agregarAtras(turnos[t], ult[t], L^.dato);
    end;
    L := L^.sig;
  end;
end;

procedure imprimirTurnos(turnos : vTurnos);
var
  t : rangoTurno;
  L : lista;
begin
  for t := 1 to 5 do begin
    writeln('Turno ', t, ':');
    L := turnos[t];
    while (L <> nil) do begin
      writeln('  ', L^.dato.apellido, ', ', L^.dato.nombre, ' (DNI ', L^.dato.dni, ', nota ', L^.dato.nota, ')');
      L := L^.sig;
    end;
  end;
end;

var
  L : lista;
  turnos : vTurnos;
begin
  cargarLista(L);
  distribuir(L, turnos);
  imprimirTurnos(turnos);
end.`,
    entrada: "40111222\nPerez\nAna\n9\n40222333\nGomez\nLuis\n6\n40333444\nDiaz\nSofia\n4\n40444555\nSosa\nJuan\n8\n40555666\nRuiz\nMara\n7\n40666777\nLopez\nIvan\n5\n40777888\nRios\nEma\n10\n40888999\nVera\nTomas\n6\n0",
  },
  {
    grupo: GA, ref: "P6 Ad 16", titulo: "Competencia mundial de corredores",
    enunciado: "La app registra de cada corredor: nombre y apellido, distancia recorrida (km), tiempo (minutos), país y ciudad de partida, y ciudad donde terminó. Leer y almacenar toda la información hasta la distancia -1 (que no se procesa). Después informar: la cantidad total de corredores, la distancia total y el tiempo total; la ciudad que convocó más corredores y los km recorridos por los corredores de esa ciudad; la distancia promedio de los corredores de Brasil; la cantidad de corredores que partieron de una ciudad y terminaron en otra; y el paso promedio (minutos por km) de los corredores de Boston.",
    pista: "La lista de corredores no está ordenada por ciudad, así que para saber cuántos salieron de cada ciudad armá una lista auxiliar de ciudades (nombre, cantidad, km): buscás la ciudad y, si no está, la agregás. El resto se resuelve en el mismo recorrido.",
    sol: `program Corredores;
type
  str30 = string[30];
  corredor = record
    nombre : str30;
    distancia, tiempo : real;
    pais, ciudadInicio, ciudadFin : str30;
  end;
  lista = ^nodo;
  nodo = record
    dato : corredor;
    sig : lista;
  end;
  listaCiudades = ^nodoCiudad;
  nodoCiudad = record
    nombre : str30;
    cant : integer;
    km : real;
    sig : listaCiudades;
  end;

procedure leerCorredor(var c : corredor);
begin
  readln(c.distancia);
  if (c.distancia <> -1) then begin
    readln(c.nombre);
    readln(c.tiempo);
    readln(c.pais);
    readln(c.ciudadInicio);
    readln(c.ciudadFin);
  end;
end;

procedure agregarAdelante(var L : lista; c : corredor);
var nue : lista;
begin
  new(nue);
  nue^.dato := c;
  nue^.sig := L;
  L := nue;
end;

procedure cargarLista(var L : lista);
var c : corredor;
begin
  L := nil;
  leerCorredor(c);
  while (c.distancia <> -1) do begin
    agregarAdelante(L, c);
    leerCorredor(c);
  end;
end;

{ suma un corredor a su ciudad; si la ciudad no está, la agrega }
procedure sumarCiudad(var LC : listaCiudades; nombre : str30; km : real);
var act : listaCiudades;
begin
  act := LC;
  while (act <> nil) and (act^.nombre <> nombre) do
    act := act^.sig;
  if (act = nil) then begin
    new(act);
    act^.nombre := nombre;
    act^.cant := 0;
    act^.km := 0;
    act^.sig := LC;
    LC := act;
  end;
  act^.cant := act^.cant + 1;
  act^.km := act^.km + km;
end;

procedure ciudadMaxima(LC : listaCiudades; var nombre : str30; var km : real);
var max : integer;
begin
  max := -1;
  nombre := '';
  km := 0;
  while (LC <> nil) do begin
    if (LC^.cant > max) then begin
      max := LC^.cant;
      nombre := LC^.nombre;
      km := LC^.km;
    end;
    LC := LC^.sig;
  end;
end;

procedure procesar(L : lista);
var
  LC : listaCiudades;
  cant, cantBrasil, cantBoston, cantDistinta : integer;
  distTotal, tiempoTotal, distBrasil, pasoBoston, kmMax : real;
  ciudadMax : str30;
begin
  LC := nil;
  cant := 0; cantBrasil := 0; cantBoston := 0; cantDistinta := 0;
  distTotal := 0; tiempoTotal := 0; distBrasil := 0; pasoBoston := 0;
  while (L <> nil) do begin
    cant := cant + 1;
    distTotal := distTotal + L^.dato.distancia;
    tiempoTotal := tiempoTotal + L^.dato.tiempo;
    sumarCiudad(LC, L^.dato.ciudadInicio, L^.dato.distancia);
    if (L^.dato.pais = 'Brasil') then begin
      cantBrasil := cantBrasil + 1;
      distBrasil := distBrasil + L^.dato.distancia;
    end;
    if (L^.dato.ciudadInicio <> L^.dato.ciudadFin) then
      cantDistinta := cantDistinta + 1;
    if (L^.dato.ciudadInicio = 'Boston') then begin
      cantBoston := cantBoston + 1;
      pasoBoston := pasoBoston + L^.dato.tiempo / L^.dato.distancia;
    end;
    L := L^.sig;
  end;
  ciudadMaxima(LC, ciudadMax, kmMax);
  writeln('Corredores: ', cant, '  Distancia total: ', distTotal:0:2,
          ' km  Tiempo total: ', tiempoTotal:0:2, ' min');
  writeln('Ciudad con más corredores: ', ciudadMax, ' (', kmMax:0:2, ' km en total)');
  if (cantBrasil > 0) then
    writeln('Distancia promedio de Brasil: ', distBrasil / cantBrasil:0:2, ' km');
  writeln('Terminaron en otra ciudad: ', cantDistinta);
  if (cantBoston > 0) then
    writeln('Paso promedio en Boston: ', pasoBoston / cantBoston:0:2, ' min/km');
end;

var
  L : lista;
begin
  cargarLista(L);
  procesar(L);
end.`,
    entrada: "10\nAna Perez\n55\nArgentina\nLa Plata\nLa Plata\n21\nJoao Silva\n120\nBrasil\nSao Paulo\nSao Paulo\n8\nMike Ross\n40\nEstados Unidos\nBoston\nCambridge\n12\nLuis Diaz\n66\nArgentina\nLa Plata\nEnsenada\n5\nAmy Lee\n30\nEstados Unidos\nBoston\nBoston\n15\nPedro Souza\n80\nBrasil\nRio\nRio\n42\nJohn Kelley\n200\nEstados Unidos\nBoston\nBoston\n-1",
  },
  {
    grupo: GA, ref: "P6 Ad 17 · Act 1", titulo: "Inversiones, con listas",
    enunciado: "Continuando con la Actividad 1 de la guía adicional de la Práctica 1 (inversiones): guardar los datos leídos en una lista y después recorrerla para resolver cada inciso, reutilizando los módulos ya implementados. En lo posible, recorrer la lista una sola vez.",
    pista: "Igual que con vectores, pero la carga agrega cada empresa al final de la lista (para conservar el orden) y el recorrido es un while L <> nil.",
    sol: `program inversionesLista;
type
  empresa = record
    codigo, cantInv : integer;
    total : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : empresa;
    sig : lista;
  end;

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

procedure agregarAtras(var pri, ult : lista; e : empresa);
var nue : lista;
begin
  new(nue);
  nue^.dato := e;
  nue^.sig := nil;
  if (pri = nil) then pri := nue else ult^.sig := nue;
  ult := nue;
end;

procedure cargar(var L : lista);
var
  e : empresa;
  ult : lista;
begin
  L := nil;
  ult := nil;
  repeat                                  { la empresa 100 se procesa }
    leerEmpresa(e);
    agregarAtras(L, ult, e);
  until (e.codigo = 100);
end;

procedure procesar(L : lista);
var
  codMax, cantMas50 : integer;
  max : real;
begin
  max := -1; codMax := 0; cantMas50 := 0;
  while (L <> nil) do begin
    if (L^.dato.cantInv > 0) then
      writeln('Empresa ', L^.dato.codigo, ' monto promedio ', L^.dato.total / L^.dato.cantInv:0:2);
    if (L^.dato.total > max) then begin
      max := L^.dato.total;
      codMax := L^.dato.codigo;
    end;
    if (L^.dato.total > 50000) then cantMas50 := cantMas50 + 1;
    L := L^.sig;
  end;
  writeln('La empresa ', codMax, ' es la que más dinero tiene invertido ($', max:0:2, ')');
  writeln('Hay ', cantMas50, ' empresas con inversiones por más de $50000');
end;

var
  L : lista;
begin
  cargar(L);
  procesar(L);
end.`,
    entrada: "33\n4\n33200 56930 24500.85 10000\n41\n3\n102000.22 53000 12000\n100\n1\n84000.34",
  },
  {
    grupo: GA, ref: "P6 Ad 17 · Act 2", titulo: "Autoevaluaciones, con listas",
    enunciado: "Continuando con la Actividad 2 (autoevaluaciones): guardar los alumnos leídos en una lista y después recorrerla una sola vez para resolver todos los incisos, reutilizando los módulos anteriores.",
    pista: "El registro alumno sigue teniendo su vector de 5 notas; lo que cambia es dónde se guardan los alumnos. analizar y actualizarDosMaximos se reutilizan tal cual.",
    sol: `program autoevaluacionesLista;
const
  NOTA_PRESENTE = 4;
  MIN_PRESENTES = 4;
type
  vNotas = array [1..5] of integer;
  alumno = record
    legajo : longint;
    condicion : char;
    notas : vNotas;
  end;
  lista = ^nodo;
  nodo = record
    dato : alumno;
    sig : lista;
  end;

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

procedure agregarAtras(var pri, ult : lista; a : alumno);
var nue : lista;
begin
  new(nue);
  nue^.dato := a;
  nue^.sig := nil;
  if (pri = nil) then pri := nue else ult^.sig := nue;
  ult := nue;
end;

procedure cargar(var L : lista);
var
  a : alumno;
  ult : lista;
begin
  L := nil;
  ult := nil;
  leerAlumno(a);
  while (a.legajo <> -1) do begin
    agregarAtras(L, ult, a);
    leerAlumno(a);
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

procedure procesar(L : lista);
var
  presentes, dieces, ceros, suma : integer;
  ingr, ingrOk, recu, recuOk, todas, promAlto, conCero : integer;
  max10a, max10b, max0a, max0b : integer;
  leg10a, leg10b, leg0a, leg0b : longint;
begin
  ingr := 0; ingrOk := 0; recu := 0; recuOk := 0;
  todas := 0; promAlto := 0; conCero := 0;
  max10a := -1; max10b := -1; max0a := -1; max0b := -1;
  leg10a := 0; leg10b := 0; leg0a := 0; leg0b := 0;
  while (L <> nil) do begin
    analizar(L^.dato.notas, presentes, dieces, ceros, suma);
    if (L^.dato.condicion = 'I') then begin
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
    actualizarDosMaximos(dieces, L^.dato.legajo, max10a, max10b, leg10a, leg10b);
    actualizarDosMaximos(ceros, L^.dato.legajo, max0a, max0b, leg0a, leg0b);
    L := L^.sig;
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
  L : lista;
begin
  cargar(L);
  procesar(L);
end.`,
    entrada: "19003\nR\n8 10 6 -1 8\n21020\nI\n4 0 6 10 -1\n22100\nI\n10 10 9 8 10\n-1",
  },
  {
    grupo: GA, ref: "P6 Ad 17 · Act 3", titulo: "Tanques de agua, con listas",
    enunciado: "Continuando con la Actividad 3 (tanques de agua): guardar los tanques leídos en una lista y después recorrerla una sola vez para resolver todos los incisos, reutilizando los módulos anteriores.",
    pista: "El volumen se calcula al leer y queda guardado en el nodo. Como el orden no importa para ningún inciso, podés agregar adelante.",
    sol: `program tanquesLista;
type
  tanque = record
    tipo : char;
    alto, volumen : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : tanque;
    sig : lista;
  end;

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

procedure agregarAdelante(var L : lista; t : tanque);
var nue : lista;
begin
  new(nue);
  nue^.dato := t;
  nue^.sig := L;
  L := nue;
end;

procedure cargar(var L : lista);
var t : tanque;
begin
  L := nil;
  leerTanque(t);
  while (t.tipo <> 'Z') do begin
    agregarAdelante(L, t);
    leerTanque(t);
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

procedure procesar(L : lista);
var
  cantC, cantR, bajos, chicos : integer;
  max1, max2, sumaC, sumaR : real;
begin
  max1 := -1; max2 := -1;
  sumaC := 0; sumaR := 0; cantC := 0; cantR := 0;
  bajos := 0; chicos := 0;
  while (L <> nil) do begin
    if (L^.dato.tipo = 'R') then begin
      sumaR := sumaR + L^.dato.volumen; cantR := cantR + 1;
    end
    else begin
      sumaC := sumaC + L^.dato.volumen; cantC := cantC + 1;
    end;
    actualizarMaximos(L^.dato.volumen, max1, max2);
    if (L^.dato.alto < 1.40) then bajos := bajos + 1;
    if (L^.dato.volumen < 800) then chicos := chicos + 1;
    L := L^.sig;
  end;
  writeln('Volumen de los dos mayores: ', max1:0:2, ' y ', max2:0:2);
  if (cantC > 0) then writeln('Promedio cilíndricos: ', sumaC / cantC:0:2);
  if (cantR > 0) then writeln('Promedio rectangulares: ', sumaR / cantR:0:2);
  writeln('Tanques de menos de 1.40 m de alto: ', bajos);
  writeln('Tanques de menos de 800 m3: ', chicos);
end;

var
  L : lista;
begin
  cargar(L);
  procesar(L);
end.`,
    entrada: "R\n2 3 1.5\nC\n1 2\nR\n10 10 9\nZ",
  },
];

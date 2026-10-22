import type { Ejercicio } from "../types";

const G = "Práctica 7 · Repaso";

/** Ejercicios 1 a 8 de la Práctica 7 */
export const guiaP7a: Ejercicio[] = [
  {
    grupo: G, ref: "P7 Ej 1", titulo: "Casting de actores extras",
    enunciado: "Leer y almacenar las personas que se presentan al casting. De cada persona: DNI, apellido y nombre, edad y código de género de actuación preferido (1: drama, 2: romántico, 3: acción, 4: suspenso, 5: terror). La lectura termina con la persona de DNI 33555444, que se procesa. Después: (a) informar la cantidad de personas cuyo DNI tiene más dígitos pares que impares; (b) informar los dos códigos de género más elegidos; (c) implementar un módulo que reciba un DNI, lo busque y lo elimine de la estructura (puede no existir) e invocarlo desde el programa principal.",
    pista: "Lista de personas cargada con repeat (la última se procesa). (a) y (b) salen en un recorrido con un vector contador por género. Para eliminar: ant/act y avanzar mientras no lo encuentres; ojo con el caso del primer nodo.",
    sol: `program Casting;
const
  DNI_FIN = 33555444;
type
  str40 = string[40];
  rangoGenero = 1..5;
  persona = record
    dni : longint;
    apeNom : str40;
    edad : integer;
    genero : rangoGenero;
  end;
  lista = ^nodo;
  nodo = record
    dato : persona;
    sig : lista;
  end;
  vGeneros = array [rangoGenero] of integer;

procedure leerPersona(var p : persona);
begin
  write('DNI: '); readln(p.dni);
  write('Apellido y nombre: '); readln(p.apeNom);
  write('Edad: '); readln(p.edad);
  write('Género (1..5): '); readln(p.genero);
end;

procedure agregarAdelante(var L : lista; p : persona);
var nue : lista;
begin
  new(nue);
  nue^.dato := p;
  nue^.sig := L;
  L := nue;
end;

procedure cargarLista(var L : lista);
var p : persona;
begin
  L := nil;
  repeat
    leerPersona(p);
    agregarAdelante(L, p);
  until (p.dni = DNI_FIN);
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

procedure dosMaximos(v : vGeneros; var g1, g2 : integer);
var
  g : rangoGenero;
  max1, max2 : integer;
begin
  max1 := -1; max2 := -1; g1 := 0; g2 := 0;
  for g := 1 to 5 do
    if (v[g] > max1) then begin
      max2 := max1; g2 := g1;
      max1 := v[g]; g1 := g;
    end
    else if (v[g] > max2) then begin
      max2 := v[g]; g2 := g;
    end;
end;

procedure procesar(L : lista);
var
  generos : vGeneros;
  g : rangoGenero;
  cantPares, g1, g2 : integer;
begin
  for g := 1 to 5 do generos[g] := 0;
  cantPares := 0;
  while (L <> nil) do begin
    if masParesQueImpares(L^.dato.dni) then cantPares := cantPares + 1;
    generos[L^.dato.genero] := generos[L^.dato.genero] + 1;
    L := L^.sig;
  end;
  dosMaximos(generos, g1, g2);
  writeln('a) DNI con más dígitos pares que impares: ', cantPares);
  writeln('b) Géneros más elegidos: ', g1, ' y ', g2);
end;

{ c) elimina la persona con ese DNI, si existe }
procedure eliminar(var L : lista; dni : longint; var ok : boolean);
var ant, act : lista;
begin
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.dni <> dni) do begin
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

var
  L : lista;
  dni : longint;
  ok : boolean;
begin
  cargarLista(L);
  writeln;
  procesar(L);
  write('DNI a eliminar: ');
  readln(dni);
  eliminar(L, dni, ok);
  if ok then writeln('c) Se eliminó la persona con DNI ', dni)
  else writeln('c) No hay ninguna persona con DNI ', dni);
end.`,
    entrada: "40222444\nPerez Ana\n25\n3\n35111333\nGomez Luis\n31\n1\n28468200\nDiaz Sofia\n40\n3\n33555444\nRuiz Mara\n22\n5\n35111333",
  },
  {
    grupo: G, ref: "P7 Ej 2", titulo: "Aseguradora automotriz",
    enunciado: "Leer y almacenar los clientes de una aseguradora: código de cliente, DNI, apellido, nombre, código de póliza (1..6) y monto básico mensual. La lectura termina con el cliente de código 1122, que se procesa. La empresa dispone de una tabla con el monto adicional que se paga según la póliza. Después: (a) informar de cada cliente DNI, apellido, nombre y el monto completo que paga por mes (básico + adicional); (b) informar apellido y nombre de los clientes cuyo DNI tiene al menos dos dígitos 9; (c) implementar un módulo que reciba un código de cliente, lo busque (seguro existe) y lo elimine.",
    pista: "La tabla es un vector de 6 reales indexado por póliza: el adicional de un cliente es tabla[c.poliza]. Como en (c) el cliente seguro existe, el while de búsqueda solo compara el código (no hace falta preguntar por nil).",
    sol: `program Aseguradora;
const
  COD_FIN = 1122;
type
  str20 = string[20];
  rangoPoliza = 1..6;
  cliente = record
    codigo : integer;
    dni : longint;
    apellido, nombre : str20;
    poliza : rangoPoliza;
    basico : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : cliente;
    sig : lista;
  end;
  vTabla = array [rangoPoliza] of real;

{ ---- se dispone: la tabla de adicionales (6 montos en una línea) ---- }
procedure cargarTabla(var t : vTabla);
var p : rangoPoliza;
begin
  for p := 1 to 6 do read(t[p]);
  readln;
end;

procedure leerCliente(var c : cliente);
begin
  readln(c.codigo);
  readln(c.dni);
  readln(c.apellido);
  readln(c.nombre);
  readln(c.poliza);
  readln(c.basico);
end;

procedure agregarAtras(var pri, ult : lista; c : cliente);
var nue : lista;
begin
  new(nue);
  nue^.dato := c;
  nue^.sig := nil;
  if (pri = nil) then pri := nue else ult^.sig := nue;
  ult := nue;
end;

procedure cargarLista(var L : lista);
var
  c : cliente;
  ult : lista;
begin
  L := nil;
  ult := nil;
  repeat
    leerCliente(c);
    agregarAtras(L, ult, c);
  until (c.codigo = COD_FIN);
end;

function cantNueves(n : longint) : integer;
var cant : integer;
begin
  cant := 0;
  while (n <> 0) do begin
    if (n mod 10 = 9) then cant := cant + 1;
    n := n div 10;
  end;
  cantNueves := cant;
end;

procedure informar(L : lista; t : vTabla);
begin
  writeln('a) Montos mensuales:');
  while (L <> nil) do begin
    writeln('  ', L^.dato.dni, ' ', L^.dato.apellido, ', ', L^.dato.nombre,
            ': $', L^.dato.basico + t[L^.dato.poliza]:0:2);
    if (cantNueves(L^.dato.dni) >= 2) then
      writeln('     b) su DNI tiene al menos dos 9: ', L^.dato.apellido, ' ', L^.dato.nombre);
    L := L^.sig;
  end;
end;

{ c) precondición: el cliente existe }
procedure eliminar(var L : lista; cod : integer);
var ant, act : lista;
begin
  ant := L;
  act := L;
  while (act^.dato.codigo <> cod) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := L^.sig
  else ant^.sig := act^.sig;
  dispose(act);
end;

procedure imprimirCodigos(L : lista);
begin
  while (L <> nil) do begin
    write(L^.dato.codigo, ' ');
    L := L^.sig;
  end;
  writeln;
end;

var
  L : lista;
  tabla : vTabla;
  cod : integer;
begin
  cargarTabla(tabla);
  cargarLista(L);
  informar(L, tabla);
  readln(cod);
  eliminar(L, cod);
  write('c) Eliminado el cliente ', cod, '. Quedan: ');
  imprimirCodigos(L);
end.`,
    entrada: "1000 1500 2200 3000 4100 5000\n10\n29399111\nPerez\nAna\n2\n8000\n25\n30123456\nGomez\nLuis\n5\n9500.5\n1122\n39990001\nDiaz\nSofia\n1\n7000\n25",
  },
  {
    grupo: G, ref: "P7 Ej 3", titulo: "Remisería: viajes de mayo",
    enunciado: "Una remisería dispone de los viajes de mayo de 2020. De cada viaje: número de viaje, código de auto, dirección de origen, dirección de destino y kilómetros recorridos. La información está ordenada por código de auto (un auto puede tener 1 o más viajes). (a) Informar los dos códigos de auto que más kilómetros recorrieron. (b) Generar una lista nueva con los viajes de más de 5 km, ordenada por número de viaje.",
    pista: "Corte de control por código de auto para sumar los km de cada uno y actualizar los dos máximos. En el mismo recorrido, cada viaje de más de 5 km se inserta ordenado (por número) en la lista nueva.",
    sol: `program Remiseria;
type
  str40 = string[40];
  viaje = record
    numero, codAuto : integer;
    origen, destino : str40;
    km : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : viaje;
    sig : lista;
  end;

{ ---- se dispone: la lista ya ordenada por código de auto.
       Lee "número auto km", origen y destino, hasta el número -1 ---- }
procedure cargarLista(var L : lista);
var
  v : viaje;
  nue, ult : lista;
begin
  L := nil;
  ult := nil;
  read(v.numero);
  while (v.numero <> -1) do begin
    readln(v.codAuto, v.km);
    readln(v.origen);
    readln(v.destino);
    new(nue);
    nue^.dato := v;
    nue^.sig := nil;
    if (L = nil) then L := nue else ult^.sig := nue;
    ult := nue;
    read(v.numero);
  end;
end;

procedure insertarPorNumero(var L : lista; v : viaje);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := v;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.numero < v.numero) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

procedure actualizarMaximos(km : real; cod : integer; var max1, max2 : real; var cod1, cod2 : integer);
begin
  if (km > max1) then begin
    max2 := max1; cod2 := cod1;
    max1 := km; cod1 := cod;
  end
  else if (km > max2) then begin
    max2 := km; cod2 := cod;
  end;
end;

procedure procesar(L : lista; var largos : lista);
var
  autoAct, cod1, cod2 : integer;
  kmAuto, max1, max2 : real;
begin
  largos := nil;
  max1 := -1; max2 := -1; cod1 := 0; cod2 := 0;
  while (L <> nil) do begin
    autoAct := L^.dato.codAuto;
    kmAuto := 0;
    while (L <> nil) and (L^.dato.codAuto = autoAct) do begin
      kmAuto := kmAuto + L^.dato.km;
      if (L^.dato.km > 5) then insertarPorNumero(largos, L^.dato);   { b }
      L := L^.sig;
    end;
    actualizarMaximos(kmAuto, autoAct, max1, max2, cod1, cod2);      { a }
  end;
  writeln('a) Autos con más km: ', cod1, ' (', max1:0:1, ' km) y ', cod2, ' (', max2:0:1, ' km)');
end;

procedure imprimir(L : lista);
begin
  while (L <> nil) do begin
    writeln('  Viaje ', L^.dato.numero, ': ', L^.dato.origen, ' -> ', L^.dato.destino, ' (', L^.dato.km:0:1, ' km)');
    L := L^.sig;
  end;
end;

var
  L, largos : lista;
begin
  cargarLista(L);
  procesar(L, largos);
  writeln('b) Viajes de más de 5 km:');
  imprimir(largos);
end.`,
    entrada: "7 1 3.5\n7 y 50\n1 y 60\n2 1 12\n7 y 50\nCity Bell\n9 2 6\n13 y 44\n122 y 80\n4 2 4.2\n1 y 57\n7 y 32\n1 3 20.5\n60 y 120\nEnsenada\n-1",
  },
  {
    grupo: G, ref: "P7 Ej 4", titulo: "Maternidad: aumento de peso",
    enunciado: "Una maternidad dispone de información sobre sus pacientes: nombre, apellido y el peso registrado el primer día de cada semana de embarazo (a lo sumo 42). Informar: (a) para cada embarazada, la semana con mayor aumento de peso; (b) el aumento de peso total de cada embarazada durante el embarazo.",
    pista: "Cada paciente tiene un vector de pesos con su dimensión lógica. El aumento de la semana i es peso[i+1] - peso[i]; el total es el último peso menos el primero. Es un recorrido de la lista con un recorrido del vector adentro.",
    sol: `{ Se toma como aumento de la semana i la diferencia entre el peso del
  comienzo de la semana i+1 y el del comienzo de la semana i. }
program Maternidad;
const
  MAX_SEMANAS = 42;
type
  str20 = string[20];
  vPesos = array [1..MAX_SEMANAS] of real;
  paciente = record
    nombre, apellido : str20;
    pesos : vPesos;
    dimL : integer;
  end;
  lista = ^nodo;
  nodo = record
    dato : paciente;
    sig : lista;
  end;

{ ---- se dispone: la lista de pacientes. Lee nombre, apellido, la
       cantidad de semanas y los pesos; termina con el nombre 'fin' ---- }
procedure cargarLista(var L : lista);
var
  p : paciente;
  nue : lista;
  i : integer;
begin
  L := nil;
  readln(p.nombre);
  while (p.nombre <> 'fin') do begin
    readln(p.apellido);
    read(p.dimL);
    for i := 1 to p.dimL do read(p.pesos[i]);
    readln;
    new(nue);
    nue^.dato := p;
    nue^.sig := L;
    L := nue;
    readln(p.nombre);
  end;
end;

procedure analizar(p : paciente; var semanaMax : integer; var total : real);
var
  i : integer;
  aumento, max : real;
begin
  semanaMax := 0;
  max := -9999;
  for i := 1 to p.dimL - 1 do begin
    aumento := p.pesos[i + 1] - p.pesos[i];
    if (aumento > max) then begin
      max := aumento;
      semanaMax := i;
    end;
  end;
  if (p.dimL > 0) then total := p.pesos[p.dimL] - p.pesos[1]
  else total := 0;
end;

var
  L : lista;
  semana : integer;
  total : real;
begin
  cargarLista(L);
  while (L <> nil) do begin
    analizar(L^.dato, semana, total);
    write(L^.dato.nombre, ' ', L^.dato.apellido, ': ');
    if (semana > 0) then write('mayor aumento en la semana ', semana, ', ')
    else write('una sola semana registrada, ');
    writeln('aumento total ', total:0:1, ' kg');
    L := L^.sig;
  end;
end.`,
    entrada: "Ana\nPerez\n5\n60 60.5 61.8 62 62.4\nSofia\nDiaz\n4\n55 55.2 55.4 57\nfin",
  },
  {
    grupo: G, ref: "P7 Ej 5", titulo: "Flota de 100 camiones",
    enunciado: "Una empresa de transporte dispone de la información de sus 100 camiones: patente, año de fabricación y capacidad (toneladas). Leer y almacenar los viajes: código de viaje, código del camión (1..100), distancia en km, ciudad de destino, año del viaje y DNI del chofer, hasta el código de viaje -1 (que no se procesa). Después: (1) informar la patente del camión con más km recorridos y la del camión con menos; (2) informar la cantidad de viajes hechos en camiones de más de 30,5 toneladas de capacidad y con más de 5 años de antigüedad al momento del viaje; (3) informar los códigos de los viajes cuyo chofer tiene un DNI con sólo dígitos impares. Los códigos de viaje no se repiten.",
    pista: "Los camiones van en un vector [1..100] de registros (acceso directo por código). Los viajes, en una lista. Al recorrer la lista acumulás los km en un vector [1..100] y resolvés (2) y (3); después buscás el máximo y el mínimo en el vector de km.",
    sol: `program Camiones;
const
  CANT_CAMIONES = 100;
type
  str20 = string[20];
  rangoCamion = 1..CANT_CAMIONES;
  camion = record
    patente : str20;
    anio : integer;
    capacidad : real;
  end;
  vCamiones = array [rangoCamion] of camion;
  vKm = array [rangoCamion] of real;
  viaje = record
    codigo : integer;
    codCamion : rangoCamion;
    distancia : real;
    destino : str20;
    anio : integer;
    dni : longint;
  end;
  lista = ^nodo;
  nodo = record
    dato : viaje;
    sig : lista;
  end;

{ ---- se dispone: los 100 camiones. Lee la patente y en otra línea
       "año capacidad" ---- }
procedure cargarCamiones(var v : vCamiones);
var i : rangoCamion;
begin
  for i := 1 to CANT_CAMIONES do begin
    readln(v[i].patente);
    readln(v[i].anio, v[i].capacidad);
  end;
end;

procedure leerViaje(var v : viaje);
begin
  readln(v.codigo);
  if (v.codigo <> -1) then begin
    readln(v.codCamion);
    readln(v.distancia);
    readln(v.destino);
    readln(v.anio);
    readln(v.dni);
  end;
end;

procedure agregarAdelante(var L : lista; v : viaje);
var nue : lista;
begin
  new(nue);
  nue^.dato := v;
  nue^.sig := L;
  L := nue;
end;

procedure cargarViajes(var L : lista);
var v : viaje;
begin
  L := nil;
  leerViaje(v);
  while (v.codigo <> -1) do begin
    agregarAdelante(L, v);
    leerViaje(v);
  end;
end;

function soloImpares(n : longint) : boolean;
var ok : boolean;
begin
  ok := true;
  while (n <> 0) and ok do begin
    if ((n mod 10) mod 2 = 0) then ok := false;
    n := n div 10;
  end;
  soloImpares := ok;
end;

procedure procesar(L : lista; cam : vCamiones);
var
  km : vKm;
  i, iMax, iMin, c : rangoCamion;
  cantViejos : integer;
begin
  for i := 1 to CANT_CAMIONES do km[i] := 0;
  cantViejos := 0;
  writeln('3) Viajes con choferes de DNI con sólo dígitos impares:');
  while (L <> nil) do begin
    c := L^.dato.codCamion;
    km[c] := km[c] + L^.dato.distancia;
    if (cam[c].capacidad > 30.5) and (L^.dato.anio - cam[c].anio > 5) then
      cantViejos := cantViejos + 1;
    if soloImpares(L^.dato.dni) then writeln('   ', L^.dato.codigo);
    L := L^.sig;
  end;
  iMax := 1;
  iMin := 1;
  for i := 2 to CANT_CAMIONES do begin
    if (km[i] > km[iMax]) then iMax := i;
    if (km[i] < km[iMin]) then iMin := i;
  end;
  writeln('1) Más km: ', cam[iMax].patente, ' (', km[iMax]:0:1, ' km)  Menos km: ',
          cam[iMin].patente, ' (', km[iMin]:0:1, ' km)');
  writeln('2) Viajes en camiones de más de 30,5 t y más de 5 años: ', cantViejos);
end;

var
  cam : vCamiones;
  L : lista;
begin
  cargarCamiones(cam);
  cargarViajes(L);
  procesar(L, cam);
end.`,
  },
  {
    grupo: G, ref: "P7 Ej 6", titulo: "Observatorio Astronómico",
    enunciado: "Los objetos observados se clasifican en 7 categorías (1: estrellas, 2: planetas, 3: satélites, 4: galaxias, 5: asteroides, 6: cometas, 7: nebulosas). De cada objeto: código, categoría, nombre, distancia a la Tierra (años luz), nombre del descubridor y año del descubrimiento. (A) Leer y almacenar los objetos hasta el código -1 (que no se procesa), manteniendo el orden de lectura. (B) Informar: 1. los códigos de los dos objetos más lejanos; 2. la cantidad de planetas descubiertos por \"Galileo Galilei\" antes de 1600; 3. la cantidad de objetos por categoría; 4. los nombres de las estrellas cuyo código tiene más dígitos pares que impares.",
    pista: "Mantener el orden de lectura = agregar atrás (con un puntero al último). Todo el reporte sale de un solo recorrido: dos máximos, un contador, un vector contador por categoría y la función de dígitos.",
    sol: `program Observatorio;
type
  str40 = string[40];
  rangoCat = 1..7;
  objeto = record
    codigo : longint;
    categoria : rangoCat;
    nombre : str40;
    distancia : real;
    descubridor : str40;
    anio : integer;
  end;
  lista = ^nodo;
  nodo = record
    dato : objeto;
    sig : lista;
  end;
  vCategorias = array [rangoCat] of integer;

procedure leerObjeto(var o : objeto);
begin
  readln(o.codigo);
  if (o.codigo <> -1) then begin
    readln(o.categoria);
    readln(o.nombre);
    readln(o.distancia);
    readln(o.descubridor);
    readln(o.anio);
  end;
end;

procedure agregarAtras(var pri, ult : lista; o : objeto);
var nue : lista;
begin
  new(nue);
  nue^.dato := o;
  nue^.sig := nil;
  if (pri = nil) then pri := nue else ult^.sig := nue;
  ult := nue;
end;

procedure cargarLista(var L : lista);          { A }
var
  o : objeto;
  ult : lista;
begin
  L := nil;
  ult := nil;
  leerObjeto(o);
  while (o.codigo <> -1) do begin
    agregarAtras(L, ult, o);
    leerObjeto(o);
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

procedure reporte(L : lista);                   { B }
var
  cats : vCategorias;
  c : rangoCat;
  max1, max2 : real;
  cod1, cod2 : longint;
  cantGalileo : integer;
  o : objeto;
begin
  for c := 1 to 7 do cats[c] := 0;
  max1 := -1; max2 := -1; cod1 := 0; cod2 := 0;
  cantGalileo := 0;
  writeln('4) Estrellas con código de más dígitos pares que impares:');
  while (L <> nil) do begin
    o := L^.dato;
    if (o.distancia > max1) then begin
      max2 := max1; cod2 := cod1;
      max1 := o.distancia; cod1 := o.codigo;
    end
    else if (o.distancia > max2) then begin
      max2 := o.distancia; cod2 := o.codigo;
    end;
    if (o.categoria = 2) and (o.descubridor = 'Galileo Galilei') and (o.anio < 1600) then
      cantGalileo := cantGalileo + 1;
    cats[o.categoria] := cats[o.categoria] + 1;
    if (o.categoria = 1) and masParesQueImpares(o.codigo) then
      writeln('   ', o.nombre);
    L := L^.sig;
  end;
  writeln('1) Los dos más lejanos: ', cod1, ' y ', cod2);
  writeln('2) Planetas de Galileo Galilei antes de 1600: ', cantGalileo);
  write('3) Objetos por categoría:');
  for c := 1 to 7 do write(' ', c, ':', cats[c]);
  writeln;
end;

var
  L : lista;
begin
  cargarLista(L);
  reporte(L);
end.`,
    entrada: "246\n1\nSirio\n8.6\nBessel\n1844\n135\n1\nVega\n25\nDesconocido\n1500\n17\n2\nJupiter\n0.00008\nGalileo Galilei\n1590\n18\n2\nSaturno\n0.00015\nGalileo Galilei\n1610\n4800\n4\nAndromeda\n2537000\nAl Sufi\n964\n9001\n7\nOrion\n1344\nPeiresc\n1610\n-1",
  },
  {
    grupo: G, ref: "P7 Ej 7", titulo: "Egresados de APU",
    enunciado: "De cada alumno que terminó Analista Programador Universitario se lee: número de alumno, apellido, nombres, email, año de ingreso, año de egreso y las notas de las 24 materias que aprobó. (1) Implementar un módulo que lea y almacene los alumnos hasta el número -1 (que no se procesa); las 24 notas de cada alumno deben quedar ordenadas de forma descendente. (2) Informar: (a) el promedio de cada alumno; (b) la cantidad de ingresantes 2012 cuyo número de alumno tiene sólo dígitos impares; (c) apellido, nombres y email de los dos alumnos que se recibieron más rápido. (3) Implementar un módulo que, dado un número de alumno leído por teclado, lo busque y elimine (puede no existir).",
    pista: "Las notas se ordenan al leerlas: cada nota nueva se inserta en el vector corriendo a la derecha las menores. Los dos más rápidos son dos mínimos de (egreso - ingreso).",
    sol: `program EgresadosAPU;
const
  CANT_NOTAS = 24;
type
  str40 = string[40];
  vNotas = array [1..CANT_NOTAS] of integer;
  alumno = record
    numero : longint;
    apellido, nombres, email : str40;
    ingreso, egreso : integer;
    notas : vNotas;
  end;
  lista = ^nodo;
  nodo = record
    dato : alumno;
    sig : lista;
  end;

{ inserta la nota manteniendo el vector ordenado de mayor a menor }
procedure insertarNota(var v : vNotas; var dimL : integer; nota : integer);
var i : integer;
begin
  i := dimL;
  while (i >= 1) and (v[i] < nota) do begin
    v[i + 1] := v[i];
    i := i - 1;
  end;
  v[i + 1] := nota;
  dimL := dimL + 1;
end;

procedure leerAlumno(var a : alumno);
var i, dimL, nota : integer;
begin
  readln(a.numero);
  if (a.numero <> -1) then begin
    readln(a.apellido);
    readln(a.nombres);
    readln(a.email);
    readln(a.ingreso, a.egreso);
    dimL := 0;
    for i := 1 to CANT_NOTAS do begin
      read(nota);
      insertarNota(a.notas, dimL, nota);
    end;
    readln;
  end;
end;

procedure cargarLista(var L : lista);           { 1 }
var
  a : alumno;
  nue : lista;
begin
  L := nil;
  leerAlumno(a);
  while (a.numero <> -1) do begin
    new(nue);
    nue^.dato := a;
    nue^.sig := L;
    L := nue;
    leerAlumno(a);
  end;
end;

function promedio(v : vNotas) : real;
var i, suma : integer;
begin
  suma := 0;
  for i := 1 to CANT_NOTAS do suma := suma + v[i];
  promedio := suma / CANT_NOTAS;
end;

function soloImpares(n : longint) : boolean;
var ok : boolean;
begin
  ok := true;
  while (n <> 0) and ok do begin
    if ((n mod 10) mod 2 = 0) then ok := false;
    n := n div 10;
  end;
  soloImpares := ok;
end;

procedure informar(L : lista);                   { 2 }
var
  cant2012, anios, min1, min2 : integer;
  p1, p2 : lista;              { punteros a los dos más rápidos }
begin
  cant2012 := 0;
  min1 := 9999; min2 := 9999;
  p1 := nil; p2 := nil;
  while (L <> nil) do begin
    writeln('a) ', L^.dato.numero, ' ', L^.dato.apellido, ': promedio ', promedio(L^.dato.notas):0:2,
            ' (mejor nota ', L^.dato.notas[1], ')');
    if (L^.dato.ingreso = 2012) and soloImpares(L^.dato.numero) then
      cant2012 := cant2012 + 1;
    anios := L^.dato.egreso - L^.dato.ingreso;
    if (anios < min1) then begin
      min2 := min1; p2 := p1;
      min1 := anios; p1 := L;
    end
    else if (anios < min2) then begin
      min2 := anios; p2 := L;
    end;
    L := L^.sig;
  end;
  writeln('b) Ingresantes 2012 con número de sólo dígitos impares: ', cant2012);
  writeln('c) Más rápidos:');
  if (p1 <> nil) then writeln('   ', p1^.dato.apellido, ', ', p1^.dato.nombres, ' - ', p1^.dato.email, ' (', min1, ' años)');
  if (p2 <> nil) then writeln('   ', p2^.dato.apellido, ', ', p2^.dato.nombres, ' - ', p2^.dato.email, ' (', min2, ' años)');
end;

procedure eliminar(var L : lista; num : longint; var ok : boolean);   { 3 }
var ant, act : lista;
begin
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.numero <> num) do begin
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

var
  L : lista;
  num : longint;
  ok : boolean;
begin
  cargarLista(L);
  informar(L);
  write('Número de alumno a eliminar: ');
  readln(num);
  eliminar(L, num, ok);
  if ok then writeln('Se eliminó el alumno ', num)
  else writeln('No existe el alumno ', num);
end.`,
    entrada: "13579\nPerez\nAna\nana@mail.com\n2012 2017\n7 8 9 6 7 8 10 9 8 7 6 7 8 9 10 8 7 6 9 8 7 8 9 10\n24680\nGomez\nLuis\nluis@mail.com\n2012 2020\n6 6 7 7 8 8 6 6 7 7 8 8 6 6 7 7 8 8 6 6 7 7 8 8\n15731\nDiaz\nSofia Belen\nsofi@mail.com\n2013 2017\n10 9 10 9 10 9 10 9 10 9 10 9 10 9 10 9 10 9 10 9 10 9 10 9\n-1\n24680",
  },
  {
    grupo: G, ref: "P7 Ej 8", titulo: "Transferencias bancarias",
    enunciado: "El banco dispone de una lista (sin orden) de transferencias de enero a noviembre de 2018. De cada una: número de cuenta origen, DNI del titular origen, número de cuenta destino, DNI del titular destino, fecha, hora, monto y código de motivo (1: alquiler, 2: expensas, 3: facturas, 4: préstamo, 5: seguro, 6: honorarios, 7: varios). (a) Generar una nueva estructura sólo con las transferencias a terceros (origen y destino de distinto titular), ordenada por número de cuenta origen. Usando esa estructura: (b) informar para cada cuenta origen el monto total transferido a terceros; (c) informar el código de motivo con más transferencias a terceros; (d) informar la cantidad de transferencias a terceros de junio en las que la cuenta destino tiene menos dígitos pares que impares.",
    pista: "(a) recorre la lista original e inserta ordenado por cuenta origen cuando los DNI son distintos. Como la nueva lista queda ordenada, (b) es un corte de control; (c) y (d) se resuelven en el mismo recorrido.",
    sol: `program Transferencias;
type
  str5 = string[5];
  rangoMotivo = 1..7;
  fecha = record
    dia, mes, anio : integer;
  end;
  transferencia = record
    ctaOrigen, dniOrigen, ctaDestino, dniDestino : longint;
    f : fecha;
    hora : str5;
    monto : real;
    motivo : rangoMotivo;
  end;
  lista = ^nodo;
  nodo = record
    dato : transferencia;
    sig : lista;
  end;
  vMotivos = array [rangoMotivo] of integer;

{ ---- se dispone: la lista sin orden. Lee por transferencia:
       "ctaOrigen dniOrigen ctaDestino dniDestino", "dia mes anio",
       la hora y "monto motivo"; termina con la cuenta origen -1 ---- }
procedure cargarLista(var L : lista);
var
  t : transferencia;
  nue : lista;
begin
  L := nil;
  read(t.ctaOrigen);
  while (t.ctaOrigen <> -1) do begin
    readln(t.dniOrigen, t.ctaDestino, t.dniDestino);
    readln(t.f.dia, t.f.mes, t.f.anio);
    readln(t.hora);
    readln(t.monto, t.motivo);
    new(nue);
    nue^.dato := t;
    nue^.sig := L;
    L := nue;
    read(t.ctaOrigen);
  end;
end;

procedure insertarPorCuenta(var L : lista; t : transferencia);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := t;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.ctaOrigen < t.ctaOrigen) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

{ a) }
procedure generarTerceros(L : lista; var T : lista);
begin
  T := nil;
  while (L <> nil) do begin
    if (L^.dato.dniOrigen <> L^.dato.dniDestino) then
      insertarPorCuenta(T, L^.dato);
    L := L^.sig;
  end;
end;

function menosParesQueImpares(n : longint) : boolean;
var pares, impares : integer;
begin
  pares := 0;
  impares := 0;
  while (n <> 0) do begin
    if ((n mod 10) mod 2 = 0) then pares := pares + 1
    else impares := impares + 1;
    n := n div 10;
  end;
  menosParesQueImpares := pares < impares;
end;

procedure procesar(T : lista);
var
  motivos : vMotivos;
  m, mMax : rangoMotivo;
  ctaAct : longint;
  total : real;
  cantJunio : integer;
begin
  for m := 1 to 7 do motivos[m] := 0;
  cantJunio := 0;
  writeln('b) Monto transferido a terceros por cuenta:');
  while (T <> nil) do begin
    ctaAct := T^.dato.ctaOrigen;
    total := 0;
    while (T <> nil) and (T^.dato.ctaOrigen = ctaAct) do begin
      total := total + T^.dato.monto;
      motivos[T^.dato.motivo] := motivos[T^.dato.motivo] + 1;           { c }
      if (T^.dato.f.mes = 6) and menosParesQueImpares(T^.dato.ctaDestino) then
        cantJunio := cantJunio + 1;                                     { d }
      T := T^.sig;
    end;
    writeln('   Cuenta ', ctaAct, ': $', total:0:2);
  end;
  mMax := 1;
  for m := 2 to 7 do
    if (motivos[m] > motivos[mMax]) then mMax := m;
  writeln('c) Motivo con más transferencias a terceros: ', mMax);
  writeln('d) Transferencias de junio a cuentas con menos pares que impares: ', cantJunio);
end;

var
  L, T : lista;
begin
  cargarLista(L);
  generarTerceros(L, T);
  procesar(T);
end.`,
    entrada: "3001 30111222 5001 28999000\n10 6 2018\n10:30\n15000 1\n1002 25444555 1003 25444555\n2 3 2018\n09:00\n5000 7\n1002 25444555 7135 40111222\n15 6 2018\n18:45\n32000.5 1\n3001 30111222 2468 33222111\n1 11 2018\n12:00\n8000 3\n1002 25444555 9001 31555666\n20 6 2018\n08:15\n1200 3\n-1",
  },
];

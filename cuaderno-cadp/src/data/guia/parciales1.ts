import type { Ejercicio } from "../types";

/** Parciales 2025 y 2024 (segunda fecha y redictado) */
export const parciales1: Ejercicio[] = [
  {
    grupo: "Parciales 2025", ref: "2025 · 2ª fecha · T1", titulo: "Aerolínea: ventas de pasajes",
    enunciado: `Una aerolínea desea procesar información sobre las ventas de pasajes para los 300 vuelos que ofrece. Para ello, dispone de una estructura de datos que posee la cantidad de asientos libres de cada uno de sus 300 vuelos.
Se pide realizar un programa que:
a) Lea y almacene la información de las ventas de pasajes en una estructura de datos adecuada. De cada venta se lee: código identificador, fecha, si fue online o en boletería, DNI del comprador, código de vuelo (1..300), cantidad de pasajes y monto total. La lectura finaliza cuando se lee el DNI -1, que no debe procesarse. Esta información debe quedar almacenada, de manera ordenada, por el DNI del comprador. Un mismo DNI puede aparecer más de una vez.
b) A partir de la estructura generada en el punto A:
1. Informe, para cada comprador, su DNI y el monto total de los pasajes que ha comprado de manera online.
2. Actualice la estructura que se dispone e informe la cantidad de vuelos que quedaron sin asientos libres.
Nota: La estructura generada se debe recorrer una vez.`,
    pista: "Asientos: vector [1..300] (se dispone). Ventas: lista insertada ordenada por DNI. Con la lista ordenada, el inciso 1 es un corte de control por DNI; en ese mismo recorrido restás los pasajes en asientos[vuelo]. Al final contás los vuelos con 0 asientos recorriendo el vector (eso no es recorrer la lista).",
    sol: `{ Se lee primero el DNI para poder cortar con -1 sin leer el resto.
  Para probar a mano, bajá CANT_VUELOS (por ejemplo a 5). }
program Aerolinea;
const
  CANT_VUELOS = 300;
type
  str5 = string[5];
  rangoVuelo = 1..CANT_VUELOS;
  vAsientos = array [rangoVuelo] of integer;
  fecha = record
    dia, mes, anio : integer;
  end;
  venta = record
    codigo : longint;
    f : fecha;
    online : boolean;
    dni : longint;
    vuelo : rangoVuelo;
    cant : integer;
    monto : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : venta;
    sig : lista;
  end;

{ ---- se dispone: los asientos libres de cada vuelo ---- }
procedure cargarAsientos(var v : vAsientos);
var i : rangoVuelo;
begin
  for i := 1 to CANT_VUELOS do read(v[i]);
  readln;
end;

procedure leerVenta(var v : venta);
var tipo : char;
begin
  readln(v.dni);
  if (v.dni <> -1) then begin
    readln(v.codigo);
    readln(v.f.dia, v.f.mes, v.f.anio);
    readln(tipo);                       { 'O' online, 'B' boletería }
    v.online := tipo = 'O';
    readln(v.vuelo);
    readln(v.cant);
    readln(v.monto);
  end;
end;

procedure insertarPorDni(var L : lista; v : venta);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := v;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.dni < v.dni) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

procedure cargarVentas(var L : lista);           { a }
var v : venta;
begin
  L := nil;
  leerVenta(v);
  while (v.dni <> -1) do begin
    insertarPorDni(L, v);
    leerVenta(v);
  end;
end;

procedure procesar(L : lista; var asientos : vAsientos);    { b }
var
  dniAct : longint;
  totalOnline : real;
  i : rangoVuelo;
  sinAsientos : integer;
begin
  writeln('1) Monto online por comprador:');
  while (L <> nil) do begin
    dniAct := L^.dato.dni;
    totalOnline := 0;
    while (L <> nil) and (L^.dato.dni = dniAct) do begin
      if L^.dato.online then totalOnline := totalOnline + L^.dato.monto;
      asientos[L^.dato.vuelo] := asientos[L^.dato.vuelo] - L^.dato.cant;
      L := L^.sig;
    end;
    writeln('   ', dniAct, ': $', totalOnline:0:2);
  end;
  sinAsientos := 0;
  for i := 1 to CANT_VUELOS do
    if (asientos[i] <= 0) then sinAsientos := sinAsientos + 1;
  writeln('2) Vuelos sin asientos libres: ', sinAsientos);
end;

var
  asientos : vAsientos;
  L : lista;
begin
  cargarAsientos(asientos);
  cargarVentas(L);
  procesar(L, asientos);
end.`,
  },
  {
    grupo: "Parciales 2025", ref: "2025 · 2ª fecha · T2", titulo: "Empresa de colectivos: ventas de pasajes",
    enunciado: `Una empresa de colectivos desea procesar información sobre las ventas de pasajes para los 200 viajes que ofrece. Para ello, dispone de una estructura de datos que posee la cantidad de asientos libres de cada uno de sus 200 viajes.
Se pide realizar un programa que:
A. Lea y almacene la información de las ventas de pasajes en una estructura de datos adecuada. De cada venta se lee: código identificador, fecha, si fue online o en boletería, DNI del comprador, código de viaje (1..200), cantidad de pasajes y monto total. La lectura finaliza cuando se lee el DNI 0 (cero), que no debe procesarse. Esta información debe quedar almacenada, de manera ordenada, por el DNI del comprador. Un mismo DNI puede aparecer más de una vez.
B. A partir de la estructura generada en el punto A:
1. Informe, para cada comprador, su DNI y la cantidad total de pasajes que compró por boletería.
2. Actualice la estructura que se dispone e informe la cantidad de vuelos que quedaron con asientos libres.
Nota: la estructura generada se debe recorrer una vez.`,
    pista: "Es el mismo esquema que el Tema 1: vector de asientos que se dispone, lista ordenada por DNI y un único recorrido con corte de control. Cambia lo que se suma (pasajes de boletería) y la condición final (viajes con asientos libres, o sea > 0).",
    sol: `{ Se lee primero el DNI para poder cortar con 0 sin leer el resto.
  Para probar a mano, bajá CANT_VIAJES (por ejemplo a 5). }
program Colectivos;
const
  CANT_VIAJES = 200;
type
  rangoViaje = 1..CANT_VIAJES;
  vAsientos = array [rangoViaje] of integer;
  fecha = record
    dia, mes, anio : integer;
  end;
  venta = record
    codigo : longint;
    f : fecha;
    online : boolean;
    dni : longint;
    viaje : rangoViaje;
    cant : integer;
    monto : real;
  end;
  lista = ^nodo;
  nodo = record
    dato : venta;
    sig : lista;
  end;

{ ---- se dispone: los asientos libres de cada viaje ---- }
procedure cargarAsientos(var v : vAsientos);
var i : rangoViaje;
begin
  for i := 1 to CANT_VIAJES do read(v[i]);
  readln;
end;

procedure leerVenta(var v : venta);
var tipo : char;
begin
  readln(v.dni);
  if (v.dni <> 0) then begin
    readln(v.codigo);
    readln(v.f.dia, v.f.mes, v.f.anio);
    readln(tipo);                       { 'O' online, 'B' boletería }
    v.online := tipo = 'O';
    readln(v.viaje);
    readln(v.cant);
    readln(v.monto);
  end;
end;

procedure insertarPorDni(var L : lista; v : venta);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := v;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.dni < v.dni) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

procedure cargarVentas(var L : lista);           { A }
var v : venta;
begin
  L := nil;
  leerVenta(v);
  while (v.dni <> 0) do begin
    insertarPorDni(L, v);
    leerVenta(v);
  end;
end;

procedure procesar(L : lista; var asientos : vAsientos);    { B }
var
  dniAct : longint;
  pasajesBoleteria, conLibres : integer;
  i : rangoViaje;
begin
  writeln('1) Pasajes comprados por boletería:');
  while (L <> nil) do begin
    dniAct := L^.dato.dni;
    pasajesBoleteria := 0;
    while (L <> nil) and (L^.dato.dni = dniAct) do begin
      if not L^.dato.online then pasajesBoleteria := pasajesBoleteria + L^.dato.cant;
      asientos[L^.dato.viaje] := asientos[L^.dato.viaje] - L^.dato.cant;
      L := L^.sig;
    end;
    writeln('   ', dniAct, ': ', pasajesBoleteria);
  end;
  conLibres := 0;
  for i := 1 to CANT_VIAJES do
    if (asientos[i] > 0) then conLibres := conLibres + 1;
  writeln('2) Viajes que quedaron con asientos libres: ', conLibres);
end;

var
  asientos : vAsientos;
  L : lista;
begin
  cargarAsientos(asientos);
  cargarVentas(L);
  procesar(L, asientos);
end.`,
  },
  {
    grupo: "Parciales 2025", ref: "2025 · Redictado", titulo: "Catering: pedidos y facturación",
    enunciado: `Una empresa de catering necesita un sistema para almacenar los pedidos. De cada pedido se conoce: Apellido y Nombre del Cliente, DNI Cliente, Nro. Pedido, fecha entrega y un listado de productos solicitados. De cada uno de esos productos se conoce: el código de producto (1..50) y cantidad vendida. Además la empresa dispone una estructura donde se almacena información de cada producto que vende: código de producto (1..50), precio unitario y si necesita conservación en frío.
A. Realizar un programa que lea la información de los pedidos y los almacene en una estructura ordenada en forma ascendente por Nro. de Pedido.
B. Realizar un módulo que reciba la estructura generada en A y la estructura de productos que dispone y retorne una estructura que indique el total facturado por código de producto.
C. Realice un módulo que reciba la estructura generada en B y la estructura de productos que dispone y retorne la cantidad de códigos de productos cuyo total facturado es múltiplo de 2 y el producto necesita conservación en frío.`,
    pista: "Cada pedido tiene su propia lista de productos (lista dentro de lista). Los productos que se disponen van en un vector [1..50] de registros. El total facturado por código es otro vector [1..50]: recorrés los pedidos y, dentro de cada uno, sus productos.",
    sol: `{ Decisiones (el enunciado no las fija):
  - Los pedidos se leen hasta el número de pedido -1, y los productos de
    cada pedido hasta el código 0.
  - Los precios son enteros (pesos), así "múltiplo de 2" tiene sentido.
  - En C solo se cuentan productos que se facturaron (total > 0).
  Para probar a mano, bajá CANT_PROD (por ejemplo a 5). }
program Catering;
const
  CANT_PROD = 50;
type
  str40 = string[40];
  rangoProd = 1..CANT_PROD;
  producto = record
    precio : longint;
    frio : boolean;
  end;
  vProductos = array [rangoProd] of producto;
  vFacturado = array [rangoProd] of longint;
  item = record
    codigo : rangoProd;
    cant : integer;
  end;
  listaItems = ^nodoItem;
  nodoItem = record
    dato : item;
    sig : listaItems;
  end;
  fecha = record
    dia, mes, anio : integer;
  end;
  pedido = record
    apeNom : str40;
    dni : longint;
    nro : integer;
    entrega : fecha;
    items : listaItems;
  end;
  lista = ^nodo;
  nodo = record
    dato : pedido;
    sig : lista;
  end;

{ ---- se dispone: los productos. Una línea "precio frio" por código,
       con frio = 1 si necesita conservación en frío ---- }
procedure cargarProductos(var v : vProductos);
var
  i : rangoProd;
  frio : integer;
begin
  for i := 1 to CANT_PROD do begin
    readln(v[i].precio, frio);
    v[i].frio := frio = 1;
  end;
end;

procedure agregarItem(var L : listaItems; it : item);
var nue : listaItems;
begin
  new(nue);
  nue^.dato := it;
  nue^.sig := L;
  L := nue;
end;

{ lee líneas "código cantidad" hasta el código 0 }
procedure leerItems(var L : listaItems);
var
  cod : integer;
  it : item;
begin
  L := nil;
  read(cod);
  while (cod <> 0) do begin
    it.codigo := cod;
    readln(it.cant);
    agregarItem(L, it);
    read(cod);
  end;
  readln;
end;

procedure leerPedido(var p : pedido);
begin
  readln(p.nro);
  if (p.nro <> -1) then begin
    readln(p.apeNom);
    readln(p.dni);
    readln(p.entrega.dia, p.entrega.mes, p.entrega.anio);
    leerItems(p.items);
  end;
end;

procedure insertarPorNro(var L : lista; p : pedido);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := p;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.nro < p.nro) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

procedure cargarPedidos(var L : lista);          { A }
var p : pedido;
begin
  L := nil;
  leerPedido(p);
  while (p.nro <> -1) do begin
    insertarPorNro(L, p);
    leerPedido(p);
  end;
end;

{ B }
procedure facturacion(L : lista; prods : vProductos; var fact : vFacturado);
var
  i : rangoProd;
  it : listaItems;
begin
  for i := 1 to CANT_PROD do fact[i] := 0;
  while (L <> nil) do begin
    it := L^.dato.items;
    while (it <> nil) do begin
      fact[it^.dato.codigo] := fact[it^.dato.codigo] + it^.dato.cant * prods[it^.dato.codigo].precio;
      it := it^.sig;
    end;
    L := L^.sig;
  end;
end;

{ C }
function cantFrioPar(fact : vFacturado; prods : vProductos) : integer;
var
  i : rangoProd;
  cant : integer;
begin
  cant := 0;
  for i := 1 to CANT_PROD do
    if (fact[i] > 0) and (fact[i] mod 2 = 0) and prods[i].frio then
      cant := cant + 1;
  cantFrioPar := cant;
end;

var
  prods : vProductos;
  L : lista;
  fact : vFacturado;
  i : rangoProd;
begin
  cargarProductos(prods);
  cargarPedidos(L);
  facturacion(L, prods, fact);
  writeln('B) Total facturado por producto:');
  for i := 1 to CANT_PROD do
    if (fact[i] > 0) then writeln('   Producto ', i, ': $', fact[i]);
  writeln('C) Productos de frío con facturación múltiplo de 2: ', cantFrioPar(fact, prods));
end.`,
  },
  {
    grupo: "Parciales 2024", ref: "2024 · 2ª fecha · T2", titulo: "Supermercado: compras 2010-2020",
    enunciado: `Un supermercado está procesando las compras que realizaron sus clientes. Para ello, dispone de una estructura de datos con todas las compras realizadas, sin ningún orden en particular. De cada compra se conoce: código, año (entre 1980 y 2024), monto y el DNI del cliente. Un cliente puede haber realizado más de una compra.
Realizar un programa que procese la información de las compras y:
a) Almacene en otra estructura de datos las compras realizadas entre los años 2010 y 2020. Esta estructura debe quedar ordenada por el DNI del cliente.
b) Una vez almacenada la estructura del inciso a, procesar estos datos e informar:
1. El año con menor facturación.
2. Los dos DNI de los clientes que realizaron mayor cantidad de compras.
3. COMPLETO: El monto total facturado de compras con código múltiplo de 10.`,
    pista: "(a) recorre la lista que se dispone e inserta ordenado por DNI solo las de 2010 a 2020. En (b), un recorrido de la lista nueva: corte de control por DNI para contar compras (dos máximos), un vector [2010..2020] para la facturación por año, y un acumulador para los códigos múltiplos de 10.",
    sol: `program Supermercado;
type
  rangoAnio = 1980..2024;
  rangoDecada = 2010..2020;
  compra = record
    codigo : integer;
    anio : rangoAnio;
    monto : real;
    dni : longint;
  end;
  lista = ^nodo;
  nodo = record
    dato : compra;
    sig : lista;
  end;
  vFacturacion = array [rangoDecada] of real;

{ ---- se dispone: las compras sin orden. Lee "código año monto dni"
       por línea, hasta el código -1 ---- }
procedure cargarLista(var L : lista);
var
  c : compra;
  nue : lista;
begin
  L := nil;
  read(c.codigo);
  while (c.codigo <> -1) do begin
    readln(c.anio, c.monto, c.dni);
    new(nue);
    nue^.dato := c;
    nue^.sig := L;
    L := nue;
    read(c.codigo);
  end;
end;

procedure insertarPorDni(var L : lista; c : compra);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := c;
  ant := L;
  act := L;
  while (act <> nil) and (act^.dato.dni < c.dni) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = L) then L := nue else ant^.sig := nue;
  nue^.sig := act;
end;

{ a) }
procedure filtrar(L : lista; var nueva : lista);
begin
  nueva := nil;
  while (L <> nil) do begin
    if (L^.dato.anio >= 2010) and (L^.dato.anio <= 2020) then
      insertarPorDni(nueva, L^.dato);
    L := L^.sig;
  end;
end;

{ b) }
procedure informar(L : lista);
var
  fact : vFacturacion;
  a, aMin : rangoDecada;
  dniAct, dni1, dni2 : longint;
  cant, max1, max2 : integer;
  totalMult10 : real;
begin
  for a := 2010 to 2020 do fact[a] := 0;
  max1 := -1; max2 := -1; dni1 := 0; dni2 := 0;
  totalMult10 := 0;
  while (L <> nil) do begin
    dniAct := L^.dato.dni;
    cant := 0;
    while (L <> nil) and (L^.dato.dni = dniAct) do begin
      cant := cant + 1;
      fact[L^.dato.anio] := fact[L^.dato.anio] + L^.dato.monto;
      if (L^.dato.codigo mod 10 = 0) then totalMult10 := totalMult10 + L^.dato.monto;
      L := L^.sig;
    end;
    if (cant > max1) then begin
      max2 := max1; dni2 := dni1;
      max1 := cant; dni1 := dniAct;
    end
    else if (cant > max2) then begin
      max2 := cant; dni2 := dniAct;
    end;
  end;
  aMin := 2010;
  for a := 2011 to 2020 do
    if (fact[a] < fact[aMin]) then aMin := a;
  writeln('1) Año con menor facturación: ', aMin, ' ($', fact[aMin]:0:2, ')');
  writeln('2) Clientes con más compras: ', dni1, ' y ', dni2);
  writeln('3) Facturado con código múltiplo de 10: $', totalMult10:0:2);
end;

var
  L, nueva : lista;
begin
  cargarLista(L);
  filtrar(L, nueva);
  informar(nueva);
end.`,
    entrada: "10 2015 1500 30111222\n11 2009 800 30111222\n12 2010 300 25444555\n20 2020 1200 30111222\n13 2012 450.5 41000111\n14 2015 700 25444555\n15 2018 90 30111222\n30 2011 600 41000111\n16 2013 50 25444555\n17 2014 80 20999888\n18 2016 75 20999888\n19 2017 66 20999888\n21 2019 55 20999888\n-1",
  },
  {
    grupo: "Parciales 2024", ref: "2024 · Redictado · Turno 1", titulo: "Fábrica de automóviles: piezas",
    enunciado: `Una fábrica de automóviles necesita un programa para administrar las piezas de los diferentes modelos de automóviles que fabrica. De cada pieza, se conoce: código de pieza, descripción, cantidad en stock, costo de la pieza, código de modelo al que pertenece (1 al 10), stock mínimo. La lectura finaliza al leer el código de pieza 9999 el cual debe procesarse.
a) Leer y almacenar la información de las piezas en una estructura de datos adecuada. La información debe quedar almacenada en el mismo orden que fue leída.
b) A partir de la estructura de datos generada en A), calcular e informar:
1. Los 2 códigos de modelo de automóviles más baratos de fabricar.
2. El promedio de piezas con código de modelo 3 y cuyo código de pieza comienza en 9.
3. Cuál es el código de pieza en que la fábrica deberá gastar más dinero para que su stock actual supere en una unidad a su stock mínimo.`,
    pista: "Mismo orden de lectura = agregar atrás. El costo de fabricar un modelo es la suma de los costos de sus piezas (vector [1..10]). Para el primer dígito de un número, dividí por 10 mientras sea >= 10. En (3), lo que hay que comprar es stockMin + 1 - stock (si es positivo) y el gasto es eso por el costo.",
    sol: `{ Interpretaciones:
  - Costo de fabricar un modelo = suma de los costos de sus piezas; solo
    se comparan modelos que tienen piezas cargadas.
  - "Promedio" en el inciso 2 se toma como porcentaje sobre el total de
    piezas. }
program FabricaAutos;
const
  COD_FIN = 9999;
type
  str40 = string[40];
  rangoModelo = 1..10;
  pieza = record
    codigo : integer;
    descripcion : str40;
    stock, stockMin : integer;
    costo : real;
    modelo : rangoModelo;
  end;
  lista = ^nodo;
  nodo = record
    dato : pieza;
    sig : lista;
  end;
  vCostos = array [rangoModelo] of real;
  vCant = array [rangoModelo] of integer;

procedure leerPieza(var p : pieza);
begin
  readln(p.codigo);
  readln(p.descripcion);
  readln(p.stock, p.stockMin);
  readln(p.costo);
  readln(p.modelo);
end;

procedure agregarAtras(var pri, ult : lista; p : pieza);
var nue : lista;
begin
  new(nue);
  nue^.dato := p;
  nue^.sig := nil;
  if (pri = nil) then pri := nue else ult^.sig := nue;
  ult := nue;
end;

procedure cargarLista(var L : lista);          { a }
var
  p : pieza;
  ult : lista;
begin
  L := nil;
  ult := nil;
  repeat
    leerPieza(p);
    agregarAtras(L, ult, p);
  until (p.codigo = COD_FIN);
end;

function primerDigito(n : integer) : integer;
begin
  while (n >= 10) do n := n div 10;
  primerDigito := n;
end;

procedure informar(L : lista);                 { b }
var
  costos : vCostos;
  cantPiezas : vCant;
  m, m1, m2 : integer;
  total, cantB, codMax : integer;
  falta : integer;
  gasto, gastoMax : real;
begin
  for m := 1 to 10 do begin
    costos[m] := 0;
    cantPiezas[m] := 0;
  end;
  total := 0; cantB := 0;
  gastoMax := -1; codMax := -1;
  while (L <> nil) do begin
    costos[L^.dato.modelo] := costos[L^.dato.modelo] + L^.dato.costo;
    cantPiezas[L^.dato.modelo] := cantPiezas[L^.dato.modelo] + 1;
    total := total + 1;
    if (L^.dato.modelo = 3) and (primerDigito(L^.dato.codigo) = 9) then
      cantB := cantB + 1;
    falta := L^.dato.stockMin + 1 - L^.dato.stock;
    if (falta > 0) then begin
      gasto := falta * L^.dato.costo;
      if (gasto > gastoMax) then begin
        gastoMax := gasto;
        codMax := L^.dato.codigo;
      end;
    end;
    L := L^.sig;
  end;
  m1 := 0; m2 := 0;
  for m := 1 to 10 do
    if (cantPiezas[m] > 0) then begin
      if (m1 = 0) or (costos[m] < costos[m1]) then begin
        m2 := m1; m1 := m;
      end
      else if (m2 = 0) or (costos[m] < costos[m2]) then
        m2 := m;
    end;
  writeln('1) Modelos más baratos de fabricar: ', m1, ' y ', m2);
  writeln('2) Piezas del modelo 3 con código que empieza en 9: ', cantB / total * 100:0:2, '%');
  if (codMax <> -1) then
    writeln('3) Pieza en la que más hay que gastar: ', codMax, ' ($', gastoMax:0:2, ')')
  else
    writeln('3) Todas las piezas superan su stock mínimo');
end;

var
  L : lista;
begin
  cargarLista(L);
  informar(L);
end.`,
    entrada: "950\nTornillo\n10 20\n15.5\n3\n120\nParagolpes\n2 5\n30000\n1\n9100\nFaro\n1 4\n12000\n3\n300\nVolante\n8 3\n25000\n2\n9999\nEspejo\n0 2\n8000\n1",
  },
  {
    grupo: "Parciales 2024", ref: "2024 · Redictado · Turno 2", titulo: "Escuela primaria: preinscripciones 2025",
    enunciado: `Una escuela primaria necesita un programa para administrar la información de preinscripciones al ciclo lectivo 2025. De cada preinscripción se lee: DNI del alumno, apellido y nombre del alumno, fecha de nacimiento del alumno (día, mes y año), teléfono de contacto y horario de preferencia (1: Mañana, 2: Tarde, 3: Jornada extendida, 4: Jornada completa). La lectura finaliza cuando se lee el código -1 (que no debe procesarse).
Se pide:
a) Leer y almacenar la información de las preinscripciones en una estructura de datos adecuada. La información debe quedar almacenada en el mismo orden en que fue leída.
b) A partir de la estructura de datos generada en A), calcular e informar:
1. Los dos horarios más requeridos por alumnos nacidos entre enero y junio.
2. Apellido, nombre y teléfono de aquellos alumnos con DNI compuesto solamente por dígitos impares.
3. Porcentaje de preinscripciones al horario Jornada Completa.`,
    pista: "Lista con agregar atrás (orden de lectura). Un recorrido: vector contador [1..4] solo para los nacidos con mes <= 6 (después dos máximos), la función de dígitos impares y un contador de jornada completa.",
    sol: `{ El "código -1" se toma como DNI -1. }
program Preinscripciones;
type
  str40 = string[40];
  rangoHorario = 1..4;
  fecha = record
    dia, mes, anio : integer;
  end;
  preinscripcion = record
    dni : longint;
    apeNom : str40;
    nac : fecha;
    telefono : str40;
    horario : rangoHorario;
  end;
  lista = ^nodo;
  nodo = record
    dato : preinscripcion;
    sig : lista;
  end;
  vHorarios = array [rangoHorario] of integer;

procedure leerPreinscripcion(var p : preinscripcion);
begin
  readln(p.dni);
  if (p.dni <> -1) then begin
    readln(p.apeNom);
    readln(p.nac.dia, p.nac.mes, p.nac.anio);
    readln(p.telefono);
    readln(p.horario);
  end;
end;

procedure agregarAtras(var pri, ult : lista; p : preinscripcion);
var nue : lista;
begin
  new(nue);
  nue^.dato := p;
  nue^.sig := nil;
  if (pri = nil) then pri := nue else ult^.sig := nue;
  ult := nue;
end;

procedure cargarLista(var L : lista);           { a }
var
  p : preinscripcion;
  ult : lista;
begin
  L := nil;
  ult := nil;
  leerPreinscripcion(p);
  while (p.dni <> -1) do begin
    agregarAtras(L, ult, p);
    leerPreinscripcion(p);
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

procedure informar(L : lista);                  { b }
var
  horarios : vHorarios;
  h : rangoHorario;
  h1, h2, max1, max2, total, completa : integer;
begin
  for h := 1 to 4 do horarios[h] := 0;
  total := 0; completa := 0;
  writeln('2) Alumnos con DNI de sólo dígitos impares:');
  while (L <> nil) do begin
    if (L^.dato.nac.mes <= 6) then
      horarios[L^.dato.horario] := horarios[L^.dato.horario] + 1;
    if soloImpares(L^.dato.dni) then
      writeln('   ', L^.dato.apeNom, ' - tel. ', L^.dato.telefono);
    total := total + 1;
    if (L^.dato.horario = 4) then completa := completa + 1;
    L := L^.sig;
  end;
  max1 := -1; max2 := -1; h1 := 0; h2 := 0;
  for h := 1 to 4 do
    if (horarios[h] > max1) then begin
      max2 := max1; h2 := h1;
      max1 := horarios[h]; h1 := h;
    end
    else if (horarios[h] > max2) then begin
      max2 := horarios[h]; h2 := h;
    end;
  writeln('1) Horarios más pedidos (nacidos de enero a junio): ', h1, ' y ', h2);
  if (total > 0) then
    writeln('3) Jornada completa: ', completa / total * 100:0:2, '%');
end;

var
  L : lista;
begin
  cargarLista(L);
  informar(L);
end.`,
    entrada: "55137991\nPerez Ana\n10 3 2019\n221-4567890\n1\n56222333\nGomez Luis\n2 8 2019\n221-5556677\n4\n57111999\nDiaz Sofia\n25 5 2019\n221-3334455\n4\n56444888\nRuiz Mara\n14 1 2019\n221-6667788\n4\n55333444\nLopez Ivan\n30 6 2019\n221-1112233\n2\n-1",
  },
];

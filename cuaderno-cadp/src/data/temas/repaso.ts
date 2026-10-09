import type { Tema } from "../types";

const tema: Tema = {
  id: "repaso",
  num: "P7",
  titulo: "Repaso y estrategia",
  fuente: "Práctica 7 y Consideraciones generales",
  resumen: "Cómo leer un enunciado de parcial: si hay que almacenar, en qué estructura y en cuántos recorridos.",
  sim: null,
  teoria: [
    { h: "1. ¿Hay que almacenar?" },
    {
      p: "Solo si el enunciado lo pide. La pista suele ser \"lea y almacene\" o \"una vez leída y almacenada toda la información\". En ese caso, durante la carga no se calcula nada: primero se carga y después se recorre."
    },
    {
      p: "Si no lo pide (\"lea números hasta -1 e informe…\"), se procesa mientras se lee y no se arma ninguna estructura."
    },
    { h: "2. ¿Qué estructura?" },
    {
      table: [
        ["Situación del enunciado", "Estructura"],
        ["Se conoce el máximo (\"a lo sumo 500\", \"los 100 camiones\")", "Vector con dimL"],
        ["Cantidad desconocida (\"hasta DNI 0\")", "Lista"],
        ["Contar por categoría de un rango chico (géneros 1..5, meses)", "Vector contador"],
        [
          "Una tabla de valores fija (montos por póliza, precio por medio)",
          "Vector que se dispone (se carga con un módulo que no se implementa)"
        ],
        ["Los datos llegan ordenados por un campo", "Corte de control"],
        ["Hay que generar una estructura ordenada", "Lista con insertar ordenado"]
      ]
    },
    { h: "3. ¿Cuántos recorridos?" },
    {
      list: [
        "Por defecto se prioriza la eficiencia: resolver todos los incisos en un único recorrido, con módulos chicos para cada parte (descomponer un número, evaluar una condición, actualizar un vector).",
        "Si el enunciado dice \"realice un módulo que…\" para cada inciso, busca modularización de alto nivel: cada módulo recorre por su cuenta.",
        "Un promedio general y \"cuántos superan el promedio\" siempre necesitan dos recorridos."
      ]
    },
    { h: "Módulos que vas a reusar en todos los parciales" },
    {
      code: `{ Devuelve cuántos dígitos pares e impares tiene n }
procedure paresImpares(n : longint; var pares, impares : integer);
var dig : integer;
begin
  pares := 0; impares := 0;
  repeat
    dig := n mod 10;
    if (dig mod 2 = 0) then pares := pares + 1
    else impares := impares + 1;
    n := n div 10;
  until (n = 0);
end;

{ Actualiza los dos máximos con su código }
procedure actualizarMax(valor, cod : integer;
                        var max1, cod1, max2, cod2 : integer);
begin
  if (valor > max1) then begin
    max2 := max1; cod2 := cod1;
    max1 := valor; cod1 := cod;
  end
  else if (valor > max2) then begin
    max2 := valor; cod2 := cod;
  end;
end;`
    },
    {
      tip: "Los DNI no entran en un integer (máximo 32767). Usá <code>longint</code> para DNI, códigos largos y números de cuenta."
    }
  ],
  quiz: [
    {
      q: "\"Lea números enteros hasta -1 e informe la cantidad de ocurrencias de cada dígito\". ¿Qué hay que almacenar?",
      ops: [
        "Todos los números en un vector",
        "Todos los números en una lista",
        "Solo un vector contador de dígitos",
        "Nada"
      ],
      ok: 2,
      exp: "No se pide guardar los números. Se procesan al leerlos y solo se lleva el contador de 0..9."
    },
    {
      q: "\"Lea y almacene la información de los clientes. La lectura finaliza con el código 1122\". ¿Qué estructura?",
      ops: ["Vector de 1122 posiciones", "Lista", "Vector contador", "Corte de control"],
      ok: 1,
      exp: "No se sabe cuántos clientes hay: lista."
    },
    {
      q: "Hay 100 camiones con códigos 1..100 y viajes en cantidad desconocida que referencian al camión. ¿Cómo se organiza?",
      ops: [
        "Lista de camiones y lista de viajes",
        "Vector de 100 camiones (se dispone) y lista de viajes",
        "Vector de viajes",
        "Todo en un registro"
      ],
      ok: 1,
      exp: "Los camiones son un conjunto fijo indexable por código: vector. Los viajes son una cantidad desconocida: lista."
    },
    {
      q: "Se pide el promedio de todos los montos y cuántos clientes lo superan. ¿Cuántos recorridos como mínimo?",
      ops: ["1", "2", "3", "Depende de la estructura"],
      ok: 1,
      exp: "Necesitás el promedio terminado antes de poder comparar contra él."
    },
    {
      q: "Durante la carga de un vector, ¿conviene ir contando las categorías para ahorrar un recorrido?",
      ops: [
        "Sí, siempre",
        "No, si el enunciado pide leer y almacenar primero",
        "Solo con listas",
        "Solo si hay corte de control"
      ],
      ok: 1,
      exp: "Las consideraciones de la cátedra lo aclaran: cuando se pide almacenar, la carga solo carga."
    },
    {
      q: "¿Qué tipo usás para guardar un DNI como 33555444?",
      ops: ["integer", "longint", "real", "char"],
      ok: 1,
      exp: "integer llega a 32767. longint llega a más de 2 mil millones."
    }
  ],
  ejercicios: [
    {
      ref: "P7 Ej 1",
      titulo: "Casting de actores",
      enunciado: "Leer y almacenar personas (DNI, apellido y nombre, edad, género 1..5) hasta el DNI 33555444, que se procesa. Informar: cuántas tienen más dígitos pares que impares en el DNI y los dos géneros más elegidos. Módulo que elimine un DNI (puede no existir).",
      pista: "Cantidad desconocida → lista. Géneros → vector contador de 1..5. Los incisos a y b salen en un solo recorrido.",
      sol: `program casting;
type
  str30 = string[30];
  persona = record
    dni : longint;
    nombre : str30;
    edad, genero : integer;
  end;
  lista = ^nodo;
  nodo = record
    dato : persona;
    sig : lista;
  end;
  vGeneros = array [1..5] of integer;

procedure leerPersona(var p : persona);
begin
  readln(p.dni); readln(p.nombre); readln(p.edad); readln(p.genero);
end;

procedure agregarAdelante(var L : lista; p : persona);
var nue : lista;
begin
  new(nue); nue^.dato := p; nue^.sig := L; L := nue;
end;

procedure cargar(var L : lista);
var p : persona;
begin
  repeat
    leerPersona(p);
    agregarAdelante(L, p);
  until (p.dni = 33555444);
end;

function masParesQueImpares(dni : longint) : boolean;
var pares, impares : integer;
begin
  pares := 0; impares := 0;
  while (dni <> 0) do begin
    if ((dni mod 10) mod 2 = 0) then pares := pares + 1
    else impares := impares + 1;
    dni := dni div 10;
  end;
  masParesQueImpares := (pares > impares);
end;

procedure procesar(L : lista);
var
  v : vGeneros;
  i, cant, max1, max2, g1, g2 : integer;
begin
  for i := 1 to 5 do v[i] := 0;
  cant := 0;
  while (L <> nil) do begin
    if masParesQueImpares(L^.dato.dni) then cant := cant + 1;
    v[L^.dato.genero] := v[L^.dato.genero] + 1;
    L := L^.sig;
  end;
  max1 := -1; max2 := -1; g1 := 0; g2 := 0;
  for i := 1 to 5 do
    if (v[i] > max1) then begin
      max2 := max1; g2 := g1; max1 := v[i]; g1 := i;
    end
    else if (v[i] > max2) then begin
      max2 := v[i]; g2 := i;
    end;
  writeln('DNI con más pares que impares: ', cant);
  writeln('Géneros más elegidos: ', g1, ' y ', g2);
end;

procedure eliminar(var L : lista; dni : longint);
var ant, act : lista;
begin
  act := L; ant := L;
  while (act <> nil) and (act^.dato.dni <> dni) do begin
    ant := act; act := act^.sig;
  end;
  if (act <> nil) then begin
    if (act = L) then L := act^.sig else ant^.sig := act^.sig;
    dispose(act);
  end;
end;

var
  L : lista;
  dni : longint;
begin
  L := nil;
  cargar(L);
  procesar(L);
  readln(dni);
  eliminar(L, dni);
end.`
    },
    {
      ref: "P7 Ej 12",
      titulo: "Fortaco's",
      enunciado: "Hay una tabla con el costo mensual de 4 suscripciones. Leer y almacenar clientes (nombre, DNI, edad, tipo 1..4) hasta el DNI 0 (no se procesa). Informar la ganancia total y las 2 suscripciones con más clientes.",
      pista: "La tabla de costos se dispone: declarala como vector de 1..4 e invocá un módulo que la cargue (sin implementarlo). Clientes → lista. Un recorrido con un vector contador.",
      sol: `type
  vCostos = array [1..4] of real;
  vCant = array [1..4] of integer;
  cliente = record
    nombre : string[30];
    dni : longint;
    edad, tipo : integer;
  end;
  lista = ^nodo;
  nodo = record
    dato : cliente;
    sig : lista;
  end;

procedure procesar(L : lista; costos : vCostos);
var
  cant : vCant;
  i, max1, max2, t1, t2 : integer;
  total : real;
begin
  for i := 1 to 4 do cant[i] := 0;
  total := 0;
  while (L <> nil) do begin
    total := total + costos[L^.dato.tipo];
    cant[L^.dato.tipo] := cant[L^.dato.tipo] + 1;
    L := L^.sig;
  end;
  max1 := -1; max2 := -1; t1 := 0; t2 := 0;
  for i := 1 to 4 do
    if (cant[i] > max1) then begin
      max2 := max1; t2 := t1; max1 := cant[i]; t1 := i;
    end
    else if (cant[i] > max2) then begin
      max2 := cant[i]; t2 := i;
    end;
  writeln('Ganancia total: $', total:0:2);
  writeln('Suscripciones con más clientes: ', t1, ' y ', t2);
end;
{ Programa principal:
    cargarCostos(costos);   se dispone, no se implementa
    cargarClientes(L);      lectura previa + while (dni <> 0)
    procesar(L, costos); }`
    },
    {
      ref: "P7 Ej 3",
      titulo: "Remisería",
      enunciado: "Se dispone de los viajes de mayo (número, código de auto, origen, destino, km), ordenados por código de auto. (a) Los dos autos con más km. (b) Generar una lista nueva con los viajes de más de 5 km, ordenada por número de viaje.",
      pista: "La estructura se dispone y viene ordenada por auto: corte de control sobre la lista. Para (b), insertar ordenado por número en la lista nueva, dentro del mismo recorrido.",
      sol: `procedure procesar(L : lista; var nueva : lista);
var
  actual, cod1, cod2 : integer;
  km, max1, max2 : real;
begin
  nueva := nil;
  max1 := -1; max2 := -1; cod1 := 0; cod2 := 0;
  while (L <> nil) do begin
    actual := L^.dato.codAuto;
    km := 0;
    while (L <> nil) and (L^.dato.codAuto = actual) do begin
      km := km + L^.dato.km;
      if (L^.dato.km > 5) then
        insertarOrdenado(nueva, L^.dato);   { por número de viaje }
      L := L^.sig;
    end;
    if (km > max1) then begin
      max2 := max1; cod2 := cod1; max1 := km; cod1 := actual;
    end
    else if (km > max2) then begin
      max2 := km; cod2 := actual;
    end;
  end;
  writeln('Autos con más km: ', cod1, ' y ', cod2);
end;
{ En el corte de control sobre una lista, el while interno
  también pregunta (L <> nil): el último grupo termina en nil. }`
    }
  ]
};

export default tema;

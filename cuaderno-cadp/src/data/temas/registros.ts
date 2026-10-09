import type { Tema } from "../types";

const tema: Tema = {
  id: "registros",
  num: "P3",
  titulo: "Registros",
  fuente: "Práctica 3",
  resumen: "Agrupar datos de una misma entidad en un tipo record y procesar información ordenada con corte de control.",
  sim: "corte",
  teoria: [
    { h: "Definir y usar un registro" },
    {
      p: "Un registro agrupa campos de tipos distintos que describen una misma cosa. Se declara en <code>type</code> y se accede a cada campo con un punto."
    },
    {
      code: `type
  str20 = string[20];
  fecha = record
    dia, mes, anio : integer;
  end;
  alumno = record
    codigo   : integer;
    nombre   : str20;
    promedio : real;
    ingreso  : fecha;       { un registro dentro de otro }
  end;
var
  a, b : alumno;
begin
  a.codigo := 1234;
  a.ingreso.anio := 2026;
  b := a;                   { asignación completa: mismo tipo }
end.`
    },
    { h: "Lo que no se puede hacer" },
    {
      list: [
        "<code>read(a)</code> o <code>writeln(a)</code> con el registro completo: se lee y escribe campo por campo.",
        "<code>if (a = b)</code>: los registros se comparan campo por campo.",
        "Una función no puede devolver un registro: se usa un procedimiento con parámetro <code>var</code>."
      ]
    },
    {
      code: `procedure leerAlumno(var alu : alumno);
begin
  readln(alu.codigo);
  if (alu.codigo <> 0) then begin
    readln(alu.nombre);
    readln(alu.promedio);
  end;
end;`
    },
    {
      tip: "Cuando un registro tiene campos string, leé cada campo con <code>readln</code>. Un <code>read</code> de un número deja pendiente el fin de la línea, y el siguiente read de un string lee esa línea vacía."
    },
    { h: "Corte de control" },
    {
      p: "Cuando el enunciado dice que la información \"se ingresa ordenada por marca\" (o por universidad, localidad, etc.), los datos de un mismo grupo llegan juntos. Eso permite calcular totales por grupo sin guardar nada: un bucle externo recorre grupos y uno interno recorre los elementos del grupo actual."
    },
    {
      code: `leerAuto(a);
while (a.marca <> 'ZZZ') do begin
  marcaActual := a.marca;
  cant := 0; suma := 0;
  while (a.marca = marcaActual) do begin   { mismo grupo }
    cant := cant + 1;
    suma := suma + a.precio;
    leerAuto(a);
  end;
  writeln(marcaActual, ': promedio ', suma / cant :0:2);
end;`
    },
    {
      tip: "La condición del bucle interno también debe controlar el fin de datos si el valor de corte podría coincidir con el grupo actual. Con 'ZZZ' como marca de fin no hace falta, porque ninguna marca real es 'ZZZ'."
    },
    {
      p: "Con dos niveles (por localidad y, dentro, por escuela) se anida un bucle más: cada nivel tiene su variable <code>actual</code> y sus contadores."
    }
  ],
  quiz: [
    {
      q: "¿Cuál de estas sentencias es válida si <code>a</code> y <code>b</code> son del mismo tipo registro?",
      ops: ["read(a)", "if (a = b) then", "b := a", "writeln(a)"],
      ok: 2,
      exp: "La asignación completa entre registros del mismo tipo está permitida. Leer, escribir y comparar se hace campo a campo."
    },
    {
      q: "Un módulo debe leer un registro completo. ¿Cómo lo declarás?",
      ops: [
        "function leer : alumno;",
        "procedure leer(var a : alumno);",
        "procedure leer(a : alumno);",
        "function leer(var a : alumno) : boolean;"
      ],
      ok: 1,
      exp: "Las funciones devuelven tipos simples. Un procedimiento con var deja el registro cargado en la variable del llamador."
    },
    {
      q: "\"La información se ingresa ordenada por marca\". ¿Qué técnica habilita eso?",
      ops: ["Búsqueda dicotómica", "Corte de control", "Vector contador", "Insertar ordenado"],
      ok: 1,
      exp: "Los autos de una misma marca llegan consecutivos, así que podés procesar marca por marca con un while anidado."
    },
    {
      q: "En un corte de control, ¿dónde se inicializan los contadores de cada grupo?",
      ops: [
        "Antes del while externo",
        "Dentro del while externo, antes del interno",
        "Dentro del while interno",
        "Después del while externo"
      ],
      ok: 1,
      exp: "Cada grupo empieza de cero. Se inicializan al entrar a un grupo nuevo, antes del bucle interno."
    },
    {
      q: "¿Cuántos bytes ocupa <code>fecha = record dia, mes, anio : integer; end;</code> con la tabla de la cátedra (integer = 2)?",
      ops: ["2", "3", "6", "12"],
      ok: 2,
      exp: "Un registro ocupa la suma de sus campos: 3 × 2 = 6 bytes."
    },
    {
      q: "¿Cómo accedés al año de ingreso de <code>a</code> si <code>ingreso</code> es un registro <code>fecha</code>?",
      ops: ["a.anio", "a.ingreso.anio", "ingreso.a.anio", "a[ingreso].anio"],
      ok: 1,
      exp: "Se encadenan los puntos desde afuera hacia adentro."
    }
  ],
  ejercicios: [
    {
      ref: "P3 Ej 1",
      titulo: "Alumno con mejor promedio",
      enunciado: "Usando el módulo leer, leer alumnos hasta el código 0 (no se procesa). Informar cuántos se leyeron y el nombre del de mejor promedio.",
      pista: "El módulo leer ya contempla el código 0, así que encaja con lectura previa + while.",
      sol: `program Registros;
type
  str20 = string[20];
  alumno = record
    codigo : integer;
    nombre : str20;
    promedio : real;
  end;
procedure leer(var alu : alumno);
begin
  readln(alu.codigo);
  if (alu.codigo <> 0) then begin
    readln(alu.nombre);
    readln(alu.promedio);
  end;
end;
var
  a : alumno;
  cant : integer;
  maxProm : real;
  mejor : str20;
begin
  cant := 0; maxProm := -1; mejor := '';
  leer(a);
  while (a.codigo <> 0) do begin
    cant := cant + 1;
    if (a.promedio > maxProm) then begin
      maxProm := a.promedio;
      mejor := a.nombre;
    end;
    leer(a);
  end;
  writeln('Alumnos leídos: ', cant);
  writeln('Mejor promedio: ', mejor);
end.`
    },
    {
      ref: "P3 Ej 2",
      titulo: "Casamientos 2019",
      enunciado: "Definir un tipo fecha, un módulo que la lea, y leer fechas de casamientos de 2019 hasta el año 2020 (no se procesa). Informar cuántos fueron en verano (enero a marzo) y cuántos en los primeros 10 días de cada mes.",
      pista: "El corte depende del año: el módulo puede leer el año primero. Las dos condiciones son independientes (un casamiento puede contar en ambas).",
      sol: `program casamientos;
type
  fecha = record
    dia, mes, anio : integer;
  end;
procedure leerFecha(var f : fecha);
begin
  read(f.anio);
  if (f.anio <> 2020) then begin
    read(f.mes);
    read(f.dia);
  end;
end;
var
  f : fecha;
  verano, primeros10 : integer;
begin
  verano := 0; primeros10 := 0;
  leerFecha(f);
  while (f.anio <> 2020) do begin
    if (f.mes <= 3) then verano := verano + 1;
    if (f.dia <= 10) then primeros10 := primeros10 + 1;
    leerFecha(f);
  end;
  writeln('En verano: ', verano);
  writeln('En los primeros 10 días: ', primeros10);
end.`
    },
    {
      ref: "P3 Ej 5",
      titulo: "Precio promedio por marca",
      enunciado: "Leer autos (marca, modelo, precio) hasta la marca 'ZZZ' (no se procesa), ordenados por marca. Informar el precio promedio por marca y la marca y modelo del más caro.",
      pista: "Corte de control por marca. El más caro se actualiza en el bucle interno, comparando contra un máximo general.",
      sol: `program concesionaria;
type
  str20 = string[20];
  auto = record
    marca, modelo : str20;
    precio : real;
  end;
procedure leerAuto(var a : auto);
begin
  readln(a.marca);
  if (a.marca <> 'ZZZ') then begin
    readln(a.modelo);
    readln(a.precio);
  end;
end;
var
  a : auto;
  actual, marcaMax, modeloMax : str20;
  cant : integer;
  suma, max : real;
begin
  max := -1;
  leerAuto(a);
  while (a.marca <> 'ZZZ') do begin
    actual := a.marca;
    cant := 0; suma := 0;
    while (a.marca = actual) do begin
      cant := cant + 1;
      suma := suma + a.precio;
      if (a.precio > max) then begin
        max := a.precio;
        marcaMax := a.marca;
        modeloMax := a.modelo;
      end;
      leerAuto(a);
    end;
    writeln(actual, ': promedio ', suma / cant :0:2);
  end;
  writeln('Más caro: ', marcaMax, ' ', modeloMax);
end.`
    },
    {
      ref: "P3 Ej 4",
      titulo: "Facturación de telefonía",
      enunciado: "Para 9300 clientes se lee código y cantidad de líneas; de cada línea, número, minutos y MB. Con un módulo que lea una línea y otro que lea todas las líneas de un cliente y devuelva el total de minutos y MB, informar el monto a facturar ($3,40 por minuto y $1,35 por MB).",
      pista: "El módulo del inciso b recibe el cliente (o su cantidad de líneas) y devuelve dos valores: procedimiento con dos var.",
      sol: `program telefonia;
type
  linea = record
    numero : longint;
    minutos, mb : real;
  end;
  cliente = record
    codigo, cantLineas : integer;
  end;
procedure leerLinea(var l : linea);
begin
  read(l.numero, l.minutos, l.mb);
end;
procedure procesarCliente(c : cliente; var totMin, totMB : real);
var
  i : integer;
  l : linea;
begin
  totMin := 0; totMB := 0;
  for i := 1 to c.cantLineas do begin
    leerLinea(l);
    totMin := totMin + l.minutos;
    totMB := totMB + l.mb;
  end;
end;
var
  c : cliente;
  i : integer;
  mins, mbs : real;
begin
  for i := 1 to 9300 do begin
    read(c.codigo, c.cantLineas);
    procesarCliente(c, mins, mbs);
    writeln('Cliente ', c.codigo, ': $', mins * 3.40 + mbs * 1.35 :0:2);
  end;
end.`
    }
  ]
};

export default tema;

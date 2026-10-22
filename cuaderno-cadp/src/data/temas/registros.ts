import type { Tema } from "../types";
import { guiaP3 } from "../guia/p3";

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
  ejercicios: guiaP3,
};

export default tema;

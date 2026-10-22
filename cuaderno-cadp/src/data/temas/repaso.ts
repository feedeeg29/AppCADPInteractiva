import type { Tema } from "../types";
import { guiaP7a } from "../guia/p7a";
import { guiaP7b } from "../guia/p7b";

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
  ejercicios: [...guiaP7a, ...guiaP7b],
};

export default tema;

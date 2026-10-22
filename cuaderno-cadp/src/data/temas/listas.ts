import type { Tema } from "../types";
import { guiaP6a } from "../guia/p6a";
import { guiaP6b } from "../guia/p6b";

const tema: Tema = {
  id: "listas",
  num: "P6",
  titulo: "Listas",
  fuente: "Práctica 6",
  resumen: "La estructura dinámica de la materia: crear nodos, recorrer, agregar adelante y atrás, insertar ordenado y eliminar.",
  sim: "listas",
  teoria: [
    { h: "Declaración" },
    {
      p: "Una lista es una secuencia de nodos en memoria dinámica. Cada nodo tiene un dato y un puntero al siguiente. Se accede solo desde el primero y se recorre en orden."
    },
    {
      code: `type
  lista = ^nodo;            { se declara antes que nodo: es la excepción }
  nodo = record
    dato : integer;
    sig  : lista;
  end;
var
  pri : lista;
begin
  pri := nil;               { lista vacía }
end.`
    },
    { h: "Recorrer" },
    {
      code: `procedure imprimir(L : lista);
begin
  while (L <> nil) do begin
    writeln(L^.dato);
    L := L^.sig;
  end;
end;`
    },
    { tip: "L se pasa por valor: el módulo avanza su copia y el pri del programa principal no se mueve." },
    { h: "Agregar adelante" },
    { p: "La forma más simple. Los elementos quedan en orden inverso al de lectura." },
    {
      code: `procedure agregarAdelante(var L : lista; n : integer);
var nue : lista;
begin
  new(nue);
  nue^.dato := n;
  nue^.sig := L;
  L := nue;
end;`
    },
    { h: "Agregar atrás con puntero al último" },
    {
      p: "Mantiene el orden de lectura. Sin <code>ult</code> habría que recorrer la lista entera en cada inserción."
    },
    {
      code: `procedure agregarAtras(var pri, ult : lista; n : integer);
var nue : lista;
begin
  new(nue);
  nue^.dato := n;
  nue^.sig := nil;
  if (pri = nil) then pri := nue
  else ult^.sig := nue;
  ult := nue;
end;`
    },
    { h: "Insertar ordenado" },
    {
      p: "Se avanza con dos punteros, <code>ant</code> y <code>act</code>, hasta encontrar dónde va el nuevo nodo. Hay que contemplar el caso en que va primero."
    },
    {
      code: `procedure insertarOrdenado(var pri : lista; n : integer);
var nue, ant, act : lista;
begin
  new(nue);
  nue^.dato := n;
  act := pri; ant := pri;
  while (act <> nil) and (act^.dato < n) do begin
    ant := act;
    act := act^.sig;
  end;
  if (act = pri) then pri := nue        { va al principio }
  else ant^.sig := nue;                 { va en el medio o al final }
  nue^.sig := act;
end;`
    },
    { h: "Eliminar" },
    {
      code: `procedure eliminar(var pri : lista; n : integer; var ok : boolean);
var ant, act : lista;
begin
  act := pri; ant := pri;
  while (act <> nil) and (act^.dato <> n) do begin
    ant := act;
    act := act^.sig;
  end;
  ok := (act <> nil);
  if ok then begin
    if (act = pri) then pri := act^.sig
    else ant^.sig := act^.sig;
    dispose(act);
  end;
end;`
    },
    { h: "¿Vector o lista?" },
    {
      table: [
        ["", "Vector", "Lista"],
        ["Tamaño", "Fijo (dimF), hay que conocer el máximo", "Crece y se achica en ejecución"],
        ["Acceso", "Directo por posición: v[i]", "Secuencial desde pri"],
        ["Insertar / eliminar", "Requiere corrimientos", "Se reacomodan punteros"],
        ["Memoria", "Estática", "Dinámica (dato + 4 bytes por nodo)"]
      ]
    }
  ],
  quiz: [
    {
      q: "Con <code>armarNodo</code> agregando adelante, leés 10 21 13 48 0. ¿Cómo queda la lista?",
      ops: ["10 → 21 → 13 → 48", "48 → 13 → 21 → 10", "10 → 13 → 21 → 48", "0 → 48 → 13 → 21 → 10"],
      ok: 1,
      exp: "Cada número nuevo pasa a ser el primero. El 0 corta y no se agrega."
    },
    {
      q: "En <code>agregarAdelante</code>, ¿por qué <code>L</code> tiene que ser <code>var</code>?",
      ops: [
        "Porque es un puntero",
        "Porque cambia a dónde apunta el primero",
        "No hace falta",
        "Para poder hacer new"
      ],
      ok: 1,
      exp: "Después de agregar, pri tiene que apuntar al nodo nuevo. Si L va por valor, ese cambio se pierde."
    },
    {
      q: "¿Qué falla en este fragmento?",
      code: `procedure agregarAdelante(var l : lista; p : persona);
var aux : lista;
begin
  aux^.dato := p;
  aux^.sig := l;
  l := aux;
end;`,
      ops: ["Falta new(aux)", "aux debería ser var", "Falta dispose", "l debería ser por valor"],
      ok: 0,
      exp: "aux tiene basura: hay que pedir memoria con new(aux) antes de usar aux^."
    },
    {
      q: "En <code>insertarOrdenado</code>, terminaste el while con <code>act = pri</code>. ¿Qué significa?",
      ops: [
        "La lista estaba vacía o el nuevo va primero",
        "El nuevo va al final",
        "El valor ya existía",
        "Hay un error"
      ],
      ok: 0,
      exp: "Nunca se avanzó: o no había nodos o el primero ya era mayor. Hay que actualizar pri."
    },
    {
      q: "Al eliminar un nodo que no es el primero, ¿qué enganchás?",
      ops: ["pri := act^.sig", "ant^.sig := act^.sig", "act := ant", "ant := nil"],
      ok: 1,
      exp: "El anterior pasa a apuntar al siguiente del eliminado. Después se hace dispose(act)."
    },
    {
      q: "La cantidad de datos es desconocida y hay que insertar ordenado muchas veces. ¿Qué estructura conviene?",
      ops: ["Vector", "Lista", "Registro", "Vector contador"],
      ok: 1,
      exp: "No hay un máximo conocido y la inserción en una lista no requiere corrimientos."
    },
    {
      q: "Sublista entre A y B sobre una lista <b>ordenada ascendente</b>. ¿Cuándo podés dejar de recorrer?",
      ops: [
        "Nunca, hay que llegar a nil",
        "Cuando el dato es mayor o igual que B",
        "Cuando el dato es mayor que A",
        "Al primer elemento"
      ],
      ok: 1,
      exp: "De ahí en adelante todos son ≥ B, así que ninguno entra en la sublista."
    }
  ],
  ejercicios: [...guiaP6a, ...guiaP6b],
};

export default tema;

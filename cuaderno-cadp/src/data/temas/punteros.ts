import type { Tema } from "../types";
import { guiaP5 } from "../guia/p5";

const tema: Tema = {
  id: "punteros",
  num: "P5",
  titulo: "Punteros",
  fuente: "Práctica 5",
  resumen: "Memoria estática y dinámica, new y dispose, y cómo calcular cuánta memoria ocupa un programa.",
  sim: "punteros",
  teoria: [
    { h: "Memoria estática y dinámica" },
    {
      list: [
        "<b>Estática</b>: la de las variables declaradas en <code>var</code>. Su tamaño se conoce al compilar y se reserva durante toda la ejecución (o del módulo, si son locales).",
        "<b>Dinámica</b>: la que se pide y se libera mientras el programa corre, con <code>new</code> y <code>dispose</code>. Vive en el heap."
      ]
    },
    { h: "Variable puntero" },
    {
      p: "Un puntero guarda una <b>dirección de memoria</b>. Siempre ocupa 4 bytes, sin importar a qué tipo apunte. Lo apuntado se accede con <code>^</code>."
    },
    {
      code: `type
  cadena = string[50];
  pCadena = ^cadena;        { tipo puntero a cadena }
var
  p, q : pCadena;
begin
  new(p);                   { reserva 51 bytes en el heap }
  p^ := 'hola';             { escribe en esa memoria }
  q := p;                   { q apunta al MISMO lugar }
  writeln(q^);              { hola }
  dispose(p);               { libera los 51 bytes }
  p := nil;                 { buena práctica }
end.`
    },
    { h: "Operaciones" },
    {
      table: [
        ["Operación", "Qué hace"],
        [
          "<code>new(p)</code>",
          "Reserva en el heap el tamaño del tipo apuntado y guarda la dirección en p."
        ],
        [
          "<code>dispose(p)</code>",
          "Libera esa memoria. p sigue guardando la dirección, pero ya no es válida."
        ],
        ["<code>p := nil</code>", "p no apunta a nada. Es el valor que marca el fin de una lista."],
        ["<code>p := q</code>", "Copia la dirección: los dos apuntan al mismo lugar."],
        ["<code>p^ := q^</code>", "Copia el contenido de un lugar al otro."]
      ]
    },
    { h: "Tamaños (tabla de la cátedra)" },
    {
      table: [
        ["Tipo", "Bytes"],
        ["integer", "2"],
        ["real", "4"],
        ["char", "1"],
        ["boolean", "1"],
        ["string[n]", "n + 1"],
        ["puntero", "4"],
        ["record", "suma de sus campos"],
        ["array", "cantidad × tamaño del elemento"]
      ]
    },
    {
      tip: "<code>sizeof(p)</code> siempre da 4, porque mide el puntero. <code>sizeof(p^)</code> da el tamaño del tipo apuntado, aunque el string guarde menos caracteres."
    },
    { h: "Errores clásicos" },
    {
      list: [
        "Usar <code>p^</code> antes de <code>new(p)</code>: p tiene basura y escribís en cualquier lado.",
        "Usar <code>p^</code> después de <code>dispose(p)</code>: esa memoria ya no es tuya.",
        "Hacer <code>new(p)</code> dos veces sin <code>dispose</code>: la primera memoria queda perdida, sin forma de liberarla.",
        "Un puntero pasado <b>por valor</b> a un módulo: el módulo puede cambiar <code>p^</code> (el contenido se comparte) pero no a dónde apunta p."
      ]
    }
  ],
  quiz: [
    {
      q: "<code>cadena = string[50]</code>, <code>pc : ^cadena</code>. Después de <code>new(pc); pc^ := 'un nuevo nombre';</code>, ¿qué imprime <code>sizeof(pc^)</code>?",
      ops: ["4", "15", "16", "51"],
      ok: 3,
      exp: "sizeof mide el tipo, no el contenido: string[50] ocupa 50 + 1 = 51 bytes."
    },
    {
      q: "¿Y <code>sizeof(pc)</code>?",
      ops: ["4", "51", "0", "Depende de si se hizo new"],
      ok: 0,
      exp: "Un puntero siempre ocupa 4 bytes."
    },
    {
      q: "<code>producto = record codigo : integer; descripcion : string[9]; precio : real; end;</code> ¿Cuántos bytes ocupa?",
      ops: ["15", "16", "17", "14"],
      ok: 1,
      exp: "2 (integer) + 10 (string[9]) + 4 (real) = 16."
    },
    {
      q: "¿Qué pasa con este código?",
      code: `new(pc);
pc^ := 'Un texto';
cambiarTexto(pc);   { procedure cambiarTexto(pun : puntero_cadena);
                      begin pun^ := 'Otro texto'; end; }
writeln(pc^);`,
      ops: ["Imprime Un texto", "Imprime Otro texto", "Error de compilación", "Imprime basura"],
      ok: 1,
      exp: "El puntero se copia, pero la copia apunta al mismo lugar. Modificar pun^ modifica lo que ve pc^."
    },
    {
      q: "Ahora <code>cambiarTexto</code> hace <code>new(pun); pun^ := 'Otro texto';</code>. ¿Qué imprime <code>writeln(pc^)</code>?",
      ops: ["Un texto", "Otro texto", "Error", "Nada"],
      ok: 0,
      exp: "new le da a la copia una dirección nueva. pc sigue apuntando a 'Un texto', y la memoria pedida adentro queda perdida."
    },
    {
      q: "Tenés 400.000 bytes libres. Hacés <code>Readln(alguien.apellido)</code> sobre una variable estática. ¿Cuánta memoria dinámica libre queda?",
      ops: ["400.000", "399.974", "399.928", "Depende del largo del apellido"],
      ok: 0,
      exp: "La variable estática ya estaba reservada. Leer en ella no pide memoria del heap."
    },
    {
      q: "Con <code>TEmpleado</code> de 72 bytes, después de <code>New(PtrEmpleado)</code> y antes de <code>Dispose</code>, ¿cuánto queda libre de los 400.000?",
      ops: ["400.000", "399.996", "399.928", "399.924"],
      ok: 2,
      exp: "new reserva sizeof(TEmpleado) = 1 + 26 + 41 + 4 = 72 bytes. El puntero en sí es estático."
    },
    {
      q: "¿Qué ocupa <code>array[1..2500] of ^string[50]</code> al iniciar el programa?",
      ops: ["127.500 bytes", "10.000 bytes", "0 bytes", "2.500 bytes"],
      ok: 1,
      exp: "Son 2500 punteros de 4 bytes. Los strings recién ocuparán memoria dinámica cuando hagas new de cada uno."
    }
  ],
  ejercicios: guiaP5,
};

export default tema;

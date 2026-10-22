import type { Ejercicio } from "../types";

const GC = "Práctica 5 · Parte conceptual";
const GP = "Práctica 5 · Parte práctica";

export const guiaP5: Ejercicio[] = [
  // ---------------- Conceptual ----------------
  {
    grupo: GC, ref: "P5 C 1", titulo: "¿Qué es la memoria estática?",
    enunciado: "¿Qué se define como memoria estática?",
    pista: "Pensá en las variables que declarás en var: ¿cuándo se sabe cuánto ocupan y cuánto tiempo existen?",
    sol: `{ Memoria estática: la que ocupan las variables declaradas en el
  programa (en las secciones var). Su tamaño se conoce al compilar y
  no cambia durante la ejecución.
  - Las variables del programa principal existen durante toda la ejecución.
  - Las variables locales y los parámetros de un módulo existen mientras
    el módulo se está ejecutando.
  Ejemplo: var v : array[1..100] of integer;  ocupa 200 bytes desde que
  arranca el programa, aunque solo se usen 3 posiciones. }`,
  },
  {
    grupo: GC, ref: "P5 C 2", titulo: "¿Qué es la memoria dinámica?",
    enunciado: "¿Qué se define como memoria dinámica?",
    pista: "¿Quién decide, y en qué momento, cuánta memoria se usa?",
    sol: `{ Memoria dinámica: la que el programa pide y libera mientras se
  ejecuta, con new y dispose. Vive en una zona llamada heap.
  Su tamaño no se conoce al compilar: depende de cuántas veces se haga
  new (por ejemplo, una lista crece con cada dato leído).
  Se accede a ella a través de punteros, porque esa memoria no tiene
  un nombre de variable propio. }`,
  },
  {
    grupo: GC, ref: "P5 C 3", titulo: "¿Qué es una variable puntero?",
    enunciado: "¿Qué es una variable de tipo puntero?",
    pista: "¿Qué guarda adentro? ¿Cuánto ocupa?",
    sol: `{ Un puntero es una variable que guarda una dirección de memoria:
  la del dato al que apunta. Con la tabla de la cátedra ocupa 4 bytes,
  sin importar el tipo apuntado.
  - p     es la dirección.
  - p^    es el dato que está en esa dirección.
  - nil   es un valor especial: "no apunta a nada".
  type pEntero = ^integer;
  var p : pEntero;      p es estático (4 bytes); p^ es dinámico (2 bytes, después de new). }`,
  },
  {
    grupo: GC, ref: "P5 C 4", titulo: "¿Qué hace new?",
    enunciado: "¿Qué hace la operación NEW aplicada a una variable de tipo puntero?",
    pista: "Pensá en qué cambia en el heap y qué queda guardado en el puntero.",
    sol: `{ new(p) reserva en la memoria dinámica el espacio que ocupa el tipo
  apuntado (sizeof(p^)) y guarda en p la dirección de ese espacio.
  El contenido reservado no está inicializado: hay que asignarle valor
  (p^ := ...) antes de usarlo.
  Si p ya apuntaba a otra memoria y nadie más la apunta, esa memoria
  queda perdida: ya no se puede usar ni liberar. }`,
  },
  {
    grupo: GC, ref: "P5 C 5", titulo: "¿Qué hace dispose?",
    enunciado: "¿Qué hace la operación DISPOSE aplicada a una variable de tipo puntero?",
    pista: "¿Qué pasa con la memoria y qué pasa con el valor de p?",
    sol: `{ dispose(p) libera la memoria dinámica a la que apunta p: queda
  disponible para futuros new.
  p sigue guardando la misma dirección, pero ya no es válida: usar p^
  después de dispose es un error (puntero "colgante"). Conviene hacer
  p := nil después.
  También es un error hacer dispose de un puntero en nil o dos veces
  sobre la misma memoria. }`,
  },

  // ---------------- Práctica ----------------
  {
    grupo: GP, ref: "P5 Ej 1", titulo: "sizeof de un puntero a cadena",
    enunciado: "cadena = string[50]; puntero_cadena = ^cadena. Indicar qué imprime el programa: sizeof(pc) antes y después de new, después de asignar 'un nuevo nombre', sizeof(pc^), y sizeof(pc^) después de asignar un texto más largo. Justificar con una prueba de escritorio.",
    pista: "sizeof depende del tipo, nunca del contenido. Un puntero ocupa 4 bytes y un string[50], 51.",
    sol: `{ Salida (con la tabla de la cátedra):
  4 bytes     sizeof(pc): un puntero ocupa 4 bytes
  4 bytes     después de new: el puntero sigue ocupando lo mismo
  4 bytes     después de asignar pc^
  51 bytes    sizeof(pc^): string[50] ocupa 50 + 1
  51 bytes    con otro texto: el tipo no cambió
  En Free Pascal de 64 bits un puntero ocupa 8 bytes. El compilador del
  Cuaderno usa la tabla de la cátedra. }
program punteros;
type
  cadena = string[50];
  puntero_cadena = ^cadena;
var
  pc : puntero_cadena;
begin
  writeln(sizeof(pc), ' bytes');
  new(pc);
  writeln(sizeof(pc), ' bytes');
  pc^ := 'un nuevo nombre';
  writeln(sizeof(pc), ' bytes');
  writeln(sizeof(pc^), ' bytes');
  pc^ := 'otro nuevo nombre distinto al anterior';
  writeln(sizeof(pc^), ' bytes');
end.`,
  },
  {
    grupo: GP, ref: "P5 Ej 2", titulo: "sizeof de un registro",
    enunciado: "producto = record codigo: integer; descripcion: string[9]; precio: real; end; puntero_producto = ^producto. Indicar qué imprime cada sizeof del programa.",
    pista: "Un registro ocupa la suma de sus campos: 2 + 10 + 4.",
    sol: `{ Salida:
  4 bytes     sizeof(p)
  16 bytes    sizeof(prod) = 2 (integer) + 10 (string[9]) + 4 (real)
  4 bytes     sizeof(p) después de new
  16 bytes    sizeof(p^)
  16 bytes    sizeof(p^) (asignar campos no cambia el tamaño)
  16 bytes    sizeof(prod)
  Ojo: 'nuevo producto' tiene más de 9 caracteres: se guarda recortado. }
program punteros;
type
  cadena = string[9];
  producto = record
    codigo : integer;
    descripcion : cadena;
    precio : real;
  end;
  puntero_producto = ^producto;
var
  p : puntero_producto;
  prod : producto;
begin
  writeln(sizeof(p), ' bytes');
  writeln(sizeof(prod), ' bytes');
  new(p);
  writeln(sizeof(p), ' bytes');
  p^.codigo := 1;
  p^.descripcion := 'nuevo producto';
  writeln(sizeof(p^), ' bytes');
  p^.precio := 200;
  writeln(sizeof(p^), ' bytes');
  prod.codigo := 2;
  prod.descripcion := 'otro nuevo producto';
  writeln(sizeof(prod), ' bytes');
end.`,
  },
  {
    grupo: GP, ref: "P5 Ej 3", titulo: "sizeof de un arreglo",
    enunciado: "numeros = array[1..10000] of integer; puntero_numeros = ^numeros. Indicar qué imprime: sizeof(n), sizeof(num), sizeof(n^) después de new y después de cargar 5000 posiciones.",
    pista: "10000 enteros de 2 bytes. Cargar datos no cambia el tamaño del tipo.",
    sol: `{ Salida:
  4 bytes        sizeof(n): es un puntero
  20000 bytes    sizeof(num) = 10000 * 2
  20000 bytes    sizeof(n^)
  20000 bytes    sizeof(n^) después de cargar 5000 posiciones: no cambia }
program punteros;
type
  numeros = array [1..10000] of integer;
  puntero_numeros = ^numeros;
var
  n : puntero_numeros;
  num : numeros;
  i : integer;
begin
  writeln(sizeof(n), ' bytes');
  writeln(sizeof(num), ' bytes');
  new(n);
  writeln(sizeof(n^), ' bytes');
  for i := 1 to 5000 do
    n^[i] := i;
  writeln(sizeof(n^), ' bytes');
end.`,
  },
  {
    grupo: GP, ref: "P5 Ej 4a", titulo: "Asignar antes de new",
    enunciado: "pc^ := 'un nuevo texto'; new(pc); writeln(pc^). ¿Qué imprime?",
    pista: "¿A dónde apunta pc en la primera línea?",
    sol: `{ Error: en la primera línea pc todavía no apunta a memoria reservada,
  así que pc^ := ... escribe en una dirección inválida (en Free Pascal,
  un error en tiempo de ejecución). Y aunque no fallara, new(pc)
  reserva memoria nueva, sin ese texto: writeln(pc^) imprimiría basura.
  Ejecutalo en el compilador para ver el mensaje de error. }
program punteros;
type
  cadena = string[50];
  puntero_cadena = ^cadena;
var
  pc : puntero_cadena;
begin
  pc^ := 'un nuevo texto';
  new(pc);
  writeln(pc^);
end.`,
  },
  {
    grupo: GP, ref: "P5 Ej 4b", titulo: "Usar después de dispose",
    enunciado: "new(pc); pc^ := 'un nuevo nombre'; writeln(sizeof(pc^)); writeln(pc^); dispose(pc); pc^ := 'otro nuevo nombre'. ¿Qué imprime?",
    pista: "Las dos primeras líneas de salida están bien. ¿Qué pasa con la última asignación?",
    sol: `{ Imprime:
  51 bytes
  un nuevo nombre
  La última asignación es un error: después de dispose(pc) la memoria
  ya no pertenece al programa (pc quedó "colgando"). }
program punteros;
type
  cadena = string[50];
  puntero_cadena = ^cadena;
var
  pc : puntero_cadena;
begin
  new(pc);
  pc^ := 'un nuevo nombre';
  writeln(sizeof(pc^), ' bytes');
  writeln(pc^);
  dispose(pc);
  pc^ := 'otro nuevo nombre';
end.`,
  },
  {
    grupo: GP, ref: "P5 Ej 4c", titulo: "Puntero por valor (1)",
    enunciado: "cambiarTexto(pun: puntero_cadena) hace pun^ := 'Otro texto'. El programa hace new(pc); pc^ := 'Un texto'; writeln(pc^); cambiarTexto(pc); writeln(pc^). ¿Qué imprime?",
    pista: "pun es una copia de pc... pero las dos copias guardan la misma dirección.",
    sol: `{ Imprime:
  Un texto
  Otro texto
  pun se pasa por valor, así que es una copia del puntero. Pero la copia
  apunta al mismo lugar que pc: modificar pun^ modifica lo que ve pc^. }
program punteros;
type
  cadena = string[50];
  puntero_cadena = ^cadena;

procedure cambiarTexto(pun : puntero_cadena);
begin
  pun^ := 'Otro texto';
end;

var
  pc : puntero_cadena;
begin
  new(pc);
  pc^ := 'Un texto';
  writeln(pc^);
  cambiarTexto(pc);
  writeln(pc^);
end.`,
    entrada: "",
  },
  {
    grupo: GP, ref: "P5 Ej 4d", titulo: "Puntero por valor (2)",
    enunciado: "Igual que el anterior, pero cambiarTexto hace new(pun) antes de pun^ := 'Otro texto'. ¿Qué imprime?",
    pista: "new cambia a dónde apunta la copia, no el original.",
    sol: `{ Imprime:
  Un texto
  Un texto
  new(pun) le da a la copia una dirección nueva. El texto se escribe ahí,
  y pc sigue apuntando a 'Un texto'. Al salir del procedimiento, la
  memoria reservada adentro queda perdida (nadie la apunta). }
program punteros;
type
  cadena = string[50];
  puntero_cadena = ^cadena;

procedure cambiarTexto(pun : puntero_cadena);
begin
  new(pun);
  pun^ := 'Otro texto';
end;

var
  pc : puntero_cadena;
begin
  new(pc);
  pc^ := 'Un texto';
  writeln(pc^);
  cambiarTexto(pc);
  writeln(pc^);
end.`,
    entrada: "",
  },
  {
    grupo: GP, ref: "P5 Ej 5", titulo: "Memoria disponible en I a V",
    enunciado: "TEmpleado = record sucursal: char; apellido: string[25]; correoElectrónico: string[40]; sueldo: real; end. Con 400.000 bytes libres en (I), calcular la memoria disponible en (II) después de leer alguien.apellido, en (III) después de New(PtrEmpleado), en (IV) después de leer los campos de PtrEmpleado^ y en (V) después de Dispose.",
    pista: "Solo new y dispose cambian la memoria dinámica. Leer en una variable (estática o dinámica) no reserva nada.",
    sol: `{ sizeof(TEmpleado) = 1 + 26 + 41 + 4 = 72 bytes
  (I)   400.000
  (II)  400.000   leer en alguien (estática) no pide memoria
  (III) 399.928   New reserva 72 bytes
  (IV)  399.928   escribir en PtrEmpleado^ no pide más memoria
  (V)   400.000   Dispose devuelve los 72 bytes
  (En el programa se cambió correoElectrónico por correo: los
  identificadores no pueden llevar tilde.) }
program Alocacion_Dinamica;
type
  TEmpleado = record
    sucursal : char;
    apellido : string[25];
    correo : string[40];
    sueldo : real;
  end;
var
  alguien : TEmpleado;
  PtrEmpleado : ^TEmpleado;
begin
  writeln('Cada empleado ocupa ', sizeof(TEmpleado), ' bytes');
  readln(alguien.apellido);
  new(PtrEmpleado);
  readln(PtrEmpleado^.sucursal);
  readln(PtrEmpleado^.apellido);
  readln(PtrEmpleado^.correo);
  readln(PtrEmpleado^.sueldo);
  dispose(PtrEmpleado);
end.`,
  },
  {
    grupo: GP, ref: "P5 Ej 6a", titulo: "50 KB solo con memoria estática",
    enunciado: "Realizar un programa que ocupe 50 KB de memoria en total usando solo memoria estática.",
    pista: "50 KB = 51200 bytes. Un integer ocupa 2 bytes: ¿cuántos hacen falta?",
    sol: `{ 51200 bytes / 2 bytes por integer = 25600 enteros. Todo es estático. }
program estatico50KB;
type
  vector = array [1..25600] of integer;     { 51200 bytes }
var
  v : vector;
begin
  writeln('Memoria estática: ', sizeof(v), ' bytes');
end.`,
  },
  {
    grupo: GP, ref: "P5 Ej 6b", titulo: "50 KB: mitad estática y mitad dinámica",
    enunciado: "Realizar un programa que ocupe 50 KB en total: 50% de memoria estática y 50% de memoria dinámica.",
    pista: "25600 bytes de cada lado. Ojo: el puntero también es memoria estática (4 bytes).",
    sol: `{ Estática: vector de 12798 enteros (25596 bytes) + puntero (4) = 25600
  Dinámica: new de un vector de 12800 enteros = 25600 bytes
  Total: 51200 bytes = 50 KB }
program mitadYMitad;
type
  vEstatico = array [1..12798] of integer;
  vDinamico = array [1..12800] of integer;
  pVector = ^vDinamico;
var
  v : vEstatico;
  p : pVector;
begin
  new(p);
  writeln('Estática: ', sizeof(v) + sizeof(p), ' bytes');
  writeln('Dinámica: ', sizeof(p^), ' bytes');
end.`,
  },
  {
    grupo: GP, ref: "P5 Ej 6c", titulo: "50 KB con a lo sumo 4 bytes estáticos",
    enunciado: "Realizar un programa que ocupe 50 KB en total minimizando la memoria estática (a lo sumo 4 bytes).",
    pista: "La única variable estática es un puntero (4 bytes); todo lo demás se reserva con new.",
    sol: `{ Estática: un puntero = 4 bytes
  Dinámica: vector de 25598 enteros = 51196 bytes
  Total: 51200 bytes = 50 KB }
program minimaEstatica;
type
  vDinamico = array [1..25598] of integer;
  pVector = ^vDinamico;
var
  p : pVector;
begin
  new(p);
  writeln('Estática: ', sizeof(p), ' bytes');
  writeln('Dinámica: ', sizeof(p^), ' bytes');
end.`,
  },
  {
    grupo: GP, ref: "P5 Ej 7", titulo: "Vector de punteros a nombres",
    enunciado: "Se quieren guardar 2500 nombres de ciudades de hasta 50 caracteres. (a) Definir una estructura estática y calcular su tamaño. (b) Como un compilador típico no permite estructuras estáticas de más de 64 KB, usar un vector de 2500 punteros a string[50]: (i) tamaño de la variable al comenzar; (ii) módulo que reserve memoria para los 2500 nombres (¿cuánta memoria se reserva?, ¿estática o dinámica?); (iii) módulo que lea los nombres y los guarde.",
    pista: "string[50] ocupa 51 bytes; un puntero, 4. Para reservar: un new por cada posición del vector.",
    sol: `{ a) array[1..2500] of string[50] = 2500 * 51 = 127.500 bytes (más de 64 KB)
  b) i)  2500 punteros * 4 = 10.000 bytes de memoria estática
     ii) reservar hace 2500 new de 51 bytes = 127.500 bytes de memoria dinámica
     iii) leerNombres }
program ciudades;
const
  CANT = 2500;
type
  Nombre = string[50];
  Puntero = ^Nombre;
  ArrPunteros = array [1..CANT] of Puntero;

procedure reservar(var p : ArrPunteros);
var i : integer;
begin
  for i := 1 to CANT do
    new(p[i]);
end;

procedure leerNombres(var p : ArrPunteros);
var i : integer;
begin
  for i := 1 to CANT do
    readln(p[i]^);
end;

var
  Punteros : ArrPunteros;
begin
  writeln('Memoria estática: ', sizeof(Punteros), ' bytes');
  reservar(Punteros);
  writeln('Memoria dinámica reservada: ', CANT * sizeof(Nombre), ' bytes');
  leerNombres(Punteros);
  writeln('Primera ciudad: ', Punteros[1]^);
  writeln('Última ciudad: ', Punteros[CANT]^);
end.
{ Para probarlo rápido, cambiá CANT a 3. }`,
  },
  {
    grupo: GP, ref: "P5 Ej 8", titulo: "¿Cuánta memoria ocupa el programa?",
    enunciado: "datos = array[1..20] of integer; punt = ^datos. procesarDatos(v: datos; var v2: datos) copia v invertido en v2. Variables del principal: vect (datos), pvect (punt), i (integer). Calcular la memoria total (estática y dinámica, parámetros y locales) hasta las sentencias de las líneas 18, 20, 23, 11 (dentro de procesarDatos) y 25.",
    pista: "datos ocupa 40 bytes. Un parámetro por valor es una copia completa; uno por referencia, una dirección (4 bytes). Las locales del módulo existen solo mientras se ejecuta.",
    sol: `{ Tamaños: datos = 20 * 2 = 40 bytes; punt = 4; integer = 2.
  Variables del programa: vect (40) + pvect (4) + i (2) = 46 bytes.

  a) Línea 18 (comienzo del programa): 46 bytes.
  b) Línea 20 (cargar vect): 46 bytes. Asignar valores no cambia la memoria.
  c) Línea 23 (después de new(pvect)): 46 + 40 dinámicos = 86 bytes.
  d) Línea 11 (dentro de procesarDatos):
     parámetro v por valor = copia de 40 bytes
     parámetro v2 por referencia = 4 bytes (una dirección)
     locales i, j = 4 bytes
     86 + 48 = 134 bytes.
  e) Línea 25 (después de volver del módulo): se liberan parámetros
     y locales: 86 bytes. }
program memoria;
type
  datos = array [1..20] of integer;
  punt = ^datos;

procedure procesarDatos(v : datos; var v2 : datos);
var
  i, j : integer;
begin
  for i := 1 to 20 do
    v2[21 - i] := v[i];
end;

var
  vect : datos;
  pvect : punt;
  i : integer;
begin
  for i := 1 to 20 do
    vect[i] := i;
  new(pvect);
  for i := 20 downto 1 do
    pvect^[i] := 0;
  procesarDatos(pvect^, vect);
  writeln('fin');
end.`,
    entrada: "",
  },
];

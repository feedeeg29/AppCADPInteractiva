import type { Ejercicio } from "../types";

const G = "Práctica 2 · Parte 2 · Funciones, procedimientos y parámetros";
const GA = "Ejercicios adicionales";

const doscientos = Array.from({ length: 200 }, (_, i) => `${i + 1} ${((i * 37) % 50) + 5}.${(i * 13) % 100}`).join(" ");

export const guiaP22: Ejercicio[] = [
  {
    grupo: G, ref: "P2·2 Ej 1", titulo: "suma: valor y referencia",
    enunciado: "procedure suma(num1: integer; var num2: integer) hace num2 := num1 + num2 y num1 := 0. El programa lee x y hace for i := 1 to 5 do suma(i, x); write(x). (a) ¿Qué imprime si se lee 10? (b) ¿Y si num2 se pasa por valor? (c) ¿Qué pasa si num1 y num2 son los dos var?",
    pista: "Seguí x en cada vuelta. Cuando num2 es var, num2 y x son la misma variable. Para (c): ¿qué variable se le pasa a num1?",
    sol: `{ a) Imprime 25: x vale 10 + 1 + 2 + 3 + 4 + 5.
  b) Imprime 10: suma trabaja sobre una copia de x y el valor original
     nunca cambia.
  c) Error de compilación: num1 recibiría la variable de control del for (i)
     por referencia, y eso no está permitido. Si estuviera permitido,
     num1 := 0 cambiaría i y el for no terminaría como se espera.
  Podés probar el caso (a) acá abajo y después sacarle el var a num2. }
program Ejercicio3;
procedure suma(num1 : integer; var num2 : integer);
begin
  num2 := num1 + num2;
  num1 := 0;
end;
var
  i, x : integer;
begin
  read(x);
  for i := 1 to 5 do
    suma(i, x);
  write(x);
end.`,
    entrada: "10",
  },
  {
    grupo: G, ref: "P2·2 Ej 2", titulo: "digParesImpares",
    enunciado: "procedure digParesImpares(num: integer; var par, impar: integer) cuenta los dígitos pares e impares de num y los suma a par e impar. El programa lee datos con repeat hasta el 100 (que se procesa). ¿Qué imprime con la secuencia 250, 35, 100?",
    pista: "par e impar son var: se acumulan entre llamadas. num es por valor: el módulo lo destruye dividiéndolo por 10, pero dato no cambia.",
    sol: `{ 250 -> dígitos 0 (par), 5 (impar), 2 (par)
  35  -> 5 (impar), 3 (impar)
  100 -> 0 (par), 0 (par), 1 (impar)
  Total: 4 pares y 4 impares. Imprime: Pares: 4Ímpares:4 }
program ejercicio4;
procedure digParesImpares(num : integer; var par, impar : integer);
var
  dig : integer;
begin
  while (num <> 0) do begin
    dig := num mod 10;
    if ((dig mod 2) = 0) then
      par := par + 1
    else
      impar := impar + 1;
    num := num div 10;
  end;
end;
var
  dato, par, impar : integer;
begin
  par := 0;
  impar := 0;
  repeat
    read(dato);
    digParesImpares(dato, par, impar);
  until (dato = 100);
  writeln('Pares: ', par, 'Ímpares:', impar);
end.`,
    entrada: "250 35 100",
  },
  {
    grupo: G, ref: "P2·2 Ej 3", titulo: "Los 6 errores de sumar",
    enunciado: "El programa ejercicio5 debe sumar los números entre a y b, devolver el resultado en c e informar si quedó entre 10 y 30. Encontrar los 6 errores e indicar la línea de cada uno.",
    pista: "Revisá: el encabezado del procedimiento, variables sin declarar, variables sin inicializar, qué se pasa como parámetro var y la condición lógica.",
    sol: `{ 1. Línea 3: falta ';' al final del encabezado, y c tiene que ser
     'var c : integer' para devolver el resultado.
  2. Línea 8: i no está declarada (tiene que ser local de sumar).
  3. Línea 9: suma no está inicializada en 0.
  4. Línea 16: a y b no están declaradas en el programa principal.
  5. Línea 17: se pasa el literal 0 en lugar de result (un parámetro var
     necesita una variable).
  6. Línea 20: tiene que ser 'and' (con 'or' siempre da verdadero),
     y ok no está declarada (boolean).
  Programa corregido: }
program ejercicio5;
{ suma los números entre a y b, y retorna el resultado en c }
procedure sumar(a, b : integer; var c : integer);
var
  suma, i : integer;
begin
  suma := 0;
  for i := a to b do
    suma := suma + i;
  c := c + suma;
end;
var
  result, a, b : integer;
  ok : boolean;
begin
  result := 0;
  readln(a); readln(b);
  sumar(a, b, result);
  writeln('La suma total es ', result);
  { averigua si el resultado final estuvo entre 10 y 30 }
  ok := (result >= 10) and (result <= 30);
  if (not ok) then
    writeln('La suma no quedó entre 10 y 30');
end.`,
    entrada: "3\n6",
  },
  {
    grupo: G, ref: "P2·2 Ej 4", titulo: "Errores en programadores",
    enunciado: "El programa debe leer legajo y salario de 130 programadores Java e imprimir el total destinado a salarios y el salario del empleado con mayor legajo. Tiene 5 errores: indicar la línea y en qué consiste cada uno.",
    pista: "Mirá qué parámetros deberían ser var, cómo están escritas las cadenas, en qué orden se pasan los parámetros y qué variables se usan sin declarar o sin inicializar.",
    sol: `{ 1. Línea 2: salario tiene que ser var; si no, el valor leído se pierde.
  2. Línea 4: la cadena abre con comilla simple y cierra con comilla doble.
  3. Líneas 8 a 10: maxSalario es local de actualizarMaximo, así que el
     valor nunca llega al programa principal. Tiene que ser un parámetro var.
  4. Línea 21: sumaSalarios no está declarada. (Además maxLegajo se usa
     sin inicializar: tiene que empezar en -1.)
  5. Línea 23: los argumentos están invertidos: leerDatos(legajo, salario).
  Programa corregido: }
program programadores;
procedure leerDatos(var legajo : integer; var salario : real);
begin
  writeln('Ingrese el nro de legajo y el salario');
  read(legajo);
  read(salario);
end;

procedure actualizarMaximo(nuevoLegajo : integer; nuevoSalario : real;
                           var maxLegajo : integer; var maxSalario : real);
begin
  if (nuevoLegajo > maxLegajo) then begin
    maxLegajo := nuevoLegajo;
    maxSalario := nuevoSalario;
  end;
end;

var
  legajo, maxLegajo, i : integer;
  salario, maxSalario, sumaSalarios : real;
begin
  sumaSalarios := 0;
  maxLegajo := -1;
  maxSalario := 0;
  for i := 1 to 130 do begin
    leerDatos(legajo, salario);
    actualizarMaximo(legajo, salario, maxLegajo, maxSalario);
    sumaSalarios := sumaSalarios + salario;
  end;
  writeln('En todo el mes se gastan ', sumaSalarios:0:2, ' pesos');
  writeln('El salario del empleado más nuevo es ', maxSalario:0:2);
end.`,
  },
  {
    grupo: G, ref: "P2·2 Ej 5", titulo: "¿numB es el doble de numA?",
    enunciado: "(a) Módulo que reciba un par (numA, numB) y devuelva si numB es el doble de numA. (b) Usándolo, leer pares hasta el (0,0) e informar la cantidad de pares leídos y en cuántos numB es el doble de numA. Ej: (1,2) (3,4) (9,3) (7,14) (0,0) → 4 y 2.",
    pista: "Un único resultado boolean: función. El corte es cuando los dos valen 0 a la vez: not ((a = 0) and (b = 0)).",
    sol: `program paresDobles;

function esDoble(numA, numB : integer) : boolean;
begin
  esDoble := (numB = 2 * numA);
end;

var
  a, b, pares, dobles : integer;
begin
  pares := 0;
  dobles := 0;
  read(a, b);
  while not ((a = 0) and (b = 0)) do begin
    pares := pares + 1;
    if esDoble(a, b) then
      dobles := dobles + 1;
    read(a, b);
  end;
  writeln('Pares leídos: ', pares);
  writeln('Pares en los que numB es el doble de numA: ', dobles);
end.`,
    entrada: "1 2\n3 4\n9 3\n7 14\n0 0",
  },
  {
    grupo: G, ref: "P2·2 Ej 6", titulo: "Tienda de ropa",
    enunciado: "Programa modularizado que lea precio, código y tipo (pantalón, remera, camisa, etc.) de 100 productos. Informar: código de los dos productos más baratos, código del pantalón más caro y precio promedio.",
    pista: "Un módulo para leer un producto, otro para actualizar los dos mínimos y otro para el pantalón más caro. Todo en un único for.",
    sol: `program tiendaRopa;
const
  CANT = 100;

procedure leerProducto(var precio : real; var codigo : integer; var tipo : string);
begin
  readln(precio);
  readln(codigo);
  readln(tipo);
end;

procedure actualizarMinimos(precio : real; codigo : integer;
                            var min1, min2 : real; var cod1, cod2 : integer);
begin
  if (precio < min1) then begin
    min2 := min1; cod2 := cod1;
    min1 := precio; cod1 := codigo;
  end
  else if (precio < min2) then begin
    min2 := precio; cod2 := codigo;
  end;
end;

procedure actualizarPantalon(precio : real; codigo : integer; tipo : string;
                             var maxPant : real; var codPant : integer);
begin
  if (tipo = 'pantalón') or (tipo = 'pantalon') then
    if (precio > maxPant) then begin
      maxPant := precio;
      codPant := codigo;
    end;
end;

var
  i, codigo, cod1, cod2, codPant : integer;
  precio, min1, min2, maxPant, suma : real;
  tipo : string;
begin
  min1 := 1e30; min2 := 1e30; cod1 := 0; cod2 := 0;
  maxPant := -1; codPant := 0;
  suma := 0;
  for i := 1 to CANT do begin
    leerProducto(precio, codigo, tipo);
    actualizarMinimos(precio, codigo, min1, min2, cod1, cod2);
    actualizarPantalon(precio, codigo, tipo, maxPant, codPant);
    suma := suma + precio;
  end;
  writeln('Los dos más baratos: ', cod1, ' y ', cod2);
  if (codPant <> 0) then
    writeln('Pantalón más caro: ', codPant)
  else
    writeln('No hubo pantalones');
  writeln('Precio promedio: ', suma / CANT:0:2);
end.
{ Para probarlo rápido, cambiá CANT a 3. }`,
  },
  {
    grupo: G, ref: "P2·2 Ej 7", titulo: "Cantidad y suma de dígitos",
    enunciado: "(a) Módulo que reciba un entero y devuelva la cantidad de dígitos y su suma. (b) Usándolo, leer números hasta uno cuyos dígitos sumen exactamente 10 (que se procesa) e imprimir la cantidad total de dígitos leídos.",
    pista: "Dos resultados: procedimiento con dos var. El corte se procesa: repeat-until. Usá repeat también al descomponer, así el 0 cuenta como un dígito.",
    sol: `program digitos;

procedure analizar(num : integer; var cant, suma : integer);
begin
  cant := 0;
  suma := 0;
  repeat
    cant := cant + 1;
    suma := suma + num mod 10;
    num := num div 10;
  until (num = 0);
end;

var
  num, cant, suma, total : integer;
begin
  total := 0;
  repeat
    read(num);
    analizar(num, cant, suma);
    total := total + cant;
  until (suma = 10);
  writeln('Cantidad total de dígitos leídos: ', total);
end.`,
    entrada: "123 9 4501 55",
  },
  {
    grupo: G, ref: "P2·2 Ej 8", titulo: "Dígitos pares e impares de cada número",
    enunciado: "Programa modularizado que lea enteros hasta el 123456, que no se procesa. Para cada número informar la suma de sus dígitos pares y la cantidad de dígitos impares.",
    pista: "123456 no entra en un integer: usá longint. Un procedimiento que reciba el número y devuelva las dos cosas.",
    sol: `program digitosParesImpares;

procedure analizar(num : longint; var sumaPares, cantImpares : integer);
var
  dig : integer;
begin
  sumaPares := 0;
  cantImpares := 0;
  repeat
    dig := num mod 10;
    if (dig mod 2 = 0) then
      sumaPares := sumaPares + dig
    else
      cantImpares := cantImpares + 1;
    num := num div 10;
  until (num = 0);
end;

var
  num : longint;
  sumaPares, cantImpares : integer;
begin
  read(num);
  while (num <> 123456) do begin
    analizar(num, sumaPares, cantImpares);
    writeln(num, ': suma de dígitos pares = ', sumaPares, ', dígitos impares = ', cantImpares);
    read(num);
  end;
end.`,
    entrada: "2468 13579 102030 123456",
  },
  {
    grupo: G, ref: "P2·2 Ej 9", titulo: "Números de inscripción",
    enunciado: "Programa modularizado que lea número de inscripción, apellido y nombre de alumnos hasta el número 1200, que se procesa. Informar: apellido de los dos alumnos con número más chico, apellido de los dos con número más grande y porcentaje de alumnos con número par.",
    pista: "Dos mínimos y dos máximos guardando el apellido. repeat-until porque el 1200 se procesa.",
    sol: `program inscripciones;

procedure leerAlumno(var nro : integer; var apellido, nombre : string);
begin
  readln(nro);
  readln(apellido);
  readln(nombre);
end;

procedure actualizarMinimos(nro : integer; apellido : string;
                            var min1, min2 : integer; var ap1, ap2 : string);
begin
  if (nro < min1) then begin
    min2 := min1; ap2 := ap1;
    min1 := nro; ap1 := apellido;
  end
  else if (nro < min2) then begin
    min2 := nro; ap2 := apellido;
  end;
end;

procedure actualizarMaximos(nro : integer; apellido : string;
                            var max1, max2 : integer; var ap1, ap2 : string);
begin
  if (nro > max1) then begin
    max2 := max1; ap2 := ap1;
    max1 := nro; ap1 := apellido;
  end
  else if (nro > max2) then begin
    max2 := nro; ap2 := apellido;
  end;
end;

var
  nro, min1, min2, max1, max2, cant, pares : integer;
  apellido, nombre, apMin1, apMin2, apMax1, apMax2 : string;
begin
  min1 := 32767; min2 := 32767; max1 := -1; max2 := -1;
  apMin1 := ''; apMin2 := ''; apMax1 := ''; apMax2 := '';
  cant := 0; pares := 0;
  repeat
    leerAlumno(nro, apellido, nombre);
    cant := cant + 1;
    if (nro mod 2 = 0) then
      pares := pares + 1;
    actualizarMinimos(nro, apellido, min1, min2, apMin1, apMin2);
    actualizarMaximos(nro, apellido, max1, max2, apMax1, apMax2);
  until (nro = 1200);
  writeln('Números más chicos: ', apMin1, ' y ', apMin2);
  writeln('Números más grandes: ', apMax1, ' y ', apMax2);
  writeln('Porcentaje con número par: ', pares / cant * 100:0:2, '%');
end.`,
    entrada: "530\nGomez\nAna\n77\nPerez\nLuis\n1999\nDiaz\nSol\n1200\nRios\nJuan",
  },
  {
    grupo: G, ref: "P2·2 Ej 10", titulo: "Patrón A$B#",
    enunciado: "Programa modularizado que lea una secuencia de caracteres y verifique si cumple el patrón A$B#: A es una secuencia de solo vocales, B es una secuencia de solo letras que no son vocales, y $ y # seguro existen. Si no cumple, informar qué parte falló.",
    pista: "Un módulo por parte del patrón; cada uno devuelve si se cumplió. Si A falla no hace falta seguir con B. Los caracteres se leen de a uno con read.",
    sol: `program patronA_B;

function esVocal(c : char) : boolean;
begin
  esVocal := (c = 'a') or (c = 'e') or (c = 'i') or (c = 'o') or (c = 'u') or
             (c = 'A') or (c = 'E') or (c = 'I') or (c = 'O') or (c = 'U');
end;

function esLetra(c : char) : boolean;
begin
  esLetra := ((c >= 'a') and (c <= 'z')) or ((c >= 'A') and (c <= 'Z'));
end;

procedure parteA(var ok : boolean);
var c : char;
begin
  ok := true;
  read(c);
  while (c <> '$') and ok do begin
    if not esVocal(c) then ok := false
    else read(c);
  end;
end;

procedure parteB(var ok : boolean);
var c : char;
begin
  ok := true;
  read(c);
  while (c <> '#') and ok do begin
    if not esLetra(c) or esVocal(c) then ok := false
    else read(c);
  end;
end;

var
  ok : boolean;
begin
  parteA(ok);
  if not ok then
    writeln('No se cumple la parte A (solo vocales antes de $)')
  else begin
    parteB(ok);
    if not ok then
      writeln('No se cumple la parte B (solo consonantes antes de #)')
    else
      writeln('La secuencia cumple el patrón A$B#');
  end;
end.`,
    entrada: "aeiou$bcdfg#",
  },
  {
    grupo: G, ref: "P2·2 Ej 11", titulo: "Patrón A%B*",
    enunciado: "Programa modularizado que lea una secuencia de caracteres y verifique si cumple el patrón A%B*: A es una secuencia sin el carácter '$'; B tiene la misma cantidad de caracteres que A y a lo sumo 3 caracteres '@'; % y * seguro existen. Si no cumple, informar qué parte falló.",
    pista: "La parte A tiene que devolver también su largo, porque la parte B lo necesita para comparar.",
    sol: `program patronAB;

procedure parteA(var largo : integer; var ok : boolean);
var c : char;
begin
  ok := true;
  largo := 0;
  read(c);
  while (c <> '%') and ok do begin
    if (c = '$') then ok := false
    else begin
      largo := largo + 1;
      read(c);
    end;
  end;
end;

procedure parteB(largoA : integer; var ok : boolean);
var
  c : char;
  largo, arrobas : integer;
begin
  largo := 0;
  arrobas := 0;
  read(c);
  while (c <> '*') do begin
    largo := largo + 1;
    if (c = '@') then arrobas := arrobas + 1;
    read(c);
  end;
  ok := (largo = largoA) and (arrobas <= 3);
end;

var
  largoA : integer;
  ok : boolean;
begin
  parteA(largoA, ok);
  if not ok then
    writeln('No se cumple la parte A (apareció un $)')
  else begin
    parteB(largoA, ok);
    if not ok then
      writeln('No se cumple la parte B (largo distinto de A o más de 3 @)')
    else
      writeln('La secuencia cumple el patrón A%B*');
  end;
end.`,
    entrada: "hola%a@b@*",
  },
  {
    grupo: G, ref: "P2·2 Ej 12", titulo: "Rendimiento de la soja",
    enunciado: "(a) Módulo que reciba hectáreas, tipo de zona (1: 6 tn/ha, 2: 2,6 tn/ha, 3: 1,4 tn/ha) y precio de la tonelada, y devuelva el rendimiento económico. (b) Leer campos (localidad, hectáreas, zona) hasta uno de 900 ha en 'Saladillo', que se procesa. Con la soja a U$S 320/tn informar: cantidad de campos de Tres de Febrero con rendimiento mayor a U$S 10000, localidad del campo con mayor y con menor rendimiento, y el rendimiento promedio.",
    pista: "Un solo valor: función. El corte depende de dos campos: repeat-until con (ha = 900) and (localidad = 'Saladillo').",
    sol: `program soja;
const
  PRECIO = 320;

function rendimiento(ha : real; zona : integer; precio : real) : real;
var tnHa : real;
begin
  case zona of
    1: tnHa := 6;
    2: tnHa := 2.6;
  else
    tnHa := 1.4;
  end;
  rendimiento := ha * tnHa * precio;
end;

var
  loc, locMax, locMin : string;
  ha, r, max, min, suma : real;
  zona, cant, cantTdF : integer;
begin
  max := -1; min := 1e30; suma := 0;
  cant := 0; cantTdF := 0;
  locMax := ''; locMin := '';
  repeat
    readln(loc);
    readln(ha);
    readln(zona);
    r := rendimiento(ha, zona, PRECIO);
    cant := cant + 1;
    suma := suma + r;
    if (loc = 'Tres de Febrero') and (r > 10000) then
      cantTdF := cantTdF + 1;
    if (r > max) then begin max := r; locMax := loc; end;
    if (r < min) then begin min := r; locMin := loc; end;
  until (ha = 900) and (loc = 'Saladillo');
  writeln('Campos de Tres de Febrero con más de U$S 10000: ', cantTdF);
  writeln('Mayor rendimiento: ', locMax);
  writeln('Menor rendimiento: ', locMin);
  writeln('Rendimiento promedio: U$S ', suma / cant:0:2);
end.`,
    entrada: "Tres de Febrero\n10\n1\nLobos\n3\n3\nSaladillo\n900\n2",
  },

  // ---------------- Adicionales ----------------
  {
    grupo: GA, ref: "P2·2 Ad 1", titulo: "intercambio y sumar",
    enunciado: "intercambio(var num1, num2) intercambia los valores y sumar(num1; var num2) hace num2 := num1 + num2. El programa lee num1 y num2 y repite 3 veces: intercambio(num1, num2); sumar(i, num1). Luego imprime num1. ¿Qué imprime con num1 = 10 y num2 = 5? ¿Y con num1 = 5 y num2 = 10?",
    pista: "Hacé una tabla con num1 y num2 en cada vuelta: primero se intercambian y después a num1 se le suma i.",
    sol: `{ a) num1 = 10, num2 = 5
     i = 1: intercambio -> 5, 10;  sumar -> num1 = 6
     i = 2: intercambio -> 10, 6;  sumar -> num1 = 12
     i = 3: intercambio -> 6, 12;  sumar -> num1 = 9
     Imprime 9.
  b) num1 = 5, num2 = 10
     i = 1: -> 10, 5 -> 11
     i = 2: -> 5, 11 -> 7
     i = 3: -> 11, 7 -> 14
     Imprime 14. }
program Ejercicio1_ad;
procedure intercambio(var num1, num2 : integer);
var aux : integer;
begin
  aux := num1;
  num1 := num2;
  num2 := aux;
end;

procedure sumar(num1 : integer; var num2 : integer);
begin
  num2 := num1 + num2;
end;

var
  i, num1, num2 : integer;
begin
  read(num1);
  read(num2);
  for i := 1 to 3 do begin
    intercambio(num1, num2);
    sumar(i, num1);
  end;
  writeln(num1);
end.`,
    entrada: "10 5",
  },
  {
    grupo: GA, ref: "P2·2 Ad 2", titulo: "Suma y producto entre X e Y",
    enunciado: "Programa modularizado que lea 10 pares (X, Y) e informe, para cada par, la suma y el producto de todos los números entre X e Y. Ej: (3, 6) → La suma es 18 (3+4+5+6) y El producto es 360 (3·4·5·6).",
    pista: "Un procedimiento que reciba X e Y y devuelva suma y producto. Si X > Y conviene intercambiarlos. El producto crece rápido: usá longint (o real si los rangos son grandes).",
    sol: `program sumaProducto;

procedure calcular(x, y : integer; var suma : integer; var prod : longint);
var
  i, aux : integer;
begin
  if (x > y) then begin
    aux := x; x := y; y := aux;
  end;
  suma := 0;
  prod := 1;
  for i := x to y do begin
    suma := suma + i;
    prod := prod * i;
  end;
end;

var
  k, x, y, suma : integer;
  prod : longint;
begin
  for k := 1 to 10 do begin
    read(x, y);
    calcular(x, y, suma, prod);
    writeln('(', x, ', ', y, ') La suma es ', suma, '. El producto es ', prod);
  end;
end.`,
    entrada: "3 6\n1 5\n4 4\n2 3\n6 3\n1 1\n10 12\n-2 2\n5 7\n1 10",
  },
  {
    grupo: GA, ref: "P2·2 Ad 3", titulo: "Supermercado modularizado",
    enunciado: "Programa modularizado que lea código (1 a 200) y precio de 200 productos e informe los códigos de los dos más baratos y la cantidad de productos de más de 16 pesos con código par.",
    pista: "Es el ejercicio 6 de la Práctica 1 parte 2, separado en módulos: leer un producto, actualizar los mínimos y evaluar la condición del segundo inciso.",
    sol: `program supermercadoModular;
const
  CANT = 200;

procedure leerProducto(var codigo : integer; var precio : real);
begin
  read(codigo, precio);
end;

procedure actualizarMinimos(codigo : integer; precio : real;
                            var min1, min2 : real; var cod1, cod2 : integer);
begin
  if (precio < min1) then begin
    min2 := min1; cod2 := cod1;
    min1 := precio; cod1 := codigo;
  end
  else if (precio < min2) then begin
    min2 := precio; cod2 := codigo;
  end;
end;

function cumple(codigo : integer; precio : real) : boolean;
begin
  cumple := (precio > 16) and (codigo mod 2 = 0);
end;

var
  i, codigo, cod1, cod2, cantCumplen : integer;
  precio, min1, min2 : real;
begin
  min1 := 1e30; min2 := 1e30; cod1 := 0; cod2 := 0;
  cantCumplen := 0;
  for i := 1 to CANT do begin
    leerProducto(codigo, precio);
    actualizarMinimos(codigo, precio, min1, min2, cod1, cod2);
    if cumple(codigo, precio) then
      cantCumplen := cantCumplen + 1;
  end;
  writeln('Los dos más baratos: ', cod1, ' y ', cod2);
  writeln('Productos de más de $16 con código par: ', cantCumplen);
end.`,
    entrada: doscientos,
  },
  {
    grupo: GA, ref: "P2·2 Ad 4", titulo: "Planetas del telescopio Kepler",
    enunciado: "(a) Módulo que reciba el radio de un círculo y devuelva su diámetro y su perímetro. (b) Leer nombre, radio (km) y distancia a la Tierra (años luz) de planetas, hasta uno con radio 0 que no se procesa. Informar el nombre y la distancia de los planetas con diámetro entre el de Marte (6780 km) y el de la Tierra (12700 km), inclusive, y la cantidad de planetas con perímetro mayor al de Júpiter (439264 km).",
    pista: "Dos resultados: procedimiento con dos var. El nombre se lee primero, después el radio, y la distancia solo si el radio no es 0.",
    sol: `program kepler;
const
  DIAM_TIERRA = 12700;
  DIAM_MARTE = 6780;
  PERIM_JUPITER = 439264;

procedure circulo(radio : real; var diametro, perimetro : real);
begin
  diametro := 2 * radio;
  perimetro := 2 * pi * radio;
end;

var
  nombre : string;
  radio, distancia, diam, perim : real;
  grandes : integer;
begin
  grandes := 0;
  readln(nombre);
  readln(radio);
  while (radio <> 0) do begin
    readln(distancia);
    circulo(radio, diam, perim);
    if (diam >= DIAM_MARTE) and (diam <= DIAM_TIERRA) then
      writeln(nombre, ' a ', distancia:0:1, ' años luz');
    if (perim > PERIM_JUPITER) then
      grandes := grandes + 1;
    readln(nombre);
    readln(radio);
  end;
  writeln('Planetas con perímetro mayor al de Júpiter: ', grandes);
end.`,
    entrada: "Kepler-22b\n4500\n620\nKepler-452b\n9500\n1400\nGigante\n80000\n3000\nfin\n0",
  },
  {
    grupo: GA, ref: "P2·2 Ad 5 · Act 1", titulo: "Inversiones, con módulos",
    enunciado: "Volver a implementar la Actividad 1 de la guía adicional de la Práctica 1 (inversiones de empresas) usando módulos. Analizar qué partes conviene modularizar, si con funciones o procedimientos, y cómo se comunican.",
    pista: "Un procedimiento que procese una empresa (lee sus inversiones y devuelve el total) y un procedimiento para actualizar el máximo. El promedio es un solo valor: puede ser una función o calcularse en el principal.",
    sol: `{ Análisis:
  - procesarEmpresa: lee la cantidad y los montos de una empresa y devuelve
    el total (procedimiento con parámetro var: hay lectura y un resultado).
  - actualizarMaximo: procedimiento con dos var (monto y código).
  - Comunicación: todo por parámetros, sin variables globales. }
program inversionesModular;

procedure procesarEmpresa(var cantInv : integer; var total : real);
var
  i : integer;
  monto : real;
begin
  read(cantInv);
  total := 0;
  for i := 1 to cantInv do begin
    read(monto);
    total := total + monto;
  end;
end;

procedure actualizarMaximo(total : real; codigo : integer; var max : real; var codMax : integer);
begin
  if (total > max) then begin
    max := total;
    codMax := codigo;
  end;
end;

var
  codigo, cantInv, codMax, cantMas50 : integer;
  total, max : real;
begin
  max := -1; codMax := 0; cantMas50 := 0;
  repeat
    read(codigo);
    procesarEmpresa(cantInv, total);
    if (cantInv > 0) then
      writeln('Empresa ', codigo, ' monto promedio ', total / cantInv:0:2);
    actualizarMaximo(total, codigo, max, codMax);
    if (total > 50000) then
      cantMas50 := cantMas50 + 1;
  until (codigo = 100);
  writeln('La empresa ', codMax, ' es la que más dinero tiene invertido ($', max:0:2, ')');
  writeln('Hay ', cantMas50, ' empresas con inversiones por más de $50000');
end.`,
    entrada: "33\n4\n33200 56930 24500.85 10000\n41\n3\n102000.22 53000 12000\n100\n1\n84000.34",
  },
  {
    grupo: GA, ref: "P2·2 Ad 5 · Act 2", titulo: "Autoevaluaciones, con módulos",
    enunciado: "Volver a implementar la Actividad 2 (autoevaluaciones de CADP) usando módulos.",
    pista: "Un procedimiento que lea las 5 notas de un alumno y devuelva presentes, dieces, ceros y suma. Un procedimiento genérico para 'actualizar los dos máximos' sirve dos veces: para los dieces y para los ceros.",
    sol: `program autoevaluacionesModular;
const
  NOTA_PRESENTE = 4;
  MIN_PRESENTES = 4;

procedure leerNotas(var presentes, dieces, ceros, suma : integer);
var i, nota : integer;
begin
  presentes := 0; dieces := 0; ceros := 0; suma := 0;
  for i := 1 to 5 do begin
    read(nota);
    if (nota >= NOTA_PRESENTE) then presentes := presentes + 1;
    if (nota = 10) then dieces := dieces + 1;
    if (nota = 0) then ceros := ceros + 1;
    if (nota > 0) then suma := suma + nota;
  end;
  readln;
end;

procedure actualizarDosMaximos(valor : integer; legajo : longint;
                               var max1, max2 : integer; var leg1, leg2 : longint);
begin
  if (valor > max1) then begin
    max2 := max1; leg2 := leg1;
    max1 := valor; leg1 := legajo;
  end
  else if (valor > max2) then begin
    max2 := valor; leg2 := legajo;
  end;
end;

procedure informarPorcentaje(texto : string; ok, total : integer);
begin
  write(texto, ok);
  if (total > 0) then writeln(' (', ok / total * 100:0:2, '%)') else writeln;
end;

var
  legajo, leg10a, leg10b, leg0a, leg0b : longint;
  cond : char;
  presentes, dieces, ceros, suma : integer;
  ingr, ingrOk, recu, recuOk, todas, promAlto, conCero : integer;
  max10a, max10b, max0a, max0b : integer;
begin
  ingr := 0; ingrOk := 0; recu := 0; recuOk := 0;
  todas := 0; promAlto := 0; conCero := 0;
  max10a := -1; max10b := -1; max0a := -1; max0b := -1;
  leg10a := 0; leg10b := 0; leg0a := 0; leg0b := 0;
  readln(legajo);
  while (legajo <> -1) do begin
    readln(cond);
    leerNotas(presentes, dieces, ceros, suma);
    if (cond = 'I') then begin
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
    actualizarDosMaximos(dieces, legajo, max10a, max10b, leg10a, leg10b);
    actualizarDosMaximos(ceros, legajo, max0a, max0b, leg0a, leg0b);
    readln(legajo);
  end;
  informarPorcentaje('Ingresantes en condiciones de rendir: ', ingrOk, ingr);
  informarPorcentaje('Recursantes en condiciones de rendir: ', recuOk, recu);
  writeln('Aprobaron todas las autoevaluaciones: ', todas);
  writeln('Promedio mayor a 6.5: ', promAlto);
  writeln('Con al menos un cero: ', conCero);
  writeln('Más dieces: ', leg10a, ' y ', leg10b);
  writeln('Más ceros: ', leg0a, ' y ', leg0b);
end.`,
    entrada: "19003\nR\n8 10 6 -1 8\n21020\nI\n4 0 6 10 -1\n22100\nI\n10 10 9 8 10\n-1",
  },
  {
    grupo: GA, ref: "P2·2 Ad 5 · Act 3", titulo: "Tanques de agua, con módulos",
    enunciado: "Volver a implementar la Actividad 3 (ventas de tanques de agua) usando módulos.",
    pista: "Dos funciones de volumen (una por tipo de tanque), un procedimiento que lea un tanque y devuelva volumen y alto, y uno para los dos máximos.",
    sol: `program tanquesModular;

function volumenRect(a, b, c : real) : real;
begin
  volumenRect := a * b * c;
end;

function volumenCil(radio, alto : real) : real;
begin
  volumenCil := pi * radio * radio * alto;
end;

{ lee los datos de un tanque del tipo indicado y devuelve volumen y alto }
procedure leerTanque(tipo : char; var vol, alto : real);
var a, b, radio : real;
begin
  if (tipo = 'R') then begin
    readln(a, b, alto);
    vol := volumenRect(a, b, alto);
  end
  else begin
    readln(radio, alto);
    vol := volumenCil(radio, alto);
  end;
end;

procedure actualizarMaximos(vol : real; var max1, max2 : real);
begin
  if (vol > max1) then begin
    max2 := max1;
    max1 := vol;
  end
  else if (vol > max2) then
    max2 := vol;
end;

var
  tipo : char;
  vol, alto, max1, max2, sumaC, sumaR : real;
  cantC, cantR, bajos, chicos : integer;
begin
  max1 := -1; max2 := -1;
  sumaC := 0; sumaR := 0; cantC := 0; cantR := 0;
  bajos := 0; chicos := 0;
  readln(tipo);
  while (tipo <> 'Z') do begin
    leerTanque(tipo, vol, alto);
    if (tipo = 'R') then begin
      sumaR := sumaR + vol; cantR := cantR + 1;
    end
    else begin
      sumaC := sumaC + vol; cantC := cantC + 1;
    end;
    actualizarMaximos(vol, max1, max2);
    if (alto < 1.40) then bajos := bajos + 1;
    if (vol < 800) then chicos := chicos + 1;
    readln(tipo);
  end;
  writeln('Volumen de los dos mayores: ', max1:0:2, ' y ', max2:0:2);
  if (cantC > 0) then writeln('Promedio cilíndricos: ', sumaC / cantC:0:2);
  if (cantR > 0) then writeln('Promedio rectangulares: ', sumaR / cantR:0:2);
  writeln('Tanques de menos de 1.40 m de alto: ', bajos);
  writeln('Tanques de menos de 800 m3: ', chicos);
end.`,
    entrada: "R\n2 3 1.5\nC\n1 2\nR\n10 10 9\nZ",
  },
];

import type { Ejercicio } from "../types";

const G1 = "Parte 1 · If y While";
const G2 = "Parte 2 · For y Repeat-until";
const G3 = "Actividades adicionales";

// Datos de prueba largos (generados una vez, fijos)
const mil = Array.from({ length: 1000 }, (_, i) => ((i * 7919 + 13) % 1999) - 999).join(" ");
const doscientos = Array.from({ length: 200 }, (_, i) => `${i + 1} ${((i * 37) % 50) + 5}.${(i * 13) % 100}`).join(" ");

export const guiaP1: Ejercicio[] = [
  // ---------------- Parte 1 ----------------
  {
    grupo: G1, ref: "P1·1 Ej 1", titulo: "El mayor de dos números",
    enunciado: "Leer 2 números enteros e informar cuál es el mayor. Si son iguales, informar: Los números leídos son iguales.",
    pista: "Con un if-else alcanza, pero hay tres casos: a mayor, b mayor o iguales. Un else if los separa.",
    sol: `program mayorDeDos;
var
  a, b : integer;
begin
  read(a, b);
  if (a > b) then
    writeln('El mayor es ', a)
  else if (b > a) then
    writeln('El mayor es ', b)
  else
    writeln('Los números leídos son iguales');
end.`,
    entrada: "7 12",
  },
  {
    grupo: G1, ref: "P1·1 Ej 2", titulo: "Valor absoluto",
    enunciado: "Leer un número real e imprimir su valor absoluto: |X| = X si X ≥ 0, y |X| = −X si X < 0.",
    pista: "Traducí la definición tal cual a un if. No hace falta la función abs.",
    sol: `program valorAbsoluto;
var
  x, absoluto : real;
begin
  read(x);
  if (x >= 0) then
    absoluto := x
  else
    absoluto := -x;
  writeln('El valor absoluto es ', absoluto:0:2);
end.`,
    entrada: "-7.25",
  },
  {
    grupo: G1, ref: "P1·1 Ej 3", titulo: "Hasta el doble de X",
    enunciado: "Leer un número real X. Después leer números reales hasta que se ingrese uno que sea exactamente el doble de X.",
    pista: "No se sabe cuántos números vienen: while con lectura previa (o repeat, porque al menos uno se lee).",
    sol: `program dobleDeX;
var
  x, num : real;
begin
  read(x);
  read(num);
  while (num <> 2 * x) do
    read(num);
  writeln('Se ingresó el doble de X: ', num:0:2);
end.`,
    entrada: "3.5\n1 4 9.5 7",
  },
  {
    grupo: G1, ref: "P1·1 Ej 4", titulo: "A lo sumo 10 números",
    enunciado: "Modificar el ejercicio anterior para que, después de leer X, se lean a lo sumo 10 números. La lectura termina al ingresar el doble de X o al leer el décimo número; en ese caso informar: No se ha ingresado el doble de X.",
    pista: "Ahora hay dos motivos para cortar: un contador y la condición del doble. Al salir, preguntá por qué saliste.",
    sol: `program dobleDeXDiez;
var
  x, num : real;
  cant : integer;
begin
  read(x);
  cant := 0;
  repeat
    read(num);
    cant := cant + 1;
  until (num = 2 * x) or (cant = 10);
  if (num <> 2 * x) then
    writeln('No se ha ingresado el doble de X')
  else
    writeln('Se ingresó el doble de X en la lectura ', cant);
end.`,
    entrada: "5\n1 2 3 4 5 6 7 8 9 11",
  },
  {
    grupo: G1, ref: "P1·1 Ej 5", titulo: "Legajos y promedios",
    enunciado: "Leer legajo y promedio de cada alumno hasta el legajo -1 (que no se procesa). Informar: la cantidad de alumnos leídos, la cantidad con promedio mayor a 6.5 y el porcentaje de alumnos destacados (promedio mayor a 8.5) con legajo menor a 2500.",
    pista: "Lectura previa del legajo + while. El promedio se lee dentro del bucle. Ojo: el legajo 33423 del ejemplo no entra en un integer (máximo 32767): usá longint.",
    sol: `program legajos;
var
  legajo : longint;
  prom : real;
  cant, cantMas65, cantDest : integer;
begin
  cant := 0; cantMas65 := 0; cantDest := 0;
  read(legajo);
  while (legajo <> -1) do begin
    read(prom);
    cant := cant + 1;
    if (prom > 6.5) then
      cantMas65 := cantMas65 + 1;
    if (prom > 8.5) and (legajo < 2500) then
      cantDest := cantDest + 1;
    read(legajo);
  end;
  writeln('Cantidad de alumnos leídos: ', cant);
  writeln('Alumnos con promedio mayor a 6.5: ', cantMas65);
  if (cant > 0) then
    writeln('Porcentaje de destacados con legajo menor a 2500: ', cantDest / cant * 100:0:2, '%');
end.`,
    entrada: "33423 8.40\n19003 6.43\n1200 9.10\n-1",
  },
  {
    grupo: G1, ref: "P1·1 Ej 6", titulo: "Aumento de precios",
    enunciado: "Leer código, precio actual y precio nuevo de productos. La lectura termina con el producto de código 32767, que se procesa. Para cada producto indicar si el nuevo precio supera en un 10% al anterior.",
    pista: "El último se procesa: repeat-until. Supera el 10% si nuevo > actual * 1.1.",
    sol: `program aumentos;
var
  codigo : integer;
  actual, nuevo : real;
begin
  repeat
    read(codigo, actual, nuevo);
    if (nuevo > actual * 1.1) then
      writeln('El aumento de precio del producto ', codigo, ' es superior al 10%')
    else
      writeln('El aumento de precio del producto ', codigo, ' no supera el 10%');
  until (codigo = 32767);
end.`,
    entrada: "10382 40 44\n32767 30 33.01",
  },
  {
    grupo: G1, ref: "P1·1 Ej 7", titulo: "¿Tres vocales?",
    enunciado: "Leer tres caracteres e informar si los tres son vocales o si al menos uno no lo es. Ejemplo: 'a e o' → Los tres son vocales; 'z a g' → Al menos un carácter no era vocal.",
    pista: "Una condición con or por cada carácter se hace larga: escribí una vez la pregunta 'es vocal' para cada uno y combiná con and. En esta solución cada carácter se escribe en su propio renglón.",
    sol: `program tresVocales;
var
  c1, c2, c3 : char;
  v1, v2, v3 : boolean;
begin
  readln(c1);
  readln(c2);
  readln(c3);
  v1 := (c1 = 'a') or (c1 = 'e') or (c1 = 'i') or (c1 = 'o') or (c1 = 'u');
  v2 := (c2 = 'a') or (c2 = 'e') or (c2 = 'i') or (c2 = 'o') or (c2 = 'u');
  v3 := (c3 = 'a') or (c3 = 'e') or (c3 = 'i') or (c3 = 'o') or (c3 = 'u');
  if v1 and v2 and v3 then
    writeln('Los tres son vocales')
  else
    writeln('Al menos un carácter no era vocal');
end.
{ Cuando veas módulos (Práctica 2), esto queda mejor con una
  función esVocal(c: char): boolean. }`,
    entrada: "a\ne\no",
  },
  {
    grupo: G1, ref: "P1·1 Ej 8", titulo: "Suma o resta de una secuencia",
    enunciado: "Leer un carácter '+' o '-' (si es otro, informar error y terminar). Después leer enteros hasta el 0 y aplicar la operación. Ej: '-' con 4 3 5 -6 0 imprime 2; '+' con -10 5 6 -1 0 imprime 0.",
    pista: "El primer número es el valor inicial; la operación se aplica desde el segundo. Leé el carácter con readln para que el salto de línea no moleste.",
    sol: `program operacion;
var
  op : char;
  num, res : integer;
begin
  readln(op);
  if (op <> '+') and (op <> '-') then
    writeln('Error: la operación tiene que ser + o -')
  else begin
    read(num);
    res := num;              { el primero es el valor inicial }
    if (num <> 0) then
      read(num);
    while (num <> 0) do begin
      if (op = '+') then
        res := res + num
      else
        res := res - num;
      read(num);
    end;
    writeln(res);
  end;
end.`,
    entrada: "-\n4 3 5 -6 0",
  },

  // ---------------- Parte 2 ----------------
  {
    grupo: G2, ref: "P1·2 Ej 1", titulo: "Suma de 10 números",
    enunciado: "Leer 10 enteros e informar la suma total. (a) Además, informar la cantidad de números mayores a 5.",
    pista: "Cantidad conocida: for. Un acumulador para la suma y un contador para los mayores a 5.",
    sol: `program sumaDiez;
var
  i, num, suma, mayores5 : integer;
begin
  suma := 0;
  mayores5 := 0;
  for i := 1 to 10 do begin
    read(num);
    suma := suma + num;
    if (num > 5) then
      mayores5 := mayores5 + 1;
  end;
  writeln('Suma total: ', suma);
  writeln('Mayores a 5: ', mayores5);
end.`,
    entrada: "3 8 1 10 5 6 -2 7 0 9",
  },
  {
    grupo: G2, ref: "P1·2 Ej 2", titulo: "El mayor y su posición",
    enunciado: "Leer 10 números e informar el mayor. (a) Informar también la posición en la que fue leído. Ej: 3 5 6 2 3 10 98 8 -12 9 → El mayor número leído fue el 98, en la posición 7.",
    pista: "Inicializá el máximo con el menor integer (-32768) y guardá la variable del for cuando lo actualizás.",
    sol: `program mayorYPosicion;
var
  i, num, max, posMax : integer;
begin
  max := -32768;
  posMax := 0;
  for i := 1 to 10 do begin
    read(num);
    if (num > max) then begin
      max := num;
      posMax := i;
    end;
  end;
  writeln('El mayor número leído fue el ', max, ', en la posición ', posMax);
end.`,
    entrada: "3 5 6 2 3 10 98 8 -12 9",
  },
  {
    grupo: G2, ref: "P1·2 Ej 3", titulo: "Ingresantes a Analista en TIC",
    enunciado: "Leer nombre y nota (1 a 10) de alumnos ingresantes. La lectura termina con el alumno 'Zidane Zinedine', que se procesa. Informar la cantidad de aprobados (nota 8 o más) y la cantidad con nota 7.",
    pista: "El último se procesa: repeat-until. El nombre tiene espacios, así que se lee con readln.",
    sol: `program ingresantes;
var
  nombre : string;
  nota, aprobados, sietes : integer;
begin
  aprobados := 0;
  sietes := 0;
  repeat
    readln(nombre);
    readln(nota);
    if (nota >= 8) then
      aprobados := aprobados + 1
    else if (nota = 7) then
      sietes := sietes + 1;
  until (nombre = 'Zidane Zinedine');
  writeln('Aprobados: ', aprobados);
  writeln('Con nota 7: ', sietes);
end.`,
    entrada: "Ana Paz\n9\nLuis Gil\n7\nZidane Zinedine\n8",
  },
  {
    grupo: G2, ref: "P1·2 Ej 4", titulo: "Los dos mínimos",
    enunciado: "Leer 1000 enteros e informar los dos mínimos. (a) La lectura termina con el 0, que se procesa. (b) Termina con el 0, que no se procesa.",
    pista: "La actualización de min1 y min2 es la misma en las tres versiones; lo que cambia es la estructura de repetición: for, repeat-until o lectura previa + while.",
    sol: `program dosMinimos;
var
  i, num, min1, min2 : integer;
begin
  min1 := 32767;
  min2 := 32767;
  for i := 1 to 1000 do begin
    read(num);
    if (num < min1) then begin
      min2 := min1;
      min1 := num;
    end
    else if (num < min2) then
      min2 := num;
  end;
  writeln('Los dos mínimos son ', min1, ' y ', min2);
end.

{ (a) Termina con 0 y se procesa:
      repeat
        read(num);
        ...actualizar min1 y min2...
      until (num = 0);

  (b) Termina con 0 y no se procesa:
      read(num);
      while (num <> 0) do begin
        ...actualizar min1 y min2...
        read(num);
      end; }`,
    entrada: mil,
  },
  {
    grupo: G2, ref: "P1·2 Ej 5", titulo: "Máximo, mínimo y suma hasta el 100",
    enunciado: "Leer enteros hasta el 100, que se procesa. Informar el máximo, el mínimo y la suma total.",
    pista: "repeat-until porque el 100 se procesa. Máximo y mínimo se actualizan con dos if independientes (un número puede ser ambos si es el primero).",
    sol: `program maxMinSuma;
var
  num, max, min, suma : integer;
begin
  max := -32768;
  min := 32767;
  suma := 0;
  repeat
    read(num);
    if (num > max) then max := num;
    if (num < min) then min := num;
    suma := suma + num;
  until (num = 100);
  writeln('Máximo: ', max);
  writeln('Mínimo: ', min);
  writeln('Suma: ', suma);
end.`,
    entrada: "15 -3 250 7 100",
  },
  {
    grupo: G2, ref: "P1·2 Ej 6", titulo: "200 productos del supermercado",
    enunciado: "Leer código (1 a 200) y precio de 200 productos. Informar los códigos de los dos productos más baratos y la cantidad de productos de más de 16 pesos con código par.",
    pista: "Dos mínimos, pero guardando el código junto al precio. El código par se pregunta con codigo mod 2 = 0.",
    sol: `program supermercado;
var
  i, codigo, cod1, cod2, cant : integer;
  precio, min1, min2 : real;
begin
  min1 := 999999; min2 := 999999;
  cod1 := 0; cod2 := 0;
  cant := 0;
  for i := 1 to 200 do begin
    read(codigo, precio);
    if (precio < min1) then begin
      min2 := min1; cod2 := cod1;
      min1 := precio; cod1 := codigo;
    end
    else if (precio < min2) then begin
      min2 := precio; cod2 := codigo;
    end;
    if (precio > 16) and (codigo mod 2 = 0) then
      cant := cant + 1;
  end;
  writeln('Los dos más baratos: ', cod1, ' y ', cod2);
  writeln('Productos de más de $16 con código par: ', cant);
end.`,
    entrada: doscientos,
  },
  {
    grupo: G2, ref: "P1·2 Ej 7", titulo: "Autos de carrera",
    enunciado: "En una carrera participaron 100 autos. De cada uno se lee el nombre del piloto y el tiempo total. Informar los nombres de los dos pilotos que terminaron primeros y de los dos que terminaron últimos.",
    pista: "Primeros = menor tiempo (dos mínimos). Últimos = mayor tiempo (dos máximos). Las cuatro actualizaciones van en el mismo for.",
    sol: `program carrera;
const
  CANT = 100;
var
  i : integer;
  piloto, pri1, pri2, ult1, ult2 : string;
  tiempo, min1, min2, max1, max2 : real;
begin
  min1 := 1e30; min2 := 1e30;
  max1 := -1; max2 := -1;
  pri1 := ''; pri2 := ''; ult1 := ''; ult2 := '';
  for i := 1 to CANT do begin
    readln(piloto);
    readln(tiempo);
    if (tiempo < min1) then begin
      min2 := min1; pri2 := pri1;
      min1 := tiempo; pri1 := piloto;
    end
    else if (tiempo < min2) then begin
      min2 := tiempo; pri2 := piloto;
    end;
    if (tiempo > max1) then begin
      max2 := max1; ult2 := ult1;
      max1 := tiempo; ult1 := piloto;
    end
    else if (tiempo > max2) then begin
      max2 := tiempo; ult2 := piloto;
    end;
  end;
  writeln('Primeros puestos: ', pri1, ' y ', pri2);
  writeln('Últimos puestos: ', ult1, ' y ', ult2);
end.
{ Para probarlo rápido, cambiá CANT a 4. }`,
  },
  {
    grupo: G2, ref: "P1·2 Ej 8", titulo: "Ventas del mes",
    enunciado: "Para cada uno de los 31 días del mes se leen los montos de las ventas, hasta el monto 0. Informar la cantidad de ventas de cada día y el monto total del mes. (a) Informar también el día con más ventas.",
    pista: "Un for de 1 a 31 por fuera y un while por dentro. El contador de ventas se reinicia cada día; el total del mes no.",
    sol: `program ventasMes;
var
  dia, cantDia, maxCant, diaMax : integer;
  monto, total : real;
begin
  total := 0;
  maxCant := -1;
  diaMax := 0;
  for dia := 1 to 31 do begin
    cantDia := 0;
    read(monto);
    while (monto <> 0) do begin
      cantDia := cantDia + 1;
      total := total + monto;
      read(monto);
    end;
    writeln('Día ', dia, ': ', cantDia, ' ventas');
    if (cantDia > maxCant) then begin
      maxCant := cantDia;
      diaMax := dia;
    end;
  end;
  writeln('Monto total del mes: ', total:0:2);
  writeln('Día con más ventas: ', diaMax);
end.`,
    entrada: Array.from({ length: 31 }, (_, d) => Array.from({ length: (d * 5) % 4 }, (_, k) => 100 + d * 3 + k).concat([0]).join(" ")).join("\n"),
  },

  // ---------------- Adicionales ----------------
  {
    grupo: G3, ref: "P1·3 Act 1", titulo: "Revisando inversiones",
    enunciado: "Por cada empresa se lee código, cantidad de inversiones y el monto de cada una. Termina con la empresa 100, que se procesa. Informar el monto promedio de cada empresa, el código de la de mayor monto total invertido y cuántas empresas tienen inversiones por más de $50000.",
    pista: "repeat-until por fuera (la empresa 100 se procesa) y un for por dentro para los montos. 'Inversiones de más de $50000' se toma como el total de la empresa.",
    sol: `program inversiones;
var
  codigo, cantInv, i, codMax, cantMas50 : integer;
  monto, total, maxTotal : real;
begin
  maxTotal := -1;
  codMax := 0;
  cantMas50 := 0;
  repeat
    read(codigo);
    read(cantInv);
    total := 0;
    for i := 1 to cantInv do begin
      read(monto);
      total := total + monto;
    end;
    if (cantInv > 0) then
      writeln('Empresa ', codigo, ' monto promedio ', total / cantInv:0:2);
    if (total > maxTotal) then begin
      maxTotal := total;
      codMax := codigo;
    end;
    if (total > 50000) then
      cantMas50 := cantMas50 + 1;
  until (codigo = 100);
  writeln('La empresa ', codMax, ' es la que más dinero tiene invertido ($', maxTotal:0:2, ')');
  writeln('Hay ', cantMas50, ' empresas con inversiones por más de $50000');
end.`,
    entrada: "33\n4\n33200 56930 24500.85 10000\n41\n3\n102000.22 53000 12000\n100\n1\n84000.34",
  },
  {
    grupo: G3, ref: "P1·3 Act 2", titulo: "Autoevaluaciones de CADP",
    enunciado: "Para cada alumno se lee legajo, condición (I: ingresante, R: recursante) y la nota de las 5 autoevaluaciones (-1 si no la entregó). Termina con el legajo -1. Informar: cantidad y porcentaje de ingresantes y de recursantes en condiciones de rendir; cantidad que aprobó todas; cantidad con promedio mayor a 6.5; cantidad con al menos un cero; legajos de los dos con más dieces y de los dos con más ceros.\nPara rendir hay que tener 'Presente' en al menos el 75% de las autoevaluaciones; es Presente la que se entregó con al menos 40% de respuestas correctas.",
    pista: "Presente = nota ≥ 4. El 75% de 5 es 3,75, así que hacen falta 4 presentes. Por cada alumno: un for de 5 notas con contadores que se reinician; después se actualizan los totales y los dos 'máximos' (de dieces y de ceros).",
    sol: `program autoevaluaciones;
const
  NOTA_PRESENTE = 4;   { 40% de respuestas correctas }
  MIN_PRESENTES = 4;   { 75% de 5 = 3,75 -> 4 }
var
  legajo, leg10a, leg10b, leg0a, leg0b : longint;
  cond : char;
  i, nota, presentes, dieces, ceros, suma : integer;
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
    presentes := 0; dieces := 0; ceros := 0; suma := 0;
    for i := 1 to 5 do begin
      read(nota);
      if (nota >= NOTA_PRESENTE) then presentes := presentes + 1;
      if (nota = 10) then dieces := dieces + 1;
      if (nota = 0) then ceros := ceros + 1;
      if (nota > 0) then suma := suma + nota;   { las no entregadas cuentan 0 }
    end;
    readln;
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
    if (dieces > max10a) then begin
      max10b := max10a; leg10b := leg10a;
      max10a := dieces; leg10a := legajo;
    end
    else if (dieces > max10b) then begin
      max10b := dieces; leg10b := legajo;
    end;
    if (ceros > max0a) then begin
      max0b := max0a; leg0b := leg0a;
      max0a := ceros; leg0a := legajo;
    end
    else if (ceros > max0b) then begin
      max0b := ceros; leg0b := legajo;
    end;
    readln(legajo);
  end;
  write('Ingresantes en condiciones de rendir: ', ingrOk);
  if (ingr > 0) then writeln(' (', ingrOk / ingr * 100:0:2, '%)') else writeln;
  write('Recursantes en condiciones de rendir: ', recuOk);
  if (recu > 0) then writeln(' (', recuOk / recu * 100:0:2, '%)') else writeln;
  writeln('Aprobaron todas las autoevaluaciones: ', todas);
  writeln('Promedio mayor a 6.5: ', promAlto);
  writeln('Con al menos un cero: ', conCero);
  writeln('Más dieces: ', leg10a, ' y ', leg10b);
  writeln('Más ceros: ', leg0a, ' y ', leg0b);
end.`,
    entrada: "19003\nR\n8 10 6 -1 8\n21020\nI\n4 0 6 10 -1\n22100\nI\n10 10 9 8 10\n-1",
  },
  {
    grupo: G3, ref: "P1·3 Act 3", titulo: "Ventas de tanques de agua",
    enunciado: "Se leen los tanques vendidos: rectangulares 'R' (ancho A, largo B y alto C) o cilíndricos 'C' (radio y alto), en metros. La lectura termina con un tanque de tipo 'Z'. Informar: el volumen de los dos mayores tanques, el volumen promedio de los cilíndricos y de los rectangulares, la cantidad de tanques con alto menor a 1.40 m y la cantidad con volumen menor a 800 m³.\nVolumen del cilindro: π·radio²·alto. Volumen del rectangular: A·B·C.",
    pista: "Lectura previa del tipo + while. Según el tipo se leen distintos datos, pero después del if ambos tienen 'volumen' y 'alto', así que el resto del procesamiento es común.",
    sol: `program tanques;
var
  tipo : char;
  a, b, radio, alto, vol, max1, max2, sumaC, sumaR : real;
  cantC, cantR, bajos, chicos : integer;
begin
  max1 := -1; max2 := -1;
  sumaC := 0; sumaR := 0; cantC := 0; cantR := 0;
  bajos := 0; chicos := 0;
  readln(tipo);
  while (tipo <> 'Z') do begin
    if (tipo = 'R') then begin
      readln(a, b, alto);
      vol := a * b * alto;
      sumaR := sumaR + vol;
      cantR := cantR + 1;
    end
    else begin
      readln(radio, alto);
      vol := pi * radio * radio * alto;
      sumaC := sumaC + vol;
      cantC := cantC + 1;
    end;
    if (vol > max1) then begin
      max2 := max1;
      max1 := vol;
    end
    else if (vol > max2) then
      max2 := vol;
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

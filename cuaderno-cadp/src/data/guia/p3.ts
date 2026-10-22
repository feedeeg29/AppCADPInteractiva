import type { Ejercicio } from "../types";

const G = "Práctica 3 · Registros";
const GA = "Ejercicios adicionales";

export const guiaP3: Ejercicio[] = [
  {
    grupo: G, ref: "P3 Ej 1", titulo: "Alumnos: cantidad y mejor promedio",
    enunciado: "Dado el tipo alumno (código, nombre, promedio) y el módulo leer: (a) completar el programa principal para que lea alumnos hasta el código 0 (que no se procesa) e informe la cantidad leída; (b) informar también el nombre del alumno con mejor promedio.",
    pista: "El módulo leer ya contempla el código 0, así que encaja con lectura previa + while. Para el mejor promedio guardá el nombre junto al máximo.",
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
  writeln('Ingrese el código del alumno');
  readln(alu.codigo);
  if (alu.codigo <> 0) then begin
    writeln('Ingrese el nombre del alumno');
    readln(alu.nombre);
    writeln('Ingrese el promedio del alumno');
    readln(alu.promedio);
  end;
end;

var
  a : alumno;
  cant : integer;
  maxProm : real;
  mejor : str20;
begin
  cant := 0;
  maxProm := -1;
  mejor := '';
  leer(a);
  while (a.codigo <> 0) do begin
    cant := cant + 1;
    if (a.promedio > maxProm) then begin
      maxProm := a.promedio;
      mejor := a.nombre;
    end;
    leer(a);
  end;
  writeln('Cantidad de alumnos leídos: ', cant);
  writeln('Mejor promedio: ', mejor);
end.`,
    entrada: "5\nAna\n7.5\n3\nLuis\n9\n0",
  },
  {
    grupo: G, ref: "P3 Ej 2", titulo: "Casamientos 2019",
    enunciado: "(a) Definir un tipo para la fecha de cada casamiento. (b) Implementar un módulo que lea una fecha. (c) Leer las fechas de los casamientos de 2019 hasta el año 2020 (que no se procesa) e informar cuántos fueron en verano (enero, febrero y marzo) y cuántos en los primeros 10 días de cada mes.",
    pista: "El corte depende del año: el módulo lee el año primero y solo lee mes y día si el año no es 2020. Las dos condiciones son independientes: un casamiento puede contar en ambas.",
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
  verano := 0;
  primeros10 := 0;
  leerFecha(f);
  while (f.anio <> 2020) do begin
    if (f.mes <= 3) then
      verano := verano + 1;
    if (f.dia <= 10) then
      primeros10 := primeros10 + 1;
    leerFecha(f);
  end;
  writeln('Casamientos en verano: ', verano);
  writeln('Casamientos en los primeros 10 días del mes: ', primeros10);
end.`,
    entrada: "2019 1 5\n2019 7 20\n2019 3 9\n2019 12 28\n2020",
  },
  {
    grupo: G, ref: "P3 Ej 3", titulo: "Escuelas y relación alumnos por docente",
    enunciado: "Se procesan las 2400 escuelas primarias de la provincia: CUE, nombre, cantidad de docentes, cantidad de alumnos y localidad. Informar la cantidad de escuelas de La Plata con una relación alumnos por docente superior a la de la UNESCO (23,435) y el CUE y nombre de las dos escuelas con mejor relación. Usar un módulo para leer una escuela y otro para calcular la relación (alumnos / docentes).",
    pista: "La 'mejor' relación es la que tiene menos alumnos por docente: dos mínimos. La relación es un único valor real: función.",
    sol: `program escuelas;
const
  CANT = 2400;
  UNESCO = 23.435;
type
  escuela = record
    cue : longint;
    nombre : string;
    docentes, alumnos : integer;
    localidad : string;
  end;

procedure leerEscuela(var e : escuela);
begin
  readln(e.cue);
  readln(e.nombre);
  readln(e.docentes);
  readln(e.alumnos);
  readln(e.localidad);
end;

function relacion(e : escuela) : real;
begin
  relacion := e.alumnos / e.docentes;
end;

var
  e : escuela;
  i, cantLP : integer;
  r, min1, min2 : real;
  cue1, cue2 : longint;
  nom1, nom2 : string;
begin
  cantLP := 0;
  min1 := 1e30; min2 := 1e30;
  cue1 := 0; cue2 := 0; nom1 := ''; nom2 := '';
  for i := 1 to CANT do begin
    leerEscuela(e);
    r := relacion(e);
    if (e.localidad = 'La Plata') and (r > UNESCO) then
      cantLP := cantLP + 1;
    if (r < min1) then begin
      min2 := min1; cue2 := cue1; nom2 := nom1;
      min1 := r; cue1 := e.cue; nom1 := e.nombre;
    end
    else if (r < min2) then begin
      min2 := r; cue2 := e.cue; nom2 := e.nombre;
    end;
  end;
  writeln('Escuelas de La Plata por encima de la relación UNESCO: ', cantLP);
  writeln('Mejor relación: ', cue1, ' ', nom1);
  writeln('Segunda mejor relación: ', cue2, ' ', nom2);
end.
{ Para probarlo rápido, cambiá CANT a 3. }`,
  },
  {
    grupo: G, ref: "P3 Ej 4", titulo: "Facturación de telefonía",
    enunciado: "Para los 9300 clientes se lee código y cantidad de líneas; de cada línea, número, minutos y MB consumidos. (a) Módulo que lea una línea. (b) Módulo que reciba un cliente, lea todas sus líneas y devuelva el total de minutos y de MB. Informar el monto a facturar de cada cliente: $3,40 por minuto y $1,35 por MB.",
    pista: "El módulo del inciso b devuelve dos valores: procedimiento con dos parámetros var. Adentro usa el del inciso a en un for.",
    sol: `program telefonia;
const
  CANT = 9300;
  PRECIO_MIN = 3.40;
  PRECIO_MB = 1.35;
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
  totMin := 0;
  totMB := 0;
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
  for i := 1 to CANT do begin
    read(c.codigo, c.cantLineas);
    procesarCliente(c, mins, mbs);
    writeln('Cliente ', c.codigo, ': $', mins * PRECIO_MIN + mbs * PRECIO_MB:0:2);
  end;
end.
{ Para probarlo rápido, cambiá CANT a 2. }`,
  },
  {
    grupo: G, ref: "P3 Ej 5", titulo: "Concesionaria: promedio por marca",
    enunciado: "Leer autos (marca, modelo y precio) hasta la marca 'ZZZ', que no se procesa. La información viene ordenada por marca. Informar el precio promedio por marca y la marca y modelo del auto más caro.",
    pista: "Corte de control por marca. Los totales del grupo se inicializan al empezar cada marca; el más caro se compara contra un máximo general.",
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
  marcaMax := ''; modeloMax := '';
  leerAuto(a);
  while (a.marca <> 'ZZZ') do begin
    actual := a.marca;
    cant := 0;
    suma := 0;
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
    writeln(actual, ': precio promedio ', suma / cant:0:2);
  end;
  writeln('Auto más caro: ', marcaMax, ' ', modeloMax);
end.`,
    entrada: "Fiat\nCronos\n12000\nFiat\nMobi\n9000\nFord\nKa\n8000\nFord\nRanger\n30000\nZZZ",
  },
  {
    grupo: G, ref: "P3 Ej 6", titulo: "Microprocesadores en stock",
    enunciado: "De cada microprocesador se conoce marca, línea, cantidad de cores, velocidad del reloj (GHz) y tamaño de los transistores (nm). La información viene agrupada por marca y termina con un procesador de 0 cores (que no se procesa). Informar: marca y línea de los procesadores de más de 2 cores con transistores de a lo sumo 22 nm; las dos marcas con más procesadores de 14 nm; y la cantidad de procesadores multicore (más de un core) con reloj de al menos 2 GHz.",
    pista: "Corte de control por marca para contar los de 14 nm de cada marca (y actualizar los dos máximos al cerrar el grupo). Los otros dos incisos se resuelven procesador por procesador.",
    sol: `program microprocesadores;
type
  procesador = record
    marca, linea : string;
    cores : integer;
    reloj : real;
    nm : integer;
  end;

procedure leerProcesador(var p : procesador);
begin
  readln(p.marca);
  readln(p.linea);
  readln(p.cores);
  if (p.cores <> 0) then begin
    readln(p.reloj);
    readln(p.nm);
  end;
end;

procedure actualizarMaximos(cant : integer; marca : string;
                            var max1, max2 : integer; var marca1, marca2 : string);
begin
  if (cant > max1) then begin
    max2 := max1; marca2 := marca1;
    max1 := cant; marca1 := marca;
  end
  else if (cant > max2) then begin
    max2 := cant; marca2 := marca;
  end;
end;

var
  p : procesador;
  actual, marca1, marca2 : string;
  cant14, max1, max2, multicore : integer;
begin
  max1 := -1; max2 := -1; marca1 := ''; marca2 := '';
  multicore := 0;
  leerProcesador(p);
  while (p.cores <> 0) do begin
    actual := p.marca;
    cant14 := 0;
    while (p.cores <> 0) and (p.marca = actual) do begin
      if (p.cores > 2) and (p.nm <= 22) then
        writeln(p.marca, ' ', p.linea);
      if (p.nm = 14) then
        cant14 := cant14 + 1;
      if (p.cores > 1) and (p.reloj >= 2) then
        multicore := multicore + 1;
      leerProcesador(p);
    end;
    actualizarMaximos(cant14, actual, max1, max2, marca1, marca2);
  end;
  writeln('Marcas con más procesadores de 14 nm: ', marca1, ' y ', marca2);
  writeln('Multicore de al menos 2 GHz: ', multicore);
end.`,
    entrada: "Intel\nCore i7\n8\n3.2\n14\nIntel\nAtom\n2\n1.6\n22\nAMD\nRyzen 5\n6\n3.6\n14\nAMD\nRyzen 7\n8\n3.8\n14\nNVidia\nTegra\n4\n2.0\n28\nfin\nfin\n0",
  },
  {
    grupo: G, ref: "P3 Ej 7", titulo: "Centros de investigación",
    enunciado: "De cada centro se lee nombre abreviado, universidad, cantidad de investigadores y cantidad de becarios. La información viene agrupada por universidad y termina con un centro de 0 investigadores (que no se procesa). Informar: la cantidad de centros de cada universidad, la universidad con más investigadores en sus centros y los dos centros con menos becarios.",
    pista: "Corte de control por universidad: cuenta centros y suma investigadores. Al cerrar cada grupo se informa y se actualiza el máximo. Los dos mínimos de becarios se actualizan centro por centro.",
    sol: `program centros;
type
  centro = record
    nombre, universidad : string;
    investigadores, becarios : integer;
  end;

procedure leerCentro(var c : centro);
begin
  readln(c.nombre);
  readln(c.universidad);
  readln(c.investigadores);
  if (c.investigadores <> 0) then
    readln(c.becarios);
end;

var
  c : centro;
  actual, univMax, cen1, cen2 : string;
  cantCentros, sumaInv, maxInv, min1, min2 : integer;
begin
  maxInv := -1; univMax := '';
  min1 := 32767; min2 := 32767; cen1 := ''; cen2 := '';
  leerCentro(c);
  while (c.investigadores <> 0) do begin
    actual := c.universidad;
    cantCentros := 0;
    sumaInv := 0;
    while (c.investigadores <> 0) and (c.universidad = actual) do begin
      cantCentros := cantCentros + 1;
      sumaInv := sumaInv + c.investigadores;
      if (c.becarios < min1) then begin
        min2 := min1; cen2 := cen1;
        min1 := c.becarios; cen1 := c.nombre;
      end
      else if (c.becarios < min2) then begin
        min2 := c.becarios; cen2 := c.nombre;
      end;
      leerCentro(c);
    end;
    writeln(actual, ': ', cantCentros, ' centros');
    if (sumaInv > maxInv) then begin
      maxInv := sumaInv;
      univMax := actual;
    end;
  end;
  writeln('Universidad con más investigadores: ', univMax);
  writeln('Centros con menos becarios: ', cen1, ' y ', cen2);
end.`,
    entrada: "LIDI\nUNLP\n80\n20\nLIFIA\nUNLP\n40\n12\nLINTI\nUNLP\n35\n9\nICC\nUBA\n90\n30\nfin\nfin\n0",
  },
  {
    grupo: G, ref: "P3 Ej 8", titulo: "Jóvenes y Memoria",
    enunciado: "Cada proyecto tiene código, título, docente coordinador (DNI, nombre y apellido, email), cantidad de alumnos, nombre de la escuela y localidad. Una escuela puede presentar varios proyectos. La información viene ordenada por localidad y, dentro de cada localidad, por escuela. Termina con el código -1. Informar: la cantidad total de escuelas y la cantidad por localidad; los nombres de las dos escuelas con más alumnos participantes; y los títulos de los proyectos de Daireaux cuyo código tiene igual cantidad de dígitos pares e impares.",
    pista: "Corte de control doble: por localidad y, dentro, por escuela. Cada nivel tiene su 'actual' y sus contadores. El docente es un registro dentro del registro proyecto.",
    sol: `program jovenesYMemoria;
type
  docente = record
    dni : longint;
    nombre, email : string;
  end;
  proyecto = record
    codigo : integer;
    titulo : string;
    coord : docente;
    alumnos : integer;
    escuela, localidad : string;
  end;

procedure leerProyecto(var p : proyecto);
begin
  readln(p.codigo);
  if (p.codigo <> -1) then begin
    readln(p.titulo);
    readln(p.coord.dni);
    readln(p.coord.nombre);
    readln(p.coord.email);
    readln(p.alumnos);
    readln(p.escuela);
    readln(p.localidad);
  end;
end;

function mismosParesEImpares(n : integer) : boolean;
var pares, impares : integer;
begin
  pares := 0;
  impares := 0;
  repeat
    if ((n mod 10) mod 2 = 0) then pares := pares + 1
    else impares := impares + 1;
    n := n div 10;
  until (n = 0);
  mismosParesEImpares := (pares = impares);
end;

procedure actualizarMaximos(cant : integer; esc : string;
                            var max1, max2 : integer; var esc1, esc2 : string);
begin
  if (cant > max1) then begin
    max2 := max1; esc2 := esc1;
    max1 := cant; esc1 := esc;
  end
  else if (cant > max2) then begin
    max2 := cant; esc2 := esc;
  end;
end;

var
  p : proyecto;
  locActual, escActual, esc1, esc2 : string;
  totalEsc, escLoc, alumEsc, max1, max2 : integer;
begin
  totalEsc := 0;
  max1 := -1; max2 := -1; esc1 := ''; esc2 := '';
  leerProyecto(p);
  while (p.codigo <> -1) do begin
    locActual := p.localidad;
    escLoc := 0;
    while (p.codigo <> -1) and (p.localidad = locActual) do begin
      escActual := p.escuela;
      escLoc := escLoc + 1;
      alumEsc := 0;
      while (p.codigo <> -1) and (p.localidad = locActual) and (p.escuela = escActual) do begin
        alumEsc := alumEsc + p.alumnos;
        if (p.localidad = 'Daireaux') and mismosParesEImpares(p.codigo) then
          writeln('Daireaux: ', p.titulo);
        leerProyecto(p);
      end;
      actualizarMaximos(alumEsc, escActual, max1, max2, esc1, esc2);
    end;
    writeln(locActual, ': ', escLoc, ' escuelas');
    totalEsc := totalEsc + escLoc;
  end;
  writeln('Total de escuelas: ', totalEsc);
  writeln('Escuelas con más alumnos: ', esc1, ' y ', esc2);
end.`,
    entrada: "1234\nMemorias del barrio\n20111222\nAna Paz\nana@mail.com\n25\nEscuela 1\nDaireaux\n15\nLa plaza\n21333444\nLuis Gil\nluis@mail.com\n10\nEscuela 1\nDaireaux\n77\nVoces\n22444555\nSol Rios\nsol@mail.com\n40\nEscuela 3\nDaireaux\n500\nArchivo vivo\n23555666\nJuan Diaz\njuan@mail.com\n18\nEscuela 9\nLa Plata\n-1",
  },

  // ---------------- Adicionales ----------------
  {
    grupo: GA, ref: "P3 Ad 9", titulo: "Intendentes",
    enunciado: "De cada candidato ganador a intendente se lee localidad, apellido, cantidad de votos obtenidos y cantidad de votantes de la localidad. La lectura termina con la localidad 'Zárate', que se procesa. Informar el intendente con más votos y el intendente con mayor porcentaje de votos.",
    pista: "Dos máximos independientes: uno por votos absolutos y otro por porcentaje (votos / votantes · 100). repeat-until porque Zárate se procesa.",
    sol: `program intendentes;
type
  candidato = record
    localidad, apellido : string;
    votos, votantes : longint;
  end;

procedure leerCandidato(var c : candidato);
begin
  readln(c.localidad);
  readln(c.apellido);
  readln(c.votos);
  readln(c.votantes);
end;

var
  c : candidato;
  maxVotos : longint;
  porc, maxPorc : real;
  apVotos, apPorc : string;
begin
  maxVotos := -1; maxPorc := -1;
  apVotos := ''; apPorc := '';
  repeat
    leerCandidato(c);
    if (c.votos > maxVotos) then begin
      maxVotos := c.votos;
      apVotos := c.apellido;
    end;
    porc := c.votos / c.votantes * 100;
    if (porc > maxPorc) then begin
      maxPorc := porc;
      apPorc := c.apellido;
    end;
  until (c.localidad = 'Zárate');
  writeln('Más votos: ', apVotos, ' (', maxVotos, ')');
  writeln('Mayor porcentaje: ', apPorc, ' (', maxPorc:0:2, '%)');
end.`,
    entrada: "La Plata\nGarcia\n250000\n500000\nBerisso\nLopez\n40000\n60000\nZárate\nMartinez\n50000\n90000",
  },
  {
    grupo: GA, ref: "P3 Ad 10", titulo: "320 especies de plantas",
    enunciado: "De cada una de las 320 especies se lee nombre científico, tiempo promedio de vida (meses), tipo de planta, clima y los países donde se encuentra (la lista de países termina con 'zzz', que no se procesa). La información viene ordenada por tipo de planta. Informar: el tipo con menos plantas; el tiempo promedio de vida de cada tipo; el nombre de las dos plantas más longevas; los nombres de las plantas nativas de Argentina que viven en clima subtropical; y la planta que se encuentra en más países.",
    pista: "Corte de control por tipo, pero además hay una cantidad fija (320): el bucle de cada grupo también corta cuando ya se procesaron todas. El módulo que lee una planta procesa su lista de países y devuelve cuántos son y si aparece Argentina.",
    sol: `program plantas;
const
  CANT = 320;
type
  planta = record
    nombre : string;
    vida : integer;
    tipo, clima : string;
    cantPaises : integer;
    enArgentina : boolean;
  end;

procedure leerPlanta(var p : planta);
var pais : string;
begin
  readln(p.nombre);
  readln(p.vida);
  readln(p.tipo);
  readln(p.clima);
  p.cantPaises := 0;
  p.enArgentina := false;
  readln(pais);
  while (pais <> 'zzz') do begin
    p.cantPaises := p.cantPaises + 1;
    if (pais = 'Argentina') then
      p.enArgentina := true;
    readln(pais);
  end;
end;

var
  p : planta;
  leidas, cantTipo, minTipo, maxPaises, vida1, vida2 : integer;
  sumaVida : longint;
  actual, tipoMin, nom1, nom2, nomPaises : string;
begin
  minTipo := 32767; tipoMin := '';
  vida1 := -1; vida2 := -1; nom1 := ''; nom2 := '';
  maxPaises := -1; nomPaises := '';
  leidas := 1;
  leerPlanta(p);
  while (leidas <= CANT) do begin
    actual := p.tipo;
    cantTipo := 0;
    sumaVida := 0;
    while (leidas <= CANT) and (p.tipo = actual) do begin
      cantTipo := cantTipo + 1;
      sumaVida := sumaVida + p.vida;
      if (p.vida > vida1) then begin
        vida2 := vida1; nom2 := nom1;
        vida1 := p.vida; nom1 := p.nombre;
      end
      else if (p.vida > vida2) then begin
        vida2 := p.vida; nom2 := p.nombre;
      end;
      if p.enArgentina and (p.clima = 'subtropical') then
        writeln('Nativa de Argentina en clima subtropical: ', p.nombre);
      if (p.cantPaises > maxPaises) then begin
        maxPaises := p.cantPaises;
        nomPaises := p.nombre;
      end;
      leidas := leidas + 1;
      if (leidas <= CANT) then
        leerPlanta(p);
    end;
    writeln('Tipo ', actual, ': vida promedio ', sumaVida / cantTipo:0:2, ' meses');
    if (cantTipo < minTipo) then begin
      minTipo := cantTipo;
      tipoMin := actual;
    end;
  end;
  writeln('Tipo con menos plantas: ', tipoMin);
  writeln('Las dos más longevas: ', nom1, ' y ', nom2);
  writeln('Planta que está en más países: ', nomPaises);
end.
{ Para probarlo rápido, cambiá CANT a 3. }`,
  },
  {
    grupo: GA, ref: "P3 Ad 11", titulo: "Vuelos de 2019",
    enunciado: "De cada vuelo se conoce código de avión, país de salida, país de llegada, kilómetros recorridos y porcentaje de ocupación. La información viene ordenada por código de avión y, para cada avión, por país de salida. Termina con el código 44 (que no se procesa). Informar: los dos aviones que más kilómetros recorrieron y los dos que menos; el avión que salió desde más países diferentes; la cantidad de vuelos de más de 5000 km que no llegaron al 60% de ocupación; y la cantidad de vuelos de menos de 10000 km que llegaron a Australia o a Nueva Zelanda.",
    pista: "Corte de control doble: por avión (suma de km) y, dentro, por país de salida (cada grupo interno es un país distinto, así que contar grupos internos da la cantidad de países). Los dos últimos incisos se evalúan vuelo por vuelo.",
    sol: `program vuelos;
type
  vuelo = record
    avion : integer;
    salida, llegada : string;
    km, ocupacion : real;
  end;

procedure leerVuelo(var v : vuelo);
begin
  readln(v.avion);
  if (v.avion <> 44) then begin
    readln(v.salida);
    readln(v.llegada);
    readln(v.km);
    readln(v.ocupacion);
  end;
end;

var
  v : vuelo;
  avActual, paises, maxPaises, avPaises, max1, max2, min1, min2, cantA, cantB : integer;
  salActual : string;
  kmAvion, kmMax1, kmMax2, kmMin1, kmMin2 : real;
begin
  kmMax1 := -1; kmMax2 := -1; max1 := 0; max2 := 0;
  kmMin1 := 1e30; kmMin2 := 1e30; min1 := 0; min2 := 0;
  maxPaises := -1; avPaises := 0;
  cantA := 0; cantB := 0;
  leerVuelo(v);
  while (v.avion <> 44) do begin
    avActual := v.avion;
    kmAvion := 0;
    paises := 0;
    while (v.avion = avActual) do begin
      salActual := v.salida;
      paises := paises + 1;
      while (v.avion = avActual) and (v.salida = salActual) do begin
        kmAvion := kmAvion + v.km;
        if (v.km > 5000) and (v.ocupacion < 60) then
          cantA := cantA + 1;
        if (v.km < 10000) and ((v.llegada = 'Australia') or (v.llegada = 'Nueva Zelanda')) then
          cantB := cantB + 1;
        leerVuelo(v);
      end;
    end;
    if (kmAvion > kmMax1) then begin
      kmMax2 := kmMax1; max2 := max1;
      kmMax1 := kmAvion; max1 := avActual;
    end
    else if (kmAvion > kmMax2) then begin
      kmMax2 := kmAvion; max2 := avActual;
    end;
    if (kmAvion < kmMin1) then begin
      kmMin2 := kmMin1; min2 := min1;
      kmMin1 := kmAvion; min1 := avActual;
    end
    else if (kmAvion < kmMin2) then begin
      kmMin2 := kmAvion; min2 := avActual;
    end;
    if (paises > maxPaises) then begin
      maxPaises := paises;
      avPaises := avActual;
    end;
  end;
  writeln('Aviones con más km: ', max1, ' y ', max2);
  writeln('Aviones con menos km: ', min1, ' y ', min2);
  writeln('Avión que salió de más países: ', avPaises);
  writeln('Vuelos de más de 5000 km con menos del 60% de ocupación: ', cantA);
  writeln('Vuelos de menos de 10000 km a Australia o Nueva Zelanda: ', cantB);
end.`,
    entrada: "1\nArgentina\nChile\n1200\n80\n1\nBrasil\nAustralia\n9000\n55\n2\nChile\nNueva Zelanda\n12000\n90\n3\nArgentina\nEspaña\n10000\n50\n3\nEspaña\nItalia\n1500\n70\n3\nItalia\nAustralia\n8000\n95\n44",
  },
  {
    grupo: GA, ref: "P3 Ad 12 · Act 1", titulo: "Inversiones, con registros",
    enunciado: "Volver a resolver la Actividad 1 de la guía adicional de la Práctica 1 (inversiones) usando registros para representar los datos. ¿Qué entidades conviene representar como registros y con qué atributos? ¿Qué cambia en los módulos?",
    pista: "La entidad es la empresa: código, cantidad de inversiones y monto total. El módulo de lectura ahora devuelve un registro completo, y actualizar el máximo puede guardar la empresa entera.",
    sol: `{ Entidad: empresa (código, cantidad de inversiones, total invertido).
  Los montos individuales no hace falta guardarlos: solo se suman.
  Comparado con la versión de la Práctica 2, los módulos reciben y
  devuelven un solo parámetro (la empresa) en vez de varios sueltos. }
program inversionesRegistros;
type
  empresa = record
    codigo, cantInv : integer;
    total : real;
  end;

procedure leerEmpresa(var e : empresa);
var
  i : integer;
  monto : real;
begin
  read(e.codigo);
  read(e.cantInv);
  e.total := 0;
  for i := 1 to e.cantInv do begin
    read(monto);
    e.total := e.total + monto;
  end;
end;

procedure actualizarMaximo(e : empresa; var max : empresa);
begin
  if (e.total > max.total) then
    max := e;
end;

var
  e, max : empresa;
  cantMas50 : integer;
begin
  max.total := -1;
  max.codigo := 0;
  cantMas50 := 0;
  repeat
    leerEmpresa(e);
    if (e.cantInv > 0) then
      writeln('Empresa ', e.codigo, ' monto promedio ', e.total / e.cantInv:0:2);
    actualizarMaximo(e, max);
    if (e.total > 50000) then
      cantMas50 := cantMas50 + 1;
  until (e.codigo = 100);
  writeln('La empresa ', max.codigo, ' es la que más dinero tiene invertido ($', max.total:0:2, ')');
  writeln('Hay ', cantMas50, ' empresas con inversiones por más de $50000');
end.`,
    entrada: "33\n4\n33200 56930 24500.85 10000\n41\n3\n102000.22 53000 12000\n100\n1\n84000.34",
  },
  {
    grupo: GA, ref: "P3 Ad 12 · Act 2", titulo: "Autoevaluaciones, con registros",
    enunciado: "Volver a resolver la Actividad 2 (autoevaluaciones de CADP) usando registros.",
    pista: "Entidad alumno: legajo, condición y un registro con el resumen de sus notas (presentes, dieces, ceros, suma). Así el módulo de lectura devuelve todo junto.",
    sol: `program autoevaluacionesRegistros;
const
  NOTA_PRESENTE = 4;
  MIN_PRESENTES = 4;
type
  resumen = record
    presentes, dieces, ceros, suma : integer;
  end;
  alumno = record
    legajo : longint;
    condicion : char;
    notas : resumen;
  end;
  ranking = record
    max1, max2 : integer;
    leg1, leg2 : longint;
  end;

procedure leerAlumno(var a : alumno);
var i, nota : integer;
begin
  readln(a.legajo);
  if (a.legajo <> -1) then begin
    readln(a.condicion);
    a.notas.presentes := 0; a.notas.dieces := 0;
    a.notas.ceros := 0; a.notas.suma := 0;
    for i := 1 to 5 do begin
      read(nota);
      if (nota >= NOTA_PRESENTE) then a.notas.presentes := a.notas.presentes + 1;
      if (nota = 10) then a.notas.dieces := a.notas.dieces + 1;
      if (nota = 0) then a.notas.ceros := a.notas.ceros + 1;
      if (nota > 0) then a.notas.suma := a.notas.suma + nota;
    end;
    readln;
  end;
end;

procedure iniciarRanking(var r : ranking);
begin
  r.max1 := -1; r.max2 := -1; r.leg1 := 0; r.leg2 := 0;
end;

procedure actualizarRanking(valor : integer; legajo : longint; var r : ranking);
begin
  if (valor > r.max1) then begin
    r.max2 := r.max1; r.leg2 := r.leg1;
    r.max1 := valor; r.leg1 := legajo;
  end
  else if (valor > r.max2) then begin
    r.max2 := valor; r.leg2 := legajo;
  end;
end;

var
  a : alumno;
  dieces, ceros : ranking;
  ingr, ingrOk, recu, recuOk, todas, promAlto, conCero : integer;
begin
  ingr := 0; ingrOk := 0; recu := 0; recuOk := 0;
  todas := 0; promAlto := 0; conCero := 0;
  iniciarRanking(dieces);
  iniciarRanking(ceros);
  leerAlumno(a);
  while (a.legajo <> -1) do begin
    if (a.condicion = 'I') then begin
      ingr := ingr + 1;
      if (a.notas.presentes >= MIN_PRESENTES) then ingrOk := ingrOk + 1;
    end
    else begin
      recu := recu + 1;
      if (a.notas.presentes >= MIN_PRESENTES) then recuOk := recuOk + 1;
    end;
    if (a.notas.presentes = 5) then todas := todas + 1;
    if (a.notas.suma / 5 > 6.5) then promAlto := promAlto + 1;
    if (a.notas.ceros > 0) then conCero := conCero + 1;
    actualizarRanking(a.notas.dieces, a.legajo, dieces);
    actualizarRanking(a.notas.ceros, a.legajo, ceros);
    leerAlumno(a);
  end;
  write('Ingresantes en condiciones de rendir: ', ingrOk);
  if (ingr > 0) then writeln(' (', ingrOk / ingr * 100:0:2, '%)') else writeln;
  write('Recursantes en condiciones de rendir: ', recuOk);
  if (recu > 0) then writeln(' (', recuOk / recu * 100:0:2, '%)') else writeln;
  writeln('Aprobaron todas las autoevaluaciones: ', todas);
  writeln('Promedio mayor a 6.5: ', promAlto);
  writeln('Con al menos un cero: ', conCero);
  writeln('Más dieces: ', dieces.leg1, ' y ', dieces.leg2);
  writeln('Más ceros: ', ceros.leg1, ' y ', ceros.leg2);
end.`,
    entrada: "19003\nR\n8 10 6 -1 8\n21020\nI\n4 0 6 10 -1\n22100\nI\n10 10 9 8 10\n-1",
  },
  {
    grupo: GA, ref: "P3 Ad 12 · Act 3", titulo: "Tanques de agua, con registros",
    enunciado: "Volver a resolver la Actividad 3 (ventas de tanques de agua) usando registros.",
    pista: "Entidad tanque: tipo, medidas, alto y volumen ya calculado. El módulo de lectura carga el registro y calcula el volumen según el tipo.",
    sol: `program tanquesRegistros;
type
  tanque = record
    tipo : char;
    a, b, radio, alto, volumen : real;
  end;

procedure leerTanque(var t : tanque);
begin
  readln(t.tipo);
  if (t.tipo = 'R') then begin
    readln(t.a, t.b, t.alto);
    t.volumen := t.a * t.b * t.alto;
  end
  else if (t.tipo = 'C') then begin
    readln(t.radio, t.alto);
    t.volumen := pi * t.radio * t.radio * t.alto;
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
  t : tanque;
  max1, max2, sumaC, sumaR : real;
  cantC, cantR, bajos, chicos : integer;
begin
  max1 := -1; max2 := -1;
  sumaC := 0; sumaR := 0; cantC := 0; cantR := 0;
  bajos := 0; chicos := 0;
  leerTanque(t);
  while (t.tipo <> 'Z') do begin
    if (t.tipo = 'R') then begin
      sumaR := sumaR + t.volumen; cantR := cantR + 1;
    end
    else begin
      sumaC := sumaC + t.volumen; cantC := cantC + 1;
    end;
    actualizarMaximos(t.volumen, max1, max2);
    if (t.alto < 1.40) then bajos := bajos + 1;
    if (t.volumen < 800) then chicos := chicos + 1;
    leerTanque(t);
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

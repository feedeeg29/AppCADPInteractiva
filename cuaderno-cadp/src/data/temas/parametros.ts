import type { Tema } from "../types";
import { guiaP22 } from "../guia/p22";

const tema: Tema = {
  id: "parametros",
  num: "P2·2",
  titulo: "Parámetros",
  fuente: "Práctica 2 (parte 2)",
  resumen: "Pasaje por valor y por referencia, cómo devolver varios resultados y cómo hacer pruebas de escritorio con módulos.",
  sim: "parametros",
  teoria: [
    { h: "Por valor y por referencia" },
    {
      table: [
        ["", "Por valor", "Por referencia (var)"],
        ["Qué recibe el módulo", "Una copia del dato", "La variable original (un alias)"],
        ["Si el módulo la modifica", "El cambio se pierde al salir", "El cambio queda en la variable"],
        ["Qué se puede pasar", "Variable, constante o expresión", "Solo una variable"],
        ["Uso típico", "Datos de entrada", "Resultados que el módulo devuelve"]
      ]
    },
    {
      code: `procedure suma(num1 : integer; var num2 : integer);
begin
  num2 := num1 + num2;   { cambia la variable original }
  num1 := 0;             { cambia solo la copia }
end;`
    },
    { h: "Reglas de correspondencia" },
    {
      p: "Los parámetros reales (en la invocación) y los formales (en el encabezado) se emparejan por <b>posición</b>. Tienen que coincidir en cantidad, orden y tipo. Los nombres no importan."
    },
    {
      code: `procedure leerDatos(var legajo : integer; var salario : real);
...
leerDatos(leg, sal);       { bien }
leerDatos(sal, leg);       { mal: tipos invertidos }`
    },
    { h: "Devolver varios resultados" },
    {
      p: "Cuando un módulo tiene que devolver más de un valor, se usa un procedimiento con varios parámetros por referencia."
    },
    {
      code: `procedure analizar(num : integer; var cantDig, suma : integer);
begin
  cantDig := 0; suma := 0;
  repeat
    cantDig := cantDig + 1;
    suma := suma + num mod 10;
    num := num div 10;
  until (num = 0);
end;`
    },
    {
      tip: "num se pasa por valor: el módulo lo destruye dividiéndolo por 10, pero en el programa principal el número sigue intacto."
    },
    { h: "Cuándo usar cada uno" },
    {
      list: [
        "Un solo resultado simple → función.",
        "Varios resultados, o un registro, vector o lista que se modifica → procedimiento con <code>var</code>.",
        "Datos que el módulo solo consulta → por valor. (Las estructuras grandes a veces se pasan por referencia para no copiarlas, aunque no se modifiquen.)"
      ]
    }
  ],
  quiz: [
    {
      q: "Con <code>procedure suma(num1 : integer; var num2 : integer)</code>, leés x = 10 y hacés <code>for i := 1 to 5 do suma(i, x)</code>. ¿Qué imprime <code>write(x)</code>?",
      ops: ["10", "15", "25", "0"],
      ok: 2,
      exp: "x es la variable original: 10 + 1 + 2 + 3 + 4 + 5 = 25."
    },
    {
      q: "Mismo programa, pero ahora <code>num2</code> es por valor. ¿Qué imprime?",
      ops: ["10", "25", "15", "Error"],
      ok: 0,
      exp: "suma trabaja sobre una copia de x. El valor original nunca cambia."
    },
    {
      q: "¿Se puede invocar <code>sumar(a, b, 0)</code> si el tercer parámetro es <code>var c : integer</code>?",
      ops: ["Sí", "No: por referencia solo se pasan variables", "Solo si c es real", "Sí, pero c vale 0 siempre"],
      ok: 1,
      exp: "Un parámetro var necesita una variable donde dejar el resultado. Un literal no sirve."
    },
    {
      q: "¿Qué imprime <code>digParesImpares</code> con la secuencia 250, 35, 100?",
      ops: ["Pares: 4  Ímpares: 4", "Pares: 2  Ímpares: 3", "Pares: 3  Ímpares: 4", "Pares: 4  Ímpares: 3"],
      ok: 0,
      exp: "250 → pares 0 y 2, impar 5. 35 → dos impares. 100 → pares 0 y 0, impar 1. Total: 4 pares y 4 impares (par e impar se acumulan entre llamadas porque son var)."
    },
    {
      q: "¿Qué pasa si un procedimiento declara <code>var salario : real</code> y lo invocás con una variable integer?",
      ops: [
        "Convierte automáticamente",
        "Error: el tipo tiene que coincidir exactamente",
        "Funciona pero redondea",
        "Solo da error en ejecución"
      ],
      ok: 1,
      exp: "En el pasaje por referencia los tipos deben ser idénticos."
    },
    {
      q: "Un módulo debe recibir un número y devolver la cantidad de dígitos y su suma. ¿Qué encabezado es correcto?",
      ops: [
        "function digitos(n : integer) : integer;",
        "procedure digitos(n : integer; cant, suma : integer);",
        "procedure digitos(n : integer; var cant, suma : integer);",
        "procedure digitos(var n, cant, suma : integer);"
      ],
      ok: 2,
      exp: "Dos resultados: procedimiento con dos var. n va por valor porque el módulo lo modifica y no hay que romper el original."
    }
  ],
  ejercicios: guiaP22,
};

export default tema;

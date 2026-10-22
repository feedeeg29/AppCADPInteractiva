/** Bloques de teoría. Los textos admiten HTML simple (<code>, <b>, <i>). */
export type BloqueTeoria =
  | { h: string }
  | { p: string }
  | { code: string }
  | { tip: string }
  | { list: string[] }
  | { table: string[][] };

export interface Pregunta {
  q: string;
  code?: string;
  ops: string[];
  /** Índice de la opción correcta */
  ok: number;
  exp: string;
}

export interface Ejercicio {
  /** Identificador visible y estable, por ejemplo "P4·1 Ej 7". Se usa para guardar el progreso. */
  ref: string;
  titulo: string;
  enunciado: string;
  pista: string;
  sol: string;
  /** Parte de la práctica a la que pertenece (se muestra como encabezado) */
  grupo?: string;
  /** Datos de prueba para ingresar en el compilador, una línea por renglón */
  entrada?: string;
}

export type SimId = "traza" | "parametros" | "corte" | "vector" | "punteros" | "listas";

export interface Tema {
  id: string;
  num: string;
  titulo: string;
  fuente: string;
  resumen: string;
  sim: SimId | null;
  teoria: BloqueTeoria[];
  quiz: Pregunta[];
  ejercicios: Ejercicio[];
}

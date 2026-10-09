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
  ref: string;
  titulo: string;
  enunciado: string;
  pista: string;
  sol: string;
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

import type { Ejercicio } from "./types";
import { parciales1 } from "./guia/parciales1";
import { parciales2 } from "./guia/parciales2";

/** Parciales de fechas anteriores, resueltos. Del más nuevo al más viejo. */
export const PARCIALES: Ejercicio[] = [...parciales1, ...parciales2];

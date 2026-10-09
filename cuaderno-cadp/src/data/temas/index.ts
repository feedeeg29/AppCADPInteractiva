import control from "./control";
import modulos from "./modulos";
import parametros from "./parametros";
import registros from "./registros";
import vectores from "./vectores";
import punteros from "./punteros";
import listas from "./listas";
import repaso from "./repaso";
import type { Tema } from "../types";

export const TEMAS: Tema[] = [control, modulos, parametros, registros, vectores, punteros, listas, repaso];

export const temaPorId = (id: string) => TEMAS.find(t => t.id === id);

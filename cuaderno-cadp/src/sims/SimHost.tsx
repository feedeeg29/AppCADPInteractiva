import type { SimId } from "../data/types";
import { ListSim } from "./ListSim";
import { PointerSim } from "./PointerSim";
import { TraceSim } from "./TraceSim";
import { TRAZAS } from "./traces";
import { VectorSim } from "./VectorSim";

export function SimHost({ sim }: { sim: SimId }) {
  if (sim === "vector") return <VectorSim />;
  if (sim === "punteros") return <PointerSim />;
  if (sim === "listas") return <ListSim />;
  return <TraceSim key={sim} programas={TRAZAS[sim]} />;
}

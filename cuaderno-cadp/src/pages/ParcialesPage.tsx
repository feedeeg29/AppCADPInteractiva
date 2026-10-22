import { useEffect } from "react";
import { Ejercicios } from "../components/Ejercicios";
import { PARCIALES } from "../data/parciales";

const CONSEJOS = [
  "Antes de escribir código, decidí qué hay que almacenar y en qué estructura: vector si hay acceso por código (1..N), lista si la cantidad es desconocida.",
  "Fijate cómo tiene que quedar la estructura: \"en el orden en que se leyó\" es agregar atrás; \"ordenada por…\" es insertar ordenado.",
  "Si la estructura queda ordenada por un campo, lo que se pida \"para cada\" ese campo es un corte de control.",
  "Lo que \"se dispone\" no se lee: se usa. En las soluciones hay un módulo de carga marcado como \"se dispone\" solo para poder probarlas.",
  "Tratá de resolver todos los incisos en un solo recorrido.",
];

export function ParcialesPage() {
  useEffect(() => { document.title = "Parciales resueltos · Cuaderno CADP"; }, []);
  return (
    <>
      <section className="hero">
        <div className="eyebrow">Segundas fechas y redictados · 2018 a 2025</div>
        <h1>Parciales resueltos</h1>
        <p className="lead">Enunciados de parciales anteriores con pista y una solución completa que podés correr en el compilador. Tomalos como simulacro: poné un reloj y resolvé en papel antes de mirar.</p>
      </section>
      <details className="parc-tips">
        <summary>Cómo encarar un parcial</summary>
        <ul>{CONSEJOS.map((c) => <li key={c}>{c}</li>)}</ul>
      </details>
      <Ejercicios tema={{ id: "parciales", ejercicios: PARCIALES }} />
    </>
  );
}

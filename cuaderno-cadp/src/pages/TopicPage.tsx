import { useEffect, useState } from "react";
import { Ejercicios } from "../components/Ejercicios";
import { Quiz } from "../components/Quiz";
import { Teoria } from "../components/Teoria";
import { TEMAS } from "../data/temas";
import type { Tema } from "../data/types";
import { ejerciciosHechos, useProgress } from "../lib/progress";
import { Link } from "../lib/router";
import { SimHost } from "../sims/SimHost";

export type Seccion = "teoria" | "quiz" | "ejercicios" | "simulador";
export const SECCIONES: Seccion[] = ["teoria", "quiz", "ejercicios", "simulador"];
const NOMBRE: Record<Seccion, string> = { teoria: "Teoría", quiz: "Quiz", ejercicios: "Ejercicios", simulador: "Simulador" };

export function TopicPage({ tema, seccion }: { tema: Tema; seccion: Seccion }) {
  const { de, visitar, toggleTeoria, registrarQuiz } = useProgress();
  const p = de(tema.id);
  const hechos = ejerciciosHechos(tema, p);
  const [quizKey, setQuizKey] = useState(0);

  useEffect(() => { visitar(tema.id); }, [tema.id]);
  useEffect(() => { document.title = `${tema.titulo} · ${NOMBRE[seccion]} · Cuaderno CADP`; }, [tema, seccion]);

  // En pantallas angostas, dejar visible la pestaña activa
  useEffect(() => {
    const tabs = document.querySelector<HTMLElement>(".tabs");
    const cur = tabs?.querySelector<HTMLElement>('[aria-current="page"]');
    if (tabs && cur && tabs.scrollWidth > tabs.clientWidth) tabs.scrollLeft = cur.offsetLeft - 16;
  }, [seccion]);

  const secciones = SECCIONES.filter((s) => s !== "simulador" || tema.sim);
  const idx = TEMAS.indexOf(tema);
  const ant = TEMAS[idx - 1], sig = TEMAS[idx + 1];
  const badge: Partial<Record<Seccion, { txt: string; done: boolean }>> = {
    teoria: p.teoria ? { txt: "leída", done: true } : undefined,
    quiz: { txt: `${p.best}/${tema.quiz.length}`, done: p.best === tema.quiz.length },
    ejercicios: { txt: `${hechos}/${tema.ejercicios.length}`, done: hechos === tema.ejercicios.length },
  };
  const ruta = (s: Seccion) => (s === "teoria" ? `/${tema.id}` : `/${tema.id}/${s}`);

  return (
    <>
      <section className="hero">
        <div className="eyebrow">{tema.num} · {tema.fuente}</div>
        <h1>{tema.titulo}</h1>
        <p className="lead">{tema.resumen}</p>
      </section>

      <nav className="tabs" aria-label="Secciones del tema">
        {secciones.map((s) => (
          <Link key={s} to={ruta(s)} className="tab" aria-current={s === seccion ? "page" : undefined}>
            {NOMBRE[s]}
            {badge[s] && <span className={"badge" + (badge[s]!.done ? " done" : "")}>{badge[s]!.txt}</span>}
          </Link>
        ))}
      </nav>

      <div className={"pane pane-" + seccion}>
        {seccion === "teoria" && (
          <article className="prose">
            <Teoria bloques={tema.teoria} />
            <div className="row end-actions">
              <button className={"btn " + (p.teoria ? "ok" : "pri")} type="button" onClick={() => toggleTeoria(tema.id)}>
                {p.teoria ? "Teoría leída ✓" : "Marcar teoría como leída"}
              </button>
              <Link className="btn" to={ruta("quiz")}>Ir al quiz →</Link>
            </div>
          </article>
        )}
        {seccion === "quiz" && (
          <Quiz key={quizKey} preguntas={tema.quiz} onTerminar={(n) => registrarQuiz(tema.id, n)} onReiniciar={() => setQuizKey((k) => k + 1)} />
        )}
        {seccion === "ejercicios" && <Ejercicios tema={tema} />}
        {seccion === "simulador" && tema.sim && <SimHost sim={tema.sim} />}
      </div>

      <nav className="pager" aria-label="Otras prácticas">
        {ant ? <Link to={`/${ant.id}`} className="pg prev"><small>← Anterior</small><span>{ant.num} · {ant.titulo}</span></Link> : <span />}
        {sig ? <Link to={`/${sig.id}`} className="pg next"><small>Siguiente →</small><span>{sig.num} · {sig.titulo}</span></Link> : <span />}
      </nav>
    </>
  );
}

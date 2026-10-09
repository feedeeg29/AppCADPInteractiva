import { useEffect, useMemo, useState } from "react";
import { Quiz } from "../components/Quiz";
import { TEMAS } from "../data/temas";
import { useProgress } from "../lib/progress";

function sortear() {
  const todas = TEMAS.flatMap((t) => t.quiz.map((q) => ({ ...q, tema: t.num })));
  for (let i = todas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [todas[i], todas[j]] = [todas[j], todas[i]];
  }
  return todas.slice(0, 10);
}

export function MixedQuiz() {
  const { progreso, registrarMix } = useProgress();
  const [ronda, setRonda] = useState(0);
  const preguntas = useMemo(sortear, [ronda]);

  useEffect(() => { document.title = "Quiz mezclado · Cuaderno CADP"; }, []);

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Todas las prácticas · Mejor resultado: {progreso.mix}/10</div>
        <h1>Quiz mezclado</h1>
        <p className="lead">Diez preguntas al azar de todos los temas, para medir cómo llegás al parcial. Cada ronda trae preguntas distintas.</p>
      </section>
      <Quiz key={ronda} preguntas={preguntas} onTerminar={registrarMix} onReiniciar={() => setRonda((r) => r + 1)} />
      <div className="row end-actions">
        <button className="btn pri" type="button" onClick={() => { setRonda((r) => r + 1); window.scrollTo(0, 0); }}>Otras 10 preguntas</button>
      </div>
    </>
  );
}

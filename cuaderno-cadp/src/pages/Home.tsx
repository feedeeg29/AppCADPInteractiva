import { useEffect } from "react";
import { CodeBlock } from "../components/CodeBlock";
import { TEMAS, temaPorId } from "../data/temas";
import { ejerciciosHechos, porcentaje, useProgress } from "../lib/progress";
import { Link } from "../lib/router";

const MUESTRA = `program cuaderno;
var
  tema : integer;
begin
  for tema := 1 to 8 do begin
    leerTeoria(tema);
    hacerQuiz(tema);
    resolverEjercicios(tema);
  end;
  writeln('Listo para el parcial');
end.`;

const SIMS = [
  { to: "/parciales", t: "Parciales resueltos", d: "Segundas fechas y redictados de 2018 a 2025, con pista y solución para correr." },
  { to: "/compilador", t: "Compilador Pascal", d: "Escribí y ejecutá tus programas, con entrada por consola y errores en español." },
  { to: "/vectores/simulador", t: "Vectores", d: "Insertar, eliminar y buscar con corrimientos paso a paso." },
  { to: "/punteros/simulador", t: "Punteros", d: "new, dispose, nil y los errores clásicos de memoria." },
  { to: "/listas/simulador", t: "Listas", d: "Agregar adelante y atrás, insertar ordenado y eliminar." },
  { to: "/parametros/simulador", t: "Pruebas de escritorio", d: "Parámetros por valor y referencia, línea por línea." },
];

function Estado({ pct }: { pct: number }) {
  if (pct >= 100) return <span className="pill ok">Completo</span>;
  if (pct > 0) return <span className="pill mid">{pct}%</span>;
  return <span className="pill">Sin empezar</span>;
}

export function Home() {
  const { de, progreso } = useProgress();
  const ultimo = progreso.last ? temaPorId(progreso.last) : undefined;
  const totalPreg = TEMAS.reduce((a, t) => a + t.quiz.length, 0);
  const totalEj = TEMAS.reduce((a, t) => a + t.ejercicios.length, 0);
  const hechos = TEMAS.reduce((a, t) => a + ejerciciosHechos(t, de(t.id)), 0);

  useEffect(() => { document.title = "Cuaderno CADP"; }, []);

  return (
    <>
      <section className="home-hero">
        <div className="hh-text">
          <div className="eyebrow">Facultad de Informática · UNLP · 1er año</div>
          <h1>Toda CADP, práctica por práctica</h1>
          <p className="lead">Teoría resumida, preguntas para autoevaluarte, los ejercicios de las prácticas con pista y solución, y simuladores para ver qué pasa en memoria con vectores, punteros y listas.</p>
          <div className="row">
            {ultimo ? (
              <Link className="btn pri lg" to={`/${ultimo.id}`}>Seguir con {ultimo.titulo}</Link>
            ) : (
              <Link className="btn pri lg" to="/control">Empezar por la Práctica 1</Link>
            )}
            <Link className="btn lg" to="/compilador">Abrir el compilador</Link>
            <Link className="btn lg ghost" to="/parciales">Parciales resueltos</Link>
          </div>
          <dl className="kpis">
            <div><dt>Prácticas</dt><dd>{TEMAS.length}</dd></div>
            <div><dt>Preguntas</dt><dd>{totalPreg}</dd></div>
            <div><dt>Ejercicios resueltos</dt><dd>{hechos}<small>/{totalEj}</small></dd></div>
          </dl>
        </div>
        <div className="hh-code">
          <CodeBlock code={MUESTRA} title="CUADERNO.PAS" numbers copy={false} probar={false} active={7} />
        </div>
      </section>

      <h2 className="section-h">Prácticas</h2>
      <div className="grid">
        {TEMAS.map((t) => {
          const p = de(t.id), pct = porcentaje(t, p);
          return (
            <Link key={t.id} to={`/${t.id}`} className="card">
              <div className="ch"><span className="ref">{t.num}</span><Estado pct={pct} /></div>
              <h3>{t.titulo}</h3>
              <p>{t.resumen}</p>
              <div className="stats">
                <span>Teoría <b>{p.teoria ? "leída" : "pendiente"}</b></span>
                <span>Quiz <b>{p.best}/{t.quiz.length}</b></span>
                <span>Ejercicios <b>{ejerciciosHechos(t, p)}/{t.ejercicios.length}</b></span>
              </div>
              <div className="meter full" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
            </Link>
          );
        })}
      </div>

      <h2 className="section-h">Herramientas</h2>
      <div className="grid sims">
        {SIMS.map((s) => (
          <Link key={s.to} to={s.to} className="card sim-card">
            <h3>{s.t}</h3>
            <p>{s.d}</p>
            <span className="go">{s.to === "/compilador" ? "Abrir compilador →" : s.to === "/parciales" ? "Ver parciales →" : "Abrir simulador →"}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

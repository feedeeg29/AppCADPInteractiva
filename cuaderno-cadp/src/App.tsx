import { useEffect } from "react";
import { Layout } from "./components/Layout";
import { temaPorId } from "./data/temas";
import { Link, useSegments } from "./lib/router";
import { Home } from "./pages/Home";
import { CompilerPage } from "./pages/CompilerPage";
import { MixedQuiz } from "./pages/MixedQuiz";
import { SECCIONES, TopicPage, type Seccion } from "./pages/TopicPage";

function NotFound() {
  useEffect(() => { document.title = "Página no encontrada · Cuaderno CADP"; }, []);
  return (
    <section className="hero">
      <div className="eyebrow">Error 404</div>
      <h1>Esta página no existe</h1>
      <p className="lead">Puede que el link esté mal escrito. Volvé al inicio para elegir una práctica.</p>
      <div className="row"><Link className="btn pri" to="/">Ir al inicio</Link></div>
    </section>
  );
}

function Rutas() {
  const [a, b, ...resto] = useSegments();
  if (!a) return <Home />;
  if (a === "mezcla" && !b) return <MixedQuiz />;
  if (a === "compilador" && !b) return <CompilerPage />;
  const tema = temaPorId(a);
  if (!tema || resto.length) return <NotFound />;
  const seccion = (b ?? "teoria") as Seccion;
  if (!SECCIONES.includes(seccion) || (seccion === "simulador" && !tema.sim)) return <NotFound />;
  return <TopicPage key={tema.id} tema={tema} seccion={seccion} />;
}

export default function App() {
  return (
    <Layout>
      <Rutas />
    </Layout>
  );
}

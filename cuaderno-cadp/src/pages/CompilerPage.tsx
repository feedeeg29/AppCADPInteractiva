import { useEffect, useMemo, useRef, useState } from "react";
import { PascalEditor, type EditorHandle } from "../components/PascalEditor";
import { PARCIALES } from "../data/parciales";
import { TEMAS } from "../data/temas";
import { usePascalRunner } from "../pascal/usePascalRunner";

export const CODE_KEY = "cadp-compilador-codigo";

const HOLA = `program hola;
var
  nombre : string;
  edad : integer;
begin
  write('¿Cómo te llamás? ');
  readln(nombre);
  write('¿Cuántos años tenés? ');
  readln(edad);
  writeln('Hola, ', nombre, '. En 5 años vas a tener ', edad + 5, '.');
end.`;

const LISTA = `program listas;
type
  lista = ^nodo;
  nodo = record
    dato : integer;
    sig : lista;
  end;

procedure agregarAdelante(var L : lista; n : integer);
var nue : lista;
begin
  new(nue);
  nue^.dato := n;
  nue^.sig := L;
  L := nue;
end;

procedure imprimir(L : lista);
begin
  while (L <> nil) do begin
    write(L^.dato, ' ');
    L := L^.sig;
  end;
  writeln;
end;

var
  pri : lista;
  n : integer;
begin
  pri := nil;
  write('Ingresá números (0 para terminar): ');
  read(n);
  while (n <> 0) do begin
    agregarAdelante(pri, n);
    read(n);
  end;
  write('La lista quedó: ');
  imprimir(pri);
end.`;

interface Ejemplo { id: string; grupo: string; nombre: string; code: string }

function ejemplos(): Ejemplo[] {
  const base: Ejemplo[] = [
    { id: "hola", grupo: "Para empezar", nombre: "Hola (lectura y escritura)", code: HOLA },
    { id: "lista", grupo: "Para empezar", nombre: "Lista enlazada", code: LISTA },
  ];
  for (const t of TEMAS)
    t.ejercicios.forEach((e, i) => {
      if (/^\s*(\{[^}]*\}\s*)*program\b/i.test(e.sol)) base.push({ id: `${t.id}-${i}`, grupo: `${t.num} · ${t.titulo}`, nombre: `${e.ref} · ${e.titulo}`, code: e.sol });
    });
  PARCIALES.forEach((e, i) => {
    if (/^\s*(\{[^}]*\}\s*)*program\b/i.test(e.sol)) base.push({ id: `parcial-${i}`, grupo: e.grupo ?? "Parciales", nombre: `${e.ref} · ${e.titulo}`, code: e.sol });
  });
  return base;
}

function codigoInicial() {
  try {
    const v = localStorage.getItem(CODE_KEY);
    if (v && v.trim()) return v;
  } catch {
    /* ignorar */
  }
  return HOLA;
}

export function CompilerPage() {
  const [code, setCode] = useState(codigoInicial);
  const [linea, setLinea] = useState("");
  const { state, run, input, stop } = usePascalRunner();
  const editor = useRef<EditorHandle>(null);
  const consola = useRef<HTMLDivElement>(null);
  const entrada = useRef<HTMLInputElement>(null);
  const lista = useMemo(ejemplos, []);
  const grupos = useMemo(() => [...new Set(lista.map((e) => e.grupo))], [lista]);

  useEffect(() => { document.title = "Compilador Pascal · Cuaderno CADP"; }, []);
  useEffect(() => {
    try { localStorage.setItem(CODE_KEY, code); } catch { /* ignorar */ }
  }, [code]);
  useEffect(() => {
    const c = consola.current;
    if (c) c.scrollTop = c.scrollHeight;
    if (state.status === "input") entrada.current?.focus({ preventScroll: true });
  }, [state]);

  const ejecutar = () => { setLinea(""); run(code); };
  const corriendo = state.status === "running" || state.status === "input";
  const errLine = state.status === "compile" || state.status === "error" ? state.error?.line : undefined;

  const estado = (() => {
    switch (state.status) {
      case "idle": return "Listo para ejecutar.";
      case "running": return "Ejecutando…";
      case "input": return "Esperando que ingreses datos.";
      case "done": {
        const h = state.heap && state.heap.blocks > 0 ? ` · Quedaron ${state.heap.blocks} bloque${state.heap.blocks > 1 ? "s" : ""} de memoria dinámica sin liberar (${state.heap.bytes} bytes).` : "";
        return `Programa terminado en ${state.ms} ms.${h}`;
      }
      case "compile": return "Error de compilación.";
      case "error": return "Error durante la ejecución.";
      case "stopped": return "Ejecución detenida.";
    }
  })();

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Herramienta · Pascal en el navegador</div>
        <h1>Compilador</h1>
        <p className="lead">Escribí un programa, ejecutalo y respondé las lecturas en la consola, como en Free Pascal. Los errores aparecen en español y marcan la línea.</p>
      </section>

      <div className="cp-toolbar">
        {corriendo ? (
          <button className="btn danger" type="button" onClick={stop}>■ Detener</button>
        ) : (
          <button className="btn pri lg" type="button" onClick={ejecutar} title="Ctrl/Cmd + Enter">▶ Ejecutar</button>
        )}
        <label className="field cp-ej">
          <span className="sr">Cargar un ejemplo</span>
          <select id="cp-ejemplo" value="" onChange={(e) => {
            const ej = lista.find((x) => x.id === e.target.value);
            if (ej) { if (corriendo) stop(); setCode(ej.code); }
          }}>
            <option value="">Cargar un ejemplo…</option>
            {grupos.map((g) => (
              <optgroup key={g} label={g}>
                {lista.filter((x) => x.grupo === g).map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <button className="btn ghost" type="button" onClick={() => { if (corriendo) stop(); setCode("program nuevo;\nvar\n  \nbegin\n  \nend."); }}>Programa en blanco</button>
        <span className="kbd-hint cp-hint"><kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> ejecuta</span>
      </div>

      <div className="cp-grid">
        <PascalEditor ref={editor} value={code} onChange={setCode} onRun={ejecutar} errorLine={errLine} />

        <div className="console" aria-live="polite">
          <div className="console-bar">
            <span className={"dot " + state.status} aria-hidden="true" />
            <b>Consola</b>
            <span className="console-state">{estado}</span>
          </div>
          <div className="console-out" ref={consola} onClick={() => state.status === "input" && entrada.current?.focus()}>
            {state.status === "idle" && <p className="console-empty">La salida del programa va a aparecer acá. Tocá Ejecutar para empezar.</p>}
            {state.segments.map((s, i) => <span key={i} className={"seg-" + s.k}>{s.s}</span>)}
            {state.status === "input" && (
              <form className="console-in" onSubmit={(e) => { e.preventDefault(); input(linea); setLinea(""); }}>
                <input
                  ref={entrada}
                  id="cp-entrada"
                  value={linea}
                  onChange={(e) => setLinea(e.target.value)}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label="Dato para el programa. Enter para enviarlo."
                />
              </form>
            )}
            {state.error && (state.status === "compile" || state.status === "error") && (
              <div className="console-err" role="alert">
                <b>{state.status === "compile" ? "Error de compilación" : "Error de ejecución"}{state.error.line ? ` (línea ${state.error.line})` : ""}</b>
                <p>{state.error.msg}</p>
                {state.error.line > 0 && (
                  <button type="button" className="btn ghost" onClick={() => editor.current?.goTo(state.error!.line, state.error!.col)}>Ir a la línea {state.error.line}</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <details className="cp-notes">
        <summary>Cómo funciona y diferencias con Free Pascal</summary>
        <ul>
          <li>El código corre en tu navegador con un intérprete hecho para CADP: no se envía a ningún servidor.</li>
          <li>Soporta lo que se ve en la materia: tipos simples, <code>string[n]</code>, subrangos, enumerados, arreglos (también de varias dimensiones), registros, punteros con <code>new</code>/<code>dispose</code>, conjuntos, procedimientos y funciones con parámetros por valor y <code>var</code>, módulos anidados y recursión.</li>
          <li>No soporta archivos, <code>with</code>, <code>goto</code>, unidades ni registros variantes.</li>
          <li>Es más estricto que Free Pascal para ayudarte a encontrar errores: avisa si usás una variable sin inicializar, si un índice se sale del arreglo o si accedés a un puntero en nil o ya liberado.</li>
          <li><code>integer</code> ocupa 2 bytes (de −32768 a 32767), como en la tabla de la cátedra. Si un valor no entra, se guarda dando la vuelta, igual que en Free Pascal, y la consola te avisa.</li>
          <li><code>sizeof</code> usa la tabla de la Práctica 5 (por ejemplo real = 4 bytes).</li>
          <li>Los reales se escriben con el mismo redondeo que Free Pascal (por ejemplo <code>2.675:0:2</code> da 2.68). En casos límite el último decimal de una cuenta puede diferir, porque Free Pascal hace algunas operaciones intermedias con más precisión.</li>
          <li>Si un programa no termina, se corta solo a los 20 millones de pasos. También podés tocar Detener.</li>
        </ul>
      </details>
    </>
  );
}

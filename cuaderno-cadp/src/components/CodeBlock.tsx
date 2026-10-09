import { useEffect, useMemo, useRef, useState } from "react";
import { highlightLines } from "../lib/pascal";

interface Props {
  code: string;
  title?: string;
  numbers?: boolean;
  /** Línea resaltada (1-based). 0 = ninguna */
  active?: number;
  copy?: boolean;
}

export function CodeBlock({ code, title = "pascal", numbers = false, active = 0, copy = true }: Props) {
  const lines = useMemo(() => highlightLines(code), [code]);
  const preRef = useRef<HTMLPreElement>(null);
  const [copiado, setCopiado] = useState(false);

  // Mantener visible la línea activa dentro del bloque (sin mover la página)
  useEffect(() => {
    const pre = preRef.current;
    const cur = pre?.querySelector<HTMLElement>(".ln.cur");
    if (pre && cur) {
      const top = cur.offsetTop - pre.clientHeight / 2;
      pre.scrollTop = Math.max(0, top);
    }
  }, [active, code]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {
      const pre = preRef.current;
      if (!pre) return;
      const r = document.createRange();
      r.selectNodeContents(pre);
      const s = window.getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
    }
  };

  return (
    <div className="ide">
      <div className="ide-bar">
        <span className="ide-dots" aria-hidden="true" />
        <b>{title}</b>
        {copy && (
          <button type="button" onClick={onCopy}>
            {copiado ? "Copiado ✓" : "Copiar"}
          </button>
        )}
      </div>
      <pre ref={preRef} className={numbers ? "num" : undefined}>
        {lines.map((l, k) => (
          <span
            key={k}
            className={"ln" + (k + 1 === active ? " cur" : "")}
            data-n={numbers ? k + 1 : undefined}
            dangerouslySetInnerHTML={{ __html: l || " " }}
          />
        ))}
      </pre>
    </div>
  );
}

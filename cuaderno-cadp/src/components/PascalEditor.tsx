import { forwardRef, useImperativeHandle, useMemo, useRef, type KeyboardEvent } from "react";
import { highlightLines } from "../lib/pascal";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
  errorLine?: number;
}
export interface EditorHandle {
  goTo: (line: number, col?: number) => void;
}

/** Editor liviano: un textarea transparente sobre el código resaltado. */
export const PascalEditor = forwardRef<EditorHandle, Props>(function PascalEditor({ value, onChange, onRun, errorLine }, ref) {
  const ta = useRef<HTMLTextAreaElement>(null);
  const pre = useRef<HTMLPreElement>(null);
  const gutter = useRef<HTMLDivElement>(null);
  const escapado = useRef(false);
  const lines = useMemo(() => highlightLines(value), [value]);

  useImperativeHandle(ref, () => ({
    goTo(line, col = 1) {
      const t = ta.current;
      if (!t) return;
      const ls = value.split("\n");
      let pos = 0;
      for (let i = 0; i < Math.min(line - 1, ls.length); i++) pos += ls[i].length + 1;
      pos += Math.max(0, Math.min(col - 1, (ls[line - 1] ?? "").length));
      t.focus();
      t.setSelectionRange(pos, pos);
      const lh = parseFloat(getComputedStyle(t).lineHeight) || 22;
      t.scrollTop = Math.max(0, (line - 4) * lh);
      sync();
    },
  }));

  const sync = () => {
    const t = ta.current;
    if (!t) return;
    if (pre.current) { pre.current.scrollTop = t.scrollTop; pre.current.scrollLeft = t.scrollLeft; }
    if (gutter.current) gutter.current.scrollTop = t.scrollTop;
  };

  const replace = (start: number, end: number, text: string, caret: number) => {
    const t = ta.current!;
    // execCommand conserva el historial de deshacer cuando el navegador lo permite
    t.setSelectionRange(start, end);
    const ok = typeof document.execCommand === "function" && document.execCommand("insertText", false, text);
    if (!ok) onChange(value.slice(0, start) + text + value.slice(end));
    requestAnimationFrame(() => t.setSelectionRange(caret, caret));
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const t = e.currentTarget;
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); onRun?.(); return; }
    if (e.key === "Escape") { escapado.current = true; return; }
    if (e.key === "Tab" && !escapado.current && !e.shiftKey) {
      e.preventDefault();
      replace(t.selectionStart, t.selectionEnd, "  ", t.selectionStart + 2);
      return;
    }
    escapado.current = false;
    if (e.key === "Enter" && !e.shiftKey) {
      const s = t.selectionStart;
      const lineStart = value.lastIndexOf("\n", s - 1) + 1;
      const indent = /^[ \t]*/.exec(value.slice(lineStart, s))![0];
      const prevText = value.slice(lineStart, s).trim().toLowerCase();
      const extra = /(begin|then|else|do|repeat|record|of|var|type|const)$/.test(prevText) ? "  " : "";
      e.preventDefault();
      replace(s, t.selectionEnd, "\n" + indent + extra, s + 1 + indent.length + extra.length);
    }
  };

  return (
    <div className="editor">
      <div className="ed-gutter" ref={gutter} aria-hidden="true">
        {lines.map((_, i) => <div key={i} className={i + 1 === errorLine ? "err" : undefined}>{i + 1}</div>)}
      </div>
      <div className="ed-body">
        <pre ref={pre} aria-hidden="true">
          {lines.map((l, i) => (
            <div key={i} className={"ed-ln" + (i + 1 === errorLine ? " err" : "")} dangerouslySetInnerHTML={{ __html: l || " " }} />
          ))}
        </pre>
        <textarea
          ref={ta}
          id="pascal-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={sync}
          onKeyDown={onKey}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
          aria-label="Código Pascal. Tab inserta espacios; Escape y después Tab para salir del editor; Ctrl o Cmd + Enter ejecuta."
        />
      </div>
    </div>
  );
});

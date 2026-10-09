const KW = new Set(
  (
    "program procedure function begin end var const type record array of if then else while do repeat until for to downto case " +
    "and or not div mod nil new dispose integer real char boolean string longint true false read readln write writeln sizeof"
  ).split(" ")
);

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Resalta código Pascal y devuelve una línea de HTML (ya escapado) por cada línea del código. */
export function highlightLines(code: string): string[] {
  const re = /(\{[^}]*\}|\(\*[\s\S]*?\*\))|('(?:[^']|'')*')|(\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([\s\S])/gi;
  let html = "";
  let m: RegExpExecArray | null;
  const wrap = (cls: string, txt: string) =>
    txt
      .split("\n")
      .map((p) => (p ? `<span class="tk-${cls}">${esc(p)}</span>` : ""))
      .join("\n");
  while ((m = re.exec(code))) {
    if (m[1]) html += wrap("c", m[1]);
    else if (m[2]) html += wrap("s", m[2]);
    else if (m[3]) html += wrap("n", m[3]);
    else if (m[4]) html += KW.has(m[4].toLowerCase()) ? wrap("k", m[4]) : esc(m[4]);
    else html += esc(m[5]);
  }
  return html.split("\n");
}

import type { BloqueTeoria } from "../data/types";
import { CodeBlock } from "./CodeBlock";

/** Los textos de teoría son contenido propio del sitio (no de usuarios) y traen HTML simple. */
const H = ({ html }: { html: string }) => <span dangerouslySetInnerHTML={{ __html: html }} />;

export function Teoria({ bloques }: { bloques: BloqueTeoria[] }) {
  return (
    <>
      {bloques.map((b, k) => {
        if ("h" in b) return <h2 key={k} id={`s${k}`}>{b.h}</h2>;
        if ("p" in b) return <p key={k}><H html={b.p} /></p>;
        if ("code" in b) return <CodeBlock key={k} code={b.code} />;
        if ("tip" in b) return <div key={k} className="tip"><H html={b.tip} /></div>;
        if ("list" in b) return <ul key={k}>{b.list.map((x, i) => <li key={i}><H html={x} /></li>)}</ul>;
        return (
          <div key={k} className="tbl">
            <table>
              <thead><tr>{b.table[0].map((c, i) => <th key={i}><H html={c} /></th>)}</tr></thead>
              <tbody>{b.table.slice(1).map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><H html={c} /></td>)}</tr>)}</tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

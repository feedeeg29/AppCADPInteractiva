import { createContext, useCallback, useContext, useEffect, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";

/**
 * Router mínimo basado en la History API. La app tiene pocas rutas y así
 * evitamos una dependencia externa. Vercel reescribe todas las rutas a
 * index.html (ver vercel.json) y en GitHub Pages se usa una copia como 404.html,
 * por lo que los links se pueden compartir.
 *
 * BASE es la subcarpeta donde vive el sitio: "" en Vercel o en local, y
 * "/AppCADPInteractiva" en GitHub Pages (se configura con BASE_PATH al compilar).
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const actual = () => {
  const p = window.location.pathname;
  const sinBase = p.startsWith(BASE) ? p.slice(BASE.length) : p;
  return sinBase || "/";
};
export const href = (to: string) => BASE + to;
interface RouterValue {
  path: string;
  navigate: (to: string) => void;
}
const RouterCtx = createContext<RouterValue>({ path: "/", navigate: () => {} });

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(actual);

  useEffect(() => {
    const onPop = () => setPath(actual());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to === actual()) return;
    window.history.pushState(null, "", href(to));
    setPath(to);
    window.scrollTo(0, 0);
  }, []);

  return <RouterCtx.Provider value={{ path, navigate }}>{children}</RouterCtx.Provider>;
}

export const useRouter = () => useContext(RouterCtx);

/** Divide la ruta en segmentos: "/vectores/quiz" -> ["vectores", "quiz"] */
export const useSegments = () => {
  const { path } = useRouter();
  return path.split("/").filter(Boolean).map(decodeURIComponent);
};

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={href(to)} onClick={handle} {...rest} />;
}

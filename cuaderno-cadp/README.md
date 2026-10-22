# Cuaderno CADP

Página de estudio para **Conceptos de Algoritmos, Datos y Programas** (Facultad de Informática, UNLP). Tiene:

- Teoría resumida de las 8 prácticas.
- 55 preguntas de autoevaluación con explicación, más un quiz mezclado.
- La guía completa: los 137 ejercicios de las prácticas 1 a 7 (incluidos los adicionales), con pista y solución en Pascal. Cada solución es un programa completo, probado con Free Pascal, que se puede correr en el compilador.
- 13 parciales resueltos (segundas fechas y redictados de 2018 a 2025) en `/parciales`, con la misma lógica de pista, solución y "Probar".
- Simuladores paso a paso de vectores, punteros, listas y pruebas de escritorio.
- Un compilador de Pascal en el navegador (`/compilador`), con entrada interactiva por consola y errores en español.

El progreso de cada persona se guarda en su propio navegador (`localStorage`). No hace falta crear cuentas ni tener un servidor.

Hecho con React 18, TypeScript y Vite. No usa librerías de UI ni de ruteo.

## Correrlo en tu computadora

Necesitás [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
npm run dev
```

Abrí la dirección que aparece en la terminal (por defecto http://localhost:5173).

Otros comandos:

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Revisa los tipos y genera la versión final en `dist/` |
| `npm run preview` | Sirve `dist/` para probar la versión final |
| `npm run typecheck` | Solo revisa los tipos de TypeScript |

## Publicarlo en Vercel

1. Subí esta carpeta a un repositorio de GitHub:
   ```bash
   git init
   git add .
   git commit -m "Cuaderno CADP"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/cuaderno-cadp.git
   git push -u origin main
   ```
2. Entrá a [vercel.com](https://vercel.com), iniciá sesión con GitHub y elegí **Add New → Project**.
3. Importá el repositorio `cuaderno-cadp`. Vercel detecta Vite solo: dejá los valores por defecto (Build Command `npm run build`, Output Directory `dist`).
4. Tocá **Deploy**. En menos de un minuto vas a tener un link del estilo `cuaderno-cadp.vercel.app` para compartir.

Cada vez que hagas `git push` a `main`, Vercel publica la nueva versión automáticamente.

El archivo `vercel.json` hace que los links directos (por ejemplo `/listas/simulador`) funcionen al compartirlos o recargar la página.

## Publicarlo en GitHub Pages

El repositorio ya incluye el workflow `.github/workflows/deploy.yml` (en la raíz del repo, una carpeta arriba de este proyecto). Compila el proyecto y lo publica en GitHub Pages en cada `git push` a `main`.

1. En GitHub, entrá al repositorio → **Settings** → **Pages**.
2. En **Build and deployment → Source**, elegí **GitHub Actions**.
3. Hacé `git push`. En la pestaña **Actions** vas a ver el workflow "Publicar en GitHub Pages" corriendo. Tarda un par de minutos.
4. Cuando termina, el sitio queda en `https://USUARIO.github.io/NOMBRE-DEL-REPO/`.

Detalles técnicos:

- GitHub Pages sirve el sitio en una subcarpeta. El workflow define `BASE_PATH=/NOMBRE-DEL-REPO/` al compilar y Vite y el router la usan para armar los links. En local y en Vercel no hace falta: queda en `/`.
- GitHub Pages no sabe de rutas como `/listas/simulador`. Por eso el workflow copia `index.html` como `404.html`: cuando alguien abre un link directo, GitHub devuelve esa página y la app muestra la sección correcta.

## Estructura

```
src/
  data/
    types.ts           Tipos del contenido (Tema, Pregunta, Ejercicio…)
    temas/*.ts         Un archivo por tema: teoría y quiz (los ejercicios vienen de guia/)
    guia/*.ts          Los ejercicios de cada práctica, en orden, con pista, solución y datos de prueba
                       (parciales1.ts y parciales2.ts tienen los parciales; se juntan en data/parciales.ts)
  components/          Layout, bloque de código, quiz, ejercicios, reproductor
  sims/                Simuladores: lógica pura (*Ops.ts, *Model.ts, traces.ts) y vistas (*.tsx)
  pages/               Inicio, página de tema y quiz mezclado
  pascal/              Intérprete de Pascal: lexer, parser con chequeo de tipos, intérprete y Web Worker
  lib/                 Router mínimo, progreso, tema claro/oscuro, resaltado de Pascal
  styles/global.css    Estilos y colores (claro y oscuro)
```

## Agregar o corregir contenido

La teoría y el quiz están en `src/data/temas/`; los ejercicios, en `src/data/guia/` (un archivo por práctica). Por ejemplo, para corregir un ejercicio de Listas, editá `src/data/guia/p6b.ts`. Cada ejercicio es un objeto así:

```ts
{
  grupo: "Práctica 6 · Listas",   // título de sección en la pestaña
  ref: "P6 Ej 11",                // identificador único: el progreso se guarda con esta clave
  titulo: "Premio Joaquín V. González",
  enunciado: "…",
  pista: "…",
  sol: `program premio;
begin
  ...
end.`,
  entrada: "1001\nPerez\n8.5\n0",   // opcional: datos para probar el programa
}
```

TypeScript te avisa si falta algún campo. Los textos de teoría y de las preguntas aceptan HTML simple (`<code>`, `<b>`, `<i>`).

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Inicio |
| `/mezcla` | Quiz mezclado |
| `/compilador` | Compilador Pascal |
| `/:tema` | Teoría del tema (por ejemplo `/vectores`) |
| `/:tema/quiz` | Quiz del tema |
| `/:tema/ejercicios` | Ejercicios del tema |
| `/parciales` | Parciales resueltos |
| `/:tema/simulador` | Simulador (en los temas que lo tienen) |

Temas: `control`, `modulos`, `parametros`, `registros`, `vectores`, `punteros`, `listas`, `repaso`.

## El compilador

No es Free Pascal: es un intérprete escrito en TypeScript (`src/pascal/`) que cubre lo que se usa en CADP y corre en un Web Worker, así la página no se congela.

- `lexer.ts` separa el código en tokens.
- `parser.ts` lo analiza en una sola pasada y chequea tipos, como los compiladores Pascal clásicos. Acá están los mensajes de error de compilación.
- `interp.ts` ejecuta el árbol. Cuando un `read` necesita un dato que todavía no se ingresó, corta la ejecución; la página pide el dato y vuelve a correr el programa desde el principio con todas las líneas ingresadas. Como los programas son deterministas, el resultado es el mismo que si hubiera esperado.
- `usePascalRunner.ts` maneja el worker desde React (ejecutar, ingresar datos, detener).

Para comparar con Free Pascal real: las soluciones completas del cuaderno dan exactamente la misma salida en los dos.

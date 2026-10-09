# Cuaderno CADP

Página de estudio para **Conceptos de Algoritmos, Datos y Programas** (Facultad de Informática, UNLP). Tiene:

- Teoría resumida de las 8 prácticas.
- 55 preguntas de autoevaluación con explicación, más un quiz mezclado.
- Ejercicios de las prácticas con pista y solución en Pascal.
- Simuladores paso a paso de vectores, punteros, listas y pruebas de escritorio.

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

## Estructura

```
src/
  data/
    types.ts           Tipos del contenido (Tema, Pregunta, Ejercicio…)
    temas/*.ts         Un archivo por práctica: teoría, quiz y ejercicios
  components/          Layout, bloque de código, quiz, ejercicios, reproductor
  sims/                Simuladores: lógica pura (*Ops.ts, *Model.ts, traces.ts) y vistas (*.tsx)
  pages/               Inicio, página de tema y quiz mezclado
  lib/                 Router mínimo, progreso, tema claro/oscuro, resaltado de Pascal
  styles/global.css    Estilos y colores (claro y oscuro)
```

## Agregar o corregir contenido

Todo el contenido está en `src/data/temas/`. Por ejemplo, para sumar un ejercicio a Listas, editá `src/data/temas/listas.ts` y agregá un objeto al arreglo `ejercicios`:

```ts
{
  ref: "P6 Ej 11",
  titulo: "Premio Joaquín V. González",
  enunciado: "…",
  pista: "…",
  sol: `program premio;
begin
  ...
end.`
}
```

TypeScript te avisa si falta algún campo. Los textos de teoría y de las preguntas aceptan HTML simple (`<code>`, `<b>`, `<i>`).

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Inicio |
| `/mezcla` | Quiz mezclado |
| `/:tema` | Teoría del tema (por ejemplo `/vectores`) |
| `/:tema/quiz` | Quiz del tema |
| `/:tema/ejercicios` | Ejercicios del tema |
| `/:tema/simulador` | Simulador (en los temas que lo tienen) |

Temas: `control`, `modulos`, `parametros`, `registros`, `vectores`, `punteros`, `listas`, `repaso`.

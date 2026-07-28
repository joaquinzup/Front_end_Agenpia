# React App — Arquitectura Base

Proyecto base para el curso Full Stack MERN. Está pensado para que los estudiantes hagan `git clone`, instalen dependencias y comiencen a trabajar sobre una arquitectura moderna y ordenada.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| [React 19](https://react.dev/) | Librería de UI |
| [Vite](https://vitejs.dev/) | Bundler y servidor de desarrollo |
| [TanStack Router](https://tanstack.com/router) | Routing con tipado completo |
| [CSS Modules](https://github.com/css-modules/css-modules) | Estilos con alcance local por componente |
| TypeScript | Tipado estático |

---

## Cómo correr el proyecto

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd reactjs

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción localmente |

---

## Arquitectura de carpetas

```
reactjs/
├── index.html              # Punto de entrada HTML (Vite lo usa como base)
├── vite.config.ts          # Configuración de Vite
├── tsconfig.json           # Configuración de TypeScript para el código fuente
├── tsconfig.node.json      # Configuración de TypeScript para herramientas (Vite)
└── src/
    ├── main.tsx            # Punto de entrada: monta <App /> en el DOM
    ├── App.tsx             # Componente raíz: contiene el RouterProvider
    ├── router.tsx          # Definición de todas las rutas de la aplicación
    │
    ├── api/                # Funciones para llamar a la API (fetch)
    ├── assets/             # Archivos estáticos (imágenes, íconos, fuentes)
    ├── config/             # Configuración global (variables de entorno, constantes)
    ├── store/              # Estado global (Zustand, Jotai o Context API)
    ├── types/              # Tipos TypeScript globales y compartidos
    │
    ├── styles/
    │   ├── variables.css   # Variables CSS globales (colores, espaciado, tipografía)
    │   └── global.css      # Reset CSS y estilos base del proyecto
    │
    ├── components/
    │   ├── ui/             # Componentes de UI reutilizables (Button, Input, Modal...)
    │   │   └── Button/
    │   │       ├── Button.tsx
    │   │       └── Button.module.css
    │   └── blocks/         # Composiciones de componentes (Navbar, Footer, Card...)
    │
    └── pages/              # Una carpeta por página, con su propio CSS Module
        ├── Home/
        │   ├── Home.tsx
        │   └── Home.module.css
        ├── Login/
        │   ├── Login.tsx
        │   └── Login.module.css
        └── Register/
            ├── Register.tsx
            └── Register.module.css
```

### Convención de carpetas

Cada página y componente vive en su propia carpeta con el mismo nombre. Dentro de esa carpeta van el archivo `.tsx` y su archivo de estilos `.module.css`. Esto mantiene el código y los estilos siempre juntos y fáciles de encontrar.

**Ejemplo:**
```
components/ui/Button/
├── Button.tsx          ← lógica y estructura del componente
└── Button.module.css   ← estilos con alcance local (solo afectan a este componente)
```

### CSS Modules

Los CSS Modules garantizan que los estilos de un componente **no afecten** a otros. Vite los procesa automáticamente al importar el archivo `.module.css`.

```tsx
import styles from './Button.module.css'

function Button() {
  return <button className={styles.button}>Click</button>
}
```

### Rutas disponibles

| Ruta | Página |
|---|---|
| `/` | Home |
| `/login` | Login |
| `/register` | Register |

Las rutas están definidas en `src/router.tsx` usando **TanStack Router** con routing basado en código (sin generación automática de archivos).

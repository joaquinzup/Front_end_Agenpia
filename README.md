# React App — Gestión de Usuarios

Frontend del CRUD de usuarios: login, listado con permisos por rol, alta y edición de usuarios. Consume la API de `Curso_FullStack` (backend Express + MongoDB).

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
cd reactjs-main

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

> La URL de la API está fijada en `src/config/globals.ts` (`API_URL`). Si el backend corre en otro puerto, hay que actualizarla ahí (actualmente apunta a `http://localhost:7575`; el backend por defecto en su README corre en `7000` — revisar que coincidan antes de levantar ambos).

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción localmente |

---

## Arquitectura de carpetas

```
reactjs-main/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                # Punto de entrada: monta <App /> en el DOM
    ├── App.tsx                 # Componente raíz: contiene el RouterProvider
    ├── router.tsx              # Definición de rutas: /, /login, /create-user
    │
    ├── api/                    # Funciones fetch hacia el backend
    │   ├── Types.ts              # Interfaz User
    │   ├── login.ts               # POST /auth/login
    │   ├── getUsers.ts             # GET /users
    │   ├── createUser.ts            # POST /users
    │   ├── updateUsers.ts             # PUT /users/:id
    │   └── deleteUser.ts               # DELETE /users/:id
    │
    ├── config/
    │   └── globals.ts          # API_URL
    │
    ├── store/                  # (reservado para estado global futuro)
    │
    ├── styles/
    │   ├── variables.css        # Variables CSS globales
    │   └── global.css            # Reset y estilos base
    │
    ├── components/
    │   ├── ui/
    │   │   └── Button/            # Botón reutilizable (variant primary/secondary)
    │   └── blocks/
    │       ├── Modal/               # Modal genérico (overlay + cierre con Escape)
    │       ├── Navigation/            # Nav simple con links (no está montado en el router)
    │       ├── LoginRightSide/         # Panel derecho decorativo del login (video + logo)
    │       └── RegisterRightSide/       # Panel derecho decorativo, reservado para un registro futuro
    │
    ├── assets/
    │   ├── Img/                # Imágenes (logo, etc.)
    │   └── Videos/               # Videos de fondo (login, alta de usuario)
    │
    └── pages/
        ├── Home/                # Listado de usuarios (tabla principal de la app)
        ├── Login/               # Formulario de login
        └── CreateUser/          # Formulario de alta de usuario
```

### Rutas disponibles

| Ruta | Página | Protegida |
|---|---|---|
| `/` | Home (listado de usuarios) | Sí — redirige a `/login` si no hay token |
| `/login` | Login | No |
| `/create-user` | Crear usuario | Sí — redirige a `/login` si no hay token |

La sesión se guarda en `localStorage` (`token` y `role`), no hay store global todavía: cada página lee `localStorage` directamente.

---

## Funcionalidades del listado de usuarios (Home)

Esta es la pantalla principal y la que concentra la mayoría de los cambios recientes:

### Permisos según rol (`localStorage.getItem('role')`)

| Acción | ROOT | ADMIN | USER | GUEST |
|---|---|---|---|---|
| Botón "+ Agregar" (ir a crear usuario) | ✅ | ✅ | ❌ | ❌ |
| Botón "Editar" por usuario | ✅ | ✅ | ❌ | ❌ |
| Cambiar el `rol` al editar (select de roles) | ✅ | ❌ (oculto) | — | — |
| Botón "Eliminar" (ícono de tacho) | ✅ | ✅ | ❌ | ❌ |
| Botón "Ver" (detalle solo lectura) | ✅ | ✅ | ✅ | ✅ |
| Usuarios que ve la tabla | Todos | Todos menos ROOT | Solo `USER` y `GUEST` | Solo a sí mismo |

> Estas reglas de visibilidad las devuelve directamente el backend (`getUsersService`); el frontend solo oculta/muestra botones según el rol guardado en `localStorage`, pero quien controla qué usuarios llegan en la respuesta es la API.

### Avatares

`getAvatarUrl(user)` genera la imagen de cada usuario:

- Si `genero` es reconocible como masculino o femenino, usa una foto real de [randomuser.me](https://randomuser.me/), eligiendo el índice de la foto (0–99) con un hash estable calculado a partir del `_id` de Mongo (`hashANumero`), así el mismo usuario siempre muestra la misma foto.
- Si el género no está especificado o no coincide con ningún patrón conocido, cae a un avatar de iniciales generado por [ui-avatars.com](https://ui-avatars.com/).
- Al hacer click sobre el avatar, se abre una vista previa ampliada en un overlay (`avatarPreview`), que se cierra clickeando fuera de la imagen.

### Ícono de género

`IconoG` reemplaza la columna de texto libre "género" por un ícono ♂ / ♀ cuando el valor coincide con "masculino"/"femenino" (y variantes cortas como "m"/"hombre", "f"/"mujer"). Cualquier otro valor se muestra como **"Sin especificar"** en vez del texto crudo cargado en la base.

### Badges de rol

Cada rol tiene su propio color de badge (definido en `Home.module.css`): `ROOT` en rojo, `ADMIN` en violeta, `USER` en amarillo, `GUEST` en gris (y queda reservada una clase `editor` para un futuro rol).

### Localidad → Google Maps

La celda de "Localidad" es un link que abre Google Maps con la búsqueda de `localidad, provincia, país` del usuario, en una pestaña nueva.

### Búsqueda y orden

- Barra de búsqueda que filtra por nombre + apellido en tiempo real.
- Las columnas "Usuario" y "Email" son clickeables: alternan orden ascendente/descendente (con flecha indicadora `↓`/`↑`) mediante `handleSort`.
- Todas las columnas de la tabla (excepto la de usuario) están centradas.

### Feedback visual

- Modal de éxito genérico que aparece tras actualizar un usuario ("Usuario actualizado correctamente") o eliminarlo ("Usuario eliminado correctamente").
- Confirmación nativa (`window.confirm`) antes de eliminar un usuario.
- Estados de carga / error / lista vacía manejados explícitamente antes de mostrar la tabla.

---

## Alta de usuario (CreateUser)

- Accesible solo si hay `token` en `localStorage` (si no, redirige a `/login`).
- El formulario pide únicamente: `nombre`, `apellido`, `email`, `password`, `genero` (select), `telefono`, `localidad`.
- El resto de los campos que el backend exige (`fechaNacimiento`, `edad`, `direccion`, `provincia`, `pais`, `codigoPostal`) se envían con valores por defecto fijos desde `api/createUser.ts`, para mantener el formulario simple. El usuario creado siempre queda con `role: "USER"`.
- Fondo con video decorativo (`videoreg.mp4`), estilo más simple/serio que antes (ya no tiene el diseño tipo publicidad de las primeras versiones).

## Edición de usuario (modal desde Home)

- El modal de edición (`UserEditForm`) reutiliza casi todos los campos del alta, más `fechaNacimiento`, `direccion`, `provincia`, `pais`, `codigoPostal`.
- El campo `email` **no se muestra** ni se envía, porque el backend rechaza su modificación.
- El `<select>` de `role` solo se muestra si `currentRol === "ROOT"` (recibido como prop desde `Home`), así que un `ADMIN` no puede reasignar roles.

## Login

- Formulario simple de email + contraseña contra `POST /auth/login`.
- Al loguearse, guarda `token` y `role` en `localStorage` y navega a `/`.
- Panel derecho decorativo (`LoginRightSide`) con video de fondo y logo.

---

## Capa de API (`src/api/`)

Todas las funciones siguen el mismo patrón: hacen `fetch` contra `API_URL`, parsean el JSON de respuesta, y si `body.success` es `false` lanzan un `Error(body.message)` (el mensaje que definió el backend). Las rutas protegidas agregan el header `Authorization: Bearer <token>` leyendo el token de `localStorage`.

| Archivo | Endpoint | Notas |
|---|---|---|
| `login.ts` | `POST /auth/login` | Devuelve `{ token, role }` |
| `getUsers.ts` | `GET /users` | Requiere token |
| `createUser.ts` | `POST /users` | Requiere token; completa campos faltantes con defaults |
| `updateUsers.ts` | `PUT /users/:id` | Requiere token; el backend devuelve `id` y acá se remapea a `_id` para que coincida con el tipo `User` |
| `deleteUser.ts` | `DELETE /users/:id` | Requiere token |

---

## Notas y elementos pendientes/detectados en el código

- `components/blocks/Navigation` existe pero no está importado en ningún lado del router: no se ve en la app actualmente.
- `components/blocks/RegisterRightSide` está preparado para una futura página de registro público, pero no hay ninguna ruta `/register` definida en `router.tsx`.
- `config/globals.ts` tiene hardcodeado `http://localhost:7575` como `API_URL`; conviene revisar que coincida con el `PORT` real del backend antes de levantar el proyecto (o migrarlo a una variable de entorno de Vite).
- Los videos de fondo (`src/assets/Videos/...`) se referencian con rutas relativas tipo `src="src/assets/Videos/HR.mp4"` en vez de usar `import`; funciona en desarrollo con Vite sirviendo el `src/` directamente, pero puede no resolver igual en un build de producción — vale la pena revisarlo antes de deployar.

## Autor: Zupel Joaquin

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
├── package.json
└── src/
    ├── main.tsx                 # Punto de entrada: monta <App /> en el DOM
    ├── App.tsx                  # Componente raíz: contiene el RouterProvider
    ├── router.tsx                # Definición de rutas: /, /login, /create-user
    │
    ├── types/
    │   └── vite-env.d.ts          # Tipos de entorno de Vite
    │
    ├── api/
    │   ├── Types.ts                # Interfaz User
    │   ├── login.ts                 # POST /auth/login (ruta pública)
    │   ├── authFetch.ts              # fetch autenticado compartido por las rutas protegidas
    │   ├── getUsers.ts                # GET /users
    │   ├── createUser.ts               # POST /users
    │   ├── updateUsers.ts               # PUT /users/:id
    │   └── deleteUser.ts                 # DELETE /users/:id
    │
    ├── config/
    │   └── globals.ts               # API_URL
    │
    ├── store/                       # (reservado para estado global futuro, vacío)
    │
    ├── styles/
    │   ├── variables.css              # Variables CSS globales
    │   └── global.css                  # Reset y estilos base
    │
    ├── components/
    │   ├── ui/
    │   │   └── Button/
    │   │       ├── Button.tsx              # Botón reutilizable (variant primary/secondary)
    │   │       └── Button.module.css
    │   └── blocks/
    │       ├── Modal/
    │       │   ├── Modal.tsx                 # Modal genérico (overlay + cierre con Escape, soporta tamaño md/lg)
    │       │   └── Modal.module.css
    │       ├── Navigation/
    │       │   ├── Navigation.tsx             # Nav simple con links (no está montado en el router)
    │       │   └── Navigation.module.css
    │       ├── LoginRightSide/
    │       │   ├── LoginRightSide.tsx          # Panel derecho decorativo del login (video + logo)
    │       │   └── LoginRightSide.module.css
    │       └── RegisterRightSide/
    │           ├── RegisterRightSide.tsx        # Panel decorativo, reservado para un registro futuro
    │           └── RegisterRightSide.module.css
    │
    ├── assets/
    │   ├── Img/
    │   │   └── logo hr-Photoroom.png
    │   └── Videos/
    │       ├── HR.mp4                 # Fondo del login
    │       └── videoreg.mp4            # Fondo del alta de usuario
    │
    └── pages/
        ├── Home/
        │   ├── Home.tsx                       # Orquestador: estado, carga de datos, handlers
        │   ├── Home.module.css
        │   ├── utils/
        │   │   └── avatar.ts                    # getAvatarUrl / hashANumero
        │   └── components/
        │       ├── HomeHeader/
        │       │   ├── HomeHeader.tsx             # Título, buscador, "+ Agregar" y "Cerrar sesión"
        │       │   └── HomeHeader.module.css
        │       ├── UsersTable/
        │       │   ├── UsersTable.tsx              # Tabla + encabezados con orden por columna
        │       │   └── UsersTable.module.css
        │       ├── UserTableRow/
        │       │   ├── UserTableRow.tsx             # Fila: avatar, género, localidad, badge de rol, acciones
        │       │   └── UserTableRow.module.css
        │       ├── GenderIcon/
        │       │   ├── GenderIcon.tsx               # Ícono ♂ / ♀ / "Sin especificar"
        │       │   └── GenderIcon.module.css
        │       ├── AvatarPreview/
        │       │   ├── AvatarPreview.tsx            # Overlay con la foto ampliada
        │       │   └── AvatarPreview.module.css
        │       ├── LocationView/
        │       │   ├── LocationView.tsx             # Mapa embebido + link "Abrir en Google Maps"
        │       │   └── LocationView.module.css
        │       ├── UserDetails/
        │       │   ├── UserDetails.tsx               # Vista solo lectura ("Ver")
        │       │   └── UserDetails.module.css
        │       ├── UserEditForm/
        │       │   ├── UserEditForm.tsx              # Formulario de edición
        │       │   └── UserEditForm.module.css
        │       └── SuccessMessage/
        │           ├── SuccessMessage.tsx            # Confirmación tras editar/eliminar
        │           └── SuccessMessage.module.css
        │
        ├── Login/
        │   ├── Login.tsx                # Formulario de login
        │   └── Login.module.css
        │
        └── CreateUser/
            ├── CreateUser.tsx             # Layout con video de fondo
            ├── CreateUser.module.css
            └── components/
                └── CreateUserForm/
                    ├── CreateUserForm.tsx     # Formulario de alta en sí
                    └── CreateUserForm.module.css
```

### Rutas disponibles

| Ruta | Página | Protegida |
|---|---|---|
| `/` | Home (listado de usuarios) | Sí — redirige a `/login` si no hay token |
| `/login` | Login | No |
| `/create-user` | Crear usuario | Sí — redirige a `/login` si no hay token |

La sesión se guarda en `localStorage` (`token` y `role`), no hay store global todavía: cada página lee `localStorage` directamente.

### Cierre de sesión

- **Manual**: el botón "Cerrar sesión" en `HomeHeader` borra `token` y `role` de `localStorage` y redirige a `/login`.
- **Por token vencido o inválido**: todas las peticiones a rutas protegidas pasan por `api/authFetch.ts`, que agrega el header `Authorization` automáticamente. Si el backend responde `401` (token faltante, corrupto o expirado):
  1. Borra `token` y `role` de `localStorage`.
  2. Muestra un `alert()` avisando que la sesión expiró (el `alert()` frena la ejecución hasta que el usuario toca "Aceptar").
  3. Al cerrar la alerta, redirige a `/login` con `router.navigate({ to: '/login' })`.
  4. Corta la ejecución (lanza un error), así ninguna pantalla llega a mostrar datos de una sesión que ya sabe inválida.

  Esto cubre tanto el caso de que el JWT haya expirado (por el `JWT_EXPIRES_IN` del backend) como cualquier otro motivo de rechazo del token.

---

## Funcionalidades del listado de usuarios (Home)

Esta es la pantalla principal y la que concentra la mayoría de los cambios recientes:

### Permisos según rol (`localStorage.getItem('role')`)

| Acción | ROOT | ADMIN | USER | GUEST |
|---|---|---|---|---|
| Botón "+ Agregar" (ir a crear usuario) | ✅ | ✅ | ❌ | ❌ |
| Botón "Editar" por usuario | ✅ | ✅ | ❌ | ❌ |
| Cambiar el `rol` al editar (select de roles) | ✅ | ❌ (oculto)¹ | — | — |
| Botón "Eliminar" (ícono de tacho SVG) | ✅ | ✅ | ❌ | ❌ |
| Botón "Ver" (detalle solo lectura) | ✅ | ✅ | ✅ | ✅ |
| Botón "Cerrar sesión" | ✅ | ✅ | ✅ | ✅ |
| Usuarios que ve la tabla | Todos | Todos menos ROOT | Solo `USER` y `GUEST` | Solo a sí mismo |

> ¹ Detectado en el código: la condición para mostrar el `<select>` de rol es `currentRol === 'ROOT' && 'ADMIN'`. Como `'ADMIN'` es un string (siempre "truthy"), esa condición en la práctica se comporta igual que `currentRol === 'ROOT'` sola — el `&& 'ADMIN'` no tiene ningún efecto. Si la intención era habilitar el select también para `ADMIN`, faltaría cambiarlo por `currentRol === 'ROOT' || currentRol === 'ADMIN'`.

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

### Localidad → mapa embebido

La celda de "Localidad" (`🌎 <localidad>`) ahora abre un **modal** (`LocationView`) con:
- Un `<iframe>` de Google Maps embebido, centrado en `direccion, localidad, provincia, país` del usuario.
- La dirección completa como texto debajo del mapa.
- Un botón "Abrir en Google Maps ↗" que sí abre la búsqueda en una pestaña nueva, por si quieren verla directamente en Google Maps.

(Antes era directamente un link que abría una pestaña nueva; ahora se previsualiza el mapa sin salir de la app.)

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

Todas las funciones parsean el JSON de respuesta y, si `body.success` es `false`, lanzan un `Error(body.message)` (el mensaje que definió el backend).

Las rutas protegidas ya no arman el `fetch` a mano cada una: todas pasan por **`authFetch(path, options)`**, que:
1. Agrega el header `Authorization: Bearer <token>` leyendo el token de `localStorage`.
2. Si la respuesta es `401`, dispara el flujo de sesión expirada (ver sección "Cierre de sesión" más arriba) y corta la ejecución.
3. Si no, devuelve la `Response` tal cual para que cada función la parsee a su manera.

| Archivo | Endpoint | Notas |
|---|---|---|
| `login.ts` | `POST /auth/login` | Ruta pública, usa `fetch` directo (no pasa por `authFetch`) |
| `authFetch.ts` | — | Wrapper compartido por el resto de las funciones de abajo |
| `getUsers.ts` | `GET /users` | Vía `authFetch` |
| `createUser.ts` | `POST /users` | Vía `authFetch`; completa campos faltantes con defaults |
| `updateUsers.ts` | `PUT /users/:id` | Vía `authFetch`; el backend devuelve `id` y acá se remapea a `_id` para que coincida con el tipo `User` |
| `deleteUser.ts` | `DELETE /users/:id` | Vía `authFetch` |

---

## Notas y elementos pendientes/detectados en el código

- `components/blocks/Navigation` existe pero no está importado en ningún lado del router: no se ve en la app actualmente.
- `components/blocks/RegisterRightSide` está preparado para una futura página de registro público, pero no hay ninguna ruta `/register` definida en `router.tsx`.
- `config/globals.ts` tiene hardcodeado `http://localhost:7575` como `API_URL`; conviene revisar que coincida con el `PORT` real del backend antes de levantar el proyecto (o migrarlo a una variable de entorno de Vite).
- En `UserEditForm`, la condición `currentRol === 'ROOT' && 'ADMIN'` no restringe nada extra por el motivo explicado más arriba — vale la pena revisar si la intención era `||` en vez de `&&`.

### ✅ Resuelto recientemente

- `LoginRightSide` ya no referencia el video y el logo con rutas relativas tipo `src="src/assets/Videos/HR.mp4"`; ahora los importa como módulos (`import videoLogin from '@/assets/Videos/HR.mp4'`), que es lo correcto para que Vite los procese bien también en el build de producción.
- `Home.tsx` y `CreateUser.tsx` se separaron en varios componentes más chicos (ver árbol de carpetas arriba), lo que deja cada archivo enfocado en una sola responsabilidad.
- Se agregó el botón "Cerrar sesión" y el manejo automático de sesión expirada (ver sección "Cierre de sesión").

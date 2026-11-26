<div align="center">

# Nocturna

**La plataforma integral para leer, escribir, publicar y colaborar en historias y fanfics.**  
Explora obras por categorías, organiza tu biblioteca personal, crea capítulos en el estudio de escritura y colabora con otros autores desde un solo lugar.

[Demo en vivo](https://nocturnafanfics.netlify.app) · [Repositorio](https://github.com/valencastrillon/Aplicativo-web-de-Fan-Fics) · [Reportar un issue](https://github.com/valencastrillon/Aplicativo-web-de-Fan-Fics/issues)

![React](https://img.shields.io/badge/React-18+-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=flat&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-API_REST-000000?style=flat&logo=express&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat&logo=postgresql&logoColor=000000)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-Database-C5F74F?style=flat&logo=drizzle&logoColor=000000)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styles-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=flat&logo=netlify&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat)

</div>

---

## ¿Qué es Nocturna?

Nocturna es una aplicación web full-stack diseñada para lectores y escritores de ficción serializada, compuesta por tres módulos principales trabajando juntos:

1. **Lectura y Descubrimiento:** Un catálogo organizado para explorar historias por géneros, etiquetas, autores y búsquedas, con un lector inmersivo diseñado para sesiones largas de lectura y seguimiento de progreso por capítulo.
2. **Estudio de Escritura y Colaboración:** Un espacio para crear obras, redactar y publicar capítulos, administrar borradores e invitar a otros usuarios registrados como colaboradores para coeditar historias.
3. **Comunidad y Biblioteca Personal:** Gestión de biblioteca guardada, seguimiento de autores e historias, publicaciones en comunidad con comentarios y *likes*, y perfil de autor personalizable.

Cada historia tiene su propio espacio editorial y cada usuario cuenta con su perfil y biblioteca sincronizados en la nube.

---

## Inicio rápido

Sigue esta lista rápida para probar la plataforma en vivo sin instalar nada localmente:

1. Abre la aplicación web desplegada en [nocturnafanfics.netlify.app](https://nocturnafanfics.netlify.app).
2. Haz clic en **Iniciar sesión** (`/login`) e ingresa con el modo de demostración:
   - **Correo:** `demo@nocturna.app` *(o el botón de acceso demo habilitado en pantalla)*
   - **Modo Demo:** Permite explorar la plataforma sin crear cuenta ni modificar datos persistentes.
3. Si deseas guardar tus obras y progreso de forma permanente, crea una cuenta gratuita en `/register`.
4. Al ingresar, podrás explorar el catálogo, guardar historias en tu biblioteca, publicar en el estudio y gestionar colaboradores.

---

## Guía para usuarios

| Quieres... | Haz esto |
| :--- | :--- |
| **Explorar historias** | Visita la página principal (`/`) o **Descubrir** (`/discover`) para filtrar obras y autores |
| **Buscar por título o etiqueta** | Entra a **Buscar** (`/search`) para encontrar fanfics e historias específicas |
| **Leer una obra** | Abre la ficha de la historia (`/story/:id`) y entra al **Lector** (`/read/:storyId/:chapterId`) |
| **Guardar tus lecturas** | Agrega historias a tu **Biblioteca** (`/library`) para retomar donde quedaste |
| **Escribir y publicar** | Ve al **Estudio** (`/studio`) para crear una historia, añadir capítulos y gestionarlos |
| **Invitar coautores** | Dentro de tu obra en el estudio, envía invitaciones por correo desde la sección **Colaboradores** |
| **Gestionar tu perfil y cuenta** | Edita tu biografía en **Perfil** (`/profile`) o actualiza correo/contraseña en **Cuenta** (`/account`) |

---

## Arquitectura

```text
valencastrillon/Aplicativo-web-de-Fan-Fics
├── drizzle/                        # Esquema y migraciones de base de datos (Drizzle ORM)
│   └── schema.ts                   # Definición de tablas PostgreSQL (profiles, stories, chapters, posts, etc.)
├── netlify/
│   └── functions/
│       └── api.ts                  # Adaptador serverless-http para ejecutar Express en Netlify Functions
├── public/                         # Recursos estáticos, íconos y assets públicos
├── server/                         # Backend API REST con Node.js y Express
│   ├── db.ts                       # Conexión a Neon PostgreSQL mediante Drizzle ORM
│   └── index.ts                    # Rutas de autenticación (JWT + bcrypt), obras, posts, documentos y colaboradores
├── src/                            # Aplicación principal Frontend (React + Vite + TypeScript)
│   ├── assets/                     # Imágenes y recursos multimedia
│   ├── components/                 # Componentes reutilizables de interfaz (UI / shadcn)
│   ├── contexts/                   # Estado global y contexto de autenticación (AuthContext con JWT)
│   ├── fic/                        # Módulo principal de historias, lectura y estudio
│   │   ├── pages/                  # Vistas de Nocturna (Account, AuthorPage, AuthPage, Discover, LibraryPage, Profile, Reader, SearchPage, StoryDetail, Studio)
│   │   ├── authors.ts              # Datos y utilidades de autores
│   │   ├── Collaborators.tsx       # Gestión de invitaciones y coautores por historia
│   │   ├── data.ts                 # Catálogo base y modelos de historias
│   │   └── LanguageFooter.tsx      # Selector y pie de página
│   ├── hooks/                      # Custom hooks (usePosts, useDocuments, etc.)
│   ├── lib/                        # Utilidades compartidas
│   ├── pages/                      # Páginas base y enrutamiento general
│   ├── App.tsx                     # Enrutamiento principal y protección de rutas
│   └── main.tsx                    # Punto de entrada de React
├── .env.example                    # Plantilla de variables de entorno
├── netlify.toml                    # Configuración de build, funciones serverless y redirecciones /api/*
├── package.json                    # Dependencias y scripts
└── vite.config.ts                  # Configuración de Vite y proxy local hacia /api
```

- **Frontend:** React, TypeScript, Vite, React Router DOM, TanStack Query, Tailwind CSS, shadcn/ui.
- **Backend & API:** Node.js, Express, `serverless-http` (desplegado como Netlify Functions en `/api/*`).
- **Base de Datos & ORM:** Neon (PostgreSQL serverless) + Drizzle ORM (`drizzle-kit`).
- **Autenticación:** JWT (`jsonwebtoken`) + hash de contraseñas con `bcryptjs` (`nocturna_token` en cliente).
- **Despliegue:** Netlify (Frontend estático en `dist` + API serverless en `netlify/functions/api.ts`).

---

## Desarrollo local

Sigue estos pasos para correr el proyecto completo (frontend + API) en tu equipo:

```bash
git clone https://github.com/valencastrillon/Aplicativo-web-de-Fan-Fics.git
cd Aplicativo-web-de-Fan-Fics
npm install
```

1. **Configura tus variables de entorno:** crea un archivo `.env` en la raíz del proyecto con tu conexión a Neon y una clave secreta para firmar los tokens JWT:

```env
DATABASE_URL="postgresql://usuario:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="tu_clave_secreta_larga_y_aleatoria"
```

2. **Sincroniza el esquema de base de datos en Neon:**

```bash
npx drizzle-kit push
```

3. **Inicia el servidor backend (Terminal 1):**

```bash
npx tsx server/index.ts
```

4. **Inicia el servidor de desarrollo frontend (Terminal 2):**

```bash
npm run dev
```

5. Abre `http://localhost:8080` *(o el puerto que indique Vite en consola)* en tu navegador.

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Levanta el entorno local de desarrollo frontend con HMR |
| `npx tsx server/index.ts` | Inicia el servidor API local de Express en el puerto `3001` |
| `npx drizzle-kit push` | Sincroniza el esquema de `drizzle/schema.ts` con Neon PostgreSQL |
| `npm run build` | Compila la aplicación frontend para producción en `dist/` |
| `npm run preview` | Previsualiza localmente la build de producción |
| `npm run lint` | Ejecuta ESLint para validar la calidad del código |

---

## Contribuir

- **Reportar errores o sugerencias:** Abre un *Issue* describiendo el problema, los pasos para reproducirlo o la mejora propuesta.
- **Enviar cambios:** Haz un *fork*, crea una rama (`git checkout -b feat/mi-mejora`), verifica que `npm run lint && npm run build` pasen sin errores y abre un *Pull Request* hacia `master`.

---

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.
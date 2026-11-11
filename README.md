# Nocturna

Plataforma web moderna orientada a la lectura y publicación de fanfiction e historias serializadas, diseñada con una experiencia inmersiva y un sistema de organización mediante etiquetas detalladas.

## Tecnologias Utilizadas

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI
- **Gestión de Estado y Datos:** TanStack React Query, React Router DOM
- **Backend y Autenticación:** Supabase (Client-side integration con autenticación OAuth y base de datos relacional PostgreSQL)
- **Gestor de Paquetes:** pnpm

## Arquitectura

El proyecto está estructurado como una aplicación cliente ligera y optimizada, comunicándose de forma directa con Supabase mediante políticas de seguridad a nivel de fila (RLS) y esquemas relacionales robustos para la gestión de obras, capítulos, biblioteca personal y comentarios.

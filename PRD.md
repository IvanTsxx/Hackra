# Hackra — Product Requirements Document (PRD)

> **Proyecto**: Plataforma web para hackatones  
> **Versión**: 1.0  
> **Fecha**: Marzo 2026  
> **Estado**: En desarrollo

---

## 1. Resumen Ejecutivo

**Hackra** es una plataforma web moderna para la gestión y descubrimiento de hackatones, inspirada en Luma Events pero diseñada exclusivamente para eventos de desarrollo. La aplicación busca diferenciarse de las soluciones tradicionales mediante un diseño visualmente impactante, altamente personalizable por organizadores, y con una experiencia de usuario centrada en developers.

### Propuesta de valor

- **Para organizadores**: Herramientas simples para crear eventos visualmente únicos sin conocimientos de diseño
- **Para participantes**: Discovery de hackatones con una experiencia atractiva y diferente
- **Diferenciación**: Estética innovadora que rompe con los layouts tradicionales de eventos

### KPIs objetivos

| Métrica                | Meta           |
| ---------------------- | -------------- |
| Hackatones publicados  | 50+ en 6 meses |
| Registros por hackatón | Promedio 30+   |
| Organizadores activos  | 20+            |
| Tiempo en página       | > 3 min        |

---

## 2. Estado Actual del Proyecto

### Lo que ya está implementado

El proyecto cuenta con una base sólida que cubre las funcionalidades core:

| Componente                | Estado       | Notas                                                                                                                                               |
| ------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stack técnico**         | ✅ Completo  | Next.js 16, Drizzle ORM, Better Auth, React Email                                                                                                   |
| **Auth**                  | ✅ Funcional | Solo Google + GitHub OAuth (email/password deshabilitado)                                                                                           |
| **Database schema**       | ✅ Listo     | Users, Hackathons, Participants, Organizers, Teams, TeamMembers, TeamJoinRequests                                                                   |
| **Hero section**          | ✅ Listo     | Globe 3D implementado                                                                                                                               |
| **Listado de hackatones** | ✅ Básico    | Página con cards simples                                                                                                                            |
| **Detalle de hackatón**   | ⚠️ Parcial   | Sin: personalización visual por evento, posibilidad de ver participantes, dejar comentarios, reacción con emotes, sistema de equipos (schema listo) |
| **Dashboard organizador** | ⚠️ Parcial   | CRUD completo + edición de hackatones, sin: gestión de participantes, exportar emails, stats, charts                                                |
| **Seed de datos**         | ✅ Listo     | 5 usuarios + 3 hackatones mockeados                                                                                                                 |
| **Theme toggle**          | ✅ Listo     | Animación de arrastre/slide implementada                                                                                                            |
| **Sistema de equipos**    | ⚠️ Parcial   | Schema de base de datos listo (teams, team_members, team_join_requests), sin UI todavía                                                             |

### Lo que falta implementar

1. **Personalización por evento** — Colores de fondo, figuras geométricas dinámicas
2. **Pagina de hackatones** — Eliminar grid tradicional, diseño único y creativo
3. **Dashboard completo** — Ver participantes, exportar emails (CSV), compartir en redes, ver stats, charts
4. **Página de detalle avanzada** — Cómo inscribirse, organizadores, comentarios, reacciones, compartir en redes con OG image
5. **Pagina de perfil de usuario** — Ver hackatones inscritos, editar perfil, conectar GitHub/Google
6. **UI Sistema de equipos** — Crear/editar equipo, unirse a equipo, gestionar solicitudes, lista de equipos
7. **SEO** — Meta tags dinámicos, sitemap, robots.txt, Open Graph

---

## 3. Requisitos del Producto

### 3.1 Landing principal (Home)

#### Hero Section — Diseño diferenciado

**Descripción**: La sección principal debe romper con el layout tradicional de "hero + grid de cards".

**Requerimientos**:

- Mostrar el hackatón más relevante (el más cercano en fecha o con más participantes)
- No usar grid de cards para listar eventos
- Diseño único que atraiga a developers

**Criterios de aceptación**:

- [ ] El hero muestra un hackatón destacado con información resumida
- [ ] El diseño NO es un grid de cards tradicional
- [ ] La sección es visualmente impactante y diferente a competidores

#### Elemento visual interactivo — Mundo globo en 3D

**Descripción**: Un mundo globo en 3D con puntos de colores que representan los hackatones.

**Requerimientos funcionales**:

- Rotación automática cada X segundos (configurable, default 5s)
- Interacción con mouse: drag para rotar manualmente, click en faces
- Usar `motion` (motion/react) para animaciones suaves
- Debe cargar rápidamente (lazy loading)

**Criterios de aceptación**:

- [ ] El globe renderiza sin errores en Chrome, Firefox, Safari
- [ ] La rotación automática funciona smooth a 60fps
- [ ] El usuario puede interactuar con drag sin lag
- [ ] El componente es lazy-loaded (no afecta initial load)

#### Tech Stack Marquee

**Descripción**: Carrusel horizontal con tecnologías/tags relevantes.

**Requerimientos**:

- Mostrar logos o nombres de tecnologías (React, Python, AI, etc.)
- Scroll infinito suave
- Visible en mobile y desktop

**Criterios de aceptación**:

- [ ] El marquee se desplaza sin saltos
- [ ] Es responsive (se adapta a mobile)
- [ ] No afecta el performance de la página

### 3.2 Página de Hackatón (Personalizable)

Cada hackatón debe tener su propia landing con personalización visual.

#### Contenido requerido

| Campo                      | Tipo          | Obligatorio | Notas                                       |
| -------------------------- | ------------- | ----------- | ------------------------------------------- |
| Título                     | string        | Sí          | Max 100 caracteres                          |
| Descripción                | string        | Sí          | Markdown soportado                          |
| Imagen de cover            | string        | No          | URL externa                                 |
| Tecnologías                | array[string] | No          | Tags visualizados                           |
| Requisitos                 | array[string] | Sí          | Lista de requisitos                         |
| Cómo inscribirse + body    | string        | Sí          | Markdown                                    |
| Organizadores              | array[object] | Sí          | Nombre, avatar, bio                         |
| Lista de asistentes        | array[object] | No          | Visibles públicamente solo si esta logueado |
| Cantidad de participantes  | number        | Auto        | Calculado desde registros                   |
| Máximo miembros por equipo | number        | No          | Default: 4, máximo 10                       |

#### Personalización visual

**Descripción**: Cada organizador puede personalizar la apariencia de su página.

**Requerimientos**:

- Color de fondo configurable (picker de color)
- Figuras geométricas dinámicas (triángulos, celdas, ondas)
- Selector de estilo visual predefinido
- Vista previa en tiempo real mientras edita

**Criterios de aceptación**:

- [ ] El organizador puede elegir un color de fondo
- [ ] Puede seleccionar un patrón de figuras geométricas
- [ ] Los cambios se ven en preview antes de guardar
- [ ] La página personalizada carga rápido (CSS inline para Critical Path)

### 3.3 Autenticación y Cuentas

#### Métodos de login

- Google OAuth
- GitHub OAuth

#### Roles de usuario

| Rol             | Permisos                                                                              |
| --------------- | ------------------------------------------------------------------------------------- |
| **Participant** | Registrarse en hackatones, ver lista de eventos, ver perfil, editar perfil etc        |
| **Organizer**   | + Crear/editar hackatones, ver participantes de sus eventos, estadisticas, charts etc |

**Criterios de aceptación**:

- [x] Un usuario puede tener rol de organizer
- [x] El dashboard solo es accesible para organizers autenticados
- [x] Los participantes ven contenido diferente a los organizadores

### 3.4 Dashboard del Organizador

#### Funcionalidades requeridas

1. **Lista de mis hackatones**
   - Ver todos los eventos creados
   - Estado (draft/publicado)
   - Cantidad de participantes

2. **Crear nuevo hackatón**
   - Formulario con todos los campos de la sección 3.2
   - Validación de datos
   - Preview antes de publicar
   - Configurar máximo de miembros por equipo (default: 4)

3. **Editar hackatón**
   - Modificar cualquier campo
   - Cambiar estado (draft ↔ publicado)
   - Modificar máximo de miembros por equipo

4. **Gestión de participantes**
   - Ver lista de registrados
   - Ver emails de participantes
   - Exportar lista (CSV)

5. **Compartir en redes**
   - Generar link compartido
   - Open Graph tags para preview en redes
   - Imagen generada con next/og para preview en redes sociales con la personalización del evento que tenga

**Criterios de aceptación**:

- [x] El organizador puede crear un hackatón desde cero
- [x] Puede editar todos los campos de un evento existente
- [ ] Puede configurar el máximo de miembros por equipo (entre 2 y 10)
- [ ] Puede ver la lista completa de participantes
- [ ] Puede exportar emails en formato CSV
- [ ] El link para compartir genera preview correcto en redes sociales

### 3.5 Registro de Participantes

#### Flujo de registro

1. Usuario autenticado hace click en "Participar"
2. Sistema verifica capacidad máxima
3. Si hay espacio, se crea registro
4. Se envía email de confirmación (React Email)
5. Se actualiza contador de participantes
6. Se muestra mensaje de confirmación

**Criterios de aceptación**:

- [ ] Solo usuarios autenticados pueden registrarse
- [ ] El sistema impide registro si el evento está lleno
- [ ] Se envía email de confirmación al registrarse
- [ ] El participante aparece en la lista pública del evento con su nombre y avatar de google o github

### 3.6 Sistema de Equipos (Teams)

Los participantes pueden formar equipos dentro de un hackatón para colaborar juntos. Esta funcionalidad es **opcional** — los participantes pueden trabajar de manera individual si lo prefieren.

#### Modelo de equipo

| Campo             | Tipo       | Obligatorio | Notas                                                |
| ----------------- | ---------- | ----------- | ---------------------------------------------------- |
| Nombre del equipo | string     | Sí          | Max 50 caracteres                                    |
| Slug único        | string     | Auto        | Generado desde el nombre                             |
| Hackatón          | ref        | Sí          | Relación al hackatón                                 |
| Creador           | ref        | Sí          | Usuario que crea el equipo                           |
| Miembros          | array[ref] | Sí          | Lista de participantes                               |
| Máximo miembros   | number     | No          | Heredado del hackatón (configurable por organizador) |
| Descripción       | string     | No          | Max 200 caracteres, qué buscan o idea del proyecto   |
| Redes sociales    | object     | No          | GitHub, Twitter/X, LinkedIn, Discord, Email          |
| Estado            | enum       | Auto        | `open` (buscando miembros) / `full` (lleno)          |
| AcceptedAt        | timestamp  | Auto        | Fecha de creación                                    |

#### Redes sociales de contacto

Cada equipo puede mostrar **opcionalmente** las redes de contacto de sus miembros:

| Campo    | Tipo   | Obligatorio | Notas                       |
| -------- | ------ | ----------- | --------------------------- |
| github   | string | No          | Username de GitHub          |
| twitter  | string | No          | Username de X/Twitter       |
| linkedin | string | No          | URL del perfil de LinkedIn  |
| discord  | string | No          | Username de Discord         |
| website  | string | No          | URL personal o del proyecto |

**Nota importante**: Las redes sociales se muestran a nivel de **equipo**, no del miembro individual. El creador del equipo decide qué redes mostrar para que otros puedan contactarlos.

#### Flujo de creación de equipo

1. Usuario autenticado y registrado en el hackatón hace click en "Crear Equipo"
2. Sistema solicita:
   - Nombre del equipo (editable después)
   - Descripción (opcional)
   - Redes sociales a mostrar (opcional)
3. Se crea el equipo con el usuario como único miembro y rol de "Creador"
4. El equipo aparece públicamente como "buscando miembros" (estado `open`)
5. El nombre por defecto sigue el patrón: `Equipo de {nombre_usuario}`

#### Flujo de unirse a un equipo

1. Usuario autenticado y registrado en el hackatón ve la lista de equipos
2. Solo muestra equipos con estado `open` (no llenos)
3. Usuario hace click en "Solicitar unión"
4. **El creador del equipo recibe una notificación** (futuro: email/in-app)
5. El creador puede **aceptar o rechazar** la solicitud
6. Si se acepta, el nuevo miembro se une al equipo
7. Si se alcanza el máximo de miembros, el estado cambia a `full` automáticamente

#### Restricciones y reglas

| Regla                          | Descripción                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------- |
| Solo participantes registrados | Solo quienes están registrados en el hackatón pueden crear o unirse a equipos |
| Un equipo por persona          | Un usuario solo puede pertenecer a un equipo por hackatón                     |
| Sin auto-unión                 | Los usuarios no pueden unirse por sí mismos, deben ser aceptados              |
| Máximo configurable            | El organizador define el máximo de miembros por equipo                        |
| Trabajo individual permitido   | Los participantes sin equipo pueden trabajar solos, es válido                 |
| Sin mensajes internos          | La plataforma NO provee sistema de mensajería                                 |

#### Gestión del equipo (para el creador)

El creador del equipo puede:

- Editar nombre del equipo (cambiar o dejar el nombre por defecto)
- Editar descripción
- Agregar/remover redes sociales de contacto
- Aceptar o rechazar solicitudes de unión
- Eliminar el equipo (los miembros quedan como participantes individuales)
- Abandonar el equipo (si hay otros miembros, uno de ellos se convierte en creador)

#### Página de detalle del equipo

| Sección     | Contenido                                                   |
| ----------- | ----------------------------------------------------------- |
| Header      | Nombre del equipo, estado (open/full), fecha de creación    |
| Miembros    | Lista de miembros con avatar, nombre, rol (Creador/Miembro) |
| Contacto    | Redes sociales del equipo (links externos)                  |
| Descripción | Idea/proyecto que están desarrollando                       |
| Acciones    | "Solicitar unión" (si está open y no es miembro)            |

**Criterios de aceptación**:

- [ ] Un participante puede crear un equipo dentro de un hackatón donde está registrado (UI pendiente)
- [ ] El equipo tiene un nombre por defecto editable por el creador ("Equipo de {username}") (UI pendiente)
- [x] El equipo muestra las redes sociales de contacto configuradas (schema listo)
- [ ] Otros participantes pueden solicitar unirse al equipo (UI pendiente)
- [ ] El creador recibe y puede aceptar o rechazar solicitudes (UI pendiente)
- [x] El sistema impide que un usuario esté en más de un equipo por hackatón (schema/restricciones listo)
- [x] Los participantes sin equipo pueden trabajar individualmente (ya soportado)
- [x] No existe sistema de mensajería interno en la plataforma (no está en el scope)
- [ ] El organizador define el máximo de miembros por equipo al crear/editar el hackatón (UI pendiente)
- [x] Cuando un equipo se llena, cambia automáticamente a estado `full` (schema listo)

---

## 4. Diseño y Experiencia de Usuario

### 4.1 Design System

**Referencia**: Vercel / v0

- Estética limpia y minimalista
- Espacios generosos (whitespace)
- Tipografía: GeistPixelGrid (fuente de Vercel)
- Componentes base: shadcn UI con BaseUi
- Figuras geométricas para fondos
- Animaciones con motion/react
- Three.js para efectos 3D
- Aspecto como de terminal para que sea llamativo para desarrolladores

### 4.2 Tema (Theme)

**Modo por defecto**: Light mode

**Toggle dark/light**:

- Botón visible en el header
- Transición tipo "arrastre" de pantalla (no instantánea)
- Duración: 300-400ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

**Criterios de aceptación**:

- [x] El theme toggle está accesible desde cualquier página
- [x] La animación de cambio es fluida tipo slide
- [x] La preferencia se persiste en localStorage
- [x] No hay flash de contenido durante el cambio

### 4.3 Animaciones

**Principios**:

- Usar `motion` (motion/react) para todas las animaciones
- Micro-interacciones en botones y links (scale, opacity)
- Transiciones de página suaves
- Loading states con skeletons

**Performance**:

- Las animaciones NO deben afectar Lighthouse score
- Usar `will-change` estratégicamente
- Animaciones en Compositor thread (transform, opacity)

### 4.4 Responsive Design

**Breakpoints**:

| Breakpoint | Ancho          | Target       |
| ---------- | -------------- | ------------ |
| Mobile     | < 640px        | Teléfonos    |
| Tablet     | 640px - 1024px | Tablets      |
| Desktop    | > 1024px       | Computadoras |

**Criterios de aceptación**:

- [ ] Todas las páginas son usables en mobile
- [ ] El 3D globe funciona en mobile (touch events)
- [ ] Las tablas/scrolls horizontales se adaptan

---

## 5. Arquitectura Técnica

### 5.1 Scope Rule + Screaming Architecture

**Regla fundamental**:

| Código usado en... | Ubicación              |
| ------------------ | ---------------------- |
| 1 solo feature     | `_components/` (local) |
| Múltiples features | `shared/`              |

**Ejemplos**:

```
✅ CORRECTO:
  app/hackathons/[slug]/_components/detail-content.tsx  (solo para hackatón)
  app/dashboard/_components/stats-card.tsx             (solo para dashboard)

  shared/components/ui/button.tsx                      (usado en todo el app)
  shared/lib/db.ts                                      (usado en múltiples features)

❌ INCORRECTO:
  components/button.tsx                                 (rompe scope rule)
  lib/utils.ts                                          (debería ser shared/)
```

### 5.2 Estructura de carpetas

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── _actions/           # Server actions de auth
│   │
│   ├── (hackathons)/
│   │   ├── page.tsx            # Listado de hackatones
│   │   ├── [slug]/
│   │   │   ├── page.tsx       # Detalle del hackatón
│   │   │   └── _components/   # Componentes locales
│   │   └── _actions/          # Server actions de hackathons
│   │
│   ├── (dashboard)/
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── create/
│   │   │   └── page.tsx       # Crear hackatón
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx  # Editar hackatón
│   │
│   ├── layout.tsx
│   └── page.tsx               # Home
│
├── shared/
│   ├── components/
│   │   └── ui/                # shadcn UI base
│   ├── lib/
│   │   ├── db.ts              # Conexión Drizzle
│   │   ├── auth.ts            # Better Auth setup
│   │   └── utils.ts           # Utilidades compartidas
│   └── types/                 # Tipos globales
│
└── styles/
    └── globals.css            # Tailwind + variables
```

### 5.3 Server-First (RSC)

**Principio**: Usar `"use client"` SOLO cuando sea necesario.

**Cuando SÍ usar client components**:

- Interacciones con mouse (drag, click)
- Estados de UI (isOpen, isLoading)
- Theme toggle
- Animaciones con motion

**Cuando NO usar**:

-Fetching de datos (usar Server Components + Server Actions)

- Renderizado de listas (usar .map() en RSC)
- Formatting de fechas (usar server-side)

### 5.4 Patrones de Fetching

**Correcto**:

```typescript
// app/hackathons/page.tsx (Server Component)
import { getHackathons } from "./_actions";

export default async function HackathonsPage() {
  const hackathons = await getHackathons(); // Direct call, no fetch

  return (
    <ul>
      {hackathons.map(h => <HackathonCard key={h.id} data={h} />)}
    </ul>
  );
}
```

**Con promesas paralelas**:

```typescript
// page.tsx con múltiples queries
const [featured, recent, categories] = await Promise.all([
  getFeaturedHackathon(),
  getRecentHackathons(),
  getCategories(),
]);
```

### 5.5 Data Access Layer (DAL)

Cada feature debe tener su propio DAL ubicado junto a los actions:

```
app/(hackathons)/
├── _actions/
│   ├── hackathons.ts          # CRUD operations
│   └── participants.ts        # Gestión de registros
├── _dal/
│   ├── hackathons.ts          # Queries específicas
│   └── participants.ts
└── _dto/
    ├── hackathon.dto.ts       # Transformaciones de datos
    └── participant.dto.ts
```

---

## 6. Stack Tecnológico

### Dependencias principales

| Categoría   | Tecnología                    | Versión           |
| ----------- | ----------------------------- | ----------------- |
| Framework   | Next.js                       | 16.x (App Router) |
| UI          | React                         | 19.x              |
| Styling     | Tailwind CSS                  | 4.x               |
| Componentes | shadcn UI                     | 4.x               |
| Animaciones | Motion                        | 12.x              |
| 3D          | Three.js + @react-three/fiber | Latest            |
| Database    | Drizzle ORM                   | 0.45.x            |
| DB Host     | Neon (PostgreSQL)             | Serverless        |
| Auth        | Better Auth                   | 1.5.x             |
| Emails      | React Email                   | 1.0.x             |
| Validadores | Zod                           | 4.x               |

### Variables de entorno requeridas

```env
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# OAuth (opcional para desarrollo)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email (para producción)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

## 7. Consideraciones Adicionales

### 7.1 Performance

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **3D globe**: Debe cargar en < 1s (lazy load)

### 7.2 SEO

- Meta tags dinámicos por página de hackatón
- Open Graph para compartir en redes
- Schema.org markup para eventos
- Sitemap automático

### 7.3 Accesibilidad

- WCAG 2.1 nivel AA
- Keyboard navigation completa
- Screen reader friendly
- Focus states visibles

### 7.4 Seguridad

- Rate limiting en autenticación
- CSRF protection
- Input sanitization con Zod
- SQL injection prevention (Drizzle ORM)

---

## 8. Glosario

| Término                    | Definición                                              |
| -------------------------- | ------------------------------------------------------- |
| **RSC**                    | React Server Component                                  |
| **DAL**                    | Data Access Layer                                       |
| **DTO**                    | Data Transfer Object                                    |
| **Scope Rule**             | Regla que determina si código va en local o shared      |
| **Screaming Architecture** | Arquitectura donde las carpetas describen funcionalidad |
| **OG Tags**                | Open Graph meta tags para redes sociales                |
| **Seed**                   | Datos iniciales mockeados para desarrollo               |

---

## 8. Referencias

- [Luma Events](https://lu.ma/) — Inspiración
- [Resend](https://resend.com/) — Referencia visual 3D
- [v0](https://v0.app/) — Design system referencia
- [Better Auth Docs](https://www.better-auth.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)

---

## Anexo: User Stories

### Como participante...

1.Quiero poder ver todos los hackatones disponibles para encontrar eventos que me interesen

2.Quiero poder filtrar hackatones por tecnología, fecha y ubicación para encontrar el evento ideal

3.Quiero poder registrarme en un hackatón con un solo click para participar rápidamente

4.Quiero ver quién más se ha registrado para conectar con otros participantes, ver sus redes, github etc.

5.Quiero recibir un email de confirmación cuando me registre para tener certeza de mi participación

6.Quiero poder crear o unirme a un equipo dentro del hackatón para trabajar en grupo

7.Quiero poder contactar a equipos a través de sus redes sociales (GitHub, Twitter, LinkedIn, Discord) para coordinar ideas o preguntas

8.Quiero que los equipos tengan un nombre editable y pueda cambiar el que genera la plataforma por defecto

### Como organizador...

1.Quiero crear un hackatón con mi propia identidad visual para que destaque

2.Quiero poder editar toda la información de mi hackatón en cualquier momento

3.Quiero ver la lista de participantes registrados para gestionar el evento

4.Quiero exportar los emails de participantes para poder contactarlos

5.Quiero compartir mi hackatón en redes sociales con una preview atractiva en X (twitter) por ejemplo

6.Las inscripciones deben de cerrarse automaticamente una vez alcanzado el límite de participantes

---

_Documento creado para Hackra v1.0_

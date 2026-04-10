# Tasks: Equipos y Aplicaciones - Wiring de Server Actions

## Change: `equipos-y-aplicaciones`

## Overview

Completar el wiring de las server actions existentes para que la UI persistente datos correctamente.

---

## Phase 1: Server Action - CreateTeam

- [x] **1.1** Agregar `createTeam` server action en `app/(private)/(user)/teams/_actions.ts`
  - [x] Validar sesión de usuario con `auth.api.getSession`
  - [x] Definir Zod schema con: `name` (string, min 2), `description` (optional), `techs` (array), `questions` (array), `hackathonId` (string)
  - [x] Crear registro en `Team` table con `prisma.team.create`
  - [x] Agregar preguntas con `prisma.teamQuestion.createMany` si existen
  - [x] Agregar al owner como `TeamMember` automaticamente
  - [x] Retornar `{ success: boolean; teamId?: string; error?: string }`
  - [x] Revalidar `/hackathon/{slug}/teams`

---

## Phase 2: Create Form - Wiring

- [x] **2.1** Importar `createTeam` server action en `app/(public)/hackathon/[slug]/teams/create/_components/create-form.tsx`
- [x] **2.2** Modificar el `onSubmit` del form para:
  - [x] Llamar a `createTeam` con los datos del form
  - [x] Manejar errores de validación (mostrar en UI)
  - [x] En éxito, setear `submitted(true)` Y pasar `teamId` al estado de éxito
- [x] **2.3** Actualizar UI de éxito para mostrar `teamId` retornado

---

## Phase 3: Hackathon Page - Join Button Wiring

- [x] **3.1** Importar `joinHackathon` server action en `app/(public)/hackathon/[slug]/page.tsx`
- [x] **3.2** Crear componente cliente `join-button.tsx` (o usar `useActionState`) para el botón JOIN
- [x] **3.3** Implementar lógica de click:
  - [x] Llamar a `joinHackathon(hackathon.id)`
  - [x] Manejar errores ("Already registered", "Unauthorized", etc.)
  - [x] En éxito, actualizar estado `joined` a `true`
- [x] **3.4** Reemplazar botón existente con el nuevo componente

---

## Phase 4: Verification

- [x] **4.1** Verificar que `bun run typecheck` pasa
- [x] **4.2** Verificar que `bun run check` pasa
- [ ] **4.3** Testear manualmente:
  - [ ] Crear un equipo desde `/hackathon/{slug}/teams/create`
  - [ ] Unirse a un hackathon desde `/hackathon/{slug}`

# Proposal: Equipos y Aplicaciones - Wiring de Server Actions

## Change Name

`equipos-y-aplicaciones`

## Intent

Completar el wiring de las server actions existentes para que la UI persistente datos correctamente. El proyecto ya tiene la lógica de servidor implementada (`applyToTeam`, `joinHackathon`, y la creación de equipos), pero los forms no las llaman.

## Scope

### Objetivos

1. **Crear Equipo**: Conectar el form de creación de equipos a una server action que persista el equipo en la base de datos
2. **Apply to Hackathon**: Wirear el botón "JOIN HACKATHON" en la página de detalle del hackathon a la server action `joinHackathon`
3. **Apply to Team**: Ya está completo y funcionando (no requiere cambios)

### Áreas Afectadas

| Archivo                                                                  | Acción Requerida                           |
| ------------------------------------------------------------------------ | ------------------------------------------ |
| `app/(private)/(user)/teams/_actions.ts`                                 | Agregar `createTeam` server action         |
| `app/(public)/hackathon/[slug]/teams/create/_components/create-form.tsx` | Conectar form a `createTeam` action        |
| `app/(public)/hackathon/[slug]/page.tsx`                                 | Wirear botón JOIN a `joinHackathon` action |

## Approach

### 1. Server Action para Crear Equipo (`createTeam`)

Agregar una nueva server action en `_actions.ts` que:

- Valide sesión de usuario
- Aceptar: `name`, `description`, `techs` (array), `questions` (array), `hackathonId`
- Crear registro en `Team` table
- Retornar `{ success: boolean; teamId?: string; error?: string }`
- Revalidar `/hackathon/{slug}/teams`

### 2. Wiring de Create Form

Modificar `create-form.tsx`:

- Importar `createTeam` server action
- En el `onSubmit`, llamar a la action con los datos del form
- Mostrar errores de validación si falla
- Mostrar UI de éxito con `teamId` si succeede

### 3. Wiring de Join Hackathon

Modificar `page.tsx`:

- Importar `joinHackathon` server action
- Crear componente cliente o usar `useFormStatus` / `useActionState` para el botón
- Llamar a `joinHackathon(hackathon.id)` al hacer click
- Actualizar estado `joined` al succès

## Risks

- **Bajo**: Es wiring de código existente
- **Validación**: Los schemas de Zod ya están definidos en las actions
- **Rollback**: Simple - revertir los cambios de wiring deja la UI como estaba (forms sin action)

## Rollback Plan

1. Revertir cambios en `create-form.tsx` (quitar llamada a server action)
2. Revertir cambios en `page.tsx` (quitar wireo de botón)
3. Eliminar server action `createTeam` si se agregó
4. Todo el código existente sigue funcionando - solo se quitó el wiring

## Technical Notes

- La server action `joinHackathon` ya existe en línea 190-221 de `_actions.ts`
- El form de creación de equipos ya tiene toda la UI necesaria (name, description, techs, questions)
- No se necesita modificar el esquema de Prisma - las tablas `Team` y `TeamQuestion` ya existen

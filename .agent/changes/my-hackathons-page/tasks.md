# Tasks: My Hackathons Page

> **Dependencies**: Requires `spec.md` and `design.md` artifacts from the `my-hackathons-page` change.
> **Mode**: File-based (`.agent/changes/my-hackathons-page/`)

## Task Breakdown

### T-1: Add Cascade Delete to Hackathon Relations

**Description**: The `Hackathon` model is missing `onDelete: Cascade` on most relations. Currently only `HackathonPrize` has cascade. Add `onDelete: Cascade` to:

- `Team.hackathon` relation (line 187)
- `HackathonParticipant.hackathon` relation (line 169)
- `HackathonSponsor.hackathon` relation (line 305)

Note: `relationMode = "prisma"` is set in the datasource (line 8), so cascade is handled at the Prisma level, not the database level.

**Files**:

- `prisma/schema.prisma` (modify)

**Dependencies**: None

**Acceptance Criteria**:

- [ ] `Team` model: `hackathon Hackathon @relation(fields: [hackathonId], references: [id], onDelete: Cascade)`
- [ ] `HackathonParticipant` model: `hackathon Hackathon @relation(fields: [hackathonId], references: [id], onDelete: Cascade)`
- [ ] `HackathonSponsor` model: `hackathon Hackathon @relation(fields: [hackathonId], references: [id], onDelete: Cascade)`
- [ ] `HackathonPrize` already has cascade (no change needed)
- [ ] `bun run db:push` succeeds
- [ ] `bun run db:generate` succeeds

---

### T-2: Create Organizer Hackathons DAL

**Description**: Create the server-only Data Access Layer at `data/organizer-hackathons.ts` with `import 'server-only'`. Follow the existing pattern from `data/hackatons.ts`.

Implement functions:

- `getOrganizerHackathons(userId)` — returns all hackathons for user with `_count.participants` (no N+1)
- `getOrganizerHackathonById(id, userId)` — returns single hackathon with participants (include user data)
- `getPendingParticipantsCount(hackathonId, userId)` — returns count of PENDING participants
- `updateHackathon(id, userId, data)` — updates hackathon fields, verifies ownership
- `deleteHackathon(id, userId)` — deletes hackathon (Prisma cascade handles children)
- `approveParticipant(hackathonId, participantId, userId)` — sets `HackathonParticipant.status` to APPROVED
- `rejectParticipant(hackathonId, participantId, userId)` — sets `HackathonParticipant.status` to REJECTED

All functions must verify ownership (`userId` matches `hackathon.organizerId`) or throw `Error('Unauthorized')`. Only ADMIN or the hackathon organizer can access.

**Files**:

- `data/organizer-hackathons.ts` (NEW)

**Dependencies**: T-1 (cascade configured)

**Acceptance Criteria**:

- [ ] File starts with `import 'server-only'`
- [ ] All functions verify ownership before mutations
- [ ] `getOrganizerHackathons` uses `select` or `include` with `_count: { select: { participants: true } }` — no N+1
- [ ] `getPendingParticipantsCount` filters by `status: 'PENDING'`
- [ ] `updateHackathon` does NOT allow updating `slug`, `organizerId`, `requiresApproval`, `themeBg`, `themeGradient`, `themeStyle`
- [ ] `deleteHackathon` relies on Prisma cascade (no manual cleanup)
- [ ] Functions return typed data, not raw Prisma models where possible
- [ ] Follows existing DAL patterns from `data/hackatons.ts`

---

### T-3: Define Zod Schemas for Server Actions

**Description**: Create Zod validation schemas for all server action inputs. Place in `_schemas.ts` or inline in `_actions.ts`.

Schemas needed:

- `editHackathonSchema` — validates: title (string, min 5), description (string, min 10), image (url string, optional), startDate (date), endDate (date, refine >= startDate), location (string), locationMode (enum: 'online' | 'in_person' | 'hybrid'), isOnline (boolean), tags (string array), techs (string array), maxParticipants (number, positive, nullable), maxTeamSize (number, positive), status (enum excluding LIVE)
- `deleteHackathonSchema` — `{ id: z.string() }`
- `participantActionSchema` — `{ hackathonId: z.string(), participantId: z.string() }`

**Files**:

- `app/(private)/(user)/my-hackathons/_schemas.ts` (NEW)

**Dependencies**: T-2 (DAL function signatures known)

**Acceptance Criteria**:

- [ ] `editHackathonSchema` validates all editable fields with appropriate constraints
- [ ] `status` field excludes `LIVE` — use `z.enum(['DRAFT', 'UPCOMING', 'ENDED', 'CANCELLED'])`
- [ ] Cross-field validation: `endDate >= startDate` via `.refine()` or `.superRefine()`
- [ ] `maxParticipants` nullable (can be unlimited), but when set must be positive
- [ ] `maxTeamSize` always positive integer
- [ ] Schemas exported for reuse in client form components

---

### T-4: Create Server Actions File

**Description**: Create `app/(private)/(user)/my-hackathons/_actions.ts` with `"use server"` directive. Implement 4 server actions:

- `editHackathonAction(dto: EditHackathonDTO)` → `Result<HackathonDTO>`
- `deleteHackathonAction({ id })` → `Result`
- `approveParticipantAction({ hackathonId, participantId })` → `Result`
- `rejectParticipantAction({ hackathonId, participantId })` → `Result`

Each action must:

1. Validate input with Zod
2. Re-verify auth (get current user from session)
3. Delegate to DAL functions
4. Call `revalidatePath('/my-hackathons')` on success
5. Return typed Result (success/error)

**Files**:

- `app/(private)/(user)/my-hackathons/_actions.ts` (NEW)

**Dependencies**: T-2 (DAL), T-3 (schemas)

**Acceptance Criteria**:

- [ ] File starts with `"use server"`
- [ ] All actions validate input with Zod before processing
- [ ] All actions re-verify auth (get current user, don't trust caller)
- [ ] All actions delegate to DAL (thin action layer)
- [ ] `revalidatePath('/my-hackathons')` called on successful mutations
- [ ] Actions return consistent Result type `{ success: boolean, data?: T, error?: string }`
- [ ] `editHackathonAction` rejects `LIVE` status with error message
- [ ] Error messages are user-friendly (not raw Prisma errors)

---

### T-5: Create My Hackathons Page (Server Component)

**Description**: Create `app/(private)/(user)/my-hackathons/page.tsx` as a Server Component. Fetch organizer's hackathons using DAL, pass data to client table component. Handle:

- Unauthorized users redirect to `/`
- Empty state when no hackathons exist
- Loading state with Suspense boundary
- Pending participant badge count (aggregate across all hackathons)

**Files**:

- `app/(private)/(user)/my-hackathons/page.tsx` (NEW)

**Dependencies**: T-2 (DAL), T-4 (actions — for passing to client components)

**Acceptance Criteria**:

- [ ] Server Component (no `"use client"`)
- [ ] Redirects to `/` if user not authenticated
- [ ] Fetches hackathons via DAL `getOrganizerHackathons(userId)`
- [ ] Shows empty state with "Create your first hackathon" CTA when no hackathons
- [ ] Passes server actions as props to client components
- [ ] Shows pending badge with total count across all hackathons
- [ ] Uses `<Suspense>` for loading state
- [ ] Page title and metadata set

---

### T-6: Create Hackathons Table Component

**Description**: Create `app/(private)/(user)/my-hackathons/_components/hackathons-table.tsx` as a Client Component. Display hackathons in a table with columns:

- Title (with pending badge if has pending participants)
- Status
- Start Date
- Participants count
- Actions (Edit, Delete, View Participants buttons)

Use shadcn Table component. Include proper `scope` attributes on `<th>` elements for accessibility.

**Files**:

- `app/(private)/(user)/my-hackathons/_components/hackathons-table.tsx` (NEW)

**Dependencies**: T-5 (page structure known)

**Acceptance Criteria**:

- [ ] Client Component (`"use client"`)
- [ ] Table has proper `<thead>`, `<tbody>`, `<th scope="col">` structure
- [ ] Shows pending badge (with count) next to title when `pendingCount > 0`
- [ ] Edit, Delete, View Participants buttons per row
- [ ] Delete button disabled for `LIVE` status hackathons
- [ ] Edit button disabled for `LIVE` status hackathons
- [ ] Responsive layout (horizontal scroll on mobile)
- [ ] Empty row message when no hackathons (fallback)

---

### T-7: Create Edit Hackathon Dialog

**Description**: Create `app/(private)/(user)/my-hackathons/_components/edit-hackathon-dialog.tsx` as a Client Component. Use TanStack Form + Zod with the render prop pattern. Fields:

- title (string, min 5)
- description (string, min 10)
- image (URL string, optional)
- startDate (date)
- endDate (date, must be >= startDate)
- location (string, conditional on isOnline)
- locationMode (enum: online/in-person/hybrid)
- isOnline (boolean)
- tags (array of strings)
- techs (array of strings)
- maxParticipants (number, positive)
- maxTeamSize (number, positive)
- status (select, excludes LIVE)

Use `toast.promise` for submit feedback. Non-editable fields (slug, organizerId, requiresApproval, theme fields) are NOT shown.

**Files**:

- `app/(private)/(user)/my-hackathons/_components/edit-hackathon-dialog.tsx` (NEW)

**Dependencies**: T-3 (schemas), T-4 (editHackathonAction)

**Acceptance Criteria**:

- [ ] Client Component (`"use client"`)
- [ ] Uses `useForm` from `@tanstack/react-form` with `validators: { onSubmit: formSchema }`
- [ ] Uses render prop pattern: `children={(field) => ...}`
- [ ] All fields wired: `value`, `onBlur`, `onChange`/`onValueChange`
- [ ] Invalid state: `field.state.meta.isTouched && !field.state.meta.isValid`
- [ ] `data-invalid` on `<Field>`, `aria-invalid` on controls
- [ ] `<FieldError>` shown when invalid
- [ ] `toast.promise` wraps `editHackathonAction` call
- [ ] Dialog closes on success
- [ ] `LIVE` status not available in status select
- [ ] Date validation: endDate >= startDate
- [ ] Form resets on open with current hackathon data

---

### T-8: Create Delete Hackathon Dialog

**Description**: Create `app/(private)/(user)/my-hackathons/_components/delete-hackathon-dialog.tsx` as a Client Component. Confirmation dialog that:

- Shows hackathon title and warning about cascade delete (teams, participants, applications will be removed)
- Requires typing hackathon title to confirm (or simple confirm button)
- Calls `deleteHackathonAction` on confirm
- Uses `toast.promise` for feedback

**Files**:

- `app/(private)/(user)/my-hackathons/_components/delete-hackathon-dialog.tsx` (NEW)

**Dependencies**: T-4 (deleteHackathonAction)

**Acceptance Criteria**:

- [ ] Client Component (`"use client"`)
- [ ] Shows warning about cascade delete consequences
- [ ] Lists what will be deleted (teams, participants, applications)
- [ ] Calls `deleteHackathonAction` on confirm
- [ ] `toast.promise` for success/error feedback
- [ ] Dialog closes on success
- [ ] Focus returns to trigger button after close
- [ ] Accessible: `aria-describedby` for warning text

---

### T-9: Create Participants Dialog

**Description**: Create `app/(private)/(user)/my-hackathons/_components/participants-dialog.tsx` as a Client Component. Shows list of participants for a hackathon with:

- Participant name, status (PENDING/APPROVED/REJECTED), join date
- Approve/Reject buttons for PENDING participants (only when `requiresApproval` is true)
- Status badges with appropriate colors
- Calls `approveParticipantAction` / `rejectParticipantAction`
- Uses `toast.promise` for feedback
- Optimistic UI update or revalidation after action

**Files**:

- `app/(private)/(user)/my-hackathons/_components/participants-dialog.tsx` (NEW)

**Dependencies**: T-4 (approveParticipantAction, rejectParticipantAction)

**Acceptance Criteria**:

- [ ] Client Component (`"use client"`)
- [ ] Lists all participants with name, status, join date
- [ ] Approve/Reject buttons only shown for PENDING participants
- [ ] Approve/Reject buttons only shown when hackathon `requiresApproval`
- [ ] `toast.promise` wraps action calls
- [ ] Participant list updates after approve/reject (revalidate or optimistic)
- [ ] Status badges use semantic colors (green=approved, red=rejected, yellow=pending)
- [ ] Empty state when no participants
- [ ] Focus-trapped dialog (shadcn Dialog handles this)

---

### T-10: Wire Components Together in Page

**Description**: Integrate all components in `page.tsx`:

- Import and render `HackathonsTable` with hackathon data
- Pass server actions as props to table and dialog components
- Manage dialog open/close state in page or table
- Connect edit/delete/participants dialogs to table row actions
- Add navigation link to "My Hackathons" in navbar (if not exists)

**Files**:

- `app/(private)/(user)/my-hackathons/page.tsx` (modify)
- `app/(private)/(user)/my-hackathons/_components/hackathons-table.tsx` (modify)
- `shared/components/navbar.tsx` (modify — add nav link if missing)

**Dependencies**: T-5, T-6, T-7, T-8, T-9

**Acceptance Criteria**:

- [ ] Table renders with hackathon data from server
- [ ] Edit button opens edit dialog with correct hackathon data
- [ ] Delete button opens delete confirmation dialog
- [ ] View Participants button opens participants dialog
- [ ] Dialogs close after successful actions
- [ ] Table refreshes after mutations (revalidatePath handles this)
- [ ] Navbar has "My Hackathons" link accessible to organizers/admins
- [ ] No TypeScript errors

---

### T-11: Add Error States and Edge Case Handling

**Description**: Implement all error states and edge cases:

- Unauthorized redirect: non-organizers/admins redirected to `/` with toast explanation
- Not found: hackathon not found shows 404 or error message
- Cascade delete warning clearly shown before deletion
- Validation errors displayed inline in forms
- Duplicate action prevention (disable buttons during pending action)
- LIVE status restriction: edit/delete buttons disabled, tooltip explains why

**Files**:

- `app/(private)/(user)/my-hackathons/page.tsx` (modify)
- `app/(private)/(user)/my-hackathons/_components/hackathons-table.tsx` (modify)
- `app/(private)/(user)/my-hackathons/_components/edit-hackathon-dialog.tsx` (modify)
- `app/(private)/(user)/my-hackathons/_components/delete-hackathon-dialog.tsx` (modify)

**Dependencies**: T-10

**Acceptance Criteria**:

- [ ] Non-organizer redirected to `/` with toast: "You don't have permission to view this page"
- [ ] Hackathon not found shows appropriate error state
- [ ] Delete dialog clearly warns about cascade delete
- [ ] Form validation errors shown inline (not just console)
- [ ] Submit buttons disabled during pending action (`isSubmitting` state)
- [ ] Edit/Delete buttons disabled for LIVE hackathons with tooltip: "Cannot modify a live hackathon"
- [ ] Date validation error shown when endDate < startDate

---

### T-12: Accessibility Audit and Polish

**Description**: Final accessibility pass across all components:

- All table headers have `scope="col"`
- All dialogs are focus-trapped (shadcn Dialog default)
- Form inputs have descriptive `<label>` elements with `htmlFor`
- All interactive elements keyboard accessible
- ARIA attributes on all form controls (`aria-invalid`, `aria-describedby`)
- Color contrast meets WCAG AA
- Screen reader announces dialog open/close
- Loading states announced with `aria-busy` or `aria-live`

**Files**:

- `app/(private)/(user)/my-hackathons/_components/hackathons-table.tsx` (modify)
- `app/(private)/(user)/my-hackathons/_components/edit-hackathon-dialog.tsx` (modify)
- `app/(private)/(user)/my-hackathons/_components/delete-hackathon-dialog.tsx` (modify)
- `app/(private)/(user)/my-hackathons/_components/participants-dialog.tsx` (modify)

**Dependencies**: T-11

**Acceptance Criteria**:

- [ ] All `<th>` elements have `scope="col"`
- [ ] All dialogs use shadcn Dialog (focus-trapped by default)
- [ ] All form inputs have visible `<label>` with correct `htmlFor`
- [ ] Tab navigation works through all interactive elements
- [ ] `aria-invalid` set on invalid form fields
- [ ] `aria-describedby` links inputs to error/description text
- [ ] Color contrast passes WCAG AA (use oklch values from theme)
- [ ] No `div` buttons — use `<button>` elements
- [ ] Run `bun run fix` — no linting errors

---

## Task Dependency Graph

```
T-1 (Prisma cascade)
  └── T-2 (DAL)
        ├── T-3 (Schemas)
        │     └── T-4 (Server Actions)
        │           ├── T-5 (Page)
        │           │     ├── T-6 (Table)
        │           │     │     ├── T-7 (Edit Dialog)
        │           │     │     ├── T-8 (Delete Dialog)
        │           │     │     └── T-9 (Participants Dialog)
        │           │     │           └── T-10 (Wire Together)
        │           │     │                 └── T-11 (Error States)
        │           │     │                       └── T-12 (A11y Polish)
```

## Parallelizable Tasks

After T-4 is complete, T-7, T-8, and T-9 can be developed in parallel (they have no cross-dependencies).

# Design: co-organizer-requests + Home enhancements

## Technical Approach

Extend the existing hackathon organizer system to support user-initiated co-organizer requests via a new `CoOrganizerRequest` model, and enhance the Home page with interactive karma, upcoming deadlines, leadership board, and countdown sections. The hackathon detail sidebar will display existing co-organizers from the `HackathonOrganizer` table.

## Architecture Decisions

### Decision: Co-organizer Request Model

**Choice**: New `CoOrganizerRequest` table with status enum (PENDING, ACCEPTED, REJECTED)
**Alternatives considered**: Reuse `HackathonOrganizer` with nullable fields, separate request table
**Rationale**: Clear state machine — requests go through lifecycle. Rejection doesn't create organizer record.

### Decision: Request Submission Flow

**Choice**: Server Action for submission with optimistic duplicate check
**Alternatives considered**: Allow duplicate submissions with conflict error on save
**Rationale**: Better UX — fail fast before DB constraint.

### Decision: Home Data Layer

**Choice**: New DAL functions in `data/home.ts` for each new section
**Alternatives considered**: Single function with all data, inline queries in page
**Rationale**: Reusable, cacheable, follows existing DAL pattern.

### Decision: Countdown Client Component

**Choice**: Client component with `setInterval` updating every second
**Alternatives considered**: SSR with fixed timestamp, no countdown
**Rationale**: Real-time countdown is expected for hackathon platforms.

### Decision: Co-organizer Display in Sidebar

**Choice**: Use existing `getCoOrganizers` from DAL (requires manage access)
**Alternatives considered**: Public query by hackathonId
**Rationale**: Existing authorization checks. May need public variant if spec changes later.

## Data Flow

```
[User] ──submit──> [Server Action: requestCoOrganizer]
                            │
                            ▼
                    [DAL: validate + insert]
                            │
                            ▼
                    [CoOrganizerRequest] ──(status change)──> [HackathonOrganizer]
                                                                         │
                                                                         ▼
[Hackathon Page] <──fetch── [getCoOrganizers] <── Prisma <── HackathonOrganizer
```

Home Page Data Flow:

```
[Home Page (RSC)] ──fetch── [getHomeKarma] ── [getUserKarma]
                      │          │
                      │          ▼
                      │    [getUpcomingDeadlines]
                      │          │
                      │          ▼
                      │    [getLeadershipBoard]
                      │          │
                      │          ▼
                      └────> [getNextHackathonCountdown]
                                                      │
                                                      ▼
                                            [Countdown Client Component]
```

## File Changes

| File                                                                      | Action | Description                                                                                   |
| ------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| `prisma/schema.prisma`                                                    | Modify | Add `CoOrganizerRequest` model                                                                |
| `data/co-organizer-request.ts`                                            | Create | DAL for request CRUD operations                                                               |
| `app/actions/co-organizer-request.ts`                                     | Create | Server Actions for submit/edit/respond                                                        |
| `app/(private)/(user)/my-hackathons/[id]/manage/page.tsx`                 | Modify | Add requests list + accept/reject buttons                                                     |
| `app/(public)/hackathon/[slug]/page.tsx`                                  | Modify | Fetch + display co-organizers in sidebar                                                      |
| `app/(public)/hackathon/[slug]/_components/co-organizers-sidebar.tsx`     | Create | Client component for co-organizers display                                                    |
| `data/home.ts`                                                            | Modify | Add `getUpcomingDeadlines`, `getLeadershipBoard`, `getUserKarma`, `getNextHackathonCountdown` |
| `app/(public)/_components/karma-section.tsx`                              | Create | Enhanced karma section (server component)                                                     |
| `app/(public)/_components/upcoming-deadlines.tsx`                         | Create | Deadlines section                                                                             |
| `app/(public)/_components/leadership-board.tsx`                           | Create | Leaderboard section                                                                           |
| `app/(public)/_components/countdown-timer.tsx`                            | Create | Real-time countdown (client component)                                                        |
| `app/(private)/(user)/my-hackathons/_components/my-hackathons-client.tsx` | Modify | Add tab switcher for Owned/Co-organizing                                                      |

## Interfaces / Contracts

```typescript
// enums for request status
enum CoOrganizerRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

// Prisma model (schema.prisma)
model CoOrganizerRequest {
  id          String   @id @default(cuid())
  hackathonId String
  userId      String
  message     String? // max 500 chars
  status      CoOrganizerRequestStatus @default(PENDING)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  hackathon Hackathon @relation(fields: [hackathonId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([hackathonId, userId])
  @@index([hackathonId])
  @@index([userId])
  @@map("co_organizer_request")
}

// DAL return types
interface CoOrganizerRequestDTO {
  id: string;
  hackathonId: string;
  user: { id: string; username: string; image: string | null; name: string | null };
  message: string | null;
  status: CoOrganizerRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface UpcomingDeadline {
  id: string;
  title: string;
  slug: string;
  daysRemaining: number;
  endDate: Date;
}

interface LeaderboardEntry {
  rank: number;
  user: { id: string; username: string; image: string | null };
  karmaPoints: number;
}

interface CountdownData {
  hackathon: { id: string; title: string; slug: string; startDate: Date };
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
```

## Testing Strategy

| Layer       | What to Test                                                          | Approach                                 |
| ----------- | --------------------------------------------------------------------- | ---------------------------------------- |
| Unit        | Co-organizer request validation (duplicate check, status transitions) | Test DAL functions with in-memory Prisma |
| Integration | Full flow: submit → accept → permissions granted                      | Test Server Action + DAL chain           |
| Unit        | Home DAL functions (deadlines sort, leaderboard order)                | Test with seed data                      |
| E2E         | Submit request, view sidebar, accept in dashboard                     | Playwright flow                          |
| Unit        | Countdown ticking                                                     | Test client component with fake timer    |

## Migration / Rollout

1. **Database Migration**: Add `co_organizer_request` table (non-breaking)
2. **Feature Flags**: None required — all new features
3. **Rollout**: Deploy in single release — Home enhancements visible to all, request flow requires auth

**No data migration required** — new table only.

## Open Questions

- [ ] Should co-organizers see the request management UI in dashboard? Spec says "UI stub only" for email. Should we hide management entirely for co-organizers?
- [ ] Public access to co-organizers list in sidebar? Current `getCoOrganizers` requires manage access. May need public variant.
- [ ] Countdown precision — server renders stale time. Acceptable trade-off vs server load.

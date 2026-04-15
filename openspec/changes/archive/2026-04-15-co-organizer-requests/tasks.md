# Tasks: co-organizer-requests + Home enhancements

## Phase 1: Database Foundation

- [ ] 1.1 Add `CoOrganizerRequest` model to `prisma/schema.prisma` with fields: id, hackathonId, userId, message, status (enum: PENDING, ACCEPTED, REJECTED), createdAt, updatedAt. Include unique constraint on (hackathonId, userId), indexes on hackathonId and userId, and @@map("co_organizer_request")
- [ ] 1.2 Run `bun run db:generate` to regenerate Prisma client
- [ ] 1.3 Run `bun run db:push` to apply schema changes

## Phase 2: DAL Layer

- [ ] 2.1 Create `data/co-organizer-request.ts` with DAL functions: createCoOrganizerRequest, getCoOrganizerRequestsByHackathon, getUserCoOrganizerRequest, updateCoOrganizerRequest, acceptCoOrganizerRequest, rejectCoOrganizerRequest
- [ ] 2.2 Create `data/hackathon-organizer.ts` (or extend existing) with getCoOrganizers function to fetch co-organizers for a hackathon
- [ ] 2.3 Extend `data/home.ts` with getUpcomingDeadlines (return hackathons sorted by registration close date, limit 5-10)
- [ ] 2.4 Extend `data/home.ts` with getLeadershipBoard (return top 5-10 users by karmaPoints, include rank, username, avatar)
- [ ] 2.5 Extend `data/home.ts` with getUserKarma (return authenticated user's karmaPoints)
- [ ] 2.6 Extend `data/home.ts` with getNextHackathonCountdown (return next UPCOMING/LIVE hackathon with calculated days/hours/minutes/seconds)

## Phase 3: Server Actions

- [ ] 3.1 Create `app/actions/co-organizer-request.ts` with Server Actions: requestCoOrganizer (submit request with optional message), updateCoOrganizerRequest (edit message while PENDING), respondToCoOrganizerRequest (accept/reject with transaction)
- [ ] 3.2 Add proper authorization checks: user must be authenticated, cannot request own hackathon, cannot double-request

## Phase 4: UI - Hackathon Detail

- [ ] 4.1 Create `app/(public)/hackathon/[slug]/_components/co-organizer-request-button.tsx` - Client component with "Request to Co-organize" button that opens modal form
- [ ] 4.2 Create `app/(public)/hackathon/[slug]/_components/co-organizer-request-modal.tsx` - Modal with optional message textarea (max 500 chars), submit via Server Action
- [ ] 4.3 Create `app/(public)/hackathon/[slug]/_components/co-organizers-sidebar.tsx` - Display co-organizers with avatar + username below organizer section
- [ ] 4.4 Modify `app/(public)/hackathon/[slug]/page.tsx` to fetch and display co-organizers in sidebar

## Phase 5: UI - Organizer Dashboard

- [ ] 5.1 Create `app/(private)/(user)/my-hackathons/[id]/manage/_components/co-organizer-requests-list.tsx` - Display list of pending requests with user info, message, accept/reject buttons
- [ ] 5.2 Modify `app/(private)/(user)/my-hackathons/[id]/manage/page.tsx` to include requests list (only for owner, not co-organizers)

## Phase 6: Home Page Components

- [ ] 6.1 Enhance existing karma section or create new `app/(public)/_components/karma-section.tsx` - Make prominent, show user's karma if logged in, show general info if anonymous
- [ ] 6.2 Create `app/(public)/_components/upcoming-deadlines.tsx` - Display list of 5-10 hackathons sorted by days remaining with link to hackathon
- [ ] 6.3 Create `app/(public)/_components/leadership-board.tsx` - Display top users by karma with rank, avatar, username, points
- [ ] 6.4 Create `app/(public)/_components/countdown-timer.tsx` - Client component with real-time countdown (days:hours:mins:secs)
- [ ] 6.5 Modify `app/(public)/page.tsx` to include all new home sections

## Phase 7: My-Hackathons UX

- [ ] 7.1 Modify `app/(private)/(user)/my-hackathons/_components/my-hackathons-client.tsx` - Add tab switcher for "Owned" vs "Co-organizing", filter hackathons appropriately, visually distinguish active tab

## Phase 8: Verification

- [ ] 8.1 Run `bun run typecheck` to verify no TypeScript errors
- [ ] 8.2 Run `bun run check` to verify code style
- [ ] 8.3 Verify co-organizer request flow: submit request → view in dashboard → accept → appears in sidebar
- [ ] 8.4 Verify Home page: karma section shows user karma, deadlines sorted correctly, leadership board ranks users, countdown ticks
- [ ] 8.5 Verify My-Hackathons: tabs filter correctly between owned and co-organizing

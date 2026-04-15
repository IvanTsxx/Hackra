# Proposal: Co-organizer Request System + Home Page Enhancements

## Intent

Currently, the co-organizer system is invite-only — organizers must manually add each co-organizer. Users who want to contribute have no way to express interest. This proposal adds:

1. A **request flow** where users can ask to become co-organizers with a message
2. **Home page enhancements** to improve engagement with upcoming events and community recognition

## Scope

### In Scope

- **New Prisma model**: `CoOrganizerRequest` with fields: id, hackathonId, userId, message, status (PENDING/ACCEPTED/REJECTED), createdAt, updatedAt
- **Server Actions**: requestCoOrganizer, updateCoOrganizerRequest, respondToCoOrganizerRequest
- **UI - Request Form**: On hackathon detail page, "Request to Co-organize" button → modal with optional message
- **UI - Organizer Dashboard**: List of requests with message, accept/reject buttons
- **Permissions**: Co-organizers CAN edit their request, CANNOT delete (must ask owner), CANNOT add more co-organizers, CAN receive email notifications
- **Home - Upcoming Deadlines**: Show hackathons closing soon (sorted by date, show days remaining)
- **Home - Leadership Board**: Top 5-10 by karmaPoints, grouped by organizers vs participants
- **Home - Countdown**: For next big upcoming hackathon, show days:hours:mins:secs
- **My-Hackathons UX**: Filter tabs for owned vs co-organizing, visual distinction

### Out of Scope

- Email delivery implementation (stub only, use Resend/SendGrid later)
- Karma transaction history UI
- Bulk request operations

## Capabilities

### New Capabilities

- `co-organizer-request`: Users can request to co-organize hackathons with a message
- `co-organizer-management`: Organizers can accept/reject requests
- `home-upcoming-deadlines`: Display upcoming registration deadlines
- `home-leadership-board`: Display top karma users
- `home-countdown`: Display countdown to next event

### Modified Capabilities

- `hackathon-detail`: Add request co-organize button
- `my-hackathons`: Add filter tabs for owned/co-organizing

## Approach

1. **Database**: Add CoOrganizerRequest model to schema.prisma
2. **Server Actions**: Create actions in `shared/actions/coorganizer.ts`
3. **UI Components**:
   - Request button + modal on hackathon page
   - Request list in organizer dashboard (`my-hackathons/[id]/manage`)
4. **Home Components**: Create three new client components under `shared/components/home/`
5. **Integrate**: Add new components to home page

## Affected Areas

| Area                                                      | Impact   | Description                                   |
| --------------------------------------------------------- | -------- | --------------------------------------------- |
| `prisma/schema.prisma`                                    | Modified | Add CoOrganizerRequest model                  |
| `shared/actions/`                                         | New      | Co-organizer request actions                  |
| `app/(public)/hackathon/[slug]/page.tsx`                  | Modified | Add request button                            |
| `app/(private)/(user)/my-hackathons/[id]/manage/page.tsx` | Modified | Request management UI                         |
| `app/(public)/page.tsx`                                   | Modified | Add new home sections                         |
| `shared/components/home/`                                 | New      | UpcomingDeadlines, LeadershipBoard, Countdown |
| `app/(private)/(user)/my-hackathons/_components/`         | Modified | Client-side filtering                         |

## Risks

| Risk                                     | Likelihood | Mitigation                                     |
| ---------------------------------------- | ---------- | ---------------------------------------------- |
| Duplicate requests (user applies twice)  | Low        | Add unique constraint on (hackathonId, userId) |
| Race condition on accept                 | Low        | Transaction wraps request + organizer creation |
| Performance on home with many hackathons | Low        | Cache queries, limit to 5-10 items             |

## Rollback Plan

1. Revert schema.prisma to remove CoOrganizerRequest model
2. Delete server action file
3. Remove UI components from pages
4. Run `bun run db:generate` + `bun run db:push`

## Dependencies

- None — all features use existing infrastructure (Prisma, Server Actions, auth)

## Success Criteria

- [ ] User can submit co-organizer request with optional message
- [ ] User can edit their request while PENDING
- [ ] Organizer can accept/reject requests
- [ ] Accepted co-organizer appears in organizer list with correct permissions
- [ ] Home page shows Upcoming Deadlines section with correct sorting
- [ ] Home page shows Leadership Board with top karma users
- [ ] Home page shows Countdown to next upcoming event
- [ ] My-hackathons has clear tab distinction between owned and co-organizing
- [ ] All code passes `bun run check` and `bun run typecheck`

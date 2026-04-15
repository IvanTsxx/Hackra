# Delta for Co-organizer Request System + Home Page Enhancements

## Change: co-organizer-requests

## ADDED Requirements

### Requirement: Co-organizer Request Submission

The system MUST allow authenticated users to submit a request to become co-organizer of a hackathon they do not own.

The request MUST include an optional message field (max 500 characters).

A user who has already submitted a request for a given hackathon CANNOT submit another.

#### Scenario: User requests co-organizer role

- GIVEN an authenticated user is viewing a hackathon detail page
- AND the user is NOT the owner of the hackathon
- AND the user has NO active (PENDING) request for this hackathon
- WHEN the user clicks "Request to Co-organize" and submits the form
- THEN a CoOrganizerRequest record is created with status PENDING
- AND the request includes the optional message if provided

#### Scenario: User cannot double-request

- GIVEN an authenticated user has a PENDING co-organizer request for a hackathon
- WHEN the user attempts to submit another request for the same hackathon
- THEN the system MUST reject the request with an error message
- AND no duplicate record is created

---

### Requirement: Co-organizer Request Editing

The system MUST allow a user to edit their own co-organizer request while it remains PENDING.

The user CANNOT edit the request once it has been ACCEPTED or REJECTED.

#### Scenario: User edits pending request

- GIVEN a user has a PENDING co-organizer request
- WHEN the user opens the edit form and modifies the message
- THEN the request is updated with the new message
- AND the status remains PENDING
- AND the updatedAt timestamp is updated

#### Scenario: User cannot edit accepted request

- GIVEN a user has an ACCEPTED co-organizer request
- WHEN the user attempts to edit the request
- THEN the edit form is not displayed
- OR the system rejects the edit with an error

---

### Requirement: Co-organizer Request Management

The system MUST allow the hackathon owner to view all co-organizer requests for their hackathon.

The owner MUST be able to ACCEPT or REJECT each request.

#### Scenario: Organizer accepts request

- GIVEN the hackathon owner is viewing requests for their hackathon
- AND there is a PENDING request from user X
- WHEN the owner clicks "Accept"
- THEN the request status is set to ACCEPTED
- AND a HackathonOrganizer record is created for user X
- AND user X gains co-organizer permissions for that hackathon

#### Scenario: Organizer rejects request

- GIVEN the hackathon owner is viewing requests for their hackathon
- AND there is a PENDING request from user X
- WHEN the owner clicks "Reject"
- THEN the request status is set to REJECTED
- AND no HackathonOrganizer record is created

---

### Requirement: Co-organizer Permissions

Co-organizers MUST have the following permissions:

- CAN edit their own request (while PENDING)
- CANNOT delete their own request (must ask organizer)
- CANNOT add more co-organizers (owner only)
- CAN send emails to participants (mass + personalized) - UI stub only

#### Scenario: Co-organizer cannot add others

- GIVEN a user is a co-organizer for hackathon H
- WHEN the user attempts to access co-organizer request management UI
- THEN the UI does not show request management features
- OR the system returns an authorization error

#### Scenario: Co-organizer sees email stub

- GIVEN a user is a co-organizer for hackathon H
- WHEN the user navigates to the manage page
- THEN the user sees an "Email Participants" button/tab
- AND clicking it shows a UI stub (not functional for now)

---

### Requirement: Hackathon Detail - Co-organizers Display

The system MUST display co-organizers in the hackathon sidebar, below the organizer section.

Each co-organizer MUST be shown with avatar and username.

#### Scenario: Co-organizers shown in sidebar

- GIVEN a hackathon has co-organizers assigned
- WHEN the hackathon detail page loads
- THEN the sidebar displays a "Co-organizers" section
- AND each co-organizer shows avatar + username
- AND the section appears below the main organizer

---

### Requirement: Home - Upcoming Deadlines Section

The system MUST display a section showing hackathons with upcoming registration deadlines.

The section MUST show hackathons sorted by registration close date (nearest first).

Each entry MUST display the hackathon name, days remaining, and a link.

#### Scenario: Deadlines sorted by date

- GIVEN there are hackathons with registration deadlines
- WHEN the home page loads
- THEN the Upcoming Deadlines section displays the nearest 5-10 hackathons
- AND they are sorted by days remaining (ascending)

#### Scenario: No upcoming deadlines

- GIVEN there are NO hackathons with upcoming deadlines
- WHEN the home page loads
- THEN the section shows a friendly message (e.g., "No upcoming deadlines")

---

### Requirement: Home - Leadership Board

The system MUST display a leadership board showing top users by karmaPoints.

The board MUST show rank, username, avatar, and karma points.

#### Scenario: Top users displayed

- GIVEN there are users with karmaPoints > 0
- WHEN the home page loads
- THEN the Leadership Board shows top 5-10 users
- AND they are sorted by karmaPoints (descending)

---

### Requirement: Home - Countdown Section

The system MUST display a countdown to the next upcoming hackathon (LIVE or UPCOMING status).

The countdown MUST show days, hours, minutes, and seconds.

#### Scenario: Countdown to next event

- GIVEN there is at least one UPCOMING or LIVE hackathon
- WHEN the home page loads
- THEN the Countdown section shows time remaining until the next one starts
- AND the display updates periodically (client-side)

#### Scenario: No upcoming events

- GIVEN there are NO UPCOMING or LIVE hackathons
- WHEN the home page loads
- THEN the Countdown section is hidden or shows "No upcoming events"

---

### Requirement: Home - Karma Section Enhancement

The system SHOULD make the Karma section more prominent and interactive.

If the user is logged in, the section SHOULD display their current karma balance.

#### Scenario: Logged-in user sees their karma

- GIVEN a user is authenticated
- WHEN the user views the home page
- THEN the Karma section displays their current karmaPoints
- AND the display is visually prominent

#### Scenario: Anonymous user sees general karma info

- GIVEN a user is NOT authenticated
- WHEN the user views the home page
- THEN the Karma section shows general information about how karma works
- AND does not display a specific user's karma

---

### Requirement: My-Hackathons UX Enhancement

The system MUST provide clear visual organization with filter tabs for owned vs co-organizing hackathons.

#### Scenario: Tabs differentiate ownership

- GIVEN a user has both owned hackathons and co-organizing hackathons
- WHEN the user views My-Hackathons page
- THEN tabs clearly show "Owned" and "Co-organizing"
- AND each tab filters the list appropriately
- AND the active tab is visually distinguished

---

## MODIFIED Requirements

_(No existing specs to modify - all requirements are NEW additions)_

---

## REMOVED Requirements

_(No requirements being removed)_

---

## Summary

| Domain                  | Type     | Requirements | Scenarios |
| ----------------------- | -------- | ------------ | --------- |
| co-organizer-request    | New      | 3            | 5         |
| co-organizer-management | New      | 2            | 4         |
| home-upcoming-deadlines | New      | 1            | 2         |
| home-leadership-board   | New      | 1            | 1         |
| home-countdown          | New      | 1            | 2         |
| home-karma              | New      | 1            | 2         |
| hackathon-detail        | Modified | 1            | 1         |
| my-hackathons           | Modified | 1            | 1         |

**Total: 11 requirements, 18 scenarios**

### Coverage

- Happy paths: ✅ Covered
- Edge cases: ✅ Covered (duplicate requests, permissions)
- Error states: ✅ Covered (authorization, no data)

import "server-only";

// oxlint-disable sort-keys
/**
 * Cache tags for granular invalidation.
 * Use these with `cacheTag()` inside `use cache` functions.
 */
export const CACHE_TAGS = {
  // Hackathons
  HACKATHONS_LIST: "HACKATHONS_LIST",
  HACKATHON_BY_SLUG: (slug: string) => `HACKATHON-${slug}`,
  FEATURED_HACKATHONS: "FEATURED_HACKATHONS",
  HACKATHON_PRIZES: (hackathonId: string) => `HACKATHON_PRIZES-${hackathonId}`,
  HACKATHON_PARTICIPANTS: (hackathonId: string) =>
    `HACKATHON_PARTICIPANTS-${hackathonId}`,

  // Teams
  TEAMS_LIST: "TEAMS_LIST",
  TEAM_BY_ID: (teamId: string) => `TEAM-${teamId}`,
  TEAMS_BY_HACKATHON: (hackathonId: string) => `TEAMS-${hackathonId}`,

  // Team Applications
  TEAM_APPLICATIONS: (hackathonId: string) =>
    `TEAM_APPLICATIONS-${hackathonId}`,
  APPLICATION_BY_ID: (applicationId: string) => `APPLICATION-${applicationId}`,

  // Users
  USERS_LIST: "USERS_LIST",
  USER_BY_ID: (userId: string) => `USER-${userId}`,
  USER_BY_SLUG: (slug: string) => `USER_SLUG-${slug}`,
  USER_PROFILE: (slug: string) => `USER_PROFILE-${slug}`,

  // Karma/Ratings
  KARMA_BY_USER: (userId: string) => `KARMA-${userId}`,
  KARMA_STATS: "KARMA_STATS",

  // Sponsors
  SPONSORS_LIST: "SPONSORS_LIST",
  SPONSORS_BY_HACKATHON: (hackathonId: string) => `SPONSORS-${hackathonId}`,

  // Organizer
  ORGANIZER_HACKATHONS: (organizerId: string) =>
    `ORGANIZER_HACKATHONS-${organizerId}`,

  // Admin
  ADMIN_ALL_HACKATHONS: "ADMIN_ALL_HACKATHONS",
  ADMIN_HACKATHON_STATS: "ADMIN_HACKATHON_STATS",

  // Home
  HOME_DATA: "HOME_DATA",
} as const;

/**
 * Cache lifetime profiles.
 * Use these with `cacheLife()` inside `use cache` functions.
 *
 * Built-in profiles: 'minutes', 'hours', 'days', 'weeks', 'max'
 */
export const CACHE_LIFE = {
  // Hackathons — public data, changes when organizers update
  HACKATHONS_LIST: "days",
  HACKATHON_BY_SLUG: "days",
  FEATURED_HACKATHONS: "days",
  HACKATHON_PRIZES: "days",
  HACKATHON_PARTICIPANTS: "hours",

  // Teams — change when people join/leave
  TEAMS_LIST: "days",
  TEAM_BY_ID: "days",
  TEAMS_BY_HACKATHON: "days",

  // Applications — user-generated, change frequently
  TEAM_APPLICATIONS: "hours",
  APPLICATION_BY_ID: "hours",

  // Users — profile updates are infrequent
  USERS_LIST: "days",
  USER_BY_ID: "days",
  USER_BY_SLUG: "days",
  USER_PROFILE: "days",

  // Karma — recalculated on interactions
  KARMA_BY_USER: "hours",
  KARMA_STATS: "days",

  // Sponsors — static, rarely change
  SPONSORS_LIST: "weeks",
  SPONSORS_BY_HACKATHON: "weeks",

  // Organizer — changes when they publish/manage
  ORGANIZER_HACKATHONS: "days",

  // Admin — should be fairly fresh but not real-time
  ADMIN_ALL_HACKATHONS: "hours",
  ADMIN_HACKATHON_STATS: "hours",

  // Home — featured content changes periodically
  HOME_DATA: "days",
} as const;

// Type helper: Generate cache tag from a tag key
export type CacheTagKey = keyof typeof CACHE_TAGS;

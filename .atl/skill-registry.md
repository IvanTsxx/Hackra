# Skill Registry — Hackra

This file is **infrastructure** — it's not an SDD artifact. It tells the orchestrator which skills are available for delegation.

**Persistence**: This registry is ALSO saved to Engram. Edits here should be reflected in the Engram version.

---

## Project Skills (`.agents/skills/`)

| Skill                                      | Description                                                                                  | Triggers                                                                   |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `better-auth-best-practices`               | Configure Better Auth server/client, database adapters, sessions, plugins, env vars          | `better-auth`, `betterauth`, `auth.ts`, authentication setup               |
| `better-auth-security-best-practices`      | Rate limiting, CSRF, trusted origins, secure sessions, OAuth token encryption, audit logging | `better-auth security`, `harden auth`, `auth rate limiting`                |
| `create-auth-skill`                        | Scaffold authentication with Better Auth, detect frameworks, configure adapters              | `add auth`, `set up authentication`, `better auth`                         |
| `email-and-password-best-practices`        | Email verification, password reset, password policies, hashing customization                 | `email password auth`, `password reset`, `email verification`              |
| `emil-design-eng`                          | UI polish, component design, animation decisions, invisible details                          | `ui polish`, `design polish`, `animation`, `ux details`                    |
| `find-skills`                              | Discover and install agent skills                                                            | `find skill`, `how do I do X`, `skill for X`                               |
| `next-best-practices`                      | Next.js file conventions, RSC, data patterns, async APIs, metadata, error handling           | `next.js`, `nextjs`, `app router`, `rsc`                                   |
| `next-cache-components`                    | Next.js 16 Cache Components - PPR, use cache, cacheLife, cacheTag                            | `cache`, `ppr`, `cacheTag`, `use cache`                                    |
| `shadcn`                                   | Manage shadcn components — add, search, fix, debug, style, compose                           | `shadcn`, `components`, `ui components`, `--preset`                        |
| `two-factor-authentication-best-practices` | TOTP authenticator, OTP via email/SMS, backup codes, trusted devices, MFA                    | `2fa`, `mfa`, `two-factor`, `authenticator`                                |
| `ultracite`                                | Linting and formatting preset using Oxlint + Oxfmt                                           | `ultracite`, `lint`, `format`, `code quality`, `oxlint`                    |
| `vercel-composition-patterns`              | React composition patterns, compound components, render props, context                       | `composition`, `compound components`, `react patterns`, `context provider` |
| `web-design-guidelines`                    | Web UI review for accessibility, best practices, UX audit                                    | `review ui`, `accessibility`, `audit design`, `ux review`                  |

---

## Global Skills (`~/.config/opencode/skills/`)

| Skill           | Description                                                  | Triggers                                              |
| --------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| `go-testing`    | Go testing patterns, Bubbletea TUI testing                   | `go test`, `testing go`, `bubbletea`                  |
| `sdd-apply`     | Implement tasks from change, write code following specs      | SDD apply phase                                       |
| `sdd-archive`   | Sync delta specs to main, archive completed change           | SDD archive phase                                     |
| `sdd-design`    | Create technical design document with architecture decisions | SDD design phase                                      |
| `sdd-explore`   | Explore and investigate ideas before committing to change    | SDD explore phase                                     |
| `sdd-init`      | Initialize SDD context, detect stack, bootstrap persistence  | `sdd init`, `iniciar sdd`, `openspec init`            |
| `sdd-propose`   | Create change proposal with intent, scope, approach          | SDD propose phase                                     |
| `sdd-spec`      | Write specifications with requirements and scenarios         | SDD spec phase                                        |
| `sdd-tasks`     | Break down change into implementation task checklist         | SDD tasks phase                                       |
| `sdd-verify`    | Validate implementation matches specs, design, tasks         | SDD verify phase                                      |
| `skill-creator` | Create new AI agent skills following Agent Skills spec       | `create skill`, `new skill`, `add agent instructions` |

---

## Project Conventions

| File                              | Description                                                        |
| --------------------------------- | ------------------------------------------------------------------ |
| `AGENTS.md`                       | Ultracite Code Standards — linting, formatting, code quality rules |
| `GEMINI.md`                       | Same as AGENTS.md (duplicate for Gemini compatibility)             |
| `.github/copilot-instructions.md` | Copilot instructions                                               |
| `.claude/CLAUDE.md`               | Claude-specific instructions                                       |

---

## How to Use

When delegating to a sub-agent, always include the resolved skill path:

```
SKILL: Load `{skill-path}` before starting.
```

Example:

```
SKILL: Load `C:/Dev/works/hackra/.agents/skills/next-best-practices/SKILL.md` before starting.
```

---

**Last updated**: 2026-03-30

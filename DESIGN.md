# Design System — Hackra (Vercel-Inspired with Pixel Aesthetic)

## 1. Visual Theme & Atmosphere

Hackra takes Vercel's "invisible infrastructure" philosophy and injects it with a **pixel-art soul**. The result is a borderless, retro-futuristic aesthetic that feels like a terminal brought to life — think "Vercel designed for a hackathon." The interface uses **Geist Pixel** fonts as its primary typeface, creating a consistent monospace/pixel aesthetic throughout. The global `--radius: 0` ensures sharp, crisp edges everywhere — no rounded corners, no softness. This is deliberate: the pixel aesthetic demands precision.

The borderless philosophy is central. Instead of traditional CSS borders, Hackra uses shadow-based effects and custom utilities: `pixel-border` creates a pixelated border effect using box-shadow, `glass` provides ethereal translucent containers, and `glow-green` adds ambient green backlighting. The depth system relies on these layered effects rather than borders.

The color palette is derived from Vercel's achromatic system but with **brand accents** in green and purple. The primary brand green (`#25c2a0` in hex, `oklch(0.72 0.19 145)`) provides the signature glow, while purple (`oklch(0.62 0.19 285)`) serves as a secondary accent. The overall effect is stark black-and-white (or dark mode equivalents) punctuated by these neon-inflected brand colors.

What makes Hackra distinct from Vercel:

- **Geist Pixel fonts** as primary — no Geist Sans, just the monospace pixel variants
- **Borderless by default** — no traditional borders, replaced by shadow utilities
- **Sharp corners** — `--radius: 0` globally, no 6px or 8px radius
- **Brand glow** — green backlight effects (`glow-green`) instead of subtle shadows
- **Pixel grid background** — decorative dot grid pattern for texture
- **Scanline overlays** — CRT-style scanlines for retro atmosphere

**Key Characteristics:**

- Geist Pixel fonts (Grid, Circle, Square, Line, Triangle) — text as terminal output
- Borderless design using `glass`, `pixel-border`, and `glow-green` utilities
- Sharp corners (`--radius: 0`) — no rounded elements
- Brand accent colors: Green (`oklch(0.72 0.19 145)`) and Purple (`oklch(0.62 0.19 285)`)
- Pixel grid background via `.pixel-grid` utility (16px dot pattern)
- Scanline effects via `.scanlines` pseudo-element
- Terminal cursor animation via `.terminal-cursor`
- Selection highlight: green glow on selection (`::selection`)
- Custom scrollbar: minimal 3px thin bars

---

## 2. Color Palette & Roles

### Primary

- **Background Light** (`oklch(1 0 0)`): Pure white, page background in light mode.
- **Background Dark** (`oklch(0.145 0 0)`): Near-black, page background in dark mode.
- **Foreground Light** (`oklch(0.145 0 0)`): Primary text in light mode — not pure black, slight warmth.
- **Foreground Dark** (`oklch(0.985 0 0)`): Primary text in dark mode — near-white.

### Brand Colors

- **Brand Green** (`oklch(0.72 0.19 145)`): Primary brand color — used for CTAs, glows, selection, active states.
- **Brand Purple** (`oklch(0.62 0.19 285)`): Secondary brand color — used for accents, badges, secondary highlights.
- **Brand Dim** (`oklch(0.46 0 0)`): Muted brand color — used for disabled states, subtle text.
- **Brand Glow** (`oklch(0.72 0.19 145 / 0.15)`): Transparent green for glow effects (light mode).
- **Brand Glow Dark** (`oklch(0.72 0.19 145 / 0.1)`): Transparent green for glow effects (dark mode).

### Neutral Scale (Light Mode)

- **Muted** (`oklch(0.97 0 0)`): Secondary backgrounds, subtle surfaces.
- **Muted Foreground** (`oklch(0.556 0 0)`): Secondary text, descriptions.
- **Secondary** (`oklch(0.97 0 0)`): Tertiary backgrounds.
- **Border/Input** (`oklch(0.922 0 0)`): Subtle borders in light mode.
- **Ring** (`oklch(0.708 0 0)`): Focus rings.

### Neutral Scale (Dark Mode)

- **Secondary** (`oklch(0.269 0 0)`): Dark surfaces.
- **Muted** (`oklch(0.269 0 0)`): Darker backgrounds.
- **Muted Foreground** (`oklch(0.708 0 0)`): Muted text in dark mode.
- **Border/Input** (`oklch(1 0 0 / 10%)`): Subtle borders in dark mode.
- **Ring** (`oklch(0.556 0 0)`): Focus rings in dark mode.

### Surface & Effects

- **Glass** (Light: `oklch(1 0 0 / 0.04)`): Translucent card background with blur.
- **Glass Dark** (Dark: `oklch(0 0 0 / 0.35)`): Dark mode glass effect.
- **Selection** (`oklch(0.85 0.15 145 / 0.3)`): Green selection highlight.
- **Scanlines** (`oklch(0 0 0 / 0.03)`): Subtle horizontal lines overlay.
- **Glow Primary** (`oklch(0.85 0.15 145 / 0.3)`): Green glow for primary elements.
- **Glow Green** (`oklch(0.72 0.19 145 / 0.12)`): Ambient green glow.

### Shadows & Depth

- **Pixel Border** (`2px 0 0 0`, `-2px 0 0 0`, `0 2px 0 0`, `0 -2px 0 0`): Pixelated border effect using 4-directional box-shadows.
- **Glow Primary** (`0 0 16px oklch(0.85 0.15 145 / 0.3)`): Direct green glow.
- **Glow Green** (`0 0 40px oklch(0.72 0.19 145 / 0.12)`): Ambient diffuse green glow.

---

## 3. Typography Rules

### Font Family

- **Primary (Pixel)**: `var(--font-geist-pixel-grid)` — the main pixel font, used for all body text, headings, and UI.
- **Alternates**: `GeistPixelCircle`, `GeistPixelSquare`, `GeistPixelLine`, `GeistPixelTriangle` — specialized variants for specific effects.
- **System Fallback**: The font stacks include standard monospace fallbacks.
- **Application**: All text uses pixel fonts — no separate "sans" and "mono" split. The pixel font IS the system.

### Hierarchy

| Role              | Font             | Size           | Weight  | Line Height    | Letter Spacing | Notes                               |
| ----------------- | ---------------- | -------------- | ------- | -------------- | -------------- | ----------------------------------- |
| Display Hero      | Geist Pixel Grid | 48px (3.00rem) | 600     | 1.00–1.17      | normal         | Maximum impact, billboard headlines |
| Section Heading   | Geist Pixel Grid | 40px (2.50rem) | 600     | 1.20           | normal         | Feature section titles              |
| Sub-heading Large | Geist Pixel Grid | 32px (2.00rem) | 600     | 1.25           | normal         | Card headings, sub-sections         |
| Sub-heading       | Geist Pixel Grid | 32px (2.00rem) | 400     | 1.50           | normal         | Lighter sub-headings                |
| Card Title        | Geist Pixel Grid | 24px (1.50rem) | 600     | 1.33           | normal         | Feature cards                       |
| Card Title Light  | Geist Pixel Grid | 24px (1.50rem) | 500     | 1.33           | normal         | Secondary card headings             |
| Body Large        | Geist Pixel Grid | 20px (1.25rem) | 400     | 1.80 (relaxed) | normal         | Introductions, feature descriptions |
| Body              | Geist Pixel Grid | 18px (1.13rem) | 400     | 1.56           | normal         | Standard reading text               |
| Body Small        | Geist Pixel Grid | 16px (1.00rem) | 400     | 1.50           | normal         | Standard UI text                    |
| Body Medium       | Geist Pixel Grid | 16px (1.00rem) | 500     | 1.50           | normal         | Navigation, emphasized text         |
| Body Semibold     | Geist Pixel Grid | 16px (1.00rem) | 600     | 1.50           | normal         | Strong labels, active states        |
| Button / Link     | Geist Pixel Grid | 14px (0.88rem) | 500     | 1.43           | normal         | Buttons, links, captions            |
| Button Small      | Geist Pixel Grid | 14px (0.88rem) | 400     | 1.00 (tight)   | normal         | Compact buttons                     |
| Caption           | Geist Pixel Grid | 12px (0.75rem) | 400–500 | 1.33           | normal         | Metadata, tags                      |
| Micro Badge       | Geist Pixel Grid | 7px (0.44rem)  | 700     | 1.00 (tight)   | normal         | Uppercase, tiny badges              |

### Principles

- **Pixel as identity**: Unlike Vercel's Geist Sans with negative tracking, Hackra uses pixel fonts with normal letter-spacing. The "compressed code" feel comes from the monospace pixel aesthetic itself, not typographic manipulation.
- **Single font system**: No split between "sans" and "mono" — the pixel font handles everything. This creates a unified "terminal" voice across all text.
- **Sharp text**: Global `tracking-widest` (`tracking-widest: 0.16em`) on `h2` and `p` elements adds extra spacing, reinforcing the terminal aesthetic.
- **Weight hierarchy**: Similar to Vercel — 400 (body), 500 (UI), 600 (headings), but applied to pixel fonts.
- **Global font class**: Applied via `font-pixel-grid` class on the `<html>` element, making all text pixel by default.

---

## 4. Component Stylings

### Buttons

**Primary (Green Glow)**

- Background: `oklch(0.72 0.19 145)` (brand green)
- Text: `oklch(0.95 0 0)` (near-white)
- Padding: 8px 16px
- Radius: 0 (sharp corners — no rounding)
- Shadow: `glow-primary` (`0 0 16px oklch(0.85 0.15 145 / 0.3)`)
- Hover: Intensified glow
- Focus: `outline-ring/50`
- Use: Primary CTAs ("Get Started", "Create Hackathon")

**Primary Dark (Vercel-style)**

- Background: `oklch(0.145 0 0)` (dark)
- Text: `oklch(0.985 0 0)` (white)
- Padding: 8px 16px
- Radius: 0
- Use: Secondary CTAs, navigation buttons

**Ghost (Borderless)**

- Background: transparent
- Text: `oklch(0.145 0 0)` (light) / `oklch(0.985 0 0)` (dark)
- Padding: 8px 16px
- Radius: 0
- Border: none — uses subtle text color or hover effects
- Hover: Subtle background or glow effect
- Use: Tertiary actions, links

### Cards & Containers

- Background: `oklch(1 0 0)` (light) / `oklch(0.205 0 0)` (dark)
- Border: **None** — no traditional borders
- Radius: 0 (sharp)
- Effect: `glass` utility for translucent cards — `backdrop-filter: blur(12px)` with subtle border
- Hover: Subtle `glow-green` effect or borderless lift
- Note: No shadow-as-border like Vercel — instead uses glass transparency and glow

### Glass Effect

```
Light: background: oklch(1 0 0 / 0.04), backdrop-filter: blur(12px), border: 1px solid oklch(1 0 0 / 0.08)
Dark: background: oklch(0 0 0 / 0.35), border: 1px solid oklch(1 0 0 / 0.06)
```

### Inputs & Forms

- Background: transparent or subtle surface
- Border: None — rely on subtle background changes
- Focus: Ring via `outline-ring/50`
- Radius: 0
- Note: The borderless approach means form inputs are defined by their internal state, not external borders

### Navigation

- Clean horizontal nav, sticky
- Font: Geist Pixel Grid 14px weight 500
- Links: Dark text in light mode, light text in dark mode
- Active: Bold weight or underline
- Mobile: Hamburger menu collapse
- Borderless: No bottom border — use subtle shadow or none

### Distinctive Components

**Pixel Grid Background**

- Utility class `.pixel-grid`
- Pattern: Radial gradient with 1px dots on `oklch(0.25 0 0)` color
- Size: 16px × 16px grid spacing
- Use: Decorative background on specific sections

**Scanline Overlay**

- Utility class `.scanlines::after`
- Pattern: Repeating horizontal lines at 2px intervals
- Opacity: `oklch(0 0 0 / 0.03)` — subtle
- Use: Retro CRT effect on hero or featured sections

**Terminal Cursor**

- Utility class `.terminal-cursor::after`
- Animation: Blinking underscore (`cursor-blink` keyframes)
- Use: Hero text, active states, loading indicators

**ASCII Corners**

- Utilities `.ascii-corners::before` and `.ascii-corners::after`
- Effect: `[` and `]` brackets as decorative corners
- Use: Card decorations, section dividers

---

## 5. Layout Principles

### Spacing System

- Base unit: 4px (tailwend standard)
- Scale follows standard Tailwind: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 36, 40, 44, 48, 52, 56, 60, 64, etc.
- No special spacing like Vercel's "jump" — standard Tailwind scale

### Grid & Container

- Max content width: Standard containers (max-w configurations)
- Hero: Centered with generous padding
- Feature sections: 2–3 column grids for cards
- Borderless: No full-width dividers with borders — separation comes from spacing and effects

### Whitespace Philosophy

- **Terminal precision**: The pixel aesthetic demands tight, controlled spacing — like code in an editor
- **Glow over shadow**: Instead of Vercel's subtle shadow stacks, Hackra uses green glow effects (`glow-green`) for depth
- **Retro contrast**: Sharp black-white contrast punctuated by green accents

### Border Radius Scale

- **Sharp (0)**: Everything — all components use `--radius: 0`. This is non-negotiable in the pixel aesthetic.
- No rounded corners, no pills, no circles — all edges are razor-sharp.

### Radius Variables (for compatibility)

```css
--radius-sm: calc(var(--radius) * 0.6) /* 0 */
  --radius-md: calc(var(--radius) * 0.8) /* 0 */ --radius-lg: var(--radius)
  /* 0 */ --radius-xl: calc(var(--radius) * 1.4) /* 0 */
  --radius-2xl: calc(var(--radius) * 1.8) /* 0 */
  --radius-3xl: calc(var(--radius) * 2.2) /* 0 */
  --radius-4xl: calc(var(--radius) * 2.6) /* 0 */;
```

---

## 6. Depth & Elevation

| Level           | Treatment                                                      | Use                              |
| --------------- | -------------------------------------------------------------- | -------------------------------- |
| Flat (Level 0)  | No shadow                                                      | Page background, text blocks     |
| Glass (Level 1) | `backdrop-filter: blur(12px)` + transparent bg + subtle border | Cards, modals, overlays          |
| Glow (Level 2)  | `0 0 16px oklch(0.85 0.15 145 / 0.3)`                          | Primary buttons, active states   |
| Ambient Glow    | `0 0 40px oklch(0.72 0.19 145 / 0.12)`                         | Hero sections, featured elements |
| Pixel Border    | 4-directional box-shadow (2px spread)                          | Decorative borders               |
| Focus           | `outline-ring/50`                                              | Keyboard focus on interactive    |

**Depth Philosophy**: Hackra replaces Vercel's multi-layer shadow system with a simpler approach: glass for surfaces, green glow for emphasis. The "glow" is the signature depth cue — rather than Material-style elevation, Hackra uses ambient light. The brand-green glow communicates "active/selected/primary" more than "elevated."

### Decorative Depth

- **Hero glow**: `glow-green` (`0 0 40px oklch(0.72 0.19 145 / 0.12)`) for featured sections
- **Pixel grid**: Optional decorative background via `.pixel-grid`
- **Scanlines**: Optional CRT overlay via `.scanlines`
- **No section borders**: Borderless design — separation via spacing and effects

---

## 7. Do's and Don'ts

### Do

- Use Geist Pixel fonts for ALL text — the pixel aesthetic is the identity
- Use `glass` utility for card/panel containers — translucent with backdrop blur
- Use `glow-green` for primary CTAs and active states — green glow communicates "primary"
- Use `pixel-border` for decorative borders where needed — the 4-shadow technique
- Apply `--radius: 0` — sharp corners are non-negotiable
- Use `tracking-widest` on headings and paragraphs — adds terminal-like spacing
- Use brand green (`oklch(0.72 0.19 145)`) as the primary accent color
- Use brand purple (`oklch(0.62 0.19 285)`) for secondary accents
- Apply `.pixel-grid` background on specific sections for texture
- Use `.scanlines` sparingly on hero or featured elements
- Use `.terminal-cursor` on active/loading states

### Don't

- Don't use rounded corners — `--radius: 0` everywhere
- Don't use traditional CSS borders — use `glass`, `pixel-border`, or no border
- Don't use Vercel's shadow-as-border technique — Hackra uses glass + glow instead
- Don't use Vercel's workflow accent colors (Ship Red, Preview Pink, Develop Blue) — use brand green/purple
- Don't use Geist Sans — use Geist Pixel fonts
- Don't use negative letter-spacing — pixel fonts use normal spacing
- Don't create "pill" buttons or badges — use sharp rectangles
- Don't use heavy shadows — use green glow instead
- Don't use color for hierarchy — use weight, size, and glow effects

---

## 8. Responsive Behavior

### Breakpoints

| Name          | Width       | Key Changes                          |
| ------------- | ----------- | ------------------------------------ |
| Mobile Small  | <400px      | Tight single column, reduced padding |
| Mobile        | 400–600px   | Standard mobile, stacked layout      |
| Tablet Small  | 600–768px   | 2-column grids begin                 |
| Tablet        | 768–1024px  | Full card grids, expanded padding    |
| Desktop Small | 1024–1200px | Standard desktop layout              |
| Desktop       | 1200–1400px | Full layout, maximum content width   |
| Large Desktop | >1400px     | Centered, generous margins           |

### Touch Targets

- Buttons: Standard padding (8px–16px vertical)
- Navigation: Pixel font 14px with adequate spacing
- Mobile menu: Standard toggle pattern

### Collapsing Strategy

- Hero: 48px → scales down proportionally
- Navigation: Horizontal → hamburger menu
- Feature cards: 3-column → 2-column → single column
- Pixel grid background: Remains visible or simplifies
- Section spacing: Standard → reduced on mobile

### Effect Behavior

- Glass effect: Maintains backdrop blur at all sizes
- Glow effects: Scale intensity based on viewport
- Pixel grid: Optional on mobile (performance)
- Scanlines: Hide on mobile (not suitable for small screens)

---

## 9. Quick Reference

### Color Reference

- Primary Background: `oklch(1 0 0)` (light) / `oklch(0.145 0 0)` (dark)
- Primary Text: `oklch(0.145 0 0)` (light) / `oklch(0.985 0 0)` (dark)
- Brand Green: `oklch(0.72 0.19 145)`
- Brand Purple: `oklch(0.62 0.19 285)`
- Glow: `0 0 16px oklch(0.85 0.15 145 / 0.3)`
- Glass: `backdrop-filter: blur(12px)` with transparent bg

### Key Utilities

- `.glass` — translucent card container
- `.glow-green` — ambient green glow
- `.pixel-grid` — dot grid background (16px pattern)
- `.scanlines` — CRT scanline overlay
- `.pixel-border` — 4-shadow pixel border
- `.terminal-cursor` — blinking underscore animation
- `.ascii-corners` — decorative bracket corners
- `tracking-widest` — wide letter-spacing for headings

### Example Component Prompts

- "Create a hero section with pixel font, sharp corners, green CTA button with glow effect. Use glass card for any containers. Add pixel grid background optionally."
- "Design a card: transparent with glass effect, sharp corners, green glow on hover. Title in pixel font 24px weight 600."
- "Build a button: brand green background, sharp corners, glow-primary shadow. Hover intensifies the glow."
- "Create navigation: sticky header, pixel font links, green active state with glow. No borders — rely on subtle effects."
- "Design a section: glass container, pixel grid background, scanlines overlay, green glow accents."

---

## 10. Iteration Guide

1. **Always use pixel fonts** — `font-pixel-grid` is the default, applied globally
2. **No borders** — use `glass` for containers, `glow-green` for emphasis
3. **Sharp corners** — `--radius: 0` everywhere, no rounded anything
4. **Green is primary** — brand green for CTAs, glow, active states
5. **Purple is secondary** — brand purple for accents, badges
6. **Effects are optional** — pixel grid and scanlines add texture but aren't required everywhere
7. **Terminal aesthetic** — tracking-widest on headings, blinking cursor on active states

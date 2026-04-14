# Delta Spec: hackathon-background

## Overview

This specification defines the requirements for the `HackathonBackground` component — a client-side component that extracts the dominant color from a hackathon's cover image and applies it as a subtle, dynamic gradient background. This creates visual identity per hackathon while maintaining content legibility across all themes.

### Why this feature matters

- **Visual distinction**: Each hackathon page gets a unique color palette derived from its own image, reinforcing brand identity
- **Seamless integration**: The gradient is subtle and non-intrusive, preserving readability
- **Theme-aware**: Automatically adapts to dark/light mode without manual intervention
- **Performance**: Client-side extraction avoids server overhead; caching ensures no repeated extraction

---

## 1. UI/UX Specification

### 1.1 Layout Structure

**Component Position:**

- Wraps all page content as a full-viewport background layer
- Positioned behind all content (`z-index: -1`)
- Fixed to viewport, not the page scroll

**DOM Structure:**

```
body
  └── HackathonBackground (client)
      └── <div> (gradient layer, fixed, inset-0)
  └── Page Content (server components)
      └── <header>
      └── <main>
      └── <footer>
```

**CSS Layout:**

- `position: fixed`
- `inset: 0`
- `z-index: -1`
- `pointer-events: none` (non-interactive)

### 1.2 Gradient Specification

**Direction:** Left to right (horizontal)

**Color Stops:**

| Mode  | Start Color | End Color      |
| ----- | ----------- | -------------- |
| Light | `#ffffff`   | Dominant color |
| Dark  | `#000000`   | Dominant color |

**Visual Characteristics:**

- **Opacity**: Start at 100%, end at ~30% (subtle fade)
- **Gradient type**: Linear gradient
- **Angle**: 90deg (left → right)
- **Blur feel**: High blur/diffused — no hard color bands
- **Smoothing**: Use color interpolation to avoid harsh transitions

### 1.3 Color Extraction

**Algorithm:**

- Use dominant color extraction (not palette — single color)
- Technique: client-side canvas sampling or ColorThief-style algorithm
- Fallback: If extraction fails, use brand-green (#22c55e) as default

**Color Processing:**

- Desaturate extracted color by ~40% to avoid aggressive saturation
- Optionally lighten/darken based on theme (darker in light mode, lighter in dark mode)
- Convert to hex/rgb for CSS compatibility

### 1.4 Theme Integration

**Dark Mode Detection:**

- Check `document.documentElement.classList.contains('dark')`
- React to theme changes via `useEffect` listener on class changes
- Immediate switch, no transition delay

**Fallback Behavior:**

- If no image URL provided → transparent background (no gradient)
- If color extraction fails → brand-green (#22c55e) as dominant color

---

## 2. Functionality Specification

### 2.1 Component API

**Props Interface:**

```typescript
interface HackathonBackgroundProps {
  imageUrl: string | null | undefined;
}
```

**Usage:**

```tsx
// In a hackathon detail page (server component)
import { HackathonBackground } from "@/components/hackathon-background";

export default async function HackathonPage({ params }: Props) {
  const hackathon = await getHackathon(params.slug);

  return (
    <>
      <HackathonBackground imageUrl={hackathon.coverImage} />
      <main>...</main>
    </>
  );
}
```

### 2.2 Color Extraction Logic

**Process Flow:**

1. **Image Load**: When `imageUrl` changes, create an off-screen `Image` element
2. **Canvas Sampling**: Draw image to canvas (small dimensions, e.g., 1x1 or 50x50 for performance)
3. **Dominant Color**: Read center pixel or use dominant color algorithm
4. **Color Processing**: Apply desaturation and theme-adjusted luminance
5. **State Update**: Store processed color hex in React state
6. **CSS Apply**: Update gradient via inline style or CSS custom property

**Performance:**

- Debounce extraction to prevent rapid re-extraction on quick image URL changes
- Use `useMemo` to avoid re-extraction on unrelated re-renders
- Limit extraction to run once per image URL (cache the result)

### 2.3 Edge Cases

| Scenario                   | Behavior                            |
| -------------------------- | ----------------------------------- |
| `imageUrl` is `null`       | No gradient, transparent background |
| `imageUrl` is `undefined`  | No gradient, transparent background |
| `imageUrl` is empty string | No gradient, transparent background |
| Image fails to load        | Use fallback color (brand-green)    |
| Image is same as previous  | Skip extraction, use cached color   |
| Theme changes mid-session  | Recalculate theme-adjusted color    |

### 2.4 Accessibility

- Ensure contrast ratio between gradient and text meets WCAG AA (4.5:1 minimum)
- Gradient should not interfere with focus indicators
- `prefers-reduced-motion`: Disable gradient animation if set

---

## 3. Implementation Requirements

### 3.1 File Structure

```
shared/components/
  └── hackathon-background.tsx   # Main component
```

### 3.2 Dependencies

- No external npm packages required — implement color extraction with native Canvas API
- Alternatively, install `colorthief` if canvas implementation is insufficient

### 3.3 Component Structure

```tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface HackathonBackgroundProps {
  imageUrl: string | null | undefined;
}

// Color extraction utilities (internal or separate file)
function extractDominantColor(imageUrl: string): Promise<string>;
function adjustColorForTheme(color: string, isDark: boolean): string;

export function HackathonBackground({ imageUrl }: HackathonBackgroundProps) {
  const [gradient, setGradient] = useState<string>("");
  const [isDark, setIsDark] = useState<boolean>(false);

  // Theme detection
  // Color extraction on imageUrl change
  // Apply gradient via style

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: gradient }}
      aria-hidden="true"
    />
  );
}
```

### 3.4 CSS Integration

The gradient applies via inline styles on the wrapper `div`. Example output:

```css
/* Light mode */
background: linear-gradient(90deg, #ffffff 0%, #6b8f71 100%);

/* Dark mode */
background: linear-gradient(90deg, #000000 0%, #4a6b4f 100%);
```

---

## 4. Acceptance Criteria

### Visual Criteria

- [ ] Gradient renders from left (neutral) to right (dominant color)
- [ ] Gradient is subtle — dominant color appears at ~30% opacity at the right edge
- [ ] No harsh color bands — smooth interpolation between stops
- [ ] Background is behind all content (z-index: -1)
- [ ] Background covers full viewport (fixed, inset-0)

### Theme Criteria

- [ ] Light mode: start color is white (#ffffff)
- [ ] Dark mode: start color is black (#000000)
- [ ] Gradient updates immediately when theme toggles
- [ ] No page reload required for theme switch

### Functional Criteria

- [ ] Component accepts `imageUrl` prop
- [ ] Extracted color is dominant color from image (not random pixel)
- [ ] Extraction fails gracefully → fallback to brand-green (#22c55e)
- [ ] No gradient renders when `imageUrl` is falsy
- [ ] Same image URL does not trigger re-extraction (cached)

### Performance Criteria

- [ ] No layout shift when gradient loads
- [ ] Color extraction completes within 500ms
- [ ] No console errors during extraction
- [ ] Memory cleaned up after extraction (canvas removed)

### Accessibility Criteria

- [ ] Text remains readable over gradient (sufficient contrast)
- [ ] Gradient does not interfere with keyboard navigation
- [ ] Works with `prefers-reduced-motion` (no animation)

---

## 5. Non-Functional Requirements

- **Bundle size**: Minimal — no heavy dependencies
- **SSR compatibility**: Component renders nothing on server (client-only)
- **Browser support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Testability**: Extract color logic into pure functions for unit testing

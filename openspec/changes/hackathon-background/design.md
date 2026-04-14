# Design: Dynamic Background (hackathon-background)

## Technical Approach

The implementation uses a client-side component that wraps hackathon pages, extracts the dominant color from the cover image via Canvas API, and applies a subtle horizontal gradient (left→right). No external dependencies—native Canvas API handles color extraction. The gradient uses CSS custom properties for dynamic theming.

## Architecture Decisions

### Decision: Color Extraction Method

**Choice**: Native Canvas API with center-weighted sampling (50×50px canvas, average of center pixels)
**Alternatives considered**: `colorthief` npm package, random pixel sampling
**Rationale**:

- No additional bundle size (~2KB savings)
- Canvas API is universally supported and fast
- 50×50 sampling provides sufficient accuracy without performance cost
- Center-weighted avoids edge artifacts in poorly-framed images

### Decision: Color Processing Pipeline

**Choice**: Desaturate ~40% + apply theme-aware luminance adjustment
**Alternatives considered**: Use raw extracted color, apply opacity only
**Rationale**: Raw dominant colors are often too saturated for backgrounds. The 40% desaturation ensures the gradient feels "subtle" per spec, not harsh. Theme-aware luminance (darker in light mode, lighter in dark mode) ensures text legibility.

### Decision: CSS Integration

**Choice**: CSS custom properties (`--gradient-color`) with inline style on fixed `div`
**Alternatives considered**: Tailwind classes with dynamic values, pure CSS gradients
**Rationale**:

- CSS custom properties work seamlessly with Tailwind CSS 4 `@theme` system
- Inline style on the `div` avoids Tailwind class parsing issues (the bug from #202)
- Fixed positioning with `z-index: -1` ensures background stays behind all content

### Decision: Theme Detection

**Choice**: `next-themes` `useTheme()` hook with `useEffect` listener on class changes
**Alternatives considered**: `document.documentElement.classList.contains('dark')` direct check
**Rationale**: The project already uses `next-themes` (`theme-provider.tsx`). Using the existing `useTheme()` hook provides consistency and ensures the component reacts to theme changes without manual DOM observation.

## Data Flow

```
Server Component (page.tsx)
         │
         ▼
    ┌────────────┐
    │  Props:    │
    │ imageUrl   │
    └─────┬──────┘
          │
          ▼
┌─────────────────────────┐
│ HackathonBackground    │
│ (client component)     │
├─────────────────────────┤
│ 1. Check imageUrl      │
│    (falsy → return    │
│    null)               │
│                        │
│ 2. UseEffect:          │
│    - Load Image        │
│    - Draw to Canvas    │
│    - Extract color    │
│    - Process (desat)   │
│    - Set gradient     │
│                        │
│ 3. UseEffect:          │
│    - Listen theme     │
│    - Adjust color     │
│    - Update gradient  │
└────────────┬───────────┘
            │
            ▼
    <div className="fixed inset-0 -z-10 pointer-events-none"
         style={{ background: gradient }} />
```

## File Changes

| File                                         | Action | Description                                          |
| -------------------------------------------- | ------ | ---------------------------------------------------- |
| `shared/components/hackathon-background.tsx` | Create | Main component with color extraction logic           |
| `app/(public)/hackathon/[slug]/page.tsx`     | Modify | Add `<HackathonBackground>` wrapper, pass `imageUrl` |

### Component Interface

```typescript
interface HackathonBackgroundProps {
  imageUrl: string | null | undefined;
}
```

### Page Integration

```tsx
// app/(public)/hackathon/[slug]/page.tsx
import { HackathonBackground } from "@/components/hackathon-background";

// In the page component, after getting hackathon data:
const hasImage = hackathon.image && !hackathon.image.includes("/placeholder");

return (
  <>
    {hasImage && <HackathonBackground imageUrl={hackathon.image} />}
    <main className="px-2 lg:px-6 py-20 bg-background">
      {/* existing page content */}
    </main>
  </>
);
```

## Gradient CSS Specification

The gradient applies via inline style:

```css
/* Light mode */
background: linear-gradient(90deg, #ffffff 0%, var(--gradient-color) 100%);
/* Dark mode */
background: linear-gradient(90deg, #000000 0%, var(--gradient-color) 100%);
```

- `linear-gradient(90deg, ...)` = horizontal left→right
- Start color: `#ffffff` (light) or `#000000` (dark)
- End color: processed dominant color (~30% opacity feel via desaturation)

## Testing Strategy

| Layer       | What to Test                  | Approach                                    |
| ----------- | ----------------------------- | ------------------------------------------- |
| Unit        | Color extraction (Canvas API) | Test with known images, verify hex output   |
| Unit        | Desaturation algorithm        | Test with saturated/gray colors             |
| Unit        | Theme adjustment              | Test light/dark mode outputs                |
| Integration | Component renders             | Render with imageUrl, verify gradient set   |
| Integration | Fallback behavior             | Render without imageUrl, verify no gradient |

**Note**: No E2E for this component—visual verification via code review + manual testing against acceptance criteria.

## Migration / Rollout

No migration required. This is a new component that wraps existing pages. Rollout is immediate upon deployment.

## Open Questions

- [ ] **CORS**: Images from external URLs (e.g., Luma, other hackathon platforms) may have CORS restrictions when drawn to Canvas. Need to test with real external images. If fails, fallback to transparent.
- [ ] **Performance**: First-time extraction on page load may cause slight delay. Consider preloading image or using `next/image` priority. Currently <500ms target per spec.

## Acceptance Criteria Alignment

| Spec Item               | Implementation                                            |
| ----------------------- | --------------------------------------------------------- |
| Gradient left→right     | `linear-gradient(90deg, ...)`                             |
| Light mode: white→color | Inline style with `#ffffff` start in light mode           |
| Dark mode: black→color  | Inline style with `#000000` start in dark mode            |
| ~40% desaturation       | Color processing function applies 0.4 desaturation        |
| ~30% opacity feel       | Achieved via desaturation (not opacity) to avoid layering |
| Fallback: transparent   | `if (!imageUrl) return null`                              |
| z-index: -1             | `className="fixed inset-0 -z-10 pointer-events-none"`     |
| Theme-aware             | `useTheme()` hook + useEffect listener                    |

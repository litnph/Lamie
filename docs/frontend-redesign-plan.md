# Lamie frontend design-system proposal

## Design read

Reading this as an editorial flower-commerce experience for design-conscious customers in Ho Chi Minh City, with a calm botanical, modern-minimal, and lightly vintage visual language. The system should feel composed by a florist rather than assembled from a generic storefront template.

This is a targeted evolution of the existing identity. It preserves Lamie's wordmark, cream and mocha foundation, serif-led voice, photography, page structure, business logic, API contracts, routing model, navigation labels, and section IDs.

## Design dials

| Dial | Value | Effect |
| --- | ---: | --- |
| `DESIGN_VARIANCE` | 6 | Controlled asymmetry, varied image crops, editorial alignment, and occasional overlap without harming shopping clarity. |
| `MOTION_INTENSITY` | 4 | Quiet entrances and tactile feedback. No cinematic scroll hijacking or decorative motion without purpose. |
| `VISUAL_DENSITY` | 5 | Comfortable product browsing with moderate information density. Marketing sections breathe; commerce and account views stay efficient. |

## Direction principles

1. **Flowers lead.** Photography carries emotion and color. UI chrome stays quiet.
2. **Editorial, not ornamental.** Use asymmetry, type scale, cropping, and whitespace instead of decorative badges or excessive cards.
3. **Warm, not sepia.** Keep the established cream and mocha identity, but introduce a botanical neutral and a restrained dried-rose accent to avoid a generic beige luxury palette.
4. **Serif with discipline.** Lamie's existing serif identity is justified by its poetic and vintage positioning. Serif is reserved for display and product naming; operational UI uses the body face.
5. **Commerce remains obvious.** Price, availability, quantity, primary action, validation, and state feedback always outrank decoration.
6. **One light theme.** The public experience stays light and continuous. The dark footer is replaced by a deeper tone in the same botanical palette, not treated as a separate theme.

## Token architecture

Define semantic CSS variables in a single global layer, then map the existing Tailwind names to them during implementation. Components should consume semantic roles such as `--color-text-primary`, not raw palette steps.

```css
:root {
  color-scheme: light;

  /* Primitive color palette */
  --lamie-paper-0: #fffefa;
  --lamie-paper-50: #fbfaf5;
  --lamie-paper-100: #f5f2e9;
  --lamie-paper-200: #e9e3d8;
  --lamie-stem-300: #a9ad99;
  --lamie-stem-500: #747a67;
  --lamie-stem-700: #4d5447;
  --lamie-mocha-300: #988b82;
  --lamie-mocha-500: #74645a;
  --lamie-mocha-700: #55463e;
  --lamie-mocha-900: #342b27;
  --lamie-rose-100: #f1dfdf;
  --lamie-rose-500: #a45f64;
  --lamie-rose-700: #7d4248;

  /* Semantic surfaces */
  --color-canvas: var(--lamie-paper-50);
  --color-surface: var(--lamie-paper-0);
  --color-surface-subtle: var(--lamie-paper-100);
  --color-surface-strong: var(--lamie-stem-700);
  --color-overlay: rgb(52 43 39 / 0.78);

  /* Semantic text */
  --color-text-primary: var(--lamie-mocha-900);
  --color-text-secondary: var(--lamie-mocha-700);
  --color-text-muted: var(--lamie-mocha-500);
  --color-text-on-strong: var(--lamie-paper-0);
  --color-text-accent: var(--lamie-rose-700);

  /* Borders and actions */
  --color-border-subtle: var(--lamie-paper-200);
  --color-border-strong: var(--lamie-mocha-500);
  --color-action-primary: var(--lamie-mocha-900);
  --color-action-primary-hover: #443833;
  --color-action-accent: var(--lamie-rose-700);
  --color-focus: var(--lamie-rose-500);

  /* Feedback */
  --color-success-bg: #e5ece3;
  --color-success-text: #35533a;
  --color-warning-bg: #f4ead2;
  --color-warning-text: #6c531f;
  --color-danger-bg: #f4dede;
  --color-danger-text: #7b3439;
  --color-info-bg: #e3e8e2;
  --color-info-text: #405246;
}
```

### Color usage rules

- Use rose as the single expressive accent. It may indicate focus, selected editorial details, and occasional calls to action, but not every interactive element.
- Primary commerce actions remain mocha for maximum continuity and contrast.
- Stem colors support delivery, freshness, and status messaging. They must not become a competing CTA color.
- Body text must use `--color-text-secondary` or darker. Muted text is limited to metadata at 14px or larger.
- Verify every foreground/background pair to WCAG AA. Target 4.5:1 for normal text and 3:1 for large text and interface boundaries.
- Do not place text directly on busy flower photography without a tested solid or gradient scrim.

## Typography

### Font roles

- **Display and product voice:** Playfair Display. Retain it because it is already part of Lamie's identity and suits the poetic vintage positioning.
- **Body and interface:** Zen Old Mincho initially, to avoid an identity-changing font migration. During implementation, test Vietnamese diacritics, small-size legibility, and loading. If it fails, replace only the body role with a Vietnamese-capable humanist sans after approval.
- **Decorative alternate:** Cormorant Garamond should not act as a third general-purpose family. Reserve it for the wordmark or one controlled editorial treatment, then remove it elsewhere.
- **Numbers:** inherit the body face with `font-variant-numeric: tabular-nums lining-nums` for prices, order IDs, quantities, and metrics.

### Type tokens

```css
:root {
  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "Zen Old Mincho", "Noto Serif", serif;

  --text-display-xl: clamp(3.5rem, 7vw, 6.75rem);
  --text-display-lg: clamp(2.75rem, 5vw, 5rem);
  --text-heading-1: clamp(2.25rem, 4vw, 3.75rem);
  --text-heading-2: clamp(1.875rem, 3vw, 2.75rem);
  --text-heading-3: clamp(1.375rem, 2vw, 1.75rem);
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-label: 0.75rem;
  --text-caption: 0.6875rem;

  --leading-display: 0.98;
  --leading-heading: 1.12;
  --leading-body: 1.65;
  --leading-compact: 1.35;

  --tracking-display: -0.035em;
  --tracking-heading: -0.02em;
  --tracking-body: 0;
  --tracking-label: 0.09em;
}
```

### Hierarchy rules

- Limit the hero heading to two visual lines. Mobile starts near 56px, not the current fixed 72px treatment.
- Display italic text uses at least `line-height: 1.1` and bottom clearance so descenders are not clipped.
- Section headings use sentence case. Uppercase tracked labels are limited to roughly one per three sections.
- Body paragraphs cap at `65ch`; prominent introductions cap at `48ch`.
- Product prices receive stronger contrast and tabular figures, but should remain visually below the product name.
- Avoid text below 12px for functional UI. Reserve 11px only for nonessential captions with sufficient contrast.

## Spacing

Use a 4px base with a deliberately smaller set of named stops. Components should choose semantic space tokens rather than arbitrary values.

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;

  --space-page-x: clamp(1rem, 4vw, 3rem);
  --space-section-y: clamp(4.5rem, 9vw, 8rem);
  --space-section-y-compact: clamp(3rem, 6vw, 5rem);
  --space-grid: clamp(1rem, 2.5vw, 2.5rem);
}
```

### Spacing rules

- Marketing sections use optical spacing: slightly less above the headline group and slightly more below the final content.
- Dense account and form surfaces use `--space-section-y-compact`.
- Adjacent heading, description, and action groups follow 12px, 20px, and 32px intervals.
- Touch targets remain at least 44 by 44px even when their visual glyph is smaller.

## Shape system

Use one documented soft-radius hierarchy. Pills are reserved for true compact controls such as language selection and filter chips.

```css
:root {
  --radius-xs: 0.25rem;
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-pill: 999px;
}
```

- Inputs and compact controls: `--radius-sm`.
- Buttons: `--radius-sm`, not automatic pills.
- Product imagery and cards: `--radius-md`.
- Feature imagery, dialogs, and composed empty states: `--radius-lg`.
- Hero photography may use `--radius-xl` when the crop benefits from softness.
- Status indicators and language/filter controls may use `--radius-pill`.

## Shadows and elevation

Most grouping should use spacing, surface change, or a single border. Shadows are reserved for floating navigation, dialogs, chat, and imagery that intentionally overlaps another plane.

```css
:root {
  --shadow-xs: 0 1px 2px rgb(85 70 62 / 0.08);
  --shadow-sm: 0 6px 18px rgb(85 70 62 / 0.09);
  --shadow-md: 0 16px 40px rgb(85 70 62 / 0.12);
  --shadow-lg: 0 28px 72px rgb(52 43 39 / 0.18);
  --shadow-focus: 0 0 0 3px rgb(164 95 100 / 0.28);
}
```

- Do not combine a heavy border and a large shadow on the same card.
- Keep the implied light source above and slightly left.
- Product grids should remain largely shadowless. Hover uses image treatment and text color, not levitation.

## Containers and layout grid

```css
:root {
  --container-reading: 42rem;
  --container-form: 36rem;
  --container-content: 75rem;
  --container-wide: 87.5rem;
  --container-bleed: 100rem;
}
```

- Default page content: `min(var(--container-content), 100% - 2 * var(--space-page-x))`.
- Image-led home sections may use `--container-wide`.
- Marquee and gallery media may bleed toward `--container-bleed`, while headings stay on the content grid.
- Forms use `--container-form`; prose uses `--container-reading`.
- Desktop grid: 12 columns with `--space-grid` gutters.
- Tablet grid: 8 columns.
- Mobile grid: 4 columns with 16px page gutters.
- Use asymmetry at variance 6 through 5/7 or 7/5 column splits, offset image baselines, and occasional controlled overlap. Do not repeat the same split layout in consecutive sections.

## Responsive breakpoints

Retain familiar Tailwind-compatible breakpoints so the proposal can be adopted incrementally.

| Token | Width | Purpose |
| --- | ---: | --- |
| `xs` | 360px | Guard very narrow phones and chat/product controls. |
| `sm` | 640px | Two-column supporting layouts and larger gutters. |
| `md` | 768px | Mobile navigation transition; editorial splits begin selectively. |
| `lg` | 1024px | Full product-detail split and four-column product grid. |
| `xl` | 1280px | 12-column compositions and full account layout. |
| `2xl` | 1536px | Wider breathing room without enlarging readable text measures. |

### Responsive behavior

- Hero uses `min-height: 100dvh`, never `100vh`, and keeps its CTA visible without scrolling on common laptop heights.
- Product grid is one column below 400px, two columns through tablet, and four columns at `lg`.
- Product detail stacks gallery before summary below `lg`; the action area becomes a stable full-width block.
- Account tables become order cards below `md`, rather than relying only on horizontal scrolling.
- Chat width is `min(24rem, calc(100vw - 2rem))` and respects safe-area insets.
- Mobile overlays lock body scroll and provide explicit close, Escape, and focus behavior.

## Interaction states

Every interactive component must define the complete state set below.

### Universal states

- **Rest:** clear affordance and AA contrast.
- **Hover:** color or surface shift plus optional 1 to 2 percent image scale. Never rely on hover to reveal essential information.
- **Focus-visible:** 2px focus outline with 2px offset using `--color-focus`; never remove it without replacement.
- **Active:** `transform: translateY(1px)` or `scale(0.98)` for tactile feedback lasting no more than 120ms.
- **Disabled:** reduced contrast while retaining readable labels, `not-allowed` cursor, and no hover/active motion.
- **Loading:** preserve dimensions, use skeletons for page content and inline progress language for actions.
- **Success:** concise confirmation near the affected element. Do not rely on color alone.
- **Error:** direct message, cause when known, and recovery action. Forms connect errors with `aria-describedby`.
- **Empty:** explain what is absent and offer one relevant next step.

### Component-specific behavior

- Buttons must not wrap at desktop widths and must maintain at least 44px height.
- Product cards become semantic links or buttons with one focus target. Entire card activation must work by keyboard.
- Filters expose selected state with `aria-pressed` or `aria-current`; product counts update visibly.
- Icon buttons receive accessible names and tooltips only when the icon is not self-explanatory.
- Lightbox and mobile navigation use dialog semantics, focus trapping, Escape handling, and focus restoration.
- Quantity controls announce the current value and enforce valid minimum/maximum states.
- Forms use persistent labels. Placeholder text is supportive, never the only label.

## Motion principles

Motion intensity 4 means animation supports orientation, hierarchy, and feedback. It does not become the subject.

```css
:root {
  --duration-instant: 100ms;
  --duration-fast: 180ms;
  --duration-base: 260ms;
  --duration-slow: 420ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- Entry reveals use opacity plus no more than 16px vertical movement over 320 to 420ms.
- Staggers are limited to 40 to 70ms and at most five siblings.
- Buttons and navigation use 180 to 260ms transitions.
- Product image hover may scale to at most 1.035 over 420ms. The current 1.10 scale is too aggressive.
- Use transform and opacity only for continuous animation.
- Keep at most one marquee on a page. It must pause on hover and keyboard focus, and stop under reduced motion.
- Remove perpetual floating decoration unless it communicates freshness or focus. Static botanical composition is preferred.
- Lightbox, drawer, and chat transitions explain spatial origin. They should not share the general page-entry animation.
- Do not add GSAP or Motion during the foundational refactor. Native CSS and the existing IntersectionObserver are sufficient at this intensity.

## Component hierarchy

The hierarchy separates tokens, primitives, patterns, domain components, and page compositions. Business behavior stays in existing features and services.

```text
Design foundations
  Color, typography, spacing, shape, elevation, motion, breakpoints

Primitives
  Button
  IconButton
  Link
  TextField
  TextArea
  Select
  Checkbox
  Divider
  ResponsiveImage
  VisuallyHidden
  FocusRing

Feedback primitives
  Skeleton
  InlineMessage
  StatusBadge
  EmptyState
  ErrorState
  ProgressText

Layout primitives
  PageContainer
  Section
  Stack
  Cluster
  Grid
  Bleed
  AspectMedia

Composite patterns
  Header
  MobileNavigationDialog
  Footer
  PageIntro
  SectionHeading
  FormField
  Dialog
  Lightbox
  ResponsiveDataList
  ContactForm

Commerce components
  ProductCard
  ProductGrid
  ProductFilters
  ProductGallery
  ProductSummary
  QuantityStepper
  AddToCartAction
  OrderSummary

Account components
  AccountHeader
  AccountNavigation
  MetricGroup
  OrderList
  OrderStatus

Support components
  ChatLauncher
  ChatPanel
  MessageBubble
  MessageComposer

Page compositions
  Home
  Shop
  ProductDetail
  Login
  Member
```

### Consolidation rules

- Keep one canonical `Button`, `FadeIn`, `Section`, Header, Footer, logo, and icon source.
- Components own appearance and interaction states; pages own composition and content.
- Domain components receive existing product and callback contracts unchanged.
- Avoid a universal `Card`. Create named components only when the grouping has a real semantic purpose.
- Keep admin/data-table work separate from this editorial system. It may consume foundations and primitives, but needs a denser product-interface treatment if restored.

## Page composition guidance

### Home

- Retain the asymmetric image-and-copy hero, but constrain it to four text elements: identity line, two-line headline, short description, and CTA group.
- Alternate layout families: split hero, editorial story, product grid, image-led gallery, compact service proof, and focused contact form.
- Remove the repeated three-equal-card treatment from service proof. Use an editorial numbered or icon-supported horizontal composition with dividers.
- Keep one gallery marquee only if it becomes controllable and accessible; otherwise use an asymmetric static mosaic.

### Shop

- Use a left-aligned page intro and compact filter rail instead of centering every element.
- Keep product imagery dominant and cards shadowless.
- Provide loading, filter-empty, fetch-error, and result-count states.

### Product detail

- Use a 7/5 media-to-summary split on large screens.
- Keep name, price, description, quantity, primary action, and fulfillment note in a strict purchase hierarchy.
- Gallery motion remains spatial but subdued; one-image products become a stable single-image layout.

### Login and contact

- Use persistent labels, visible validation, and restrained surfaces.
- Avoid large glass cards. A solid paper surface with a subtle border is more consistent with the tactile brand.

### Member

- Apply the foundations but prioritize efficient account patterns over editorial novelty.
- Replace generic metric cards with a grouped metric strip or definition list.
- Use responsive order cards below `md` and retain a table only where it is readable.

## Accessibility and quality gates

- WCAG AA contrast for text, fields, controls, and focus indicators.
- Keyboard reachability and visible focus for every action.
- Reduced-motion behavior for every nonessential animation.
- Meaningful image alt text; duplicated decorative gallery images use empty alt text intentionally and are hidden from assistive technology.
- Dialog focus management and body-scroll locking.
- Loading, empty, error, disabled, and success states included in component acceptance criteria.
- Vietnamese and English glyph coverage verified for every font weight.
- Target LCP below 2.5s, INP below 200ms, and CLS below 0.1.
- Self-host fonts with `font-display: swap` when the styling infrastructure is modernized.

## Token adoption strategy

1. Add semantic CSS variables without removing current Tailwind names.
2. Map `cream` and `mocha` utilities to the new primitives for gradual adoption.
3. Consolidate duplicate foundations and primitives.
4. Apply typography, focus, spacing, and motion tokens first.
5. Add complete state components.
6. Refactor responsive page compositions in the audit's recommended order.
7. Validate contrast, keyboard behavior, motion preferences, and build output after each page.

## Explicit non-goals

- No routing migration.
- No API or product data contract changes.
- No cart, authentication, or admin feature invention.
- No generic SaaS component library.
- No dark-mode toggle in this phase.
- No new animation dependency.
- No logo or wordmark replacement.
- No silent copy, form-order, navigation-label, or section-ID changes.

## Proposal acceptance checklist

- The cream and mocha identity remains recognizable, with rose used as one restrained accent.
- Display serif usage is intentional and body/UI typography remains legible in Vietnamese and English.
- One consistent shape system replaces arbitrary radii.
- Every component supports keyboard, focus, disabled, loading, error, empty, and success behavior where applicable.
- Mobile behavior is explicit for hero, grid, product detail, account orders, overlays, and chat.
- Motion has a functional reason and respects reduced-motion preferences.
- Product imagery remains the dominant expressive material.
- Existing business logic, API contracts, routing, primary navigation, and section anchors remain unchanged.

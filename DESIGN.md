---
name: Lamie Storefront
description: A warm botanical editorial system for calm flower discovery and clear contact journeys.
colors:
  paper: "#f3ebdd"
  paper-light: "#fbf8f2"
  paper-deep: "#e7dcc9"
  ink: "#38271f"
  mocha: "#6b3a23"
  mocha-soft: "#805c48"
  sage: "#697561"
  sage-light: "#cbd2c2"
  rose: "#b77f80"
  rose-light: "#ead2d0"
  line: "#cbbca8"
  line-dark: "#9c806d"
  focus: "#8f4850"
typography:
  display:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "clamp(3.1rem, 6.6vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "clamp(2.6rem, 5vw, 5.4rem)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.04em"
rounded:
  sm: "0.375rem"
  md: "0.75rem"
  lg: "1rem"
spacing:
  page-x: "clamp(1rem, 4vw, 4rem)"
  section-y: "clamp(6rem, 11vw, 11rem)"
  control-y: "0.78rem"
  control-x: "1.15rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-light}"
    rounded: "{rounded.sm}"
    padding: "0.78rem 1.15rem"
    height: "2.875rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.78rem 1.15rem"
    height: "2.875rem"
  input:
    backgroundColor: "#fffdf8"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 0.8rem"
    height: "2.8rem"
---

# Design System: Lamie Storefront

## Overview

**Creative North Star: "Botanical Paper Editorial"**

Lamie feels like a quiet florist's lookbook assembled from warm paper, botanical color fields, restrained typography and real flower imagery. The system is gentle without becoming vague: high-contrast ink, explicit states and practical contact actions keep every journey legible.

Editorial scale and asymmetry create personality on storytelling surfaces; catalog and detail views become calmer, denser galleries. Decorative depth comes from paper layers, hairline rules and occasional photographic overlap rather than generic floating cards.

**Key Characteristics:**

- Warm paper canvases with ink-brown type.
- Lora headlines paired with precise Be Vietnam Pro UI copy.
- Broad editorial rhythm on Home; compact task rhythm in catalog.
- Dusty rose and botanical sage used as supporting fields, not competing accents.
- Motion is selective, transform-based and fully removed for reduced-motion users.

## Colors

The palette stays earthy and low-saturation so flower photography carries the brightest color.

### Primary

- **Ink Brown:** primary text, dark sections and high-emphasis actions.
- **Lamie Mocha:** contact sections and primary hover state.

### Secondary

- **Botanical Sage / Light Sage:** calm delivery, process and paper-layer accents.
- **Dusty Rose / Blush Paper:** warm selected states and alternating editorial fields.

### Neutral

- **Paper Cream / Light Paper / Deep Paper:** canvas, raised reading surfaces and recessed fields.
- **Soft Mocha:** secondary copy and metadata.
- **Paper Line / Dark Paper Line:** separators, input strokes and gapless grid seams.
- **Focus Berry:** the single keyboard-focus outline color.

**The Flower Leads Rule.** UI colors remain muted; saturated hues belong to approved product photography.

**The Ink Is Scarce Rule.** Full ink backgrounds mark major narrative or conversion moments, not every container.

## Typography

**Display Font:** Lora with Georgia fallback  
**Body Font:** Be Vietnam Pro with system UI fallback

**Character:** Lora supplies crafted, literary warmth; Be Vietnam Pro keeps Vietnamese interface copy compact and unambiguous.

### Hierarchy

- **Display:** medium-weight Lora with tight leading and tracking; use for hero statements only.
- **Headline:** medium-weight Lora for section and page headings, normally balanced across two or three lines.
- **Title:** Lora for product names and editorial card titles; never fake emphasis with all caps.
- **Body:** regular Be Vietnam Pro with generous line height; keep long passages near 60–65 characters per line.
- **Label:** compact semibold Be Vietnam Pro with restrained tracking; use for genuine status, metadata and controls.

**The Wide Headline Rule.** Prefer a broad two- or three-line editorial composition over a narrow stack of many short lines.

**The Honest Label Rule.** Labels describe state or source; they are not decorative eyebrow copy.

## Layout

The wide container tops out at 90rem, the reading/content container at 76rem, and page gutters expand fluidly. Home uses asymmetric 12-column compositions and large vertical intervals. Catalog uses a sidebar plus gallery at desktop, two columns at tablet and mobile, with the filter moving into a bottom sheet below desktop.

The principal responsive boundaries are 1199px, 1023px, 767px and 389px. At 767px and below, storytelling grids collapse to one column, controls remain at least 44px tall, the hero message precedes its image and the detail contact dock appears only after the product title has been read. Section spacing is intentionally generous; internal control spacing remains compact.

## Elevation & Depth

The system is flat by default. Depth comes first from tonal paper layering, 1px rules, overlap and small rotations. A soft ambient shadow is reserved for hero/story photography; the stronger shadow belongs to modal dialogs and lightboxes. Product cards do not float as generic white tiles.

**The Tonal-First Rule.** Try a paper shade or rule before adding a shadow.

**The Transform-Only Motion Rule.** Animate opacity and transforms; never animate layout dimensions.

## Shapes

Corners are gently curved, not pill-heavy: 0.375rem for controls and badges, 0.75rem for dialogs and 1rem for mobile sheets. Full pills are limited to filter chips and compact count badges where the capsule conveys grouping. Editorial image frames may rotate slightly, but task surfaces remain aligned to the grid.

Hairline borders provide most grouping. Avoid nested rounded containers and avoid gradients as a component treatment; the faint paper texture on the global canvas is atmospheric, not a call-to-action effect.

## Components

### Buttons

- **Shape:** compact rectangular control with gentle corners and a 2.875rem minimum height.
- **Primary:** ink surface with light-paper text; hover shifts to mocha and active state moves down by one pixel.
- **Outline:** transparent paper surface with a dark paper-line border; hover strengthens the border.
- **Text:** square-cornered, low-padding action with an underlined bottom edge.
- **Focus:** the global two-pixel Focus Berry outline with a three-pixel offset.

### Chips

- **Style:** light-paper capsule with a quiet line border and compact label type.
- **State:** selected state is communicated by content/count and stronger ink contrast; chips remain removable buttons.

### Cards / Containers

- **Product cards:** image-first, borderless and flat; metadata aligns below the image.
- **Occasion cards:** a gapless bento grid whose 1px seams provide structure.
- **Process cards:** square editorial sheets with alternating paper, blush and sage fields; sequence numbers are meaningful here.

### Inputs / Fields

- **Style:** warm near-white fill, dark paper-line stroke, small corner radius and at least 2.8rem height.
- **Focus:** the global visible outline; hover shifts the border toward mocha.
- **Placeholder:** secondary but still readable; never use placeholder text as the only label.

### Navigation

Desktop navigation is quiet body type with an animated underline and a single contact action. Mobile navigation uses a compact menu trigger and full-width, rule-separated links inside an accessible dialog. The sticky header may change height discretely; it does not animate layout.

### Contact Chooser

The contact dialog collects optional context locally, summarizes it, then offers real channels. It never implies that a form was submitted, and it always provides hotline/copy fallbacks.

## Do's and Don'ts

### Do:

- **Do** let approved flower photography be the strongest chromatic element.
- **Do** keep desktop hero headings to two lines and mobile hero headings to three or fewer.
- **Do** use paper rules and negative space to group information.
- **Do** preserve visible focus, reduced motion and truthful demo/source labels.
- **Do** keep task-heavy catalog views denser than narrative Home sections.

### Don't:

- **Don't** introduce gradients, glass cards, excessive pills or card-inside-card layouts.
- **Don't** animate width, height, margin or padding.
- **Don't** add testimonials, prices, delivery promises or policies without approved source data.
- **Don't** use decorative section numbers where there is no real sequence.
- **Don't** let a sticky control cover a heading, focus target or the end of the page.

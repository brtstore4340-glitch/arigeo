# UI Reference Summary for Zeus

Date: 2026-06-03 21:05:00 +07
Requested by: พี่เอก
Prepared by: Hermes
Subject: Visual analysis of a weather-dashboard reference for downstream brand/UI direction

## Executive Summary
The reference is a premium dark-mode dashboard with a calm, data-first, modern product feel. The visual language is highly controlled: rounded cards, restrained blue accents, soft contrast, clean sans-serif typography, and a small geometric app-style logo. The overall direction is suitable for a high-trust SaaS, AI tool, dashboard, operations console, or weather/data product.

## Brand / Mood
Primary mood signals:
- premium
- calm
- technical
- trustworthy
- data-centric
- modern consumer-SaaS

Secondary cues:
- lightweight futurism
- polished but not flashy
- editorial clarity inside a dashboard structure

## Logo Direction
Observed logo behavior:
- small symbol-only mark at top-left
- enclosed in a rounded square container
- geometric, modular, minimal
- designed to survive at very small sizes
- no long wordmark in the main nav

Recommended logo direction:
1. Symbol-first logo
   - compact abstract shape
   - rounded geometry
   - strong silhouette at 16–24 px

2. Weather/data hybrid icon
   - cloud + grid / wind + nodes / sun + wave abstraction
   - should remain simple enough for favicon/app icon use

3. Rounded monogram
   - only if the brand initials are strong
   - must still behave like an app icon, not a corporate badge

Avoid:
- complex emblems
- thin detailed marks
- long horizontal wordmarks in the navbar
- overly colorful gradients
- ornamental or legacy-enterprise logo styles

Recommended logo implementation constraints:
- icon canvas: 24x24 or 28x28
- one-color version must work on dark background
- rounded corners should visually match the dashboard card language
- prepare monochrome white and soft-blue accent variants

## Typography
The font style reads as modern neutral sans.
Closest families:
- Inter
- Manrope
- Plus Jakarta Sans
- SF Pro-like system styling
- General Sans

Usage pattern:
- headings: semibold
- body: regular/medium
- labels: regular with lower contrast
- numeric data: semibold or bold-lite

For bilingual UI:
- English: Inter
- Thai companion: Noto Sans Thai or IBM Plex Sans Thai

## Approximate Type Scale
Estimated from the reference:
- navbar metadata/location: 11–13 px
- tabs: 12–14 px
- small card labels: 10–12 px
- section titles: 14–16 px
- metric values: 18–24 px
- small forecast temperatures: 14–20 px
- hero temperature value: 30–36 px
- CTA button text: 13–15 px
- helper text: 10–12 px

Typography behavior:
- tight hierarchy
- restrained line-height
- strong number emphasis
- muted supporting text
- sentence case over all-caps

## Color Direction
The palette is mostly dark neutrals with selective cool accents.

Approximate token set:
- page background: #2B2B2E
- app base: #111216
- default card: #191B21
- alternate card/surface: #20242B
- selected light card: #C5DCF3
- primary text: #F5F7FA
- secondary text: #9AA3AE
- accent blue: #3EA0FF
- accent soft blue: #8BC7FF
- soft border: #2A2F38

Color strategy:
- 80–90% of the interface stays in dark neutrals
- blue is used sparingly for focus, charts, gauges, and active states
- weather icons carry small warm accents for life and contrast
- contrast is created more by value shifts than by visible borders or heavy shadows

## Layout System
The layout uses a dashboard grid with clear horizontal and vertical rhythm.

Top band:
- logo
- location metadata
- centered search bar
- utility/avatar controls at right

Forecast strip:
- one featured card (selected/active)
- several small equal forecast cards beside it

Main body:
- left/center: analytics metric cards
- center-right: large feature/hero card
- far right: chart and location/weather list stack

Structural traits:
- card-first composition
- strong spacing consistency
- one large emphasis block balanced by many compact metric blocks
- fast scanability
- no visual clutter

## UI Component Language
Cards:
- large rounded corners
- low-shadow or shadowless
- separation by tone, not by hard borders
- dense but breathable internal spacing

Buttons:
- rounded pill/soft rectangle
- light background on dark UI
- black/dark text
- minimal chrome

Search:
- wide centered input
- dark fill, subtle contrast against the app shell
- unobtrusive iconography

Charts:
- thin glowing blue line
- very light grid presence
- tiny axis labels
- elegant, not analytical-heavy

Icons:
- system icons are simple and restrained
- weather icons are semi-illustrative with soft gloss/light depth
- icons add personality without turning playful

## Design DNA
This reference can be summarized as:
- dark premium dashboard
- rounded modern SaaS surfaces
- cool blue restraint
- compact geometric logo language
- clean sans-serif hierarchy
- calm data visualization

## Practical Translation Rules
If this reference is used as a direction for a product/system:
1. Keep the brand mark compact and app-native.
2. Use dark neutrals as the dominant surface language.
3. Reserve bright blue for action, state, and graph emphasis.
4. Make large numeric content visually dominant.
5. Use rounded cards consistently across all modules.
6. Avoid heavy border usage and avoid skeuomorphic decoration.
7. Keep the navbar clean with low text noise.

## Suggested Next Deliverables
Zeus can route follow-up work into one or more of these tracks:
1. Brand direction board
   - 3–5 logo concepts aligned to this visual system
2. Theme token pack
   - colors, typography, radius, spacing, surfaces
3. Dashboard UI kit
   - card patterns, chart styling, buttons, nav, weather widgets
4. Tailwind/CSS theme translation
   - production-ready tokens and component classes

## Final Recommendation
If the fleet adopts this style, the logo should not try to overpower the interface. The system wants a compact, geometric, high-legibility symbol that behaves like a product icon. The typography and palette should do most of the premium signaling; the logo should act as a quiet anchor, not a loud centerpiece.

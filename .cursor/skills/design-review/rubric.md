# Design Review Rubric

Structured comparison criteria for Figma baseline vs app screenshots.

## Discrepancy categories

| Category | What to check | Severity guide |
|----------|---------------|----------------|
| **Layout** | gap, padding, margin, min-height, alignment, flex direction, widget order | Critical if structure breaks; Major if >4px off; Minor if 2–4px |
| **Typography** | font-size, weight, line-height, letter-spacing, font-family | Major if wrong mixin/scale; Minor if 1–2px size drift |
| **Color** | background, text, border, badge tones vs CSS variables | Major if wrong token; Minor if opacity/anti-aliasing only |
| **Components** | StatusBadge variant/tone, Button variant, icon size, badge height | Critical if wrong component state |
| **Responsive** | breakpoint behavior (992px), mobile-only tokens, column order | Critical if desktop layout on mobile or vice versa |

## Widget vs full-page scope

When manifest sets `app.screenshotTarget`, compare **widget-level** screenshots only. Do not penalize header, footer, or sibling widgets visible in full-page captures.

Restart dev server with `mockEnv` vars when mock variant must match Figma state (e.g. `serving` for ClientWorkCard appeal view). Dynamic text (client name, durations) may differ if mock data ≠ Figma copy — ignore content mismatches, compare layout/typography/colors.

## Tolerance rules

- **Ignore**: font anti-aliasing, subpixel rendering, 1px browser rounding, scrollbar presence if Figma has none
- **Ignore**: different mock text content when structure and styles match
- **Minor**: 2–4px spacing/size difference in non-critical areas
- **Major**: >4px spacing, wrong color token, wrong font size/weight, missing/extra UI element
- **Critical**: broken layout, wrong widget order, unreadable contrast, missing CTA/badge, auth/loading overlay in screenshot

## Per-variant checklist

For each variant (`light-desktop`, `dark-desktop`, `light-mobile`, `dark-mobile`):

```
- [ ] Overall composition matches Figma frame
- [ ] Header/nav visible and aligned (if in frame)
- [ ] Widget/card structure matches
- [ ] Typography matches docs/typography-figma.md tokens
- [ ] Colors match theme tokens (_workspace-widgets.scss, component SCSS)
- [ ] StatusBadge / Button match component rules
- [ ] No loading spinner or error overlay in capture
```

## Confidence formula

Score each dimension 0–100, then apply weights:

| Dimension | Weight | Scoring |
|-----------|--------|---------|
| **Visual match** | 40% | 100 = all variants pass checklist with no Major/Critical; −25 per Major; −50 per Critical |
| **Layout/spacing** | 25% | 100 = all spacing within tolerance; −10 per Major layout issue; −25 per Critical |
| **Color tokens** | 20% | 100 = all colors map to documented tokens; −15 per wrong token; −30 per Critical contrast |
| **Typography** | 15% | 100 = all text uses correct mixin/scale; −10 per Major typo issue; −20 per Critical |

**Total confidence** = weighted sum rounded to nearest integer.

### Confidence gates (from `.cursor/rules/confidence.mdc`)

- **< 70%**: do not claim high confidence; continue fix loop
- **70–84%**: fixes applied but re-capture required before claiming success
- **≥ 85%**: allowed only after re-capture in the same iteration confirms improvements
- **≥ 86%**: requires verified screenshots, not assumptions

## Severity prioritization for fixes

Fix in this order when multiple issues exist:

1. Critical (layout break, missing elements, wrong state)
2. Major layout/spacing
3. Major color/typography
4. Minor spacing/typography
5. Minor color drift

## Discrepancy log template

```markdown
| Variant | Category | Severity | Description | File to fix |
|---------|----------|----------|-------------|-------------|
| light-desktop | Layout | Major | Card gap 16px vs Figma 20px | ShiftPage.module.scss |
```

## Reference sources

- [docs/typography-figma.md](../../../docs/typography-figma.md) — Figma node IDs, typography, color tokens
- [src/shared/styles/_workspace-widgets.scss](../../../src/shared/styles/_workspace-widgets.scss) — workspace CSS variables
- [.cursor/rules/status-badge.mdc](../../rules/status-badge.mdc) — StatusBadge specs
- [.cursor/rules/button.mdc](../../rules/button.mdc) — Button specs

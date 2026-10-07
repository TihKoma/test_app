---
name: design-review
description: >-
  Compare app screens against Figma baselines (light/dark, desktop/mobile) via
  figma-bridge and Playwright, fix discrepancies, and loop until confidence is
  at least 85%. Use only when the user explicitly asks for /design-review.
disable-model-invocation: true
---

# Design Review (`/design-review`)

Visual regression workflow: Figma baseline → app screenshots → compare → fix → loop until confidence ≥ 85%.

## Trigger

Run only when the user explicitly invokes `/design-review` or asks for a design review autofix loop.

## Input resolution

1. Read [`.cursor/design-review.manifest.json`](../../design-review.manifest.json)
2. Apply prompt overrides (screen filter, path, nodeId, fileKey)
3. Filter screens: `/design-review shift-page-serving` → only matching `id`

Schema details: [manifest.schema.md](manifest.schema.md)

## Progress checklist

Copy and update in every response:

```
Design Review Progress:
- [ ] Phase 0: Prerequisites
- [ ] Phase 1: Figma baselines (4 variants × N screens)
- [ ] Phase 2–3: Loop iter 1 — capture + compare + fix
- [ ] Phase 2–3: Loop iter N — re-capture + confidence
- [ ] Final report
```

---

## Phase 0: Prerequisites

Stop with a clear error if any check fails.

### 0.1 MCP servers

| Server | Identifier | Required tools |
|--------|------------|----------------|
| figma-bridge | `user-figma-bridge` / `figma-bridge` | `list_files`, `get_node`, `save_screenshots` |
| Playwright | `user-playwright` | `browser_navigate`, `browser_resize`, `browser_evaluate`, `browser_wait_for`, `browser_take_screenshot`, `browser_snapshot` |

If multiple Figma files are connected, call `list_files` and resolve `fileKey` before exports.

Validate each Figma `nodeId` with `get_node` — only `FRAME` / `COMPONENT` / `INSTANCE` are valid export targets. Skip or fix TEXT nodes.

### 0.2 Dev server

- Default URL: `http://localhost:3000` (from `vite.config.js`)
- If unreachable: start `npm run dev` in background, wait until HTTP responds
- If screen has `mockEnv`, restart dev with those `VITE_*` vars or warn if mocks differ from running server

### 0.3 Manifest validation

For each screen in scope:

- All 4 variant keys present (`light-desktop`, `dark-desktop`, `light-mobile`, `dark-mobile`) or explicit `skip` with reason
- Each variant has `nodeId` in `digits:digits` format (no hyphens)
- `app.path` is set

### 0.4 Artifact directories

Ensure `.visual-regression/figma/` and `.visual-regression/app/` exist (create if missing).

---

## Phase 1: Figma baselines (once per run)

Use `save_screenshots` on **figma-bridge** — never `get_screenshot` (avoids base64 in context).

### Batch export

```json
{
  "fileKey": "<from manifest or list_files>",
  "scale": 2,
  "clip": true,
  "format": "PNG",
  "items": [
    {
      "nodeId": "6:8519",
      "outputPath": "/absolute/path/to/workspace/.visual-regression/figma/shift-page-serving/light-desktop.png"
    }
  ]
}
```

**Use absolute workspace paths** for `outputPath` — relative paths resolve from MCP server CWD (often user home), not the project root.

Export all variants for all screens in one or few batch calls.

Output path pattern: `{workspace}/.visual-regression/figma/{screenId}/{variant}.png`

After export, verify files exist. If `fileKey` fails, call `list_files` and update manifest or prompt override.

---

## Phase 2: App screenshots (each loop iteration)

For each screen × variant (skip variants with `skip: true`):

### 2.1 Navigate and resize

```
browser_navigate → {appBaseUrl}{app.path}
browser_resize   → desktop or mobile viewport from manifest
```

| Variant suffix | Viewport |
|----------------|----------|
| `*-desktop` | `defaults.viewports.desktop` (1440×900) |
| `*-mobile` | `defaults.viewports.mobile` (390×844) |

### 2.2 Set theme

| Variant prefix | Theme |
|----------------|-------|
| `light-*` | `light` |
| `dark-*` | `dark` |

Use `browser_evaluate`:

```js
() => {
  const theme = 'dark'; // or 'light'
  document.documentElement.dataset.theme = theme;
  const key = 'online-queue-front_themeUi';
  localStorage.setItem(key, JSON.stringify({ version: 1, data: { theme } }));
  return theme;
}
```

Alternative: click theme switch from `browser_snapshot` (switch with `sun` icon in header).

Reload or re-navigate after theme change if styles do not apply immediately.

### 2.3 Wait for stable UI

- If `app.waitForGone`: `browser_wait_for` with `textGone: "loading"`
- If `app.waitFor`: `browser_wait_for` with `text: "<value>"`
- Optional short `browser_wait_for` time: 1s after loading gone

### 2.4 Screenshot

Take a `browser_snapshot` first if you need element refs for interactions (dismiss overlays, scroll).

**Widget-level comparison** (when Figma node is a card/widget, not full page):

```
browser_take_screenshot
  target: [data-testid='client-work-card']  (from app.screenshotTarget)
  filename: {workspace}/.visual-regression/app/{screenId}/{variant}-iter{N}.png
```

**Full-page comparison**:

```
browser_take_screenshot
  filename: {workspace}/.visual-regression/app/{screenId}/{variant}-iter{N}.png
  fullPage: app.fullPage ?? false
```

Set `app.screenshotTarget` in manifest when Figma exports a widget frame (e.g. ClientWorkCard `6:8519`).

---

## Phase 3: Compare + fix loop

Repeat Phase 2 (re-capture) + compare + fix until:

- **Success:** confidence ≥ `defaults.loop.minConfidence` (85) for all screens in scope
- **Stop:** `maxIterations` reached, or unrecoverable blocker

### 3.1 Compare

For each variant, read both images:

- Figma: `.visual-regression/figma/{screenId}/{variant}.png`
- App: latest `.visual-regression/app/{screenId}/{variant}-iter{N}.png`

Apply rubric from [rubric.md](rubric.md). Log discrepancies in the table template.

Cross-check tokens against [docs/typography-figma.md](../../../docs/typography-figma.md).

### 3.2 Fix

- Minimal diff; only affected SCSS/components
- Follow: `react-ui.mdc`, `styling-guidelines.mdc`, `status-badge.mdc`, `button.mdc`, FSD imports
- Priority: Critical → Major layout → Major color/typo → Minor

### 3.3 Lint after edits

```bash
npm run type-check && npm run eslint && npm run stylelint
```

### 3.4 Re-capture and score

After fixes, re-run Phase 2 for affected variants in the **same iteration** before scoring.

Compute confidence per [rubric.md](rubric.md). Do not claim ≥ 85% without verified re-capture.

### 3.5 Loop safety

- Default `maxIterations`: 5
- If stuck on auth/mock/data issues, stop with manual follow-up plan
- If one variant is skipped in Figma, exclude it from visual-match weight (pro-rate remaining variants)

---

## MCP cheat sheet

### figma-bridge: save_screenshots

| Param | Value |
|-------|-------|
| `fileKey` | From manifest; refresh via `list_files` if stale |
| `scale` | 2 |
| `clip` | true |
| `items[].nodeId` | e.g. `6:8519` |
| `items[].outputPath` | Absolute path: `{workspace}/.visual-regression/figma/{screenId}/{variant}.png` |

### Playwright sequence per variant

1. `browser_navigate` — `{appBaseUrl}{path}`
2. `browser_resize` — width/height
3. `browser_evaluate` — set theme (see §2.2)
4. `browser_wait_for` — `textGone: "loading"` or `time: 1`
5. `browser_take_screenshot` — element target if `app.screenshotTarget` set, else viewport/fullPage

---

## Final report template

```markdown
## Design Review Report

**Screens:** shift-page-serving
**Iterations:** 2 / 5
**Confidence:** 87%

### Variant results

| Variant | Issues | Severity | Fixed |
|---------|--------|----------|-------|
| light-desktop | Card gap 16→20px | Major | yes |
| dark-desktop | — | — | — |
| light-mobile | Badge border color | Minor | yes |
| dark-mobile | — | — | — |

### Files changed

- src/widgets/.../ClientWorkCard.module.scss

### Artifacts

- Figma: `.visual-regression/figma/shift-page-serving/`
- App: `.visual-regression/app/shift-page-serving/`

### Remaining risks

- (none | list manual follow-ups)

**Confidence Level:** 87%
**Rationale:** All variants re-captured after fixes; no Major/Critical issues remain.
**Risks:** Mock data may differ from production API responses.
```

---

## Additional resources

- [manifest.schema.md](manifest.schema.md) — manifest format and examples
- [rubric.md](rubric.md) — comparison criteria and confidence formula
- [docs/typography-figma.md](../../../docs/typography-figma.md) — verified Figma node IDs and tokens

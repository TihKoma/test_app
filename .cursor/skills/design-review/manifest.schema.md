# Design Review Manifest Schema

Default manifest path: [`.cursor/design-review.manifest.json`](../../design-review.manifest.json)

## Top-level structure

```json
{
  "defaults": { ... },
  "screens": [ ... ]
}
```

## `defaults`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `appBaseUrl` | string | `http://localhost:3000` | Dev server base URL (port from `vite.config.js`) |
| `viewports.desktop` | `{ width, height }` | `1440×900` | Desktop browser size |
| `viewports.mobile` | `{ width, height }` | `390×844` | Mobile browser size |
| `figma.scale` | number | `2` | Export scale for raster screenshots |
| `figma.clip` | boolean | `true` | Clip to node logical bounds |
| `figma.format` | string | `PNG` | Export format |
| `loop.maxIterations` | number | `5` | Max compare-fix cycles |
| `loop.minConfidence` | number | `85` | Stop threshold (percent) |

## `screens[]`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique screen slug (used in artifact paths) |
| `label` | string | yes | Human-readable name for reports |
| `app.path` | string | yes | Route path appended to `appBaseUrl` |
| `app.waitForGone` | string | no | Text that must disappear before screenshot (e.g. `loading`) |
| `app.waitFor` | string | no | Text that must appear before screenshot |
| `app.fullPage` | boolean | no | Playwright full-page screenshot (default: viewport only) |
| `app.screenshotTarget` | string | no | CSS selector or `data-testid` value for element screenshot (use when Figma node is a widget, not full page) |
| `app.mockEnv` | object | no | Env vars for dev server (`VITE_*`) |
| `app.auth` | object | no | `{ "required": false }` to skip auth warning |
| `figma.fileKey` | string | yes | Figma file key from `list_files` (often `unsaved-*`) |
| `figma.variants` | object | yes | Four variant keys (see below) |

### Variant keys (all required unless explicitly skipped)

| Key | Viewport | Theme | Figma node |
|-----|----------|-------|------------|
| `light-desktop` | desktop | light | separate frame nodeId |
| `dark-desktop` | desktop | dark | separate frame nodeId |
| `light-mobile` | mobile | light | separate frame nodeId |
| `dark-mobile` | mobile | dark | separate frame nodeId |

**Important:** Figma light/dark use **separate frame nodeIds**. Do not try to switch Figma variable modes programmatically.

### Optional variant skip

```json
"dark-mobile": { "skip": true, "reason": "No dark mobile frame in Figma yet" }
```

## Prompt overrides

When user invokes `/design-review` with inline args, override manifest fields:

| Prompt input | Overrides |
|--------------|-----------|
| `shift-page-serving` | Filter to screen with matching `id` |
| `fileKey: unsaved-xxx` | Replace `figma.fileKey` for targeted screen |
| `path: /shift/2` | Replace `app.path` |
| `node light-desktop: 6:8519` | Replace variant nodeId |
| Full JSON snippet | Merge into manifest for this run only |

## Artifact paths

| Source | Path pattern |
|--------|--------------|
| Figma baseline | `.visual-regression/figma/{screenId}/{variant}.png` |
| App capture | `.visual-regression/app/{screenId}/{variant}-iter{N}.png` |

## Figma fileKey notes

- URL key (`RLuwi98Gxu9yv8ljwm9AAh`) ≠ bridge `fileKey`
- Always call `list_files` on figma-bridge when `fileKey` is stale or export fails
- Current connected file (smoke-tested): `unsaved-mq6o84g6-aflw3u1l` («Логотип»)

## Figma node validation

Before Phase 1, call `get_node` for each `nodeId`. If `type` is not `FRAME` or `COMPONENT` or `INSTANCE`, skip or find the parent frame. Example: `289:10206` is TEXT — invalid for screenshot export.

## save_screenshots paths

`outputPath` resolves from MCP server CWD, not project root. Use **absolute workspace paths**:

```
/Users/photon/project/queue-online/queue-online-admin/.visual-regression/figma/{screenId}/{variant}.png
```

Or verify saved files exist after export; re-run with absolute path if files land outside the repo.
- Document verified nodeIds in [docs/typography-figma.md](../../../docs/typography-figma.md)

## Theme localStorage key

App theme is stored via `appThemeStorage` (id `themeUi`):

```
localStorage key: {REACT_APP_NAME}_themeUi
```

Value shape: `{"version":1,"data":{"theme":"light"|"dark"}}`

Package name default: `online-queue-front` → key `online-queue-front_themeUi`

Also set `document.documentElement.dataset.theme` when switching theme in Playwright.

## Example: add a new screen

```json
{
  "id": "shift-info-active",
  "label": "ShiftInfoCard / active",
  "app": {
    "path": "/shift/1",
    "waitForGone": "loading",
    "mockEnv": {
      "VITE_USE_SHIFT_MOCK": "true",
      "VITE_USE_SHIFT_MOCK_VARIANT": "active"
    }
  },
  "figma": {
    "fileKey": "unsaved-mq159kps-k1nalxgp",
    "variants": {
      "light-desktop": { "nodeId": "97:15858" },
      "dark-desktop": { "nodeId": "289:8533" },
      "light-mobile": { "nodeId": "5:8106" },
      "dark-mobile": { "nodeId": "289:10232" }
    }
  }
}
```
